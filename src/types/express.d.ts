declare namespace Express {
  interface Request {
    user?: {
      id?: string;
      role: "SUPER_ADMIN" | "ADMIN" | "USER" | "EMPLOYEE";
      tenantId?: string;
      shopId?: string | null;
    };
  }
}
