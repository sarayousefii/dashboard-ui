import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";

import { Toaster } from "@/components/ui/sonner";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { routing } from "@/i18n/routing";
import { Providers } from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const isPersian = locale === "fa";

  const title = isPersian ? "داشبورد" : "Dashboard";

  const description = isPersian
    ? "پنل مدیریت و گزارش‌گیری سیستم"
    : "Modern Admin Dashboard built with Next.js, TypeScript, React Query, Zustand and RBAC.";

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords: [
      "Next.js",
      "React",
      "TypeScript",
      "Dashboard",
      "Admin Panel",
      "React Query",
      "RBAC",
    ],
    authors: [{ name: "Sara Yousefi" }],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const direction = locale === "fa" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <AuthGuard>{children}</AuthGuard>
            <Toaster />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}