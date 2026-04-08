import Navigation from "@/components/ui/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-parchment">
      <Navigation />

      {/* Main content — mobile-first, tight native-app feel */}
      <main className="pb-24 md:pb-0 md:pl-56 safe-top">
        <div className="mx-auto max-w-3xl px-4 pt-3 pb-4 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
