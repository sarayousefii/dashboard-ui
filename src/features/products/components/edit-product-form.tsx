"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import type { ApiResponse } from "@/shared/types/api-response";
import type { Product } from "../types/product.types";

import { appToast } from "@/shared/lib/toast";
import { useUpdateProduct } from "../hooks/use-update-product";
import { ProductForm } from "./product-form";

interface Props {
  product: ApiResponse<Product>;
}

export function EditProductForm({ product }: Props) {
  const updateMutation = useUpdateProduct();
  const router = useRouter();
  const t = useTranslations("products.notifications");

  const productData = product.data;

  return (
    <ProductForm
      mode="edit"
      initialData={{
        id: productData.id,
        title: productData.title,
        description: productData.description ?? "",
        price: productData.price,
      }}
      isPending={updateMutation.isPending}
      onSubmit={(values) =>
        updateMutation.mutate(
          { id: productData.id, data: values },
          {
            onSuccess: () => {
              appToast.success(t("updated"));
              router.push("/products");
            },
          },
        )
      }
    />
  );
}