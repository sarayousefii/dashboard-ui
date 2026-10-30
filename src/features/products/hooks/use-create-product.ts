import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiResponse } from "@/shared/types/api-response";
import { createProduct } from "../api/products.mutations";
import { productsKeys } from "../api/products.query-keys";
import type {
  GetProductsParams,
  Product,
  ProductListData,
} from "../types/product.types";

import { getErrorMessage } from "@/shared/lib/api-error";
import { appToast } from "@/shared/lib/toast";
import { useTranslations } from "next-intl";

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const t = useTranslations("products.notifications");

  return useMutation({
    mutationFn: createProduct,

    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({
        queryKey: productsKeys.lists(),
      });

      const previousLists = queryClient.getQueriesData<ApiResponse<ProductListData>>({
        queryKey: productsKeys.lists(),
      });

      const tempProduct: Product = {
        id: -Date.now(),
        title: newProduct.title,
        description: newProduct.description,
        price: newProduct.price,
      };

      for (const [queryKey, previousResponse] of previousLists) {
        const params = queryKey[2] as GetProductsParams | undefined;
        const listData = previousResponse?.data;
        const isFirstPage = (params?.page ?? 1) === 1;
        const isUnfiltered = !params?.search && !params?.sortBy && !params?.order;

        // Only insert optimistically into the unfiltered first page.
        // Other list variants are reconciled with the server after mutation.
        if (!previousResponse || !listData || !isFirstPage || !isUnfiltered) continue;

        queryClient.setQueryData<ApiResponse<ProductListData>>(queryKey, {
          ...previousResponse,
          data: {
            ...listData,
            products: [tempProduct, ...listData.products],
            total: listData.total + 1,
          },
        });
      }

      return { previousLists };
    },

    onError: (error, _newProduct, context) => {
      for (const [queryKey, previousResponse] of context?.previousLists ?? []) {
        if (previousResponse) {
          queryClient.setQueryData<ApiResponse<ProductListData>>(
            queryKey,
            previousResponse,
          );
        }
      }

      appToast.error(getErrorMessage(error) || t("createFailed"));
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.all,
      });
    },
  });
}
