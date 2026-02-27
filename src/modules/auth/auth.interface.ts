export interface IAuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    tenantId?: string | null;
    shopId?: string | null;
    name: string;
  };
}

export interface ITokenPayload {
  id: string;
  role: string;
  tenantId?: string | null;
  shopId?: string | null;
}
