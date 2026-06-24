import { z } from "zod";

export const userFormSchema = z.object({
  firstName: z
    .string()
    .min(2),

  lastName: z
    .string()
    .min(2),

  email: z
    .email(),

  age: z
    .number()
    .min(18),
});

export type UserFormValues =
  z.infer<
    typeof userFormSchema
  >;