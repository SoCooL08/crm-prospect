import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cereNextAction, calculScorAudit, STADII } from "@/lib/stadii";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  if (body.status && !STADII.includes(body.status)) {
    return NextResponse.json({ error: `Stadiu necunoscut: ${body.status}` }, { status: 400 });
  }

  // Scorul de audit se recalculeaza mereu pe server din bife, ca sa nu poata
  // ajunge desincronizat fata de semnale.
  if (body.audit_semnale) {
    body.scor_audit = calculScorAudit(body.audit_semnale);
  }

  // Sectiunea 5.4 #2 — next action obligatoriu.
  // Validarea sta aici, nu doar in UI, ca sa nu poata fi ocolita din kanban
  // sau printr-un request direct.
  if (body.status && cereNextAction(body.status) && !body.data_urmatoarei_actiuni) {
    const { data: existent } = await supabaseAdmin
      .from("leads")
      .select("data_urmatoarei_actiuni")
      .eq("id", id)
      .single();
    if (!existent?.data_urmatoarei_actiuni) {
      return NextResponse.json(
        {
          error: "next_action_lipsa",
          mesaj: `Stadiul „${body.status}” nu se poate salva fara data urmatoarei actiuni. Un lead fara next action e un lead mort.`,
        },
        { status: 400 }
      );
    }
  }

  const { error } = await supabaseAdmin.from("leads").update(body).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
