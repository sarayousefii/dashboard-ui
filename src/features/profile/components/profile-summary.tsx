
import Image from 'next/image';

import {
  Activity,
  CheckCircle2,
  CircleDashed,
  Mail,
  UserRound,
} from 'lucide-react';

import type { User } from '@/features/users/shared/types/user.types';

interface ProfileSummaryProps {
  user: User;
  statusTitle: string;
  statusLabel: string;
  statusStyles: string;
  status: string;
}

export function ProfileSummary({
  user,
  statusTitle,
  statusLabel,
  statusStyles,
  status,
}: ProfileSummaryProps) {
  const initials =
    `${user.firstName?.trim().charAt(0) ?? ''}${user.lastName?.trim().charAt(0) ?? ''}`.toUpperCase();

  return (
    <section className="relative isolate overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 sm:p-5 lg:p-6">
      <div className="pointer-events-none absolute -start-10 -top-12 size-40 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -end-10 -bottom-16 size-36 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative grid min-w-0 grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(13rem,0.72fr)] md:items-center md:gap-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-background text-xl font-bold text-primary shadow-sm ring-4 ring-primary/5 sm:size-20 sm:text-2xl">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={`${user.firstName} ${user.lastName}`}
                width={80}
                height={80}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              initials || <UserRound className="size-8" />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <h2 className="break-words text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {user.firstName} {user.lastName}
            </h2>

            <div className="flex min-w-0 items-start gap-2 text-muted-foreground">
              <Mail className="mt-0.5 size-4 shrink-0" />

              <span className="min-w-0 break-all text-xs leading-5 sm:text-sm">
                {user.email}
              </span>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-1">
          <div className="min-w-0 rounded-xl border border-border/70 bg-background/70 p-3 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Activity className="size-4 shrink-0 text-primary" />
              <span>{statusTitle}</span>
            </div>

            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${statusStyles}`}
              >
                {status === 'active' ? (
                  <CheckCircle2 className="size-3.5" />
                ) : (
                  <CircleDashed className="size-3.5" />
                )}

                {statusLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
