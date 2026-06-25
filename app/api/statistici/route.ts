import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data: leads, error } = await supabaseAdmin
    .from("leads")
    .select("nisa, status, rating, oras, motiv_pierdere, valoare_estimata, scor, created_at");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!leads?.length) return NextResponse.json({ nise: [], totale: {} });

  // Aggregate per nisa
  const map: Record<string, {
    total: number;
    clienti: number;
    pierduti: number;
    pipeline: number;
    ratings: number[];
    orase: Record<string, number>;
    motive: Record<string, number>;
    valoare: number;
  }> = {};

  for (const lead of leads) {
    const nisa = lead.nisa?.trim() || "Necunoscuta";
    if (!map[nisa]) {
      map[nisa] = { total: 0, clienti: 0, pierduti: 0, pipeline: 0, ratings: [], orase: {}, motive: {}, valoare: 0 };
    }
    const n = map[nisa];
    n.total++;
    if (lead.status === "Client") { n.clienti++; n.valoare += lead.valoare_estimata || 0; }
    else if (lead.status === "Pierdut") {
      n.pierduti++;
      if (lead.motiv_pierdere) n.motive[lead.motiv_pierdere] = (n.motive[lead.motiv_pierdere] || 0) + 1;
    } else {
      n.pipeline++;
      n.valoare += lead.valoare_estimata || 0;
    }
    if (lead.rating) n.ratings.push(Number(lead.rating));
    if (lead.oras) n.orase[lead.oras] = (n.orase[lead.oras] || 0) + 1;
  }

  const nise = Object.entries(map)
    .map(([nisa, d]) => ({
      nisa,
      total: d.total,
      clienti: d.clienti,
      pierduti: d.pierduti,
      pipeline: d.pipeline,
      conversie: d.total > 0 ? Math.round((d.clienti / d.total) * 100) : 0,
      rating_mediu: d.ratings.length > 0 ? Math.round((d.ratings.reduce((a, b) => a + b, 0) / d.ratings.length) * 10) / 10 : null,
      oras_principal: Object.entries(d.orase).sort((a, b) => b[1] - a[1])[0]?.[0] || "",
      motiv_principal: Object.entries(d.motive).sort((a, b) => b[1] - a[1])[0]?.[0] || "",
      valoare_pipeline: d.valoare,
    }))
    .sort((a, b) => b.total - a.total);

  const totale = {
    leads: leads.length,
    clienti: leads.filter((l) => l.status === "Client").length,
    pierduti: leads.filter((l) => l.status === "Pierdut").length,
    pipeline: leads.filter((l) => !["Client", "Pierdut"].includes(l.status)).length,
    nise_unice: Object.keys(map).length,
    conversie: Math.round((leads.filter((l) => l.status === "Client").length / leads.length) * 100),
  };

  return NextResponse.json({ nise, totale });
}
