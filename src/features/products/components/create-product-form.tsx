"use client";

import { ProductForm } from "./product-form";
import { appToast } from "@/shared/lib/toast";
import { useCreateProduct } from "../hooks/use-create-product";
import { useRouter } from "next/navigation";

export function CreateProductForm() {
  const createMutation = useCreateProduct();
  const router = useRouter();

  return (
    <ProductForm
      mode="create"
      onSubmit={(values) =>
        createMutation.mutate(values, {
          onSuccess: () => {
            appToast.success(
              "Product created successfully"
            );

            router.push("/products");
          }
        })
      }
    />
  );
}