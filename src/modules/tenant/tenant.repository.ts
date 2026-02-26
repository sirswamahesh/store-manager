import { BaseRepository } from "../../core/BaseRepository";

export class TenantRepository extends BaseRepository<any> {
  constructor() {
    super("tenants");
  }
}

export class UserRepository extends BaseRepository<any> {
  constructor() {
    super("users");
  }
}
