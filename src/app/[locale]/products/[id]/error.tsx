"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type Props = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  const t = useTranslations("products.states");

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        {t("errorTitle")}
      </h2>

      <p className="text-muted-foreground">
        {error.message}
      </p>

      <Button onClick={reset}>
        {t("retry")}
      </Button>
    </div>
  );
}