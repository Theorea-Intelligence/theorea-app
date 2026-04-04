import { redirect } from "next/navigation";

/**
 * Root page redirect.
 *
 * Next.js needs a page.tsx at the app root. This redirects to /dashboard
 * where the (main) route group serves the actual app.
 *
 * Once auth is added:
 * - Authenticated → /dashboard
 * - Unauthenticated → /welcome (landing page)
 */
export default function RootPage() {
  redirect("/dashboard");
}
