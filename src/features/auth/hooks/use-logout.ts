"use client";

import { useRouter } from "next/navigation";

import {
  useMutation
} from "@tanstack/react-query";

import { logout } from "../api/auth.api";
import { getQueryClient } from "@/shared/lib/react-query"; 
import { appToast } from "@/shared/lib/toast";
import { handleMutationError } from "@/shared/lib/mutation-handlers";

export function useLogout() {
  const router = useRouter();

  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: async () => {

      appToast.success(
        "Logout in successfully"
      );
      // clear auth cache
      await queryClient.removeQueries({
        queryKey: ["me"],
      });

      router.push("/login");
    },

    onError: handleMutationError
  });
}