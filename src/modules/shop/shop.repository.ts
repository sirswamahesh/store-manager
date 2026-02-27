import { BaseRepository } from "../../core/BaseRepository";
import { IShop } from "./shop.interface";

export class ShopRepository extends BaseRepository<IShop> {
  constructor() {
    super("shops");
  }

  async findByTenantId(tenantId: string): Promise<IShop[]> {
    return this.findMany([
      { field: "tenantId", operator: "==", value: tenantId },
    ]);
  }

  async countByTenantId(tenantId: string): Promise<number> {
    const snapshot = await this.collection
      .where("tenantId", "==", tenantId)
      .count()
      .get();
    return snapshot.data().count;
  }

  async createShopTransaction(transaction: any, data: any): Promise<string> {
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
