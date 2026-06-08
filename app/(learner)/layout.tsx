"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { BottomNav, SidebarNav } from "@/components/bottom-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar } from "@/components/avatar";
import { cn } from "@/lib/utils";

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isForcedDark = pathname.startsWith("/learn") || pathname.startsWith("/battle");

  useEffect(() => {
    if (isForcedDark) {
      document.documentElement.classList.add("dark");
    } else {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else if (savedTheme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", prefersDark);
      }
    }
  }, [pathname, isForcedDark]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row antialiased font-sans bg-background text-foreground transition-colors duration-300">
      {/* Desktop Sidebar navigation */}
      <SidebarNav />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen relative">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between h-16 px-6 bg-surface border-b border-border sticky top-0 z-40 select-none">
          <span className="text-xl font-black text-primary leading-none tracking-tight">Lexara</span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Avatar name="Learner" size="sm" />
          </div>
        </header>

        <main className={cn(
          "flex-1 w-full mx-auto px-4 py-8 pb-24 md:pb-12",
          pathname === "/dashboard"
            ? "max-w-[1280px]"
            : "max-w-md md:max-w-2xl lg:max-w-3xl"
        )}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom navigation */}
      <BottomNav />
    </div>
  );
}
