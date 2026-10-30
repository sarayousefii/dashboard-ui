import CreateUserForm from "@/features/users/components/create-user-form";

export const metadata = {
  title: "Create User",
};

export default function CreateUserPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <CreateUserForm />
    </div>
  );
}