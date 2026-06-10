import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "No Connection — Théorea",
  description: "You appear to be offline.",
};

export default function OfflinePage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{
        background: "linear-gradient(180deg, #EDE6DC 0%, #F5F0EA 40%, #FAF8F5 100%)",
      }}
    >
      {/* Tea leaf icon */}
      <div
        className="mb-8 flex h-20 w-20 items-center justify-center rounded-full"
        style={{ background: "rgba(184,149,106,0.12)" }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#B8956A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Teapot */}
          <path d="M6 14c0 3.3 2.7 6 6 6s6-2.7 6-6V10H6v4z" />
          <path d="M18 11c2 0 3 1 3 2.5S20 16 18 16" />
          <path d="M6 10s-1-4 6-4 6 4 6 4" />
          <path d="M10 4c0-1 .5-2 2-2s2 1 2 2" />
        </svg>
      </div>

      <h1
        className="font-serif text-[28px] text-ink mb-3"
        style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.02em" }}
      >
        A moment of stillness
      </h1>

      <p
        className="text-[15px] leading-relaxed mb-10 max-w-[280px]"
        style={{ color: "rgba(58,48,40,0.60)" }}
      >
        It seems you are offline. Your ritual history and previously visited teas
        are still available below.
      </p>

      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-[14px] font-medium"
        style={{
          background: "#3A3028",
          color: "#FAF8F5",
          letterSpacing: "0.02em",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(58,48,40,0.20)",
        }}
      >
        Return to the app
      </Link>
    </main>
  );
}
