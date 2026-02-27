export interface IUser {
  id: string;
  tenantId?: string;
  name: string;
  email: string;
  pin: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER" | "EMPLOYEE";
  shopId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
