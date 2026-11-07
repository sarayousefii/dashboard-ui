interface ProfileMessageProps {
  message: string;
}

export function ProfileMessage({ message }: ProfileMessageProps) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed bg-card p-6 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}