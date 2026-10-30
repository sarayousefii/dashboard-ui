import { LoginForm } from "@/features/auth/components/login-form";
import { LanguageSwitcher } from "@/shared/components/layout/language-switcher";
import { ThemeToggle } from "@/shared/components/layout/theme-toggle";

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <div className="mb-6 flex justify-end gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <LoginForm />
    </main>
  );
}