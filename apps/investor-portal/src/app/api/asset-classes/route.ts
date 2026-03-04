import { NextResponse } from "next/server";
import { createSupabaseService } from "@/lib/supabase-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const service = createSupabaseService();

  const { data: classes, error } = await service
    .from("asset_classes")
    .select("*")
    .eq("enabled", true)
    .order("code");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ classes });
}
