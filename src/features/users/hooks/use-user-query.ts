import { useQuery } from "@tanstack/react-query";
import { userDetailQuery } from "../api/users.query-options";

export function useUserQuery(id: number) {
  return useQuery(userDetailQuery(id));
}