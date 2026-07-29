import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { STADII_DE_APELAT, sfarsitulZilei } from "@/lib/stadii";

const CAMPURI = `
  id, nume, telefon, telefon_secundar, website, are_website, adresa, oras, judet, nisa,
  rating, nr_reviews, scor, scor_viteza, status, valoare_estimata, valoare_retainer,
  pachet_propus, sursa, facebook_url, instagram_url,
  nota_personalizare, scor_audit, audit_semnale,
  nume_decident, functie_decident, email,
  nr_atingeri, data_ultimei_atingeri, data_urmatoarei_actiuni, do_not_call
`;

/**
 * Coada de apelare de azi (sectiunea 5.4 #1).
 *
 * Ordinea nu e negociabila si e aceeasi in fiecare zi:
 *   1. Urmaririle scadente — lead-uri atinse deja, cu next action <= azi.
 *      Cele mai vechi primele. Aici sunt banii (6.6: 80% se inchid intre
 *      atingerea 4 si 8).
 *   2. Lead-uri calificate netinse, sortate dupa scorul de audit desc.
 *
 * Lead-urile marcate Do Not Call (5.5) si cele fara telefon nu apar niciodata.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const judet = searchParams.get("judet") || "";
  const nisa = searchParams.get("nisa") || "";
  const limit = Math.min(Number(searchParams.get("limit")) || 60, 200);
  // Fallback pentru cand nu ai apucat sa scanezi destule lead-uri.
  const includeBrut = searchParams.get("includeBrut") === "true";
  // Pragul din 3.2: sub 8 nu suni. Poate fi coborat cand coada e goala.
  const scorMinim = searchParams.get("scorMinim") !== null
    ? Number(searchParams.get("scorMinim"))
    : 8;

  const azi = sfarsitulZilei().toISOString();

  // 1. Urmariri scadente — orice stadiu activ, next action trecut sau azi.
  let scadenteQ = supabaseAdmin
    .from("leads")
    .select(CAMPURI)
    .not("telefon", "is", null)
    .not("do_not_call", "is", true)
    .in("status", STADII_DE_APELAT)
    .not("data_urmatoarei_actiuni", "is", null)
    .lte("data_urmatoarei_actiuni", azi)
    .order("data_urmatoarei_actiuni", { ascending: true })
    .limit(limit);

  // 2. Lead-uri netinse, gata de primul apel.
  // Cand ceri explicit lead-uri nescanate, pragul de scor nu se mai aplica —
  // altfel filtrul l-ar taia pe fiecare (un lead nescanat are scor_audit 0).
  const stadiiNoi = includeBrut ? ["2 CALIFICAT", "1 LEAD BRUT"] : ["2 CALIFICAT"];
  const prag = includeBrut ? 0 : scorMinim;
  let noiQ = supabaseAdmin
    .from("leads")
    .select(CAMPURI)
    .not("telefon", "is", null)
    .not("do_not_call", "is", true)
    .in("status", stadiiNoi)
    .is("data_urmatoarei_actiuni", null)
    .gte("scor_audit", prag)
    .order("scor_audit", { ascending: false })
    .order("scor", { ascending: false })
    .limit(limit);

  if (judet) { scadenteQ = scadenteQ.eq("judet", judet); noiQ = noiQ.eq("judet", judet); }
  if (nisa) { scadenteQ = scadenteQ.eq("nisa", nisa); noiQ = noiQ.eq("nisa", nisa); }

  const [scadente, noi] = await Promise.all([scadenteQ, noiQ]);

  if (scadente.error) return NextResponse.json({ error: scadente.error.message }, { status: 500 });
  if (noi.error) return NextResponse.json({ error: noi.error.message }, { status: 500 });

  const vazute = new Set<string>();
  const coada = [...(scadente.data ?? []), ...(noi.data ?? [])]
    .filter((l) => (vazute.has(l.id) ? false : (vazute.add(l.id), true)))
    .slice(0, limit);

  return NextResponse.json({
    coada,
    total: coada.length,
    scadente: scadente.data?.length ?? 0,
    noi: noi.data?.length ?? 0,
  });
}
