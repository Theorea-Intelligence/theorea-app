import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Auth callback handler for Théorea.
 *
 * Handles three distinct flows:
 *
 * 1. token_hash + type  — Email confirmation (type=signup) and password reset
 *    (type=recovery). Supabase sends these via email links in newer PKCE-based
 *    auth. We call verifyOtp to exchange the token for a session.
 *
 * 2. code               — OAuth (Google, Apple) and magic link PKCE flow.
 *    We call exchangeCodeForSession to convert the one-time code into a session.
 *
 * After a successful exchange the user is redirected to the appropriate page.
 * Errors redirect back to /welcome with a message in the query string.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // ── OAuth / provider errors ────────────────────────────────────────────────
  if (error) {
    const msg = encodeURIComponent(errorDescription || error);
    return NextResponse.redirect(`${origin}/welcome?error=${msg}`);
  }

  const supabase = await createClient();

  // ── Flow 1: token_hash — email confirmation & password reset ──────────────
  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (!verifyError) {
      // Password recovery — send straight to the reset password page
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`);
      }
      // Email confirmation (signup) — send to dashboard (or requested next)
      return NextResponse.redirect(`${origin}${next}`);
    }

    const msg = encodeURIComponent(
      verifyError.message === "Token has expired or is invalid"
        ? "Your link has expired. Please request a new one."
        : verifyError.message
    );
    return NextResponse.redirect(`${origin}/welcome?error=${msg}`);
  }

  // ── Flow 2: code — OAuth & magic link PKCE ────────────────────────────────
  if (code) {
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    const msg = encodeURIComponent(exchangeError.message);
    return NextResponse.redirect(`${origin}/welcome?error=${msg}`);
  }

  // ── No recognised parameters — back to welcome ────────────────────────────
  return NextResponse.redirect(`${origin}/welcome`);
}
