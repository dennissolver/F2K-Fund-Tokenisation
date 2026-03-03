import { createClient } from "@supabase/supabase-js";
import { createBrowserClient, createServerClient } from "@supabase/ssr";

// Server-side client (for API routes, server components)
export function createSupabaseServerClient(
  supabaseUrl: string,
  supabaseKey: string
) {
  return createClient(supabaseUrl, supabaseKey);
}

// Service role client (bypasses RLS — admin console only)
export function createSupabaseServiceClient(
  supabaseUrl: string,
  serviceRoleKey: string
) {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Browser client (for client components)
export function createSupabaseBrowserClient(
  supabaseUrl: string,
  supabaseAnonKey: string
) {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// SSR client factory (for Next.js middleware/server components with cookie handling)
export { createServerClient, createBrowserClient };
