
import { useQuery } from "@tanstack/react-query";

import { getProfile } from "../api/profile.api";
import { profileKeys } from "../api/profile.query-keys";

interface Props {
  userId: number;
  isSelf: boolean;
  enabled: boolean;
}

export function useProfileQuery({
  userId,
  isSelf,
  enabled,
}: Props) {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => getProfile(userId, isSelf),
    enabled,
  });
}
