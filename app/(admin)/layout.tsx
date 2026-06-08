"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/avatar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Admin section is dark mode by default based on the silk dark design
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  const adminNavItems = [
    { label: "Dashboard", href: "/admin", icon: "ti-dashboard" },
    { label: "Members", href: "/admin/members", icon: "ti-users" },
    { label: "Reports", href: "/admin/reports", icon: "ti-report" },
    { label: "Word Packs", href: "/admin/word-packs", icon: "ti-package" },
  ];

  return (
    <div className="min-h-screen bg-background text-on-background font-sans flex transition-colors duration-300">
      {/* Sidebar Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant flex flex-col py-8 hidden md:flex z-50 select-none">
        <div className="px-6 mb-8">
          <h1 className="text-lg font-bold text-primary tracking-tight">Lexara Admin</h1>
          <p className="text-[10px] text-on-surface-variant font-medium">Batch Management</p>
        </div>

        <nav className="flex-1 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 py-2.5 px-4 rounded-lg mx-2 transition-transform active:translate-x-0.5",
                  isActive
                    ? "bg-primary-container text-on-primary-container font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                )}
              >
                <i className={cn("ti text-base", item.icon)} />
                <span className="text-xs font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-2 mt-auto">
          <button className="w-full py-2.5 mb-6 bg-primary text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/10 hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none">
            Create New Pack
          </button>
          <div className="border-t border-outline-variant pt-4 space-y-1">
            <Link
              href="#"
              className="flex items-center gap-3 py-2 px-4 text-on-surface-variant hover:bg-surface-container-high rounded-lg text-xs font-semibold"
            >
              <i className="ti ti-help" />
              <span>Help Center</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 py-2 px-4 text-on-surface-variant hover:bg-surface-container-high rounded-lg text-xs font-semibold"
            >
              <i className="ti ti-logout" />
              <span>Exit Admin</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen relative">
        {/* Top AppBar */}
        <header className="w-full top-0 sticky z-40 bg-background/80 backdrop-blur-md flex justify-between items-center px-6 h-16 max-w-7xl mx-auto border-b border-outline-variant/10 md:border-none">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-primary hover:bg-surface-container-high p-1.5 rounded-lg border-none bg-transparent cursor-pointer"
            >
              <i className="ti ti-menu text-lg" />
            </button>
            <h2 className="text-sm font-bold text-on-surface tracking-tight uppercase">Overview</h2>
          </div>

          <div className="flex items-center gap-4 select-none">
            {/* Search Input */}
            <div className="hidden sm:flex items-center bg-surface-container px-3.5 py-1.5 rounded-lg border border-outline-variant">
              <i className="ti ti-search text-on-surface-variant text-sm mr-2" />
              <input
                type="text"
                placeholder="Search data..."
                className="bg-transparent border-none focus:outline-none text-xs text-on-surface placeholder:text-outline w-40"
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-container text-on-surface-variant border-none bg-transparent cursor-pointer">
                <i className="ti ti-bell text-base" />
              </button>
              <button className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-container text-tertiary border-none bg-transparent cursor-pointer">
                <i className="ti ti-flame text-base" />
              </button>
              <Avatar name="Lexara Admin" size="sm" className="ml-2 border-outline-variant" />
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs select-none">
            <div className="w-64 bg-surface-container-low h-full p-6 flex flex-col animate-in slide-in-from-left duration-250">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-base font-bold text-primary">Lexara Admin</h1>
                  <p className="text-[9px] text-on-surface-variant font-medium">Batch Management</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-on-surface-variant hover:bg-surface-container-high p-1 rounded-lg border-none bg-transparent cursor-pointer"
                >
                  <i className="ti ti-x text-sm" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {adminNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 py-2.5 px-4 rounded-lg transition-transform active:translate-x-0.5",
                        isActive
                          ? "bg-primary-container text-on-primary-container font-semibold"
                          : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                      )}
                    >
                      <i className={cn("ti text-base", item.icon)} />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto border-t border-outline-variant pt-4 space-y-3">
                <button className="w-full py-2.5 bg-primary text-white rounded-lg text-xs font-bold border-none cursor-pointer">
                  Create New Pack
                </button>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg text-xs font-semibold"
                >
                  <i className="ti ti-logout" />
                  <span>Exit Admin</span>
                </Link>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Content Children */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-surface shadow-[0_-4px_24px_rgba(0,0,0,0.4)] md:hidden rounded-t-xl border-t border-outline-variant/20">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-200 cursor-pointer",
                isActive ? "bg-primary text-white scale-105" : "text-on-surface-variant"
              )}
            >
              <i className={cn("ti text-lg", item.icon)} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
