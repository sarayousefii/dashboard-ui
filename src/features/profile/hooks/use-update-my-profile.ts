
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMyProfile } from "../api/profile.api";
import { profileKeys } from "../api/profile.query-keys";

import { usersKeys } from "@/features/users/api/users.query-keys";

import type { User } from "@/features/users/types/user.types";

interface CurrentUserResponse {
  user: (User & { name?: string }) | null;
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,

    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(
        ["me"],
        (current: CurrentUserResponse | undefined) => {
          if (!current) return current;

          return {
            ...current,
            user: {
              ...updatedUser,
              name: `${updatedUser.firstName} ${updatedUser.lastName}`,
            },
          };
        },
      );

      queryClient.setQueryData(
        profileKeys.detail(updatedUser.id),
        updatedUser,
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["me"],
        }),
        queryClient.invalidateQueries({
          queryKey: usersKeys.all,
        }),
      ]);
    },
  });
}
