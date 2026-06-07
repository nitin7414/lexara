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
  const isDarkTheme = pathname.startsWith("/learn");

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 h-16 md:hidden flex items-center justify-around px-4 pb-safe transition-colors duration-300 select-none",
        isDarkTheme
          ? "bg-[#1A1730] border-t border-[#3C3489]"
          : "bg-white border-t border-[#E8E6FF]"
      )}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center w-12 h-full relative group transition-colors cursor-pointer"
          >
            <i
              className={cn(
                "ti text-lg transition-all duration-250",
                item.icon,
                isActive ? "text-[#7F77DD] scale-110" : "text-[#AFA9EC]"
              )}
            />
            {isActive && (
              <span className="absolute bottom-1.5 w-1 h-1 bg-[#7F77DD] rounded-[2px]" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function SidebarNav() {
  const pathname = usePathname();
  const isDarkTheme = pathname.startsWith("/learn");

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 fixed top-0 bottom-0 left-0 p-6 z-40 select-none border-r transition-colors duration-300",
        isDarkTheme
          ? "bg-[#1A1730] border-[#3C3489]"
          : "bg-white border-[#E8E6FF]"
      )}
    >
      {/* Brand Logo */}
      <div className="mb-10 px-2">
        <Link
          href="/dashboard"
          className={cn(
            "text-2xl font-black transition-colors leading-none tracking-tight",
            isDarkTheme ? "text-[#CECBF6]" : "text-[#7F77DD]"
          )}
        >
          Lexara
        </Link>
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
                "flex items-center gap-4 px-4 py-3 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer border-none",
                isActive
                  ? isDarkTheme
                    ? "bg-[#2D2550] text-[#CECBF6]"
                    : "bg-[#EEEDFE] text-[#7F77DD] border-l-4 border-[#7F77DD] pl-3"
                  : isDarkTheme
                  ? "text-[#AFA9EC] hover:bg-[#241E40] hover:text-white"
                  : "text-lexara-800 hover:bg-[#F4F3FF] hover:text-[#7F77DD]"
              )}
            >
              <i className={cn("ti text-base", item.icon)} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div
        className={cn(
          "text-[9px] font-semibold uppercase tracking-wider px-4",
          isDarkTheme ? "text-zinc-600" : "text-zinc-400"
        )}
      >
        © 2026 Lexara
      </div>
    </aside>
  );
}
