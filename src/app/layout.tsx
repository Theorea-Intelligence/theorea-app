import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import GoogleAnalytics from "@/components/ui/GoogleAnalytics";
import PWARegister from "@/components/PWARegister";
import { LocaleProvider } from "@/i18n/LocaleContext";
import "@/styles/globals.css";

/*
 * Plus Jakarta Sans — refined geometric humanist sans-serif.
 * Uses --nf-sans so it doesn't clash with Tailwind's @theme --font-sans.
 * Tailwind's @theme then sets --font-sans: var(--nf-sans) to bridge them.
 */
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal"],
  variable: "--nf-sans",   // ← unique name, no @theme clash
  display: "swap",
});

/*
 * Playfair Display — high-contrast transitional serif, Baskerville lineage.
 * Uses --nf-serif so it doesn't clash with Tailwind's @theme --font-serif.
 * Tailwind's @theme then sets --font-serif: var(--nf-serif) to bridge them.
 */
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  variable: "--nf-serif",  // ← unique name, no @theme clash
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f7f3",
};

export const metadata: Metadata = {
  title: "Théorea — Tea as Ritual",
  description:
    "A connoisseur-grade tea platform. Discover exceptional teas, deepen your ritual, and connect with the world's finest tea sommeliers.",
  keywords: [
    "tea",
    "premium tea",
    "tea sommelier",
    "tea ritual",
    "oolong",
    "green tea",
    "Da Hong Pao",
    "Jasmin Snow Buds",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Théorea",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${jakartaSans.variable} ${playfairDisplay.variable}`} style={{ fontFamily: "var(--nf-sans), system-ui, sans-serif" }}>
      <body className="bg-parchment text-ink antialiased">
        <GoogleAnalytics />
        <PWARegister />
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
