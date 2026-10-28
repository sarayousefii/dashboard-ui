import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const get = (key: string, fallback = "") =>
    searchParams.get(key) ?? fallback;

  const setMany = (values: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(values)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const set = (key: string, value: string) => {
    setMany({ [key]: value });
  };

  return { get, set, setMany };
}
