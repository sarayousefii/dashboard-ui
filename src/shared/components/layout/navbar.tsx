
'use client';

import Image from 'next/image';

import { ChevronDown, LogOut, Menu, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useLogout } from '@/features/auth/hooks/use-logout';

import { useUIStore } from '@/store/ui-store';

import { Link } from '@/i18n/navigation';

import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  const { data, isLoading } = useCurrentUser();
  const { mutate: logout } = useLogout();

  const t = useTranslations('navbar');

  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const toggleMobileSidebar = useUIStore(
    (state) => state.toggleMobileSidebar,
  );

  const handleSidebarToggle = () => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      toggleMobileSidebar();
    } else {
      toggleSidebar();
    }
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-3 sm:px-5 lg:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSidebarToggle}
            aria-label={t('toggleSidebar')}
            title={t('toggleSidebar')}
            className="size-8 shrink-0"
          >
            <Menu className="size-4" />
          </Button>

          <div className="space-y-1.5">
            <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <span className="sr-only">{t('loading')}</span>

        <div className="flex shrink-0 items-center gap-2">
          <div className="size-8 animate-pulse rounded-md bg-muted" />
          <div className="size-8 animate-pulse rounded-md bg-muted" />
        </div>
      </header>
    );
  }

  const user = data?.user;

  const avatarInitial =
    user?.name?.trim()?.slice(0, 1).toLocaleUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/80 bg-card px-3 sm:px-5 lg:px-7">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleSidebarToggle}
          aria-label={t('toggleSidebar')}
          title={t('toggleSidebar')}
          className="size-8 shrink-0 rounded-md border-border bg-background p-0 text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
        >
          <Menu className="size-4" />
        </Button>

        <div className="min-w-0">
          <p className="truncate text-[11px] leading-4 text-muted-foreground">
            {t('welcomeBack')}
          </p>

          <h1 className="truncate text-[13px] font-semibold leading-5 tracking-tight text-foreground">
            {t('hello', { name: user?.name ?? '' })}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {user?.role && (
          <div className="hidden items-center rounded-md border border-border bg-muted/60 px-2 py-1 sm:flex">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {user.role}
            </span>
          </div>
        )}

        <div className="flex items-center gap-0.5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={user?.name ?? 'User menu'}
              className="group flex items-center gap-1 rounded-md p-0.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name ?? 'Profile'}
                    width={32}
                    height={32}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  avatarInitial
                )}
              </span>

              <ChevronDown className="hidden size-3 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 sm:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="w-60 rounded-lg border-border p-1 shadow-lg"
          >
            <div className="px-2.5 py-2">
              <p className="truncate text-[13px] font-semibold text-foreground">
                {user?.name}
              </p>

              {user?.email && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              )}

              {user?.role && (
                <span className="mt-2 inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                  {user.role}
                </span>
              )}
            </div>

            {user?.id && (
              <>
                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem asChild>
                  <Link
                    href={`/users/${user.id}`}
                    className="flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 text-[13px]"
                  >
                    <UserRound className="size-3.5 text-muted-foreground" />
                    <span>{t('profile')}</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={() => logout()}
              className="min-h-8 cursor-pointer gap-2 rounded-md px-2 text-[13px] text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="size-3.5" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
