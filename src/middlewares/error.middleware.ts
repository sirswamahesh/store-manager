import { Request, Response, NextFunction } from "express";
import { AppError } from "../core/AppError";
import { ApiResponse } from "../core/ApiResponse";
import { HTTP_STATUS } from "../utils/httpStatus";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("❌ Error:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(ApiResponse.error(err.message));
  }

  return res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json(ApiResponse.error("Something went wrong"));
};
