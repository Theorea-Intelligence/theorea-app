import Navigation from "@/components/ui/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f3]">
      <Navigation />
      {/*
       * The dashboard page uses position:fixed and is completely independent
       * of this container — it covers the full viewport regardless.
       * All other pages get proper padding and max-width from the inner div.
       */}
      <main className="pb-[88px] md:pb-0 md:pl-56 safe-top">
        <div className="mx-auto max-w-2xl px-5 pt-5 pb-8 md:px-10 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
