"use client";

import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  setPage: (value: number) => void;
};

export function ProductsPagination({
  page,
  setPage,
}: Props) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        disabled={page === 1}
        onClick={() =>
          setPage(page - 1)
        }
      >
        Previous
      </Button>

      <span>Page {page}</span>

      <Button
        variant="outline"
        onClick={() =>
          setPage(page + 1)
        }
      >
        Next
      </Button>
    </div>
  );
}