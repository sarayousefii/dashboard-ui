import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { UserRole } from "../types/user.types";
import { usersKeys } from "../api/users.query-keys";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role}: {
      id: number;

      role: UserRole;
    }) => {
      return {
        id,
        role,
      };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
    },
  });
}