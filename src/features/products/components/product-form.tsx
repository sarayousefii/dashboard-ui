"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  productSchema,
  ProductFormValues,
} from "../schemas/product.schema";
import { FormField } from "@/shared/components/form/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        price: initialData.price,
      });
    }
  }, [initialData, mode, reset]);

  const submitHandler = (values: ProductFormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="max-w-2xl p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          {mode === "create"
            ? "Create Product"
            : "Edit Product"}
        </h1>

        <p className="text-muted-foreground">
          Manage product information
        </p>
      </div>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="space-y-6"
      >
        
        <FormField
          label="Title"
          htmlFor="title"
          error={errors.title?.message}
        >
          <Input
            id="title"
            {...register("title")}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="Description"
          error={errors.description?.message}
        >
          <Textarea
            id="description"
            placeholder="Description"
            {...register("description")}
          />
        </FormField>

        <FormField
          label="Price"
          htmlFor="price"
          error={
            errors.price?.message
          }
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
            ? "Saving..."
            : mode === "create"
            ? "Create Product"
            : "Update Product"}
        </Button>
      </form>
    </Card>
  );
}