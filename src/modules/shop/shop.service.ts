import bcrypt from "bcryptjs";
import crypto from "crypto";
import { BaseService } from "../../core/BaseService";
import { ShopRepository } from "./shop.repository";
import { TenantRepository } from "../tenant/tenant.repository";
import { UserRepository } from "../user/user.repository";
import { db } from "../../config/firebase";
import { AppError } from "../../core/AppError";
import { CreateShopDTO, RequestUser } from "./shop.types";
import { ICreateShopResponse, IShop } from "./shop.interface";
import { UserRole } from "../../utils/roles";

const generateSixDigitPin = (): string => {
  return crypto.randomInt(100000, 1000000).toString(); // secure ✅
};

export class ShopService extends BaseService<IShop> {
  private shopRepo: ShopRepository;
  private userRepo: UserRepository;
  private tenantRepo: TenantRepository;

  constructor() {
    const shopRepository = new ShopRepository();

    super(shopRepository); // single instance ✅

    this.shopRepo = shopRepository;
    this.userRepo = new UserRepository();
    this.tenantRepo = new TenantRepository();
  }

  // ============== CREATE SHOP ==============
  async createShop(
    tenantId: string,
    data: CreateShopDTO,
  ): Promise<ICreateShopResponse> {
    const tenant = await this.tenantRepo.findById(tenantId);
    if (!tenant) {
      throw new AppError("Tenant not found", 404);
    }

    const currentShopCount = await this.shopRepo.countByTenantId(tenantId);
    const shopLimit = (tenant as any).shopLimit || 2;

    if (currentShopCount >= shopLimit) {
      throw new AppError(
        "Shop creation limit exceeded. Upgrade your plan.",
        403,
      );
    }

    const existingUser = await this.userRepo.findByEmail(data.ownerEmail);
    if (existingUser) {
      throw new AppError("Owner email already exists", 400);
    }

    const plainPin = generateSixDigitPin();
    const hashedPin = await bcrypt.hash(plainPin, 10);
    const now = new Date().toISOString();

    let shopId = "";

    await db.runTransaction(async (transaction) => {
      // Create shop
      shopId = await this.shopRepo.createShopTransaction(transaction, {
        tenantId,
        name: data.name,
        ownerId: "",
        createdAt: now,
        updatedAt: now,
      });

      // Create owner
      const userId = await this.userRepo.createUserTransaction(transaction, {
        tenantId,
        shopId,
        name: data.ownerName,
        email: data.ownerEmail,
        pin: hashedPin,
        role: UserRole.USER,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });

      // Update shop ownerId
      transaction.update(db.collection("shops").doc(shopId), {
        ownerId: userId,
        updatedAt: now,
      });
    });

    return {
      shopId,
      ownerEmail: data.ownerEmail,
      ownerPin: plainPin,
    };
  }

  // ============== GET SHOPS ==============
  async getShops(currentUser: RequestUser): Promise<IShop[]> {
    const { role, tenantId, shopId } = currentUser;

    switch (role) {
      case UserRole.SUPER_ADMIN:
        return this.shopRepo.findMany();

      case UserRole.ADMIN:
        if (!tenantId) throw new AppError("Tenant ID not found", 403);
        return this.shopRepo.findByTenantId(tenantId);

      case UserRole.USER:
        if (!shopId) throw new AppError("Shop ID not found", 403);
        const shop = await this.shopRepo.findById(shopId);
        return shop ? [shop] : [];

      default:
        throw new AppError("Unauthorized", 403);
    }
  }

  // ============== GET SHOP BY ID ==============
  async getShopById(
    id: string,
    currentUser: RequestUser,
  ): Promise<IShop | null> {
    const shop = await this.shopRepo.findById(id);
    if (!shop) return null;

    switch (currentUser.role) {
      case UserRole.SUPER_ADMIN:
        return shop;

      case UserRole.ADMIN:
        if (shop.tenantId !== currentUser.tenantId)
          throw new AppError("Access denied", 403);
        return shop;

      case UserRole.USER:
        if (shop.id !== currentUser.shopId)
          throw new AppError("Access denied", 403);
        return shop;

      default:
        throw new AppError("Unauthorized", 403);
    }
  }
}
