import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("activitati")
    .select("id, tip, nota, urmator_followup, data, lead_id, leads(id, nume, nisa, oras, judet, telefon, status)")
    .not("urmator_followup", "is", null)
    .order("urmator_followup", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
