"use client";

import { useRouter } from "next/navigation";

import type { ApiResponse } from "@/shared/types/api-response";
import type { Product } from "../types/product.types";
import { appToast } from "@/shared/lib/toast";

import { ProductForm } from "./product-form";
import { useUpdateProduct } from "../hooks/use-update-product";

interface Props {
  product: ApiResponse<Product>;
}

export function EditProductForm({ product }: Props) {
  const updateMutation = useUpdateProduct();
  const router = useRouter();
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
              appToast.success("Product updated successfully");
              router.push("/products");
            },
          },
        )
      }
    />
  );
}
