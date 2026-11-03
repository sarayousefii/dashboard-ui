"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useUrlState } from "@/shared/hooks/use-url-state";
import { useDebounce } from "@/shared/hooks/use-debounce";

import { useUsersQuery } from "./use-users-query";
import { usersListQuery } from "../api/users.query-options";

export function useUsersView() {
  const queryClient = useQueryClient();
  const { get, set, setMany } = useUrlState();

  const page = Math.max(1, Number(get("page", "1")) || 1);
  const sortBy = get("sortBy", "");
  const order = get("order", "");
  const search = get("search", "");
  const debouncedSearch = useDebounce(search, 400);

  const query = useUsersQuery({
    page,
    search: debouncedSearch,
    sortBy,
    order,
  });

  const updateSearch = (value: string) => {
    setMany({ search: value, page: "1" });
  };

  const setPage = (value: number) => {
    set("page", String(Math.max(1, value)));
  };

  const setSortBy = (value: string) => {
    setMany({ sortBy: value, page: "1" });
  };

  const setOrder = (value: string) => {
    setMany({ order: value, page: "1" });
  };

  const prefetchNextPage = () => {
    void queryClient.prefetchQuery(
      usersListQuery({
        page: page + 1,
        search: debouncedSearch,
        sortBy,
        order,
      }),
    );
  };

  return {
    page,
    search,
    sortBy,
    order,
    setSearch: updateSearch,
    setPage,
    setSortBy,
    setOrder,
    prefetchNextPage,
    ...query,
  };
}
