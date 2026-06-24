import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { UserStatus } from "../types/user.types";
import { usersKeys } from "../api/users.query-keys";

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: UserStatus;
    }) => {
      return {
        id,
        status,
      };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
    },
  });
}