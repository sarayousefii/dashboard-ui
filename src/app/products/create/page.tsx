import { CreateProductForm } from "@/features/products/components/create-product-form";

export const metadata = {
  title: "Create Product",
};

export default function CreateProductPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <CreateProductForm />
    </div>
  );
}