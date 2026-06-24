import { api } from "@/shared/lib/axios"

export async function deleteUser(id: number) {
  const res  = await api.delete(`/users/${id}`);
  return res.data;
}

export async function updateUser(id: number, data: any) {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
}

export async function createUser(data: any) {
  const res = await api.post(`/users`, data);
  return res.data;
}