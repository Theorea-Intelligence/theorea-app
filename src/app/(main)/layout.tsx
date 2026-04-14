import Navigation from "@/components/ui/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f3]">
      <Navigation />
      <main className="pb-[88px] md:pb-0 md:pl-56 safe-top">
        {children}
      </main>
    </div>
  );
}
