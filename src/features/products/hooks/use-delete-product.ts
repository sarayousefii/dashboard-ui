import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteProduct } from "../api/products.mutations";
import { productsKeys } from "../api/products.query-keys";

import { appToast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/lib/api-error";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    // API call برای حذف محصول
    mutationFn: deleteProduct,

    // قبل از ارسال request → Optimistic Update
    onMutate: async (id: number) => {
      // جلوگیری از refetch همزمان
      await queryClient.cancelQueries({
        queryKey: productsKeys.all,
      });

      // گرفتن snapshot از cache برای rollback
      const previousData = queryClient.getQueryData(
        productsKeys.list({} as any)
      );

      // حذف فوری از UI (Optimistic Update)
      queryClient.setQueryData(
        productsKeys.list({} as any),
        (old: any) => {
          if (!old?.products) return old;

          return {
            ...old,
            products: old.products.filter(
              (p: any) => p.id !== id
            ),
          };
        }
      );

      return { previousData };
    },

    // اگر خطا رخ دهد → rollback UI
    onError: (error, _id, context) => {
      // بازگرداندن state قبلی
      if (context?.previousData) {
        queryClient.setQueryData(
          productsKeys.list({} as any),
          context.previousData
        );
      }

      appToast.error(
        getErrorMessage(error) || "Delete failed"
      );
    },

    // بعد از success یا error → sync با server
    onSettled: () => {
      // invalidateQueries:
      // یعنی داده را دوباره از سرور fetch کن
      // برای sync کردن cache با backend
      queryClient.invalidateQueries({
        queryKey: productsKeys.all,
      });
    },
  });
}