import { AppError } from "./AppError";
import { BaseRepository } from "./BaseRepository";

export abstract class BaseService<T extends { id: string }> {
  constructor(protected repository: BaseRepository<T>) {}

  async create(data: any): Promise<T> {
    try {
      return await this.repository.create(data);
    } catch (error: any) {
      throw new AppError(`Failed to create: ${error.message}`, 400);
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      return await this.repository.findById(id);
    } catch (error: any) {
      throw new AppError(`Failed to fetch: ${error.message}`, 400);
    }
  }

  async getOneBy(field: string, value: any): Promise<T | null> {
    try {
      return await this.repository.findOne(field, value);
    } catch (error: any) {
      throw new AppError(`Failed to fetch: ${error.message}`, 400);
    }
  }

  async getAll(conditions?: any): Promise<T[]> {
    try {
      return await this.repository.findMany(conditions);
    } catch (error: any) {
      throw new AppError(`Failed to fetch: ${error.message}`, 400);
    }
  }

  async getWithCursor(options: {
    limit: number;
    cursor?: string | null;
    orderBy?: string;
    orderDirection?: "asc" | "desc";
    conditions?: any;
  }) {
    try {
      return await this.repository.findWithCursor(options);
    } catch (error: any) {
      throw new AppError(`Failed to fetch: ${error.message}`, 400);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const exists = await this.repository.findById(id);
      if (!exists) throw new AppError("Resource not found", 404);
      return await this.repository.update(id, data);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Failed to update: ${error.message}`, 400);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const exists = await this.repository.findById(id);
      if (!exists) throw new AppError("Resource not found", 404);
      return await this.repository.delete(id);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Failed to delete: ${error.message}`, 400);
    }
  }

  async exists(field: string, value: any): Promise<boolean> {
    try {
      return await this.repository.exists(field, value);
    } catch (error: any) {
      throw new AppError(`Failed to check: ${error.message}`, 400);
    }
  }
}
