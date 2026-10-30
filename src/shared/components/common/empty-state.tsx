interface Props {
  title: string;
}

export function EmptyState({ title }: Props) {
  return (
    <div className="flex min-h-72 items-center justify-center rounded-xl border bg-card text-card-foreground">
      <p className="text-muted-foreground">{title}</p>
    </div>
  );
}