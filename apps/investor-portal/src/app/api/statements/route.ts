import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseService } from "@/lib/supabase-service";

export async function GET(request: Request) {
  const supabase = createSupabaseServer();
  const serviceClient = createSupabaseService();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const quarter = searchParams.get("quarter") || "2024-Q4";
  const format = searchParams.get("format") || "csv";

  // Get investor
  const { data: investor } = await serviceClient
    .from("investors")
    .select("id, full_name, email")
    .eq("auth_user_id", user.id)
    .single();

  if (!investor) {
    return NextResponse.json({ error: "Investor not found" }, { status: 404 });
  }

  // Parse quarter to date range
  const [year, q] = quarter.split("-");
  const qNum = parseInt(q.replace("Q", ""));
  const startMonth = (qNum - 1) * 3;
  const startDate = new Date(parseInt(year), startMonth, 1).toISOString();
  const endDate = new Date(parseInt(year), startMonth + 3, 0).toISOString();

  // Fetch subscriptions in quarter
  const { data: subscriptions } = await serviceClient
    .from("subscriptions")
    .select("*")
    .eq("investor_id", investor.id)
    .gte("created_at", startDate)
    .lte("created_at", endDate);

  // Fetch distributions in quarter
  const { data: payments } = await serviceClient
    .from("distribution_payments")
    .select("*")
    .eq("investor_id", investor.id)
    .gte("created_at", startDate)
    .lte("created_at", endDate);

  if (format === "csv") {
    const lines = [
      "F2K Housing Token — Quarterly Statement",
      `Investor: ${investor.full_name || investor.email}`,
      `Quarter: ${quarter}`,
      "",
      "SUBSCRIPTIONS",
      "Date,Amount USDC,Token Price,Tokens,Status",
      ...(subscriptions || []).map(
        (s) =>
          `${s.created_at},${s.amount_usdc},${s.token_price},${s.tokens_to_mint},${s.status}`
      ),
      "",
      "DISTRIBUTIONS",
      "Date,Amount USDC,Status,Tx Hash",
      ...(payments || []).map(
        (p) => `${p.created_at},${p.amount_usdc},${p.status},${p.tx_hash || ""}`
      ),
    ];

    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="f2k-statement-${quarter}.csv"`,
      },
    });
  }

  // PDF placeholder — return text for now
  return new NextResponse(
    `F2K Housing Token Statement\n${quarter}\n\nPDF generation coming in production.`,
    {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="f2k-statement-${quarter}.txt"`,
      },
    }
  );
}
