import { BaseRepository } from "../../core/BaseRepository";
import { Product } from "./product.types";

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super("products");
  }

  async findByShopId(shopId: string) {
    const snapshot = await this.collection.where("shopId", "==", shopId).get();

    return snapshot.docs.map((doc) => doc.data());
  }
  async findByNameAndShop(name: string, shopId: string) {
    const snapshot = await this.collection
      .where("name", "==", name.toLowerCase())
      .where("shopId", "==", shopId)
      .limit(1)
      .get();

    return snapshot.empty ? null : snapshot.docs[0].data();
  }

  async findByTenantId(tenantId: string) {
    const snapshot = await this.collection
      .where("tenantId", "==", tenantId)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }
  async findByTenantAndShop(tenantId: string, shopId: string) {
    const snapshot = await this.collection
      .where("tenantId", "==", tenantId)
      .where("shopId", "==", shopId)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }
}
