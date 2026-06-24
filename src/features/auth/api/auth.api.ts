import { api } from "@/shared/lib/axios";

interface LoginPayload {
  username: string;
  password: string;
}

export async function login(
  data: LoginPayload
) {
  const res = await api.post(
    "/auth/login",
    data
  );

  return res.data;
}

export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function logout() {
  const res = await api.post(
    "/auth/logout"
  );

  return res.data;
}