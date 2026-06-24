import { api } from "@/shared/lib/axios";

//delete Product
export const deleteProduct = async (id: number) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

//edit Product
export const updateProduct = async ({id,data}: {
  id: number;
  data: any;
}) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

//create Product
export const createProduct = async (data: any) => {
  const res = await api.post("/products/add", data);
  return res.data;
};