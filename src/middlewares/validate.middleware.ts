import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import path from "path";
import { deleteFile } from "../utils/file";

export const validate =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      if (req.file) {
        const filePath = path.join(
          process.cwd(),
          "uploads/products",
          req.file.filename,
        );
        deleteFile(filePath);
      }

      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        data: error.details.map((err) => err.message),
      });
    }

    req.body = value;
    next();
  };
