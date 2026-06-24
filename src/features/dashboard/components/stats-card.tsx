import { Card } from "@/components/ui/card";

import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
}: Props) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <div className="rounded-lg border p-3">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}