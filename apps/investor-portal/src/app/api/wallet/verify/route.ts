import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseService } from "@/lib/supabase-service";
import { verifyMessage } from "viem";
import { walletVerifySchema } from "@f2k/shared/validation";

export async function POST(request: Request) {
  const supabase = createSupabaseServer();
  const serviceClient = createSupabaseService();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = walletVerifySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { address: wallet_address, signature, message } = parsed.data;

  // Verify the signature
  const valid = await verifyMessage({
    address: wallet_address as `0x${string}`,
    message,
    signature: signature as `0x${string}`,
  });

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Check wallet not already claimed
  const { data: existing } = await serviceClient
    .from("investors")
    .select("id")
    .eq("wallet_address", wallet_address)
    .neq("auth_user_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Wallet already linked to another investor" },
      { status: 409 }
    );
  }

  // Update investor record
  const { error } = await serviceClient
    .from("investors")
    .update({
      wallet_address,
      wallet_verified_at: new Date().toISOString(),
    })
    .eq("auth_user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Audit log
  await serviceClient.from("audit_log").insert({
    actor_id: user.id,
    actor_email: user.email,
    action: "wallet_verified",
    entity_type: "investor",
    details: { wallet_address },
  });

  return NextResponse.json({ ok: true });
}
