
export const profileKeys = {
  all: ["profile"] as const,

  detail: (userId: number) =>
    ["profile", userId] as const,
};
