import bcrypt from "bcryptjs";
import { BaseService } from "../../core/BaseService";
import { TenantRepository } from "./tenant.repository";
import { UserRepository } from "../user/user.repository";
import {
  ITenant,
  ITenantWithAdmin,
  ICreateTenantDTO,
  ICreateTenantResponse,
} from "./tenant.interface";
import { RequestUser, TenantFilters } from "./tenant.types";
import { AppError } from "../../core/AppError";
import { db } from "../../config/firebase";
import { UserRole } from "../../utils/roles";

const generateSixDigitPin = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export class TenantService extends BaseService<ITenant> {
  private tenantRepo: TenantRepository;
  private userRepo: UserRepository;

  constructor() {
    super(new TenantRepository());
    this.tenantRepo = new TenantRepository();
    this.userRepo = new UserRepository();
  }

  async createTenant(data: ICreateTenantDTO): Promise<ICreateTenantResponse> {
    const existingTenant = await this.tenantRepo.findByEmail(data.tenantEmail);
    if (existingTenant) {
      throw new AppError("Tenant email already exists", 400);
    }

    const existingAdmin = await this.userRepo.findOne("email", data.adminEmail);
    if (existingAdmin) {
      throw new AppError("Admin email already exists", 400);
    }

    const tenantRef = db.collection("tenants").doc();
    const userRef = db.collection("users").doc();

    const plainPin = generateSixDigitPin();
    const hashedPin = await bcrypt.hash(plainPin, 10);
    const now = new Date().toISOString();

    await db.runTransaction(async (transaction) => {
      transaction.set(tenantRef, {
        id: tenantRef.id,
        name: data.tenantName,
        email: data.tenantEmail,
        subscriptionStatus: "TRIAL",
        shopLimit: 2,
        userLimitPerShop: 10,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });

      transaction.set(userRef, {
        id: userRef.id,
        tenantId: tenantRef.id,
        shopId: null,
        name: data.adminName,
        email: data.adminEmail,
        pin: hashedPin,
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    });

    return {
      tenantId: tenantRef.id,
      adminEmail: data.adminEmail,
      adminPin: plainPin,
    };
  }

  async getAllTenants(filters?: TenantFilters): Promise<ITenant[]> {
    const conditions = [];

    if (filters?.isActive !== undefined) {
      conditions.push({
        field: "isActive",
        operator: "==",
        value: filters.isActive,
      });
    }

    if (filters?.subscriptionStatus) {
      conditions.push({
        field: "subscriptionStatus",
        operator: "==",
        value: filters.subscriptionStatus,
      });
    }

    return conditions.length > 0
      ? this.tenantRepo.findMany(conditions)
      : this.tenantRepo.findMany();
  }
  async getTenantById(
    id: string,
    currentUser: RequestUser,
  ): Promise<ITenantWithAdmin> {
    if (currentUser.role !== UserRole.SUPER_ADMIN) {
      if (currentUser.tenantId !== id) {
        throw new AppError(
          "Access denied: You can only view your own tenant",
          403,
        );
      }
    }

    const tenant: any = await this.tenantRepo.findById(id);
    if (!tenant) {
      throw new AppError("Tenant not found", 404);
    }

    const admin = await this.userRepo.findOne("tenantId", id);

    const adminData = admin
      ? {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          isActive: admin.isActive,
          ...(currentUser.role === UserRole.SUPER_ADMIN && { pin: admin.pin }),
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt,
        }
      : null;

    return {
      ...tenant,
      admin: adminData,
    };
  }

  async updateTenant(
    id: string,
    data: Partial<ITenant>,
    currentUser: RequestUser,
  ): Promise<ITenant | null> {
    if (currentUser.role !== UserRole.SUPER_ADMIN) {
      if (currentUser.tenantId !== id) {
        throw new AppError(
          "Access denied: You can only update your own tenant",
          403,
        );
      }
    }

    const { id: _, ...updateData } = data;

    const updated = await this.tenantRepo.update(id, updateData);
    if (!updated) {
      throw new AppError("Tenant not found", 404);
    }

    return updated;
  }

  async deactivateTenant(id: string): Promise<ITenant | null> {
    const tenant = await this.tenantRepo.update(id, {
      isActive: false,
      updatedAt: new Date().toISOString(),
    } as Partial<ITenant>);

    if (!tenant) {
      throw new AppError("Tenant not found", 404);
    }

    const users = await this.userRepo.findMany([
      { field: "tenantId", operator: "==", value: id },
    ]);

    for (const user of users) {
      await this.userRepo.update(user.id, { isActive: false });
    }

    return tenant;
  }
}
