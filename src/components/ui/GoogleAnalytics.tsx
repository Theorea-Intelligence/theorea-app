"use client";

import Script from "next/script";
import { GA_MEASUREMENT_ID, isGAEnabled } from "@/lib/analytics/gtag";

/**
 * GA4 script loader — renders the Google Analytics script tags.
 * Only loads when NEXT_PUBLIC_GA4_ID is set.
 */
export default function GoogleAnalytics() {
  if (!isGAEnabled()) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
