"use client";

import { useUserQuery } from "../hooks/use-user-query";
import { useUpdateUser } from "../hooks/use-users-mutations";
import { UserForm } from "./user-form";
import { useParams } from "next/navigation";

export default function EditUserForm() {
  const { id } = useParams();
  const { data } = useUserQuery(Number(id));
  const updateUser = useUpdateUser();

  const user = data?.data;

  if (!user) return <div>Loading...</div>;

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