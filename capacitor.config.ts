import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.maisontheorea.app',
  appName: 'Théorea',

  // The app loads from the live Vercel deployment.
  // This means any update pushed to production is immediately available
  // in the native app — no new App Store submission required.
  webDir: 'out', // fallback dir (used only if server.url is removed for offline builds)
  server: {
    url: 'https://app.maison-theorea.com',
    cleartext: false, // HTTPS only
    androidScheme: 'https',
  },

  ios: {
    // Respect iPhone notch / Dynamic Island / home indicator safe areas
    contentInset: 'always',
    // Prevent rubber-band scroll on the root view (the app handles its own scroll)
    scrollEnabled: false,
    // Match the app background so there's no white flash during launch
    backgroundColor: '#1A1A1A',
    // Limit to portrait — the app is designed for portrait only
    preferredContentMode: 'mobile',
  },
};

export default config;
