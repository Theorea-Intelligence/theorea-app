import Navigation from "@/components/ui/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #EDE6DC 0%, #F5F0EA 30%, #FAF8F5 60%, #F5F0EA 100%)",
      }}
    >
      <div className="screen-ambient" aria-hidden />
      <div className="screen-vignette" aria-hidden />
      <Navigation />
      <main className="pb-[88px] md:pb-0 md:pl-56 safe-top" style={{ position: "relative", zIndex: 2 }}>
        <div className="mx-auto max-w-2xl px-5 pt-5 pb-8 md:px-10 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
