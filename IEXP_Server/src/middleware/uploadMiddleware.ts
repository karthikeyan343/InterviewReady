import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  callback
) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const isPdf =
    extension === ".pdf" ||
    file.mimetype === "application/pdf";

  const isDocx =
    extension === ".docx" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

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

export default upload;