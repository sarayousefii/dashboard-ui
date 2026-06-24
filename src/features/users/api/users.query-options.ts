import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { getUsers, getUserById } from "./users.api";
import { usersKeys } from "./users.query-keys";

export function usersListQuery(params: any) {
  return queryOptions({
    queryKey: usersKeys.list(params),
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
}

export function userDetailQuery(id: number) {
  return queryOptions({
    queryKey: usersKeys.detail(id),
    queryFn: () => getUserById(id),
    staleTime: 1000 * 60,
  });
}