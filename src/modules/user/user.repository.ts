import { BaseRepository } from "../../core/BaseRepository";
import { IUser } from "./user.interface";
import { db } from "../../config/firebase";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super("users");
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne("email", email);
  }

  async findByTenantId(tenantId: string): Promise<IUser[]> {
    return this.findMany([
      { field: "tenantId", operator: "==", value: tenantId },
    ]);
  }

  async findByShopId(shopId: string): Promise<IUser[]> {
    return this.findMany([{ field: "shopId", operator: "==", value: shopId }]);
  }
  async createUserTransaction(transaction: any, data: any): Promise<string> {
    const docRef = this.collection.doc();
    transaction.set(docRef, {
      ...data,
      id: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  }
}
