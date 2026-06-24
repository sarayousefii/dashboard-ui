"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { updateUser } from "../api/users.mutations";
import { User } from "../types/user.types";

export function useUpdateUser(
  id: number
) {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: Partial<User>) =>
      updateUser(id, data),

    onSuccess: () => {
      router.push("/users");
    },
  });
}