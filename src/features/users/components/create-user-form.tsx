"use client";
import { UserForm } from "./user-form";
import { useCreateUser } from "../hooks/use-users-mutations";
import { useRouter } from "next/navigation";
import { appToast } from "@/shared/lib/toast";

export default function CreateUserForm() {
  const createUser = useCreateUser();
  const router = useRouter();
  
  return (
    <UserForm
          mode="create"
          onSubmit={(values) =>
            createUser.mutate(values, {
              onSuccess: () => {
                appToast.success(
                  "User created successfully"
                );
    
                router.push("/users");
              }
            })
          }
          isLoading={createUser.isPending}
        />
  );
}