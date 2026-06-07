import { requireAuth } from "@/lib/auth";
import { BottomNav, SidebarNav } from "@/components/bottom-nav";

export default async function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce authentication for all sub-routes under (learner)
  await requireAuth();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row text-zinc-900 dark:text-zinc-50 antialiased font-sans">
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
