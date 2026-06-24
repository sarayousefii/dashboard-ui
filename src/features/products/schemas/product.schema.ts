import { z } from "zod";

export const productSchema =
  z.object({
    title: z
      .string()
      .min(3),

    description: z
      .string()
      .min(10),

    price: z
      .number()
      .min(1),
  });

export type ProductFormValues =
  z.infer<
    typeof productSchema
  >;