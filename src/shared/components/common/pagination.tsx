'use client';

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { PAGE_SIZE_OPTIONS } from '@/shared/constants/pagination';

type PageToken = number | 'start-ellipsis' | 'end-ellipsis';

interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: readonly number[];
}

function getPageTokens(
  currentPage: number,
  totalPages: number,
): PageToken[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'end-ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'start-ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'start-ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'end-ellipsis',
    totalPages,
  ];
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
}: Props) {
  const t = useTranslations('pagination');
  const locale = useLocale();

  const isRtl = locale === 'fa';
  const direction = isRtl ? 'rtl' : 'ltr';

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale).format(value);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const currentPage = Math.min(Math.max(page, 1), totalPages);

  useEffect(() => {
    if (page !== currentPage) {
      onPageChange(currentPage);
    }
  }, [page, currentPage, onPageChange]);

  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  const pageTokens = getPageTokens(currentPage, totalPages);

  const FirstPageIcon = isRtl ? ChevronsRight : ChevronsLeft;
  const PreviousPageIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextPageIcon = isRtl ? ChevronLeft : ChevronRight;
  const LastPageIcon = isRtl ? ChevronsLeft : ChevronsRight;

  return (
    <div
      dir={direction}
      className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between"
    >
      {/* Pagination information and page size */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-muted-foreground">
        <span className="tabular-nums">
          {t('showing', {
            start: formatNumber(start),
            end: formatNumber(end),
            total: formatNumber(total),
          })}
        </span>

        <div className="flex items-center gap-2">
          <span>{t('rowsPerPage')}</span>

          <Select
            dir={direction}
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger
              size="sm"
              aria-label={t('rowsPerPage')}
              className="h-8 w-[76px]"
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent
              align={isRtl ? 'end' : 'start'}
            >
              {pageSizeOptions.map((option) => (
                <SelectItem
                  key={option}
                  value={String(option)}
                >
                  {formatNumber(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Page navigation */}
      <div className="flex flex-wrap items-center gap-1 self-start sm:self-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="hidden size-8 p-0 sm:inline-flex"
          disabled={currentPage === 1}
          aria-label={t('first')}
          onClick={() => onPageChange(1)}
        >
          <FirstPageIcon className="size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2 sm:px-3"
          disabled={currentPage === 1}
          aria-label={t('previous')}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <PreviousPageIcon className="size-4" />

          <span className="hidden sm:inline">
            {t('previous')}
          </span>
        </Button>

        {pageTokens.map((token) => {
          if (typeof token !== 'number') {
            return (
              <span
                key={token}
                aria-hidden="true"
                className="px-1 text-sm text-muted-foreground"
              >
                …
              </span>
            );
          }

          const isCurrentPage = token === currentPage;

          return (
            <Button
              key={token}
              type="button"
              size="sm"
              variant={isCurrentPage ? 'default' : 'outline'}
              className="h-8 min-w-8 px-2"
              aria-label={t('goToPage', {
                page: formatNumber(token),
              })}
              aria-current={isCurrentPage ? 'page' : undefined}
              onClick={() => onPageChange(token)}
            >
              {formatNumber(token)}
            </Button>
          );
        })}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2 sm:px-3"
          disabled={currentPage === totalPages}
          aria-label={t('next')}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className="hidden sm:inline">
            {t('next')}
          </span>

          <NextPageIcon className="size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="hidden size-8 p-0 sm:inline-flex"
          disabled={currentPage === totalPages}
          aria-label={t('last')}
          onClick={() => onPageChange(totalPages)}
        >
          <LastPageIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}