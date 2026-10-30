interface Props {
  title: string;
  description?: string;
}

export function ErrorState({ title, description }: Props) {
  return (
    <div className="flex min-h-72 items-center justify-center rounded-xl border bg-card text-card-foreground">
      <div className="space-y-2 text-center">
        <p className="font-medium text-destructive">{title}</p>

        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}