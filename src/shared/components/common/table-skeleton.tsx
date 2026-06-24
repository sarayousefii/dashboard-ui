export function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="animate-pulse">
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                gap-4
                border-b
                p-4
              "
            >
              <div className="h-4 w-40 rounded bg-gray-200" />

              <div className="h-4 w-24 rounded bg-gray-200" />

              <div className="h-4 w-16 rounded bg-gray-200" />
            </div>
          )
        )}
      </div>
    </div>
  );
}