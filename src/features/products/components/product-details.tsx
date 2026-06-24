"use client";

import { useQuery } from "@tanstack/react-query";

import { DashboardLayout } from "@/shared/components/layout/dashboard-layout";

import { Card } from "@/components/ui/card";

import { productDetailQuery } from "../api/products.query-options";

interface Props {
  id: number;
}

export function ProductDetails({
  id,
}: Props) {
  const { data: product } =
    useQuery(productDetailQuery(id));

  if (!product) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {product.data.title}
          </h1>

          <p className="text-muted-foreground">
            Product Details
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Description
              </p>

              <p>
                {product.data.description}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Price
              </p>

              <p className="text-2xl font-bold">
                ${product.data.price}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}