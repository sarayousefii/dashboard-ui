"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userFormSchema, UserFormValues } from "../schemas/user-form.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

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
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
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
            ? "Edit User"
            : "Create User"}
        </h1>

        <p className="text-muted-foreground">
          Manage user information
        </p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <Input placeholder="First Name" {...form.register("firstName")} />
        <Input placeholder="Last Name" {...form.register("lastName")} />
        <Input type="email" placeholder="Email" {...form.register("email")} />
        <Input type="number" placeholder="Age" {...form.register("age", { valueAsNumber: true })} />

        <Button type="submit" disabled={isLoading}>
          {mode === "edit" ? "Update User" : "Create User"}
        </Button>
      </form>
    </Card>
  );
}