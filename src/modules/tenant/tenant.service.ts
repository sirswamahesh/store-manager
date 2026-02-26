import bcrypt from "bcryptjs";
import { BaseService } from "../../core/BaseService";
import { TenantRepository, UserRepository } from "./tenant.repository";
import { db } from "../../config/firebase";
import { AppError } from "../../core/AppError";
import { HTTP_STATUS } from "../../utils/httpStatus";

const generateSixDigitPin = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export class TenantService extends BaseService<any> {
  private tenantRepo = new TenantRepository();
  private userRepo = new UserRepository();

  constructor() {
    super(null);
  }

  async createTenant(data: any) {
    const existingTenant = await this.tenantRepo.findOneByField(
      "email",
      data.tenantEmail,
    );

    if (existingTenant) {
      throw new AppError(
        "Tenant email already exists",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const existingAdmin = await this.userRepo.findOneByField(
      "email",
      data.adminEmail,
    );

    if (existingAdmin) {
      throw new AppError("Admin email already exists", HTTP_STATUS.BAD_REQUEST);
    }

    const tenantRef = db.collection("tenants").doc();
    const userRef = db.collection("users").doc();

    const plainPin = generateSixDigitPin();

    const hashedPin = await bcrypt.hash(plainPin, 10);

    await db.runTransaction(async (transaction) => {
      transaction.set(tenantRef, {
        id: tenantRef.id,
        name: data.tenantName,
        email: data.tenantEmail,
        subscriptionStatus: "TRIAL",
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      transaction.set(userRef, {
        id: userRef.id,
        tenantId: tenantRef.id,
        shopId: null,
        name: data.adminName,
        email: data.adminEmail,
        pin: hashedPin,
        role: "ADMIN",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    return {
      tenantId: tenantRef.id,
      adminEmail: data.adminEmail,
      adminPin: plainPin,
    };
  }
}
