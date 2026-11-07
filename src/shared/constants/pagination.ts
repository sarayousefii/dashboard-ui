export const DEFAULT_PAGE_SIZE = 10;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export function normalizePageSize(
  value: string | number | null | undefined,
): PageSize {
  const parsedValue = Number(value);

  return (
    PAGE_SIZE_OPTIONS.find((option) => option === parsedValue) ??
    DEFAULT_PAGE_SIZE
  );
}