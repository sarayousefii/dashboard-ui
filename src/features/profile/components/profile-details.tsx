
import type { LucideIcon } from 'lucide-react';

interface ProfileDetailItem {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
}

interface ProfileDetailsProps {
  title: string;
  fields: ProfileDetailItem[];
}

type ProfileFieldProps = Omit<ProfileDetailItem, 'id'>;

export function ProfileDetails({
  title,
  fields,
}: ProfileDetailsProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span className="size-1.5 rounded-full bg-primary" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>

      <div className="grid w-full min-w-0 grid-cols-2 gap-2.5 sm:gap-3">
        {fields.map((field) => (
          <ProfileField
            key={field.id}
            icon={field.icon}
            label={field.label}
            value={field.value}
          />
        ))}
      </div>
    </section>
  );
}

function ProfileField({
  icon: Icon,
  label,
  value,
}: ProfileFieldProps) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-xl border border-border/70 bg-muted/20 p-3 transition-colors hover:border-primary/30 hover:bg-primary/[0.03] sm:gap-3 sm:p-3.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:size-9">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[11px] leading-5 text-muted-foreground sm:text-xs">
          {label}
        </p>

        <p className="mt-0.5 break-all text-xs font-semibold leading-5 text-foreground sm:text-sm">
          {value || '—'}
        </p>
      </div>
    </div>
  );
}
