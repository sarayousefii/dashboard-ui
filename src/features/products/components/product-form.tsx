"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  createProductSchema,
  type ProductFormValues,
} from "../schemas/product.schema";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/shared/components/form/form-field";

interface Props {
  mode: "create" | "edit";
  initialData?: {
    id: number;
    title: string;
    description: string;
    price: number;
  };
  onSubmit: (values: ProductFormValues) => void;
  isPending?: boolean;
}

export function ProductForm({
  mode,
  initialData,
  onSubmit,
  isPending = false,
}: Props) {
  const t = useTranslations("products.form");
  const validationT = useTranslations("products.validation");

  const schema = useMemo(
    () =>
      createProductSchema({
        titleMin: validationT("titleMin"),
        descriptionMin: validationT("descriptionMin"),
        priceMin: validationT("priceMin"),
      }),
    [validationT],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        price: initialData.price,
      });
    }
  }, [initialData, mode, reset]);

  return (
    <Card className="max-w-2xl p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          {mode === "create"
            ? t("createTitle")
            : t("editTitle")}
        </h1>

        <p className="text-muted-foreground">
          {t("manageDescription")}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-6"
      >
        <FormField
          label={t("title")}
          htmlFor="title"
          error={errors.title?.message}
        >
          <Input id="title" {...register("title")} />
        </FormField>

        <FormField
          label={t("description")}
          htmlFor="description"
          error={errors.description?.message}
        >
          <Textarea
            id="description"
            placeholder={t("description")}
            {...register("description")}
          />
        </FormField>

        <FormField
          label={t("price")}
          htmlFor="price"
          error={errors.price?.message}
        >
          <Input
            id="price"
            type="number"
            {...register("price", {
              valueAsNumber: true,
            })}
          />
        </FormField>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
        >
          {isPending
            ? t("saving")
            : mode === "create"
              ? t("create")
              : t("update")}
        </Button>
      </form>
    </Card>
  );
}