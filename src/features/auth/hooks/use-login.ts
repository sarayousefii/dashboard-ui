"use client";

import { useRouter } from "@/i18n/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { handleMutationError } from "@/shared/lib/mutation-handlers";
import { appToast } from "@/shared/lib/toast";
import { useQueryClient } from "@tanstack/react-query";
import { login } from "../api/auth.api";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("notifications");

  return useMutation({
    mutationFn: login,

    onSuccess: () => {

      appToast.success(t("loginSuccess"));

      queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      router.push("/products");
    },
    
    onError: handleMutationError
  });
}