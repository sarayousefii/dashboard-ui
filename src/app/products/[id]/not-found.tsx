import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">
        Product Not Found
      </h1>

      <p className="text-muted-foreground">
        The product you are looking for
        does not exist.
      </p>

      <Link
        href="/"
        className="rounded-lg border px-4 py-2 inline-block"
      >
        Back to Products
      </Link>
    </div>
  );
}