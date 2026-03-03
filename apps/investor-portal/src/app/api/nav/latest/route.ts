import { NextResponse } from "next/server";
import { createSupabaseService } from "@/lib/supabase-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createSupabaseService();

  const { data } = await supabase
    .from("nav_records")
    .select("nav_per_token, total_nav, total_supply, calculated_at")
    .eq("status", "published")
    .order("calculated_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) {
    return NextResponse.json({ nav_per_token: 1.0 });
  }

  return NextResponse.json(data);
}
