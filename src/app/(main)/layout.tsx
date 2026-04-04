import Navigation from "@/components/ui/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-parchment">
      <Navigation />

      {/* Main content — mobile-first padding, shifts right on desktop for sidebar */}
      <main className="pb-20 md:pb-0 md:pl-56">
        <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
