"use client";

type Props = {
  error: Error;

  reset: () => void;
};

export default function Error({
  error,
  reset,
}: Props) {

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        Something went wrong
      </h2>

      <p className="text-muted-foreground">
        {error.message}
      </p>

      <button
        onClick={reset}
        className="rounded-lg border px-4 py-2"
      >
        Try again
      </button>
    </div>
  );
}