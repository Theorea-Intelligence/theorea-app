import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Auth helpers ───────────────────────────────────────────

/** Magic link sign-in (email OTP) */
export async function signInWithEmail(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

/** Google OAuth sign-in */
export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
}

/** Apple OAuth sign-in */
export async function signInWithApple() {
  return supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

/** Sign out */
export async function signOut() {
  return supabase.auth.signOut();
}

/** Get current session */
export async function getSession() {
  return supabase.auth.getSession();
}

/** Listen for auth changes */
export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}
