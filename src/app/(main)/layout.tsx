import Navigation from "@/components/ui/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0d0b08]">
      <Navigation />

      {/* Main content — mobile-first, dark canvas */}
      <main className="pb-28 md:pb-0 md:pl-56 safe-top">
        <div className="mx-auto max-w-3xl px-4 pt-4 pb-4 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
