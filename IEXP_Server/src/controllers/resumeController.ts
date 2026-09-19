import { Response } from "express";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { AuthRequest } from "../middleware/authMiddleware.js";
import supabase from "../config/supabase.js";
import Resume from "../models/Resume.js";

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

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      res.status(400).json({
        message: "Only PDF and DOCX files are allowed",
      });
      return;
    }

    const existingResume = await Resume.findOne({
      userId: req.userId,
    });

    let extractedText = "";

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

    extractedText = extractedText.trim();

    if (!extractedText) {
      res.status(400).json({
        message: "Could not extract text from the resume",
      });
      return;
    }

    const safeFileName = file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    const storagePath = `${req.userId}/${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);

      res.status(500).json({
        message: "Failed to upload resume",
      });
      return;
    }

    if (existingResume) {
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([existingResume.storagePath]);

      if (deleteError) {
        console.error(
          "Old resume deletion error:",
          deleteError
        );
      }

      existingResume.originalFileName = file.originalname;
      existingResume.fileType = file.mimetype;
      existingResume.storagePath = storagePath;
      existingResume.extractedText = extractedText;

      await existingResume.save();

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

    const resume = await Resume.create({
      userId: req.userId,
      originalFileName: file.originalname,
      fileType: file.mimetype,
      storagePath,
      extractedText,
    });

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

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(resume.storagePath, 300);

    if (error || !data?.signedUrl) {
      console.error(
        "Supabase signed URL error:",
        error
      );

      res.status(500).json({
        message: "Failed to generate resume URL",
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