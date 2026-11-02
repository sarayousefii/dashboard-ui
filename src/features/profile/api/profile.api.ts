
import { getMe } from "@/features/auth/api/auth.api";
import { getUserById } from "@/features/users/api/users.api";
import type { UserFormValues } from "@/features/users/schemas/user-form.schema";
import type { User } from "@/features/users/types/user.types";
import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api-response";

export async function getProfile(
  userId: number,
  isSelf: boolean,
): Promise<User> {
  if (isSelf) {
    const response = (await getMe()) as {
      user: User | null;
    };

    if (!response.user) {
      throw new Error("Current user not found");
    }

    return response.user;
  }

  const response = await getUserById(userId);

  return response.data;
}

export async function updateMyProfile(
  data: UserFormValues,
): Promise<User> {
  const response = await api.patch<ApiResponse<User>>(
    "/profile/me",
    data,
  );

  return response.data.data;
}
