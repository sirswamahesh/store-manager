import { UserRole } from "../../utils/roles";

export interface CreateShopDTO {
  name: string;
  ownerName: string;
  ownerEmail: string;
}

export interface RequestUser {
  id: string;
  role: UserRole;
  tenantId?: string;
  shopId?: string;
}
