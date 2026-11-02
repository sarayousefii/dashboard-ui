
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useUpdateUser } from "@/features/users/hooks/use-users-mutations";
import { useProfileQuery } from "../hooks/use-profile-query";
import { useUpdateMyProfile } from "../hooks/use-update-my-profile";

import { profileKeys } from "../api/profile.query-keys";

import { UserForm } from "@/features/users/components/user-form";
import type { UserFormValues } from "@/features/users/schemas/user-form.schema";
import type { User } from "@/features/users/types/user.types";

import { DashboardLayout } from "@/shared/components/layout/dashboard-layout";
import { hasPermission } from "@/shared/lib/permissions";

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const userId = Number(params.id);
  const isValidId = Number.isInteger(userId) && userId > 0;

  const t = useTranslations("profile");
  const usersT = useTranslations("users");

  const [isEditing, setIsEditing] = useState(false);

  const currentUserQuery = useCurrentUser();
  const currentUser = currentUserQuery.data?.user as
    | User
    | null
    | undefined;

  const isSelf = currentUser?.id === userId;

  const canViewProfile =
    !!currentUser &&
    (isSelf ||
      hasPermission(currentUser.role, "users.view"));

  const canEditProfile =
    isSelf ||
    hasPermission(currentUser?.role, "users.edit");

  const profileQuery = useProfileQuery({
    userId,
    isSelf,
    enabled:
      !currentUserQuery.isLoading &&
      !!currentUser &&
      isValidId &&
      canViewProfile,
  });

  const updateMyProfile = useUpdateMyProfile();
  const updateUser = useUpdateUser();

  const user = profileQuery.data;

  const isSaving = isSelf
    ? updateMyProfile.isPending
    : updateUser.isPending;

  const handleSubmit = (values: UserFormValues) => {
    if (isSelf) {
      updateMyProfile.mutate(values, {
        onSuccess: () => setIsEditing(false),
      });

      return;
    }

    updateUser.mutate(
      {
        id: userId,
        data: values,
      },
      {
        onSuccess: async () => {
          setIsEditing(false);

          await queryClient.invalidateQueries({
            queryKey: profileKeys.detail(userId),
          });
        },
      },
    );
  };

  const roleLabel = user
    ? usersT(
        `roles.${user.role}` as
          | "roles.admin"
          | "roles.editor"
          | "roles.viewer",
      )
    : "";

  const status = user?.status ?? "active";

  const statusLabel = usersT(
    `statuses.${status}` as
      | "statuses.active"
      | "statuses.inactive"
      | "statuses.pending",
  );

  let content;

  if (currentUserQuery.isLoading) {
    content = <p>{t("loading")}</p>;
  } else if (!currentUser) {
    content = <p>{t("accessDenied")}</p>;
  } else if (!isValidId) {
    content = <p>{t("notFound")}</p>;
  } else if (!canViewProfile) {
    content = <p>{t("accessDenied")}</p>;
  } else if (profileQuery.isLoading) {
    content = <p>{t("loading")}</p>;
  } else if (profileQuery.isError || !user) {
    content = <p>{t("notFound")}</p>;
  } else if (isEditing && canEditProfile) {
    content = (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            {t("cancel")}
          </Button>
        </div>

        <UserForm
          mode="edit"
          initialValues={user}
          onSubmit={handleSubmit}
          isLoading={isSaving}
          title={t("form.editTitle")}
          description={t("form.manageDescription")}
          submitLabel={t("form.update")}
        />
      </div>
    );
  } else {
    content = (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {isSelf ? t("selfTitle") : t("title")}
            </h1>

            <p className="mt-1 text-muted-foreground">
              {t("description")}
            </p>
          </div>

          {canEditProfile && (
            <Button onClick={() => setIsEditing(true)}>
              {t("edit")}
            </Button>
          )}
        </div>

        <Card className="max-w-3xl p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <ProfileField
              label={t("fields.firstName")}
              value={user.firstName}
            />

            <ProfileField
              label={t("fields.lastName")}
              value={user.lastName}
            />

            <ProfileField
              label={t("fields.email")}
              value={user.email}
            />

            <ProfileField
              label={t("fields.age")}
              value={String(user.age)}
            />

            <ProfileField
              label={t("fields.role")}
              value={roleLabel}
            />

            <ProfileField
              label={t("fields.status")}
              value={statusLabel}
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        {content}
      </div>
    </DashboardLayout>
  );
}

interface ProfileFieldProps {
  label: string;
  value: string;
}

function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="font-medium wrap-break-words">
        {value}
      </p>
    </div>
  );
}
