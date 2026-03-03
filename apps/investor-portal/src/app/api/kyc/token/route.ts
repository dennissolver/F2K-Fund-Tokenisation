import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import crypto from "crypto";

export async function POST() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Generate Sumsub access token (sandbox)
  const appToken = process.env.SUMSUB_APP_TOKEN;
  const secretKey = process.env.SUMSUB_SECRET_KEY;

  if (!appToken || !secretKey) {
    return NextResponse.json(
      { error: "KYC provider not configured" },
      { status: 503 }
    );
  }

  const ts = Math.floor(Date.now() / 1000).toString();
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(ts + "POST" + `/resources/accessTokens?userId=${user.id}&levelName=basic-kyc-level`)
    .digest("hex");

  try {
    const res = await fetch(
      `https://api.sumsub.com/resources/accessTokens?userId=${user.id}&levelName=basic-kyc-level`,
      {
        method: "POST",
        headers: {
          "X-App-Token": appToken,
          "X-App-Access-Ts": ts,
          "X-App-Access-Sig": signature,
        },
      }
    );

    const data = await res.json();

    // Store provider ID
    await supabase
      .from("investors")
      .update({ kyc_provider_id: user.id, kyc_status: "pending" })
      .eq("auth_user_id", user.id);

    return NextResponse.json({ token: data.token });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate KYC token" },
      { status: 500 }
    );
  }
}
