'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

type Props = {
  page: number;
  setPage: (value: number) => void;
};

export function UsersPagination({ page, setPage }: Props) {
  const t = useTranslations('users.pagination');

  return (
    <div className="flex items-center justify-between gap-3 px-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        <ChevronLeft className="size-3.5" />
        {t('previous')}
      </Button>

      <span className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium tabular-nums text-muted-foreground">
        {t('page', { page })}
      </span>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setPage(page + 1)}
      >
        {t('next')}
        <ChevronRight className="size-3.5" />
      </Button>
    </div>
  );
}
