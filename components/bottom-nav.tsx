"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: "ti-home" },
  { label: "Streak", href: "/streak", icon: "ti-flame" },
  { label: "Learn", href: "/learn", icon: "ti-book-2" },
  { label: "Leaderboard", href: "/leaderboard", icon: "ti-trophy" },
  { label: "Profile", href: "/profile", icon: "ti-user" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 md:hidden flex items-center justify-around px-4 pb-safe">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center w-12 h-full relative group transition-colors"
          >
            <i
              className={cn(
                "ti text-xl transition-all duration-200",
                item.icon,
                isActive
                  ? "text-primary scale-110"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400"
              )}
            />
            {isActive && (
              <span className="absolute bottom-1.5 w-1 h-1 bg-primary rounded-full" />
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
    <aside className="hidden md:flex flex-col w-64 fixed top-0 bottom-0 left-0 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 p-6 z-40 select-none">
      {/* Brand Logo */}
      <div className="mb-10 px-2">
        <Link href="/dashboard" className="text-2xl font-black text-primary hover:opacity-95 transition-opacity">
          Lexara
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200",
                isActive
                  ? "bg-primary-light text-primary border-l-4 border-primary pl-3"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <i className={cn("ti text-lg", item.icon)} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info / Decorative */}
      <div className="text-[10px] text-zinc-400 dark:text-zinc-600 font-semibold uppercase tracking-wider px-4">
        © 2026 Lexara app
      </div>
    </aside>
  );
}
