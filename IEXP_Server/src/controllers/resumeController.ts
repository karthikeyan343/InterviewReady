import { Response } from "express";
import path from "path";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { AuthRequest } from "../middleware/authMiddleware.js";
import supabase from "../config/supabase.js";
import Resume from "../models/Resume.js";
import {
  validateResume,
  RESUME_CONFIDENCE_THRESHOLD,
  validateResumeTextDeterministic,
} from "../services/resumeValidationService.js";

const BUCKET_NAME = "resumes";

export const uploadResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        message: "Resume file is required",
      });
      return;
    }

    const file = req.file;

    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".pdf", ".docx"];
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedExtensions.includes(ext) || !allowedTypes.includes(file.mimetype)) {
      res.status(400).json({
        message: "Only PDF and DOCX files are allowed",
      });
      return;
    }

    const existingResume = await Resume.findOne({
      userId: req.userId,
    });

    let extractedText = "";

    try {
      if (file.mimetype === "application/pdf") {
        const parser = new PDFParse({
          data: new Uint8Array(file.buffer),
        });

        try {
          const pdfData = await parser.getText();

          extractedText = pdfData.text;
        } finally {
          await parser.destroy();
        }
      } else {
        const docxData = await mammoth.extractRawText({
          buffer: file.buffer,
        });

        extractedText = docxData.value;
      }
    } catch (parseError: any) {
      console.error(
        "[Resume Extraction] Failed to parse document:",
        parseError?.message || parseError
      );
      res.status(400).json({
        message:
          "The uploaded file appears to be corrupted or unreadable. Please upload a valid PDF or DOCX file.",
      });
      return;
    }

    extractedText = extractedText.trim();

    if (!extractedText) {
      res.status(400).json({
        message: "Could not extract text from the resume",
      });
      return;
    }

    // Two-layer validation (deterministic with best-effort semantic AI) BEFORE Supabase storage
    let validationResult;
    try {
      validationResult = await validateResume(extractedText);
    } catch (unexpectedValError: any) {
      console.warn(
        "[Resume Validation] Unexpected validation exception, falling back to deterministic validation:",
        unexpectedValError?.message || unexpectedValError
      );
      validationResult = validateResumeTextDeterministic(extractedText);
    }

    if (
      !validationResult.isResume ||
      validationResult.confidence < RESUME_CONFIDENCE_THRESHOLD
    ) {
      res.status(400).json({
        message: "Please upload a valid resume.",
        reason: validationResult.reason,
      });
      return;
    }

    const safeFileName = file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    const storagePath = `${req.userId}/${Date.now()}-${safeFileName}`;

    // ONLY after successful validation: upload original file to Supabase
    let uploadData: any = null;
    let uploadError: any = null;

    try {
      const uploadResult = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });
      uploadData = uploadResult.data;
      uploadError = uploadResult.error;
    } catch (networkErr: any) {
      uploadError = networkErr;
    }

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);

      const errString = `${uploadError?.message || ""} ${uploadError?.name || ""} ${uploadError?.stack || ""} ${JSON.stringify(uploadError || "")}`;
      const isConnectionIssue =
        errString.includes("ENOTFOUND") ||
        errString.includes("fetch failed") ||
        errString.includes("ECONNREFUSED") ||
        errString.includes("ETIMEDOUT") ||
        errString.includes("NetworkError");

      if (isConnectionIssue) {
        res.status(503).json({
          message:
            "Resume storage service is currently unreachable (Supabase project may be paused or offline). Please restore the storage project in the Supabase dashboard or check your credentials.",
        });
        return;
      }

      res.status(500).json({
        message:
          uploadError?.message || "Failed to upload resume",
      });
      return;
    }

    console.log("Resume successfully uploaded to Supabase.");

    // ONLY after successful Supabase upload: create or update Resume MongoDB document
    if (existingResume) {
      const oldStoragePath = existingResume.storagePath;

      existingResume.originalFileName = file.originalname;
      existingResume.fileType = file.mimetype;
      existingResume.storagePath = storagePath;
      existingResume.extractedText = extractedText;

      try {
        await existingResume.save();
      } catch (dbError) {
        // Rollback newly uploaded Supabase file if MongoDB update fails
        await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
        throw dbError;
      }

      console.log("Resume successfully persisted to MongoDB.");

      // ONLY delete old resume from Supabase after successful new resume storage
      if (oldStoragePath && oldStoragePath !== storagePath) {
        const { error: deleteError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([oldStoragePath]);

        if (deleteError) {
          console.error(
            "Old resume deletion error:",
            deleteError
          );
        }
      }

      res.status(200).json({
        message: "Resume replaced successfully",
        resume: {
          id: existingResume._id,
          originalFileName:
            existingResume.originalFileName,
          fileType: existingResume.fileType,
          uploadedAt: existingResume.updatedAt,
        },
      });

      return;
    }

    let resume;
    try {
      resume = await Resume.create({
        userId: req.userId,
        originalFileName: file.originalname,
        fileType: file.mimetype,
        storagePath,
        extractedText,
      });
    } catch (dbError) {
      // Rollback newly uploaded Supabase file if MongoDB creation fails
      await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
      throw dbError;
    }

    console.log("Resume successfully persisted to MongoDB.");

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume: {
        id: resume._id,
        originalFileName: resume.originalFileName,
        fileType: resume.fileType,
        uploadedAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    res.status(500).json({
      message: "Server error while processing resume",
    });
  }
};

