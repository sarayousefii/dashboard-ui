import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlState() {
  const searchParams =
    useSearchParams();

  const router =
    useRouter();

  const pathname =
    usePathname();

  const get = (
    key: string,
    fallback = ""
  ) =>
    searchParams.get(key) ??
    fallback;

  const set = (
    key: string,
    value: string
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.replace(
      `${pathname}?${params.toString()}`,
      { scroll: false }
    );
  };

  return {
    get,
    set,
  };
}