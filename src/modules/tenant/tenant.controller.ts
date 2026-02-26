import { Request, Response } from "express";
import { BaseController } from "../../core/BaseController";
import { TenantService } from "./tenant.service";

export class TenantController extends BaseController {
  private tenantService = new TenantService();

  createTenant = async (req: Request, res: Response) => {
    const result = await this.tenantService.createTenant(req.body);

    return this.created(res, "Tenant and Admin created successfully", result);
  };
}
