import { GetUsersParams } from "../types/user.types";

export const usersKeys = {
  all: ["users"] as const,

  lists: () => [...usersKeys.all, "list"] as const,

  list: (params: GetUsersParams) =>
    [...usersKeys.lists(), params] as const,

  detail: (id: number) =>
    [...usersKeys.all, "detail", id] as const,
};