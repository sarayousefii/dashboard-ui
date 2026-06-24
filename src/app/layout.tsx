import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import { AuthGuard } from "@/features/auth/components/auth-guard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard",
  },

  description:
    "Modern Admin Dashboard built with Next.js, TypeScript, React Query, Zustand and RBAC.",

  keywords: [
    "Next.js",
    "React",
    "TypeScript",
    "Dashboard",
    "Admin Panel",
    "React Query",
    "RBAC",
  ],

  authors: [
    {
      name: "Sara Yousefi",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>

          <AuthGuard>
            {children}
          </AuthGuard>

          <Toaster />
          
        </Providers>
      </body>
    </html>
  );
}
