import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.join(__dirname, "../../uploads/products");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files allowed"));
  } else {
    cb(null, true);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