export const getMyResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const resume = await Resume.findOne({
      userId: req.userId,
    }).select("-extractedText -storagePath");

    if (!resume) {
      res.status(404).json({
        message: "Resume not found",
      });
      return;
    }

    res.status(200).json({
      resume: {
        id: resume._id,
        originalFileName: resume.originalFileName,
        fileType: resume.fileType,
        uploadedAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get resume error:", error);

    res.status(500).json({
      message: "Server error while fetching resume",
    });
  }
};

export const viewMyResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const resume = await Resume.findOne({
      userId: req.userId,
    });

    if (!resume) {
      res.status(404).json({
        message: "Resume not found",
      });
      return;
    }

    let data: { signedUrl: string } | null = null;
    let storageError: any = null;

    try {
      const result = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(resume.storagePath, 300);
      data = result.data;
      storageError = result.error;
    } catch (networkErr: any) {
      storageError = networkErr;
    }

    if (storageError || !data?.signedUrl) {
      console.error(
        "Supabase signed URL error:",
        storageError
      );

      const errString = `${storageError?.message || ""} ${storageError?.name || ""} ${storageError?.stack || ""} ${JSON.stringify(storageError || "")}`;
      const isConnectionIssue =
        errString.includes("ENOTFOUND") ||
        errString.includes("fetch failed") ||
        errString.includes("ECONNREFUSED") ||
        errString.includes("ETIMEDOUT") ||
        errString.includes("NetworkError");

      const isNotFound =
        storageError?.statusCode === 404 ||
        storageError?.statusCode === "404" ||
        errString.toLowerCase().includes("not found");

      if (isConnectionIssue) {
        res.status(503).json({
          message:
            "Resume storage service is currently unreachable (Supabase project may be paused or offline). Please restore the storage project in the Supabase dashboard or re-upload your resume.",
        });
        return;
      }

      if (isNotFound) {
        res.status(404).json({
          message:
            "Resume file was not found in storage. Please re-upload your resume.",
        });
        return;
      }

      res.status(500).json({
        message:
          storageError?.message || "Failed to generate resume URL",
      });
      return;
    }

    res.status(200).json({
      url: data.signedUrl,
      fileName: resume.originalFileName,
      fileType: resume.fileType,
    });
  } catch (error) {
    console.error("View resume error:", error);

    res.status(500).json({
      message: "Server error while opening resume",
    });
  }
};