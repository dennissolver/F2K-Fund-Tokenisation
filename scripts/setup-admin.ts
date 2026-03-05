/**
 * Setup script: creates a Supabase Auth user and admin_users record.
 *
 * Usage:
 *   npx tsx scripts/setup-admin.ts
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const ADMIN_EMAIL = "dennis@factory2key.com.au";
const ADMIN_PASSWORD = process.argv[2];

if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
  console.error("Usage: npx tsx scripts/setup-admin.ts <password>");
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

async function main() {
  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Check if auth user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === ADMIN_EMAIL);

  let authUserId: string;

  if (existing) {
    console.log(`Auth user already exists: ${existing.id}`);
    authUserId = existing.id;

    // Update password
    const { error: updateError } = await supabase.auth.admin.updateUserById(authUserId, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (updateError) {
      console.error("Failed to update password:", updateError.message);
      process.exit(1);
    }
    console.log("Password updated.");
  } else {
    // Create new auth user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });

    if (createError || !newUser.user) {
      console.error("Failed to create auth user:", createError?.message);
      process.exit(1);
    }

    authUserId = newUser.user.id;
    console.log(`Created auth user: ${authUserId}`);
  }

  // 2. Upsert admin_users record
  const { error: upsertError } = await supabase
    .from("admin_users")
    .upsert(
      {
        auth_user_id: authUserId,
        email: ADMIN_EMAIL,
        role: "super_admin",
        full_name: "Dennis",
      },
      { onConflict: "email" }
    );

  if (upsertError) {
    console.error("Failed to upsert admin_users:", upsertError.message);
    process.exit(1);
  }

  console.log(`\nAdmin setup complete.`);
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Role:     super_admin`);
  console.log(`  Auth ID:  ${authUserId}`);
  console.log(`\nLogin at the admin console with your email and password.`);
}

main();
