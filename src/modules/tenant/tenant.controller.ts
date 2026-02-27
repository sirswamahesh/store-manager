import { Request, Response } from "express";
import { BaseController } from "../../core/BaseController";
import { TenantService } from "./tenant.service";
import { ICreateTenantDTO, TenantFilters } from "./tenant.interface";
import { RequestUser } from "./tenant.types";
import { AppError } from "../../core/AppError";
import { UserRole } from "../../utils/roles";

export class TenantController extends BaseController {
  private tenantService: TenantService;

  constructor() {
    super(new TenantService());
    this.tenantService = new TenantService();
  }

  createTenant = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data: ICreateTenantDTO = req.body;
      const result = await this.tenantService.createTenant(data);
      return this.created(res, "Tenant and Admin created successfully", result);
    } catch (error) {
      return this.error(res, error);
    }
  };

  getAllTenants = async (req: Request, res: Response): Promise<Response> => {
    try {
      const filters: TenantFilters = {
        isActive:
          req.query.isActive === "true"
            ? true
            : req.query.isActive === "false"
              ? false
              : undefined,
        subscriptionStatus: req.query.subscriptionStatus as string,
        search: req.query.search as string,
      };

      const result = await this.tenantService.getAllTenants(filters);
      return this.ok(res, "Tenants fetched successfully", result);
    } catch (error) {
      return this.error(res, error);
    }
  };

  getTenantById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const currentUser = req.user as RequestUser;

      if (!currentUser) {
        throw new AppError("Unauthorized", 401);
      }

      let id: string;

      if (currentUser.role === UserRole.SUPER_ADMIN) {
        if (!req.params.id) {
          throw new AppError("Tenant ID is required", 400);
        }
        id = req.params.id as string;
      } else {
        if (!currentUser.tenantId) {
          throw new AppError("You don't have a tenant associated", 403);
        }
        id = currentUser.tenantId;
      }

      const result = await this.tenantService.getTenantById(id, currentUser);
      return this.ok(res, "Tenant fetched successfully", result);
    } catch (error) {
      return this.error(res, error);
    }
  };

  updateTenant = async (req: Request, res: Response): Promise<Response> => {
    try {
      const currentUser = req.user as RequestUser;

      if (!currentUser) {
        throw new AppError("Unauthorized", 401);
      }

      const id = req.params.id || currentUser.tenantId;

      if (!id) {
        throw new AppError("Tenant ID is required", 400);
      }

      const result = await this.tenantService.updateTenant(
        id as string,
        req.body,
        currentUser,
      );
      return this.ok(res, "Tenant updated successfully", result);
    } catch (error) {
      return this.error(res, error);
    }
  };

  deactivateTenant = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const result = await this.tenantService.deactivateTenant(id as string);
      return this.ok(res, "Tenant deactivated successfully", result);
    } catch (error) {
      return this.error(res, error);
    }
  };
}
