import { BaseRepository } from "../../core/BaseRepository";
import { ITenant } from "./tenant.interface";

export class TenantRepository extends BaseRepository<ITenant> {
  constructor() {
    super("tenants");
  }

  async findByEmail(email: string): Promise<ITenant | null> {
    return this.findOne("email", email);
  }

  async findActiveTenants(): Promise<ITenant[]> {
    return this.findMany([{ field: "isActive", operator: "==", value: true }]);
  }

  async updateSubscriptionStatus(
    id: string,
    status: ITenant["subscriptionStatus"],
  ): Promise<ITenant | null> {
    return this.update(id, { subscriptionStatus: status } as Partial<ITenant>);
  }
}
