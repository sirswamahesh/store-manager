import { Response } from "express";
import { ApiResponse } from "./ApiResponse";

export abstract class BaseController {
  protected ok<T>(res: Response, message: string, data?: T) {
    return res.status(200).json(ApiResponse.success(message, data));
  }

  protected created<T>(res: Response, message: string, data?: T) {
    return res.status(201).json(ApiResponse.success(message, data));
  }

  protected fail(
    res: Response,
    message: string,
    statusCode: number = 400,
    errors?: any,
  ) {
    return res.status(statusCode).json(ApiResponse.error(message, errors));
  }
}
