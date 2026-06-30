import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const client = new Anthropic();

export async function POST(req: NextRequest) {
  let answers: Record<string, string> = {};
  try {
    const body = await req.json();
    answers = body.answers ?? {};
  } catch {
    return NextResponse.json({ error: "Body invalid" }, { status: 400 });
  }

  const raspunsuri = Object.entries(answers)
    .filter(([, v]) => v && v.trim())
    .map(([q, v]) => `Î: ${q}\nR: ${v.trim()}`)
    .join("\n\n");

  if (!raspunsuri) {
    return NextResponse.json(
      { error: "Nu există răspunsuri completate. Completează întrebările din tab-ul Pregătire Întâlnire mai întâi." },
      { status: 400 }
    );
  }

  const prompt = `Ești un expert senior în Facebook/Meta Ads pentru clinici de estetică din România. Construiește CEL MAI BUN plan de Facebook Ads pentru clientul Episculp Beauty, pe baza răspunsurilor reale obținute la întâlnire.

CONTEXT FIX DESPRE CLIENT (nu îl repeta, folosește-l):
- Episculp Beauty — clinică estetică non-invazivă, Șelimbăr/Sibiu. Fondator: Loredana Voinea (cosmetician CIDESCO).
- Servicii: Epilare definitivă (Primelase HR, Full Body 910 lei), Remodelare corporală (Cooltech criolipoliză, Viora V10), Tratamente faciale (Hydrafacial Syndeo), Analiză facială Observ 320 (unic în Sibiu).
- Diferențiatori reali: Observ 320 (unic), Hydrafacial Syndeo (versiune premium), certificare CIDESCO.
- Audiență: femei 22-45 (birou/antreprenoare) + mămici (septembrie).
- DECIZII STRATEGICE DEJA LUATE (respectă-le strict):
  * DOAR Meta/Facebook — FĂRĂ Google Ads. Motivul: clientul e deja #1 organic pe "epilare definitiva sibiu", deci Google ar dubla gratuit traficul. Meta = cerere latentă (oameni care nu caută încă).
  * Pixel-ul Meta este DEJA INSTALAT pe site. NU recomanda instalarea lui — recomandă verificarea/optimizarea evenimentelor și folosirea lui pentru retargeting și audiențe.
  * Creativele (video/foto) le produce CLIENTUL singur. NU propune costuri de producție. Tu propui unghiuri/concepte pe care le pot filma ei.
  * La buget mic se CONCENTREAZĂ, nu se fragmentează: o singură campanie cold + retargeting până spre 6000 lei/lună; 2 campanii cold doar peste 6000 lei.
- Concurenți principali: Shining Body (agresiv pe preț, 2 locații), Clinica Michaelis, EC Beauty, CooLaser (la 50m, full body 350 lei).

RĂSPUNSURILE CLIENTULUI LA ÎNTÂLNIRE:
${raspunsuri}

Generează un plan de Facebook Ads în limba română, în format Markdown curat, ADAPTAT la răspunsurile de mai sus (capacitate, buget, follow-up, serviciu prioritar etc.). Structura:

## Diagnoză rapidă (pe baza răspunsurilor)
3-5 puncte cu ce ai înțeles din răspunsuri și ce implică pentru strategie.

## Structura de campanii recomandată
Câte campanii, ce obiectiv fiecare, cum se împarte bugetul (folosește bugetul din răspunsuri dacă există; altfel dă scenarii). Respectă regula concentrării.

## Audiențe
Cold (interese concrete), Lookalike (din ce sursă), Retargeting (folosind pixel-ul existent). Vârstă + locații.

## Unghiuri & oferte per serviciu
Pentru serviciul prioritar (din răspunsuri) + 1-2 secundare: concept creativ (de filmat de client), titlu, text scurt, CTA.

## Plan pe 3 luni (sintetic)
Luna 1 / Luna 2 / Luna 3 — focus + ce măsurăm. Impactul real se vede între luna 2 și 3.

## KPI de urmărit
4-6 metrici cu ținte realiste (cost/lead, CTR, frequency etc.).

## Recomandări specifice clientului
Bazate DIRECT pe răspunsuri (ex: dacă follow-up-ul e lent → soluție; dacă capacitatea e mică → calibrare volum).

Răspunde DOAR cu Markdown-ul planului, fără introducere sau încheiere de tip "iată planul".`;

  try {
    const stream = await client.messages.stream({
      model: "claude-opus-4-8",
      max_tokens: 6000,
      thinking: { type: "adaptive" },
      messages: [{ role: "user", content: prompt }],
    });

    const message = await stream.finalMessage();
    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "Nu s-a generat conținut" }, { status: 500 });
    }

    return NextResponse.json({ plan: textBlock.text.trim() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Eroare necunoscută";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
