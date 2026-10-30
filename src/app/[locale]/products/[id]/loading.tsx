export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 rounded bg-muted" />

      <div className="h-80 w-80 rounded-xl bg-muted" />

      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-muted" />

        <div className="h-4 w-3/4 rounded bg-muted" />
      </div>

      <div className="h-8 w-32 rounded bg-muted" />
    </div>
  );
}