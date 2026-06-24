import { ReactNode } from "react";

import { Label } from "@/components/ui/label";

import { FormError } from "./form-error";

interface Props {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
}

export function FormField({
  label,
  error,
  children,htmlFor
}: Props) {
  return (
    <div className="space-y-2">
        <Label htmlFor={htmlFor}>
            {label}
        </Label>

      {children}

      <FormError message={error} />
    </div>
  );
}