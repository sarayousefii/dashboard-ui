"use client";

import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useUrlState } from "@/shared/hooks/use-url-state";
import { useDebounce } from "@/shared/hooks/use-debounce";

import { useUsersQuery } from "./use-users-query";

import { usersListQuery } from "../api/users.query-options";

export function useUsersView() {
  const queryClient = useQueryClient();

  const { get, set } = useUrlState();

  const page = Number(
    get("page", "1")
  );

  const sortBy = get(
    "sortBy",
    ""
  );

  const order = get(
    "order",
    ""
  );

  const urlSearch = get(
    "search",
    ""
  );

  const [search, setSearch] =
    useState(urlSearch);

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  const debouncedSearch =
    useDebounce(search, 400);

  const query = useUsersQuery({
    page,
    search: debouncedSearch,
    sortBy,
    order,
  });

  const updateSearch = (
    value: string
  ) => {
    setSearch(value);

    set("search", value);

    set("page", "1");
  };

  const setPage = (
    value: number
  ) => {
    set(
      "page",
      String(value)
    );
  };

  const setSortBy = (
    value: string
  ) => {
    set("sortBy", value);

    set("page", "1");
  };

  const setOrder = (
    value: string
  ) => {
    set("order", value);

    set("page", "1");
  };

  const prefetchNextPage = () => {
    queryClient.prefetchQuery(
      usersListQuery({
        page: page + 1,
        search: debouncedSearch,
        sortBy,
        order,
      })
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