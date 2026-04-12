import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Auth helpers ───────────────────────────────────────────

/** Sign up with email + password */
export async function signUpWithPassword(
  email: string,
  password: string,
  metadata?: { full_name?: string; marketing_consent?: boolean }
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        full_name: metadata?.full_name || email.split("@")[0],
        marketing_consent: metadata?.marketing_consent ?? false,
        signup_source: "web",
        signup_date: new Date().toISOString(),
      },
    },
  });
}

/** Sign in with email + password */
export async function signInWithPassword(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

/** Send password reset email */
export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
  });
}

/** Update password (for reset flow, user must be authenticated) */
export async function updatePassword(newPassword: string) {
  return supabase.auth.updateUser({ password: newPassword });
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
