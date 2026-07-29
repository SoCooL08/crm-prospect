import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { configRezultat, cereNextAction, zileLucratoare, MOTIVE_PIERDERE } from "@/lib/stadii";

/**
 * Inregistreaza rezultatul unui apel din coada (sectiunea 5.4 #1 + #2).
 *
 * Un singur request scrie tot: activitatea in jurnal, contorul de atingeri,
 * stadiul si data urmatoarei actiuni. Nu exista cale prin care un lead atins
 * sa iasa de aici fara next action.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { lead_id, rezultat, nota, urmator_followup, motiv_pierdere, do_not_call } = body ?? {};

  if (!lead_id) {
    return NextResponse.json({ error: "lead_id lipseste" }, { status: 400 });
  }

  const cfg = configRezultat(rezultat);
  if (!cfg) {
    return NextResponse.json({ error: `Rezultat necunoscut: ${rezultat}` }, { status: 400 });
  }

  // Next action obligatoriu — regula din 5.2: un lead fara next action e mort.
  let nextAction: string | null = null;
  if (cereNextAction(cfg.stadiu)) {
    if (urmator_followup) {
      const d = new Date(urmator_followup);
      if (Number.isNaN(d.getTime())) {
        return NextResponse.json({ error: "Data urmatoarei actiuni e invalida" }, { status: 400 });
      }
      nextAction = d.toISOString();
    } else if (cfg.zileAuto) {
      nextAction = zileLucratoare(cfg.zileAuto).toISOString();
    } else {
      return NextResponse.json(
        { error: `„${cfg.label}” cere data urmatoarei actiuni.` },
        { status: 400 }
      );
    }
  }

  if (cfg.cereMotiv && !motiv_pierdere) {
    return NextResponse.json(
      { error: `„${cfg.label}” cere motivul pierderii.` },
      { status: 400 }
    );
  }
  if (motiv_pierdere && !MOTIVE_PIERDERE.includes(motiv_pierdere)) {
    return NextResponse.json({ error: `Motiv necunoscut: ${motiv_pierdere}` }, { status: 400 });
  }

  const { data: lead, error: eLead } = await supabaseAdmin
    .from("leads")
    .select("id, nume, nr_atingeri")
    .eq("id", lead_id)
    .single();

  if (eLead || !lead) {
    return NextResponse.json({ error: eLead?.message ?? "Lead negasit" }, { status: 404 });
  }

  const acum = new Date().toISOString();
  const atingere = (lead.nr_atingeri ?? 0) + 1;

  const { error: eAct } = await supabaseAdmin.from("activitati").insert({
    lead_id,
    tip: "apel",
    rezultat: cfg.cheie,
    nota: nota?.trim() || `${cfg.label} (atingerea ${atingere})`,
    urmator_followup: nextAction,
    data: acum,
  });
  if (eAct) return NextResponse.json({ error: eAct.message }, { status: 500 });

  const patch: Record<string, unknown> = {
    status: cfg.stadiu,
    nr_atingeri: atingere,
    data_ultimei_atingeri: acum,
    data_urmatoarei_actiuni: nextAction,
  };
  if (motiv_pierdere) patch.motiv_pierdere = motiv_pierdere;
  // Sectiunea 5.5 — cerere de a nu mai fi contactat: permanent, se respecta.
  if (do_not_call === true) {
    patch.do_not_call = true;
    patch.status = "9b PIERDUT";
    patch.motiv_pierdere = "Do Not Call";
    patch.data_urmatoarei_actiuni = null;
  }

  const { error: ePatch } = await supabaseAdmin.from("leads").update(patch).eq("id", lead_id);
  if (ePatch) return NextResponse.json({ error: ePatch.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    lead_id,
    stadiu: patch.status,
    nr_atingeri: atingere,
    data_urmatoarei_actiuni: patch.data_urmatoarei_actiuni,
  });
}
