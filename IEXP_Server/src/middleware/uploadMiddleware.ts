import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage();

const allowedExtensions = [".pdf", ".docx"];

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  callback
) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    callback(new Error("Only PDF and DOCX files are allowed"));
    return;
  }

  const isPdf =
    extension === ".pdf" &&
    (file.mimetype === "application/pdf" ||
      file.mimetype === "application/x-pdf" ||
      file.mimetype === "application/octet-stream");

  const isDocx =
    extension === ".docx" &&
    (file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/octet-stream" ||
      file.mimetype === "application/zip");

  if (isPdf) {
    file.mimetype = "application/pdf";
    callback(null, true);
    return;
  }

  if (isDocx) {
    file.mimetype =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    callback(null, true);
    return;
  }

  callback(new Error("Only PDF and DOCX files are allowed"));
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

export const handleResumeUpload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  upload.single("resume")(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          res.status(400).json({
            message: "File size exceeds the 5 MB limit. Please upload a smaller file.",
          });
          return;
        }
        res.status(400).json({
          message: err.message,
        });
        return;
      }
      res.status(400).json({
        message: err.message || "Invalid file upload",
      });
      return;
    }
    next();
  });
};

export default upload;