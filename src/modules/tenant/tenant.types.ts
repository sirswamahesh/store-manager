import { UserRole } from "../../utils/roles";

export interface TenantFilters {
  isActive?: boolean;
  subscriptionStatus?: string;
  search?: string;
}

export interface TenantAdminInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  pin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RequestUser {
  id: string;
  role: UserRole;
  tenantId?: string;
  shopId?: string;
}
