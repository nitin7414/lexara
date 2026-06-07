"use client";

import { usePathname } from "next/navigation";
import { BottomNav, SidebarNav } from "@/components/bottom-nav";
import { cn } from "@/lib/utils";

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDarkTheme = pathname.startsWith("/learn");

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col md:flex-row antialiased font-sans transition-colors duration-300",
        isDarkTheme
          ? "bg-[#1A1730] text-[#CECBF6]"
          : "bg-[#F4F3FF] text-lexara-900"
      )}
    >
      {/* Desktop Sidebar navigation */}
      <SidebarNav />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen relative">
        <main className="flex-1 w-full max-w-md mx-auto md:max-w-2xl lg:max-w-3xl px-4 py-8 pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Bottom navigation */}
      <BottomNav />
    </div>
  );
}
