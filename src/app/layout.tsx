import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import GoogleAnalytics from "@/components/ui/GoogleAnalytics";
import PWARegister from "@/components/PWARegister";
import { LocaleProvider } from "@/i18n/LocaleContext";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#5a7a6a",
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
    <html lang="en-GB" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-parchment text-ink antialiased">
        <GoogleAnalytics />
        <PWARegister />
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
