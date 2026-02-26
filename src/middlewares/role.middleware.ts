import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { ApiResponse } from "../core/ApiResponse";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json(ApiResponse.error("Unauthorized"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json(ApiResponse.error("Forbidden: You do not have permission"));
    }

    next();
  };
};
