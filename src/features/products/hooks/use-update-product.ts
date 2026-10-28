import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProduct } from "../api/products.mutations";
import type { UpdateProductVariables } from "../api/products.mutations";
import { productsKeys } from "../api/products.query-keys";
import type { Product, ProductListData } from "../types/product.types";
import type { ApiResponse } from "@/shared/types/api-response";

import { appToast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/lib/api-error";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,

    onMutate: async ({ id, data }: UpdateProductVariables) => {
      await queryClient.cancelQueries({ queryKey: productsKeys.all });

      const previousLists = queryClient.getQueriesData<ApiResponse<ProductListData>>({
        queryKey: productsKeys.lists(),
      });

      const detailKey = productsKeys.detail(id);
      const previousDetail = queryClient.getQueryData<ApiResponse<Product>>(detailKey);
      const detailWasCached = queryClient.getQueryState(detailKey) !== undefined;

      queryClient.setQueriesData<ApiResponse<ProductListData>>(
        { queryKey: productsKeys.lists() },
        (previousResponse) => {
          if (!previousResponse?.data?.products) return previousResponse;

          return {
            ...previousResponse,
            data: {
              ...previousResponse.data,
              products: previousResponse.data.products.map((product) =>
                product.id === id ? { ...product, ...data } : product,
              ),
            },
          };
        },
      );

      queryClient.setQueryData<ApiResponse<Product>>(detailKey, (previousResponse) => {
        if (!previousResponse?.data) return previousResponse;

        return {
          ...previousResponse,
          data: { ...previousResponse.data, ...data },
        };
      });

      return { previousLists, previousDetail, detailWasCached };
    },

    onError: (error, variables, context) => {
      for (const [queryKey, previousResponse] of context?.previousLists ?? []) {
        if (previousResponse) {
          queryClient.setQueryData<ApiResponse<ProductListData>>(
            queryKey,
            previousResponse,
          );
        }
      }

      const detailKey = productsKeys.detail(variables.id);
      if (context?.detailWasCached) {
        queryClient.setQueryData<ApiResponse<Product>>(
          detailKey,
          context.previousDetail,
        );
      } else {
        queryClient.removeQueries({ queryKey: detailKey, exact: true });
      }

      appToast.error(getErrorMessage(error) || "Update failed");
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(variables.id) });
    },
  });
}
