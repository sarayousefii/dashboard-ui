"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { appToast } from "@/shared/lib/toast";
import { useCreateUser } from "../hooks/use-users-mutations";
import { UserForm } from "./user-form";

export default function CreateUserForm() {
  const createUser = useCreateUser();
  const router = useRouter();
  const t = useTranslations("users.notifications");

  return (
    <UserForm
      mode="create"
      isLoading={createUser.isPending}
      onSubmit={(values) =>
        createUser.mutate(values, {
          onSuccess: () => {
            appToast.success(t("created"));
            router.push("/users");
          },
        })
      }
    />
  );
}