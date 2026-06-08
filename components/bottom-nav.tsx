"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: "ti-home" },
  { label: "Streak", href: "/streak", icon: "ti-flame" },
  { label: "Learn", href: "/learn", icon: "ti-book-2" },
  { label: "Battle", href: "/battle", icon: "ti-swords" },
  { label: "Leaderboard", href: "/leaderboard", icon: "ti-trophy" },
  { label: "Profile", href: "/profile", icon: "ti-user" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 h-16 md:hidden flex items-center justify-around px-2 pb-safe bg-background border-t border-border select-none"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center w-10 h-full relative group transition-colors cursor-pointer"
          >
            <i
              className={cn(
                "ti text-lg transition-all duration-200",
                item.icon,
                isActive ? "text-primary scale-110" : "text-on-surface-variant/70"
              )}
            />
            {isActive && (
              <span className="absolute bottom-1.5 w-1 h-1 bg-primary rounded-[2px]" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col w-64 fixed top-0 bottom-0 left-0 p-6 z-40 select-none border-r border-border bg-surface"
    >
      {/* Brand Logo */}
      <div className="flex items-center justify-between mb-10 px-2">
        <Link
          href="/dashboard"
          className="text-2xl font-black transition-colors leading-none tracking-tight text-primary"
        >
          Lexara
        </Link>
        <ThemeToggle />
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer border-none",
                isActive
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
              )}
            >
              <i className={cn("ti text-base", item.icon)} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="text-[9px] font-semibold uppercase tracking-wider px-4 text-on-surface-variant/50">
        © 2026 Lexara
      </div>
    </aside>
  );
}
