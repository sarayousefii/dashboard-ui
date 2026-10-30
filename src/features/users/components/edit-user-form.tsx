"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useUserQuery } from "../hooks/use-user-query";
import { useUpdateUser } from "../hooks/use-users-mutations";
import { UserForm } from "./user-form";

export default function EditUserForm() {
  const t = useTranslations("users.common");

  const { id } = useParams();
  const { data } = useUserQuery(Number(id));
  const updateUser = useUpdateUser();

  const user = data?.data;

  if (!user) {
    return <div>{t("loading")}</div>;
  }

  return (
    <UserForm
      mode="edit"
      initialValues={user}
      onSubmit={(values) =>
        updateUser.mutate({
          id: Number(id),
          data: values,
        })
      }
    />
  );
}