import { z } from "zod";

interface UserValidationMessages {
  firstNameMin: string;
  lastNameMin: string;
  emailInvalid: string;
  ageMin: string;
}

export function createUserFormSchema(
  messages: UserValidationMessages,
) {
  return z.object({
    firstName: z.string().min(2, messages.firstNameMin),

    lastName: z.string().min(2, messages.lastNameMin),

    email: z.email({
      error: messages.emailInvalid,
    }),

    age: z.number().min(18, messages.ageMin),
  });
}

export type UserFormValues = z.infer<
  ReturnType<typeof createUserFormSchema>
>;