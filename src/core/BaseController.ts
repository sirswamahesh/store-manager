import { Request, Response } from "express";
import { BaseService } from "./BaseService";
import { ApiResponse } from "./ApiResponse";
import { AppError } from "./AppError";

export abstract class BaseController {
  constructor(protected service: BaseService<any>) {}

  protected ok<T>(res: Response, message: string, data?: T) {
    return res.status(200).json(ApiResponse.success(message, data));
  }

  protected created<T>(res: Response, message: string, data?: T) {
    return res.status(201).json(ApiResponse.success(message, data));
  }

  protected noContent(res: Response) {
    return res.status(204).send();
  }

  protected error(res: Response, error: any) {
    if (error instanceof AppError) {
      return res
        .status(error.statusCode)
        .json(ApiResponse.error(error.message));
    }
    return res.status(500).json(ApiResponse.error("Internal server error"));
  }

  async getWithCursor(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const cursor = req.query.cursor as string | null;
      const orderBy = (req.query.orderBy as string) || "createdAt";
      const orderDirection =
        (req.query.orderDirection as "asc" | "desc") || "desc";

      const conditions = this.buildConditions(req.query);

      const result = await this.service.getWithCursor({
        limit,
        cursor,
        orderBy,
        orderDirection,
        conditions,
      });

      return this.ok(res, "Fetched successfully", {
        items: result.data,
        nextCursor: result.nextCursor,
        hasMore: result.hasMore,
      });
    } catch (error) {
      return this.error(res, error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await this.service.create(req.body);
      return this.created(res, "Created successfully", data);
    } catch (error) {
      return this.error(res, error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const data = await this.service.getById(req.params.id as string);
      if (!data) throw new AppError("Resource not found", 404);
      return this.ok(res, "Fetched successfully", data);
    } catch (error) {
      return this.error(res, error);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const data = await this.service.getAll();
      return this.ok(res, "Fetched successfully", data);
    } catch (error) {
      return this.error(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = await this.service.update(req.params.id as string, req.body);
      return this.ok(res, "Updated successfully", data);
    } catch (error) {
      return this.error(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.service.delete(req.params.id as string);
      return this.ok(res, "Deleted successfully");
    } catch (error) {
      return this.error(res, error);
    }
  }

  protected buildConditions(
    query: any,
  ): Array<{ field: string; operator: any; value: any }> {
    const conditions = [];
    const exclude = ["page", "limit", "cursor", "orderBy", "orderDirection"];

    for (const [key, value] of Object.entries(query)) {
      if (!exclude.includes(key) && value) {
        conditions.push({ field: key, operator: "==", value });
      }
    }
    return conditions;
  }
}
