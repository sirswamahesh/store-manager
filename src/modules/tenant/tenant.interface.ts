export interface ITenant {
  id: string;
  name: string;
  email: string;
  subscriptionStatus: "TRIAL" | "ACTIVE" | "EXPIRED" | "CANCELLED";
  shopLimit: number;
  userLimitPerShop: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITenantWithAdmin extends ITenant {
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    pin?: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export interface ICreateTenantDTO {
  tenantName: string;
  tenantEmail: string;
  adminName: string;
  adminEmail: string;
}

export interface ICreateTenantResponse {
  tenantId: string;
  adminEmail: string;
  adminPin: string;
}
export interface TenantFilters {
  isActive?: boolean;
  subscriptionStatus?: string;
  search?: string;
}
