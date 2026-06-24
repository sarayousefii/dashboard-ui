"use client";

import { useParams } from "next/navigation";

import { Card } from "@/components/ui/card";

import { DashboardLayout } from "@/shared/components/layout/dashboard-layout";

import { useUserQuery } from "../hooks/use-user-query";

export default function UserDetails() {
  const { id } = useParams();

  const { data } =
    useUserQuery(Number(id));

  const user = data?.data;

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {user.firstName}{" "}
            {user.lastName}
          </h1>

          <p className="text-muted-foreground">
            User Details
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm">
                Email
              </p>

              <p>{user.email}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm">
                Age
              </p>

              <p>{user.age}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm">
                Role
              </p>

              <p>{user.role}</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}