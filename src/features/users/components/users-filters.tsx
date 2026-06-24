"use client";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  search: string;

  sortBy?: string;

  order?: string;

  onSearchChange: (
    value: string
  ) => void;

  onSortChange: (
    value: string
  ) => void;

  onOrderChange: (
    value: string
  ) => void;
};

export function UsersFilters({
  search,
  sortBy,
  order,
  onSearchChange,
  onSortChange,
  onOrderChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4">
      <Input
        value={search ?? ""}
        onChange={(e) =>
          onSearchChange(e.target.value)
        }
        placeholder="Search users..."
      />

      <Select
        value={sortBy}
        onValueChange={
          onSortChange
        }
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="firstName">
            First Name
          </SelectItem>

          <SelectItem value="lastName">
            Last Name
          </SelectItem>

          <SelectItem value="age">
            Age
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={order || "asc"}
        onValueChange={
          onOrderChange
        }
      >
        <SelectTrigger className="w-45">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="asc">
            Asc
          </SelectItem>

          <SelectItem value="desc">
            Desc
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}