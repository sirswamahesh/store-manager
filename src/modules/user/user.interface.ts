export interface IUser {
  id?: string;
  tenantId?: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER" | "EMPLOYEE";
  isActive: boolean;
  createdAt: Date;
}
