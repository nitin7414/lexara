import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { cn } from "@/lib/utils";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lexara - Vocabulary Streak Learning",
  description: "Dynamic vocabulary learning and streak retention platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "var(--primary)",
          colorBackground: "var(--surface-container-lowest)",
          colorText: "var(--foreground)",
          colorTextSecondary: "var(--on-surface-variant)",
          colorInputBackground: "var(--surface-container-low)",
          colorInputText: "var(--foreground)",
          colorBorder: "var(--border)",
          borderRadius: "var(--radius)",
        },
      }}
    >
      <html
        lang="en"
        className={cn("h-full", "antialiased", plusJakartaSans.variable, geistMono.variable, "font-sans")}
      >
        <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        </head>
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
