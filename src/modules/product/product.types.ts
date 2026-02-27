export interface CreateProductDTO {
  name: string;
  price: number;
  category: string;
  stock?: number;
  imageUrl?: string | null;
}

export interface Product {
  id: string;
  tenantId: string;
  shopId: string;
  name: string;
  price: number;
  category: string;
  stock?: number;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
