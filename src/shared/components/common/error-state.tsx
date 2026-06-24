interface Props {
  title: string;
  description?: string;
}

export function ErrorState({ title, description }: Props) {
  return (
    <div
      className="
        flex
        min-h-72
        items-center
        justify-center
        rounded-xl
        border
        bg-white
      "
    >
      <div className="text-center space-y-2">
        <p className="text-red-500 font-medium">
          {title}
        </p>

        {description && (
          <p className="text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}