import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data: leads } = await supabaseAdmin.from("leads").select("*");
  const { data: followups } = await supabaseAdmin
    .from("activitati")
    .select("*, leads(nume)")
    .not("urmator_followup", "is", null)
    .gte("urmator_followup", new Date().toISOString())
    .order("urmator_followup", { ascending: true })
    .limit(10);

  return NextResponse.json({ leads: leads || [], followups: followups || [] });
}
