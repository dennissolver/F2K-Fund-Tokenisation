import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseService } from "@/lib/supabase-service";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServer();
  const service = createSupabaseService();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: investor } = await service
    .from("investors")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!investor) {
    return NextResponse.json({ error: "Investor record not found" }, { status: 404 });
  }

  // Verify stake belongs to investor and is in draft
  const { data: stake } = await service
    .from("asset_stakes")
    .select("id, status, investor_id, supporting_docs")
    .eq("id", params.id)
    .eq("investor_id", investor.id)
    .single();

  if (!stake) {
    return NextResponse.json({ error: "Stake not found" }, { status: 404 });
  }

  if (stake.status !== "draft") {
    return NextResponse.json(
      { error: "Can only upload documents to draft stakes" },
      { status: 400 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const filePath = `${investor.id}/${params.id}/${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await service.storage
    .from("stake-documents")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Append to supporting_docs array
  const currentDocs: string[] = stake.supporting_docs || [];
  const { error: updateError } = await service
    .from("asset_stakes")
    .update({ supporting_docs: [...currentDocs, filePath] })
    .eq("id", params.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ path: filePath });
}
