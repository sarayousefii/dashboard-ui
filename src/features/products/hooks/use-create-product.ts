import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProduct } from "../api/products.mutations";
import { productsKeys } from "../api/products.query-keys";

import { appToast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/lib/api-error";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    // API call
    mutationFn: createProduct,

    // 🔥 Optimistic Create
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({
        queryKey: productsKeys.all,
      });

      const previousList = queryClient.getQueryData(
        productsKeys.list({} as any)
      );

      // 🔥 ساخت آیتم موقت (temp id)
      const tempProduct = {
        id: Date.now(), // موقت
        ...newProduct,
      };

      // اضافه کردن فوری به UI
      queryClient.setQueryData(
        productsKeys.list({} as any),
        (old: any) => {
          if (!old?.products) return old;

          return {
            ...old,
            products: [
              tempProduct,
              ...old.products,
            ],
          };
        }
      );

      return { previousList, tempProduct };
    },

    // ❌ اگر خطا شد → rollback
    onError: (error, _newProduct, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(
          productsKeys.list({} as any),
          context.previousList
        );
      }

      appToast.error(
        getErrorMessage(error) || "Create failed"
      );
    },

    // 🔄 بعد از success → sync نهایی
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.all,
      });
    },
  });
}