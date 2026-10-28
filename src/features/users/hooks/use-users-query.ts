import { useQuery } from "@tanstack/react-query";

import { usersListQuery } from "../api/users.query-options";
import type { GetUsersParams } from "../types/user.types";

export function useUsersQuery(params: GetUsersParams) {
  return useQuery(usersListQuery(params));
}
