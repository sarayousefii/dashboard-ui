export interface Product {
  id: number;
  title: string;
  description?: string;
  category?: string;
  price: number;
}

export interface ProductListData {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface GetProductsParams {
  limit?: number;
  page?: number;
  search?: string;
  sortBy?: string;
  order?: string;
}
