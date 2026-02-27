import { BaseService } from "../../core/BaseService";
import { ProductRepository } from "./product.repository";
import { CreateProductDTO } from "./product.types";
import { AppError } from "../../core/AppError";
import { HTTP_STATUS } from "../../utils/httpStatus";
import { ROLE } from "../../utils/roles";

export class ProductService extends BaseService<any> {
  private productRepo = new ProductRepository();

  constructor() {
    super(null);
  }

  async createProduct(currentUser: any, data: CreateProductDTO) {
    const { role, tenantId, shopId } = currentUser;

    if (!tenantId || !shopId) {
      throw new AppError("Invalid tenant/shop", HTTP_STATUS.BAD_REQUEST);
    }
    const existingProduct = await this.productRepo.findByNameAndShop(
      data.name.trim(),
      shopId,
    );

    if (existingProduct) {
      throw new AppError(
        "Product with this name already exists in this shop",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    return await this.productRepo.create({
      tenantId,
      shopId,
      name: data.name.trim().toLowerCase(),
      price: data.price,
      category: data.category,
      stock: data.stock || 0,
      imageUrl: data.imageUrl ?? undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  async getProducts(currentUser: any, shopIdParam?: string) {
    const { role, tenantId, shopId } = currentUser;

    if (role === ROLE.SUPER_ADMIN) {
      return await this.productRepo.findAll();
    }

    if (role === ROLE.ADMIN) {
      if (!shopIdParam) {
        throw new AppError("Shop ID is required", HTTP_STATUS.BAD_REQUEST);
      }

      return await this.productRepo.findByTenantAndShop(tenantId, shopIdParam);
    }

    if (role === ROLE.USER) {
      return await this.productRepo.findByShopId(shopId);
    }

    throw new AppError("Unauthorized", HTTP_STATUS.FORBIDDEN);
  }
}
