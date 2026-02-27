export interface LoginDTO {
  email: string;
  pin: string;
}

export interface TokenPayload {
  id: string;
  role: string;
  tenantId?: string | null;
  shopId?: string | null;
}
