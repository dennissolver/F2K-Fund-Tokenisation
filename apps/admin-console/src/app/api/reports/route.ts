import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

export async function GET(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "investors";
  const supabase = createSupabaseService();

  let csvContent = "";

  switch (type) {
    case "investors": {
      const { data } = await supabase.from("investors").select("*").order("created_at");
      csvContent = "ID,Email,Name,Type,KYC Status,Wallet,Registered\n";
      csvContent += (data || [])
        .map((i) => `${i.id},${i.email},${i.full_name || ""},${i.investor_type || ""},${i.kyc_status},${i.wallet_address || ""},${i.created_at}`)
        .join("\n");
      break;
    }
    case "holdings": {
      const { data } = await supabase.from("subscriptions").select("*, investors(email, full_name)").eq("status", "minted");
      csvContent = "Investor Email,Name,Tokens Minted,Amount USDC,Token Price\n";
      csvContent += (data || [])
        .map((s) => {
          const inv = s.investors as { email: string; full_name: string | null } | null;
          return `${inv?.email || ""},${inv?.full_name || ""},${s.tokens_to_mint},${s.amount_usdc},${s.token_price}`;
        })
        .join("\n");
      break;
    }
    case "distributions": {
      const { data } = await supabase.from("distribution_payments").select("*, investors(email, full_name), distributions(distribution_date)");
      csvContent = "Distribution Date,Investor,Amount USDC,Share %,Status,Tx Hash\n";
      csvContent += (data || [])
        .map((p) => {
          const inv = p.investors as { email: string; full_name: string | null } | null;
          const dist = p.distributions as { distribution_date: string } | null;
          return `${dist?.distribution_date || ""},${inv?.email || ""},${p.amount_usdc},${p.share_percentage},${p.status},${p.tx_hash || ""}`;
        })
        .join("\n");
      break;
    }
    case "audit": {
      const { data } = await supabase.from("audit_log").select("*").order("created_at", { ascending: false });
      csvContent = "Timestamp,Actor,Action,Entity Type,Entity ID,Details\n";
      csvContent += (data || [])
        .map((e) => `${e.created_at},${e.actor_email || "system"},${e.action},${e.entity_type},${e.entity_id || ""},"${JSON.stringify(e.details).replace(/"/g, '""')}"`)
        .join("\n");
      break;
    }
  }

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="f2k-${type}-report.csv"`,
    },
  });
}
