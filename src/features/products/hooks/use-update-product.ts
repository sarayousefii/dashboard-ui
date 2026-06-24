import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProduct } from "../api/products.mutations";
import { productsKeys } from "../api/products.query-keys";

import { appToast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/lib/api-error";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    // API call برای آپدیت محصول
    mutationFn: updateProduct,

    // قبل از ارسال request → Optimistic Update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: productsKeys.all,
      });

      // snapshot از لیست برای rollback
      const previousList = queryClient.getQueryData(
        productsKeys.list({} as any)
      );

      // snapshot از detail page
      const previousDetail = queryClient.getQueryData(
        productsKeys.detail(id)
      );

      // 🔥 1. آپدیت لیست محصولات
      queryClient.setQueryData(
        productsKeys.list({} as any),
        (old: any) => {
          if (!old?.products) return old;

          return {
            ...old,
            products: old.products.map((p: any) =>
              p.id === id
                ? { ...p, ...data }
                : p
            ),
          };
        }
      );

      // 🔥 2. آپدیت صفحه جزئیات
      queryClient.setQueryData(
        productsKeys.detail(id),
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            ...data,
          };
        }
      );

      return {
        previousList,
        previousDetail,
      };
    },

    // اگر خطا رخ داد → rollback کامل
    onError: (error, variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(
          productsKeys.list({} as any),
          context.previousList
        );
      }

      if (context?.previousDetail) {
        queryClient.setQueryData(
          productsKeys.detail(variables.id),
          context.previousDetail
        );
      }

      appToast.error(
        getErrorMessage(error) || "Update failed"
      );
    },

    // بعد از success یا error → sync با server
    onSettled: (_data, _error, variables) => {
      // invalidate لیست
      queryClient.invalidateQueries({
        queryKey: productsKeys.all,
      });

      // invalidate دیتیل
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(variables.id),
      });
    },
  });
}