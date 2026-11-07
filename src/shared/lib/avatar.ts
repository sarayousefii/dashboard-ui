
export const MAX_AVATAR_DATA_URL_LENGTH = 80_000;

const AVATAR_DATA_URL_PATTERN =
  /^data:image\/webp;base64,[A-Za-z0-9+/]+={0,2}$/;

export function isValidAvatarValue(
  value: unknown,
): value is string | null {
  if (value === null) {
    return true;
  }

  if (
    typeof value !== 'string' ||
    value.length > MAX_AVATAR_DATA_URL_LENGTH
  ) {
    return false;
  }

  return AVATAR_DATA_URL_PATTERN.test(value);
}
