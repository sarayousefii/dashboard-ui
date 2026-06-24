export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
}

export interface GetProductsParams {
  limit?: number;
  page?: number;
  search?: string;
  sortBy?: string;
  order?: string;
}