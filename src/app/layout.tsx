import type { Metadata, Viewport } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import GoogleAnalytics from "@/components/ui/GoogleAnalytics";
import PWARegister from "@/components/PWARegister";
import { LocaleProvider } from "@/i18n/LocaleContext";
import "@/styles/globals.css";

/*
 * DM Sans — closest free equivalent to Proxima Nova.
 * Same geometric-humanist proportions, optimised for screen rendering.
 * Weights: 300 (light labels), 400 (body), 500 (medium UI), 600 (semibold CTAs).
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

/*
 * Cormorant Garamond — editorial serif for display headings.
 * More refined and contemporary than Playfair Display; excellent with
 * nature-forward palettes. Light weight for large headings.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#f1e6c8",
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
    <html lang="en-GB" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body className="bg-parchment text-ink antialiased">
        <GoogleAnalytics />
        <PWARegister />
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
