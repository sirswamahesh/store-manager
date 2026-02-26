export interface LoginDTO {
  email: string;
  pin: string;
}

export interface JwtPayload {
  id: string;
  role: string;
  tenantId?: string;
}
