import { notFound } from "next/navigation";

import { getProductById } from "@/features/products/api/products.api";

import { EditProductForm } from "@/features/products/components/edit-product-form";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: Props) {
  const { id } = await params;

  const product =
    await getProductById(
      Number(id)
    );
  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <EditProductForm
        product={product}
      />
    </div>
  );
}