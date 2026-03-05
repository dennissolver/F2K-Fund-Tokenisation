import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

function generatePassword(length = 16): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join("");
}

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseService();
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

const VALID_ROLES = ["super_admin", "fund_manager", "compliance", "read_only"] as const;

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(admin.role, "manage_admin_users")) {
    return NextResponse.json({ error: "Forbidden: super_admin only" }, { status: 403 });
  }

  const body = await request.json();
  const { email, role, full_name } = body as {
    email?: string;
    role?: string;
    full_name?: string;
  };

  if (!email || !role || !full_name) {
    return NextResponse.json(
      { error: "Missing required fields: email, role, full_name" },
      { status: 400 }
    );
  }

  if (!VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
    return NextResponse.json(
      { error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}` },
      { status: 400 }
    );
  }

  const supabase = createSupabaseService();
  const generatedPassword = generatePassword();

  // Create Supabase Auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: generatedPassword,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message || "Failed to create auth user" },
      { status: 500 }
    );
  }

  // Insert admin_users record
  const { data: adminUser, error: insertError } = await supabase
    .from("admin_users")
    .insert({
      auth_user_id: authData.user.id,
      email,
      role,
      full_name,
    } as never)
    .select()
    .single();

  if (insertError) {
    // Attempt cleanup of the auth user
    await supabase.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  await auditLog(
    admin.id,
    admin.email,
    "admin_user_created",
    "admin_users",
    adminUser.id,
    { new_email: email, new_role: role }
  );

  return NextResponse.json({
    admin_user: adminUser,
    generated_password: generatedPassword,
  });
}
