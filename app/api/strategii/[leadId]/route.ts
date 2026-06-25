import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const { leadId } = await params;

  const { data, error } = await supabaseAdmin
    .from("strategii")
    .select("*")
    .eq("lead_id", leadId)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    data || { lead_id: leadId, audienta: {}, concurenti: [], sostac: {} }
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const { leadId } = await params;
  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("strategii")
    .upsert(
      { lead_id: leadId, ...body, updated_at: new Date().toISOString() },
      { onConflict: "lead_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
