import {
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,

        refetchOnWindowFocus: false,

        retry: 1,
      },

      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(
            query
          ),
      },
    },
  });
}

let browserQueryClient:
  | QueryClient
  | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient =
      makeQueryClient();
  }

  return browserQueryClient;
}