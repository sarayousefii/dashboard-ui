"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  createUserFormSchema,
  type UserFormValues,
} from "../schemas/user-form.schema";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Props = {
  onSubmit: (values: UserFormValues) => void;
  isLoading?: boolean;
  initialValues?: Partial<UserFormValues>;
  mode?: "create" | "edit";
};

export function UserForm({
  onSubmit,
  isLoading = false,
  initialValues,
  mode = "create",
}: Props) {
  const t = useTranslations("users.form");
  const validationT = useTranslations("users.validation");

  const schema = useMemo(
    () =>
      createUserFormSchema({
        firstNameMin: validationT("firstNameMin"),
        lastNameMin: validationT("lastNameMin"),
        emailInvalid: validationT("emailInvalid"),
        ageMin: validationT("ageMin"),
      }),
    [validationT],
  );

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: 18,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        firstName: initialValues.firstName ?? "",
        lastName: initialValues.lastName ?? "",
        email: initialValues.email ?? "",
        age: initialValues.age ?? 18,
      });
    }
  }, [initialValues, form]);

  return (
    <Card className="max-w-2xl p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          {mode === "edit"
            ? t("editTitle")
            : t("createTitle")}
        </h1>

        <p className="text-muted-foreground">
          {t("manageDescription")}
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-6 max-w-md space-y-4"
      >
        <Input
          placeholder={t("firstName")}
          aria-label={t("firstName")}
          aria-invalid={!!form.formState.errors.firstName}
          {...form.register("firstName")}
        />

        {form.formState.errors.firstName && (
          <p className="text-sm text-destructive">
            {form.formState.errors.firstName.message}
          </p>
        )}

        <Input
          placeholder={t("lastName")}
          aria-label={t("lastName")}
          aria-invalid={!!form.formState.errors.lastName}
          {...form.register("lastName")}
        />

        {form.formState.errors.lastName && (
          <p className="text-sm text-destructive">
            {form.formState.errors.lastName.message}
          </p>
        )}

        <Input
          type="email"
          placeholder={t("email")}
          aria-label={t("email")}
          aria-invalid={!!form.formState.errors.email}
          {...form.register("email")}
        />

        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}

        <Input
          type="number"
          placeholder={t("age")}
          aria-label={t("age")}
          aria-invalid={!!form.formState.errors.age}
          {...form.register("age", {
            valueAsNumber: true,
          })}
        />

        {form.formState.errors.age && (
          <p className="text-sm text-destructive">
            {form.formState.errors.age.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {mode === "edit"
            ? t("update")
            : t("create")}
        </Button>
      </form>
    </Card>
  );
}