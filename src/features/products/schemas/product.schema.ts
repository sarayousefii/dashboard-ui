import { z } from "zod";

interface ProductValidationMessages {
  titleMin: string;
  descriptionMin: string;
  priceMin: string;
}

export function createProductSchema(
  messages: ProductValidationMessages,
) {
  return z.object({
    title: z.string().min(3, messages.titleMin),
    description: z.string().min(10, messages.descriptionMin),
    price: z.number().min(1, messages.priceMin),
  });
}

export type ProductFormValues = z.infer<
  ReturnType<typeof createProductSchema>
>;