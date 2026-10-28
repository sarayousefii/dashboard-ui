import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteProduct } from "../api/products.mutations";
import { productsKeys } from "../api/products.query-keys";
import type { ProductListData } from "../types/product.types";
import type { ApiResponse } from "@/shared/types/api-response";

import { appToast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/lib/api-error";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({
        queryKey: productsKeys.lists(),
      });

      const previousLists = queryClient.getQueriesData<ApiResponse<ProductListData>>({
        queryKey: productsKeys.lists(),
      });

      queryClient.setQueriesData<ApiResponse<ProductListData>>(
        { queryKey: productsKeys.lists() },
        (previousResponse) => {
          if (!previousResponse?.data?.products) return previousResponse;

          const beforeCount = previousResponse.data.products.length;
          const products = previousResponse.data.products.filter(
            (product) => product.id !== id,
          );

          if (products.length === beforeCount) return previousResponse;

          return {
            ...previousResponse,
            data: {
              ...previousResponse.data,
              products,
              total: Math.max(0, previousResponse.data.total - 1),
            },
          };
        },
      );

      return { previousLists };
    },

    onError: (error, _id, context) => {
      for (const [queryKey, previousResponse] of context?.previousLists ?? []) {
        if (previousResponse) {
          queryClient.setQueryData<ApiResponse<ProductListData>>(
            queryKey,
            previousResponse,
          );
        }
      }

      appToast.error(getErrorMessage(error) || "Delete failed");
    },

    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(id) });
    },
  });
}
