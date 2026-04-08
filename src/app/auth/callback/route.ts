import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Auth callback handler for Théorea.
 *
 * Handles:
 * 1. Magic link (OTP) — receives ?code= query param
 * 2. OAuth (Google, Apple) — receives ?code= from provider redirect
 *
 * After exchanging the code for a session, redirects to /dashboard.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth errors (e.g. user cancelled)
  if (error) {
    const errorMsg = encodeURIComponent(errorDescription || error);
    return NextResponse.redirect(`${origin}/welcome?error=${errorMsg}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // If exchange fails, redirect with error message
    const msg = encodeURIComponent(exchangeError.message);
    return NextResponse.redirect(`${origin}/welcome?error=${msg}`);
  }

  // No code present — redirect to welcome
  return NextResponse.redirect(`${origin}/welcome`);
}
