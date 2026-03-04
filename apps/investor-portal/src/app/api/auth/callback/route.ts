import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next");

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[]
        ) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as never)
          );
        },
      },
    }
  );

  let sessionError = true;

  // PKCE flow: exchange code for session
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) sessionError = false;
  }

  // Token hash flow (email OTP): verify the token
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "signup" | "email",
    });
    if (!error) sessionError = false;
  }

  if (sessionError) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  // Session is now valid — create investor record if it doesn't exist
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isNewUser = false;

  if (user) {
    // Use service role to bypass RLS for the initial insert
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if investor record already exists
    const { data: existing } = await serviceClient
      .from("investors")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (!existing) {
      isNewUser = true;
      // Pull eligibility data from user metadata (set during signUp)
      const meta = user.user_metadata || {};

      await serviceClient.from("investors").insert({
        auth_user_id: user.id,
        email: user.email!,
        investor_type: meta.investor_type || null,
        net_assets_declared: meta.net_assets_declared || false,
        income_declared: meta.income_declared || false,
      });
    }
  }

  // New users go to onboarding, returning users go to dashboard
  const destination = next ?? (isNewUser ? "/onboarding" : "/dashboard");
  return NextResponse.redirect(`${origin}${destination}`);
}
