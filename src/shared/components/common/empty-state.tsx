interface Props {
  title: string;
}

export function EmptyState({
  title,
}: Props) {
  return (
    <div
      className="
        flex
        `min-h-75`
        items-center
        justify-center
        rounded-xl
        border
        bg-white
      "
    >
      <p className="text-gray-500">
        {title}
      </p>
    </div>
  );
}