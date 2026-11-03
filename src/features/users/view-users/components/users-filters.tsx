'use client';

import { useTranslations } from 'next-intl';
import { ArrowUpDown, Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  search: string;
  sortBy?: string;
  order?: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onOrderChange: (value: string) => void;
};

export function UsersFilters({
  search,
  sortBy,
  order,
  onSearchChange,
  onSortChange,
  onOrderChange,
}: Props) {
  const t = useTranslations('users.filters');

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
      <div className="relative w-full sm:max-w-sm sm:flex-1">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search ?? ''}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t('search')}
          className="ps-9"
        />
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="h-9 w-full text-xs sm:w-40">
            <div className="flex min-w-0 items-center gap-2">
              <ArrowUpDown className="size-3.5 shrink-0 text-muted-foreground" />
              <SelectValue placeholder={t('sortBy')} />
            </div>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="firstName">{t('firstName')}</SelectItem>
            <SelectItem value="lastName">{t('lastName')}</SelectItem>
            <SelectItem value="age">{t('age')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={order || 'asc'} onValueChange={onOrderChange}>
          <SelectTrigger className="h-9 w-full text-xs sm:w-40">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="asc">{t('ascending')}</SelectItem>
            <SelectItem value="desc">{t('descending')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
