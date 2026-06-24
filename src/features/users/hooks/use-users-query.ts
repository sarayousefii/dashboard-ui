import { useQuery } from "@tanstack/react-query";
import { usersListQuery } from "../api/users.query-options";

export function useUsersQuery(params: any) {
  return useQuery(usersListQuery(params));
}