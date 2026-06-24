import axios from "axios";

const BASE_URL =
  typeof window === "undefined"
    ? "http://localhost:3000/api"
    : "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});