"use client";

import { ProductForm } from "./product-form";
import { useUpdateProduct } from "../hooks/use-update-product";
import { useRouter } from "next/navigation";
import { appToast } from "@/shared/lib/toast";

interface Props {
  product: any;
}

export function EditProductForm({ product }: Props) {

  const updateMutation = useUpdateProduct();
  const router = useRouter();

  return (
    <ProductForm
      mode="edit"
      initialData={product.data}
      onSubmit={(values) =>
        updateMutation.mutate({
          id: product.id,
          data: values,
        },
        {
            onSuccess: () => {
              appToast.success(
                "Product updated successfully"
              );

              router.push("/products");
            }
        })
      }
    />
  );
}