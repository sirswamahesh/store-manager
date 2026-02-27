import { Request, Response } from "express";
import { BaseController } from "../../core/BaseController";
import { ShopService } from "./shop.service";
import { CreateShopDTO, RequestUser } from "./shop.types";
import { AppError } from "../../core/AppError";

export class ShopController extends BaseController {
  protected service: ShopService;

  constructor() {
    const shopService = new ShopService();
    super(shopService);
    this.service = shopService; // single instance ✅
  }

  // ============== CREATE SHOP ==============
  createShop = async (req: Request, res: Response): Promise<Response> => {
    try {
      const tenantId = (req.user as RequestUser)?.tenantId;

      if (!tenantId) {
        throw new AppError("Tenant ID not found", 400);
      }

      const data: CreateShopDTO = req.body;
      const result = await this.service.createShop(tenantId, data);

      return this.created(res, "Shop and owner created successfully", result);
    } catch (error) {
      return this.error(res, error);
    }
  };

  // ============== GET SHOPS ==============
  getShops = async (req: Request, res: Response): Promise<Response> => {
    try {
      const currentUser = req.user as RequestUser;

      if (!currentUser) {
        throw new AppError("Unauthorized", 401);
      }

      const result = await this.service.getShops(currentUser);
      return this.ok(res, "Shops fetched successfully", result);
    } catch (error) {
      return this.error(res, error);
    }
  };

  // ============== GET SHOP BY ID ==============
  getShopById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const currentUser = req.user as RequestUser;
      const { id } = req.params;

      if (!currentUser) {
        throw new AppError("Unauthorized", 401);
      }

      const result = await this.service.getShopById(id as string, currentUser);

      if (!result) {
        throw new AppError("Shop not found", 404);
      }

      return this.ok(res, "Shop fetched successfully", result);
    } catch (error) {
      return this.error(res, error);
    }
  };
}
