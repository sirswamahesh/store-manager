import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { ApiResponse } from "../core/ApiResponse";

export const validate =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json(
        ApiResponse.error(
          "Validation Failed",
          error.details.map((err) => err.message),
        ),
      );
    }

    req.body = value;
    next();
  };
