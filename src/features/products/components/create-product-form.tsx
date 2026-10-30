"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { appToast } from "@/shared/lib/toast";
import { useCreateProduct } from "../hooks/use-create-product";
import { ProductForm } from "./product-form";

export function CreateProductForm() {
  const createMutation = useCreateProduct();
  const router = useRouter();
  const t = useTranslations("products.notifications");

  return (
    <ProductForm
      mode="create"
      isPending={createMutation.isPending}
      onSubmit={(values) =>
        createMutation.mutate(values, {
          onSuccess: () => {
            appToast.success(t("created"));
            router.push("/products");
          },
        })
      }
    />
  );
}