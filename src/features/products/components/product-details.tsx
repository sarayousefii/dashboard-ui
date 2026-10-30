"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/shared/components/layout/dashboard-layout";

import { productDetailQuery } from "../api/products.query-options";

interface Props {
  id: number;
}

export function ProductDetails({ id }: Props) {
  const t = useTranslations("products");

  const { data: product } = useQuery(
    productDetailQuery(id),
  );

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
            {t("details")}
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("form.description")}
              </p>
              <p>{product.data.description}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {t("form.price")}
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