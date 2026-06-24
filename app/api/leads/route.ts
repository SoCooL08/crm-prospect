import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const faraSite = searchParams.get("faraSite") === "true";
  const status = searchParams.get("status") || "";

  let q = supabaseAdmin.from("leads").select("*").order("scor", { ascending: false });
  if (faraSite) q = q.eq("are_website", false);
  if (status) q = q.eq("status", status);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
