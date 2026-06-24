"use client";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { login } from "../api/auth.api";
import { appToast } from "@/shared/lib/toast";
import { handleMutationError } from "@/shared/lib/mutation-handlers";
import { useQueryClient } from "@tanstack/react-query";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: login,

    onSuccess: () => {

      appToast.success(
        "Logged in successfully"
      );

      queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      router.push("/products");
    },
    
    onError: handleMutationError
  });
}