import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "@/lib/supabase";

export const maxDuration = 60;

const client = new Anthropic();

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const { leadId } = await params;

  // Fetch lead data
  const { data: lead, error: leadErr } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (leadErr || !lead) {
    return NextResponse.json({ error: "Lead negasit" }, { status: 404 });
  }

  const prompt = `Esti un expert in marketing digital si analiza de piata din Romania.

Analizeaza urmatorul business si genereaza o strategie completa:
- Nume: ${lead.nume}
- Nisa: ${lead.nisa}
- Oras: ${lead.oras}, ${lead.judet}
- Rating Google: ${lead.rating || "N/A"} (${lead.nr_reviews || 0} recenzii)
- Are website: ${lead.are_website ? "Da" : "Nu"}
- Scor viteza site: ${lead.scor_viteza || "Nemasurat"}
- Status CRM: ${lead.status}

Genereaza un JSON cu urmatoarea structura EXACTA (fara comentarii, JSON valid):

{
  "audienta": {
    "segmente": [
      {
        "id": "seg1",
        "nume": "Segment 1 - [descriere scurta]",
        "geo_locatie": "...",
        "geo_alte_locatii": "...",
        "geo_online": "...",
        "geo_zona": "...",
        "socio_varsta": "...",
        "socio_sex": "...",
        "socio_ocupatie": "...",
        "socio_statut": "...",
        "socio_educatie": "...",
        "socio_venit": "...",
        "psiho_motivatie": "...",
        "psiho_valori": "...",
        "psiho_convingeri": "...",
        "psiho_model": "...",
        "psiho_inovatie": "...",
        "comp_tip": "...",
        "comp_hant": "...",
        "comp_factor": "...",
        "comp_incredere": "...",
        "comp_risc": "...",
        "comp_online": "...",
        "comp_ciclu": "...",
        "comp_independenta": "...",
        "fi_frici": "...",
        "fi_interese": "...",
        "prod_de_ce": "...",
        "prod_beneficii": "...",
        "prod_probleme": "...",
        "prod_solutie": "...",
        "prod_alternative": "...",
        "prod_obiectii": "...",
        "prod_de_ce_tu": "...",
        "prod_cunostinte": "...",
        "prod_factori": "..."
      },
      { "id": "seg2", "nume": "Segment 2 - [descriere scurta]", ... },
      { "id": "seg3", "nume": "Segment 3 - [descriere scurta]", ... }
    ]
  },
  "concurenti": [
    {
      "id": "conc1",
      "nume": "[Concurent generic 1]",
      "link": "",
      "prod_ce_are": "...",
      "prod_best": "...",
      "prod_unic": "...",
      "strat_sediu": "...",
      "strat_reclama": "...",
      "strat_bloggeri": "...",
      "strat_contact": "...",
      "strat_content": "...",
      "strat_er": "...",
      "strat_canale": "...",
      "vanz_algoritm": "...",
      "vanz_canale": "...",
      "vanz_lant": "...",
      "vanz_raspuns": "...",
      "vanz_bio": "...",
      "vanz_comentarii": "...",
      "vanz_script": "...",
      "fin_cec": "...",
      "fin_vanzari": "...",
      "clt_urmaritori": "...",
      "clt_zi": "...",
      "par_schimba": "...",
      "par_nota": "..."
    },
    { "id": "conc2", ... },
    { "id": "conc3", ... }
  ],
  "sostac": {
    "situatie": "Analiza detaliata a situatiei actuale: prezenta online actuala, canale folosite, puncte slabe si forte, pozitionare in piata...",
    "obiective": "Obiective SMART in cifre si limite de timp pentru urmatoarele 6-12 luni...",
    "strategie": "Minim 3 directii strategice principale pentru atingerea obiectivelor...",
    "tactici": "Instrumente, platforme si formate concrete pentru fiecare directie strategica...",
    "actiuni": "Plan de actiune detaliat cu termene si responsabilitati concrete...",
    "control": "KPI-uri, metrici de urmarit si sistem de raportare si corectare a strategiei..."
  },
  "ads": {
    "google": {
      "tip_campanie": "...",
      "obiectiv": "...",
      "cuvinte_cheie": ["...", "...", "..."],
      "cuvinte_negative": ["...", "...", "..."],
      "titluri": ["...", "...", "..."],
      "descrieri": ["...", "..."],
      "targeting_geo": "...",
      "buget_recomandat": "...",
      "bid_strategy": "...",
      "extensii": ["...", "...", "..."],
      "landing_page": "..."
    },
    "meta": {
      "tip_campanie": "...",
      "obiectiv": "...",
      "audienta_primara": "...",
      "audienta_lookalike": "...",
      "interese_targeting": ["...", "...", "..."],
      "varsta_targeting": "...",
      "locatii_targeting": "...",
      "formate_reclama": ["...", "...", "..."],
      "titlu_reclama": "...",
      "text_principal": "...",
      "cta": "...",
      "buget_recomandat": "...",
      "durata_campanie": "...",
      "retargeting": "..."
    }
  }
}

Toate valorile trebuie sa fie specifice si relevante pentru nisa "${lead.nisa}" din ${lead.oras}, Romania.
Raspunde DOAR cu JSON-ul valid, fara text inainte sau dupa.`;

  try {
    const stream = await client.messages.stream({
      model: "claude-opus-4-8",
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      messages: [{ role: "user", content: prompt }],
    });

    const message = await stream.finalMessage();

    // Extract JSON from the text block
    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "Nu s-a generat continut" }, { status: 500 });
    }

    let jsonText = textBlock.text.trim();
    // Remove markdown code fences if present
    jsonText = jsonText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

    let generated: {
      audienta: { segmente: unknown[] };
      concurenti: unknown[];
      sostac: Record<string, string>;
      ads: { google: Record<string, unknown>; meta: Record<string, unknown> };
    };
    try {
      generated = JSON.parse(jsonText);
    } catch {
      return NextResponse.json({ error: "JSON invalid returnat de AI", raw: jsonText.slice(0, 500) }, { status: 500 });
    }

    // Save to DB
    const { data: saved, error: saveErr } = await supabaseAdmin
      .from("strategii")
      .upsert(
        {
          lead_id: leadId,
          audienta: generated.audienta || {},
          concurenti: generated.concurenti || [],
          sostac: generated.sostac || {},
          ads: generated.ads || {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: "lead_id" }
      )
      .select()
      .single();

    if (saveErr) {
      return NextResponse.json({ error: saveErr.message }, { status: 500 });
    }

    return NextResponse.json(saved);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Eroare necunoscuta";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
