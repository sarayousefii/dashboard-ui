import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { getUsers, getUserById } from "./users.api";
import { usersKeys } from "./users.query-keys";
import type { GetUsersParams } from "../types/user.types";

export function usersListQuery(params: GetUsersParams) {
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
