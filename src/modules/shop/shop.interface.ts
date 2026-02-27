import { IUser } from "../user/user.interface";
import { ITenant } from "../tenant/tenant.interface";

export interface IShop {
  id: string;
  tenantId: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IShopWithOwner extends IShop {
  owner?: Partial<IUser>;
  tenant?: Partial<ITenant>;
}

export interface ICreateShopDTO {
  name: string;
  ownerName: string;
  ownerEmail: string;
}

export interface ICreateShopResponse {
  shopId: string;
  ownerEmail: string;
  ownerPin: string;
}
