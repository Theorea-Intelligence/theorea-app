/**
 * Google Analytics 4 — Théorea
 *
 * GA4 is implemented directly in app code (no GTM).
 * Measurement ID should be stored in environment variable NEXT_PUBLIC_GA4_ID.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "";

/** Check if GA4 is configured */
export const isGAEnabled = (): boolean => GA_MEASUREMENT_ID !== "";

/** Track page views */
export const pageview = (url: string): void => {
  if (!isGAEnabled()) return;
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

/** Track custom events */
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}): void => {
  if (!isGAEnabled()) return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

/** Théorea-specific events */
export const trackRitualLogged = (teaName: string): void => {
  event({ action: "ritual_logged", category: "rituals", label: teaName });
};

export const trackLouConversation = (): void => {
  event({ action: "lou_conversation", category: "ai" });
};

export const trackWaitlistSignup = (email: string): void => {
  event({ action: "waitlist_signup", category: "acquisition" });
};

export const trackProductView = (teaName: string): void => {
  event({ action: "view_item", category: "marketplace", label: teaName });
};

export const trackAddToCart = (teaName: string, price: number): void => {
  event({
    action: "add_to_cart",
    category: "marketplace",
    label: teaName,
    value: price,
  });
};
