// Grila de preturi Nova Visio Tech — recalibrata 01.08.2026 (memory/business.md
// din workspace-ul de business, sectiunea "Ofertă").
//
// Decizia din spate (decisions.md, 2026-08-01): modelul principal devine
// PACHET COMPLET — abonament lunar cu site inclus, nu proiect platit integral.
// Obiectia reala la cold calling nu e "e scump", e "nu am buget acum": 1.100€
// deodata e decizie de capital si se amana; 349€/luna e cheltuiala
// operationala si se decide pe loc. Creștere e ANCORA — propunerea implicita
// in orice discutie de 20 de minute, indiferent de semnalele lead-ului.
//
// Setup-ul e obligatoriu (acopera costul direct al site-ului, filtreaza
// clientii neseriosi) si NU e negociabil in scris — daca cere reducere,
// se propune apel, nu discount pe WhatsApp.

import { SemnaleLead } from "./scoring";

// ─── PACHET COMPLET — model principal, abonament cu site inclus ─────────────

export type PachetComplet = {
  nume: string;
  setup: number;
  lunar: number;
  paginiInclude: string;
  valoareSite: number;
  include: string[];
};

export const PACHETE_COMPLET: Record<"LANSARE" | "CRESTERE" | "SCALARE", PachetComplet> = {
  LANSARE: {
    nume: "Lansare",
    setup: 390,
    lunar: 129,
    paginiInclude: "1–3 pagini",
    valoareSite: 550,
    include: [
      "Site 1–3 pagini (valoare 550€, inclus)",
      "Mentenanță + găzduire + SSL + backup",
      "2 ore de modificări pe lună",
      "Raport lunar",
    ],
  },
  CRESTERE: {
    nume: "Creștere",
    setup: 390,
    lunar: 349,
    paginiInclude: "5–8 pagini",
    valoareSite: 1100,
    include: [
      "Site 5–8 pagini (valoare 1.100€, inclus)",
      "Mentenanță + găzduire + SSL + backup",
      "Google & Meta Ads — setup și optimizare",
      "Optimizare conversii lunară",
      "Apel bi-lunar + suport WhatsApp prioritar",
    ],
  },
  SCALARE: {
    nume: "Scalare",
    setup: 390,
    lunar: 649,
    paginiInclude: "site sau shop dedicat",
    valoareSite: 1900,
    include: [
      "Site sau shop dedicat, pe măsură",
      "Mentenanță Business+ (5h modificări/lună)",
      "Ads multi-platformă + retargeting",
      "Manager de cont dedicat",
      "A/B testing continuu",
    ],
  },
};

/** Buget media minim recomandat clientului, separat de abonament — 2.1. */
export const BUGET_MEDIA_MINIM = 800;

/** Interval de spus la telefon când întreabă „cât costă?" — nu se dau cifre exacte la telefon. */
export const INTERVAL_LA_TELEFON =
  "de la 129 €/lună pentru site + mentenanță, majoritatea clienților aleg pachetul de 349 €/lună care include și reclamele";

// ─── PROIECTE — plată integrală, doar dacă se cere explicit ─────────────────
// Nu se ofera in discutie decat daca clientul cere sa detina site-ul din prima
// (canibalizeaza Lansare altfel).

export type Proiect = { nume: string; pret: number; include: string[] };

export const PROIECTE: Record<"START" | "BUSINESS" | "PREMIUM" | "SHOP_START" | "SHOP_PRO", Proiect> = {
  START: { nume: "Start", pret: 550, include: ["1–3 pagini"] },
  BUSINESS: { nume: "Business", pret: 1100, include: ["5–8 pagini", "design custom", "SEO avansat", "blog", "analytics", "instruire video"] },
  PREMIUM: { nume: "Premium", pret: 1900, include: ["pagini nelimitate", "funcționalități custom", "multilingv", "SEO tehnic complet"] },
  SHOP_START: { nume: "Shop Start", pret: 1400, include: ["≤50 produse", "plăți", "curieri", "instruire"] },
  SHOP_PRO: { nume: "Shop Pro", pret: 2290, include: ["produse nelimitate", "facturare automată", "feed", "cont client", "TVA & GDPR"] },
};

// ─── Servicii separate — pentru clienți care au deja site ───────────────────

export const MENTENANTA = {
  ESENTIAL: { nume: "Esențial", pret: 45 },
  PARTENERIAT: { nume: "Parteneriat", pret: 129, ore: "2h/lună" },
  BUSINESS_PLUS: { nume: "Business+", pret: 249, ore: "5h/lună" },
};

export const ADS_SEPARAT = {
  GOOGLE: { nume: "Google", pret: 290 },
  META: { nume: "Meta", pret: 250 },
  AMBELE: { nume: "Google + Meta", pret: 490 },
};

// ─── Propunerea cu 3 opțiuni (ancorare de preț) ──────────────────────────────

export type Optiune = {
  id: string;
  eticheta: "Bun" | "Mai bun" | "Cel mai bun";
  nume: string;
  subtitlu: string;
  pretBaza: number;   // pretul lunar (abonamentul, nu setup-ul)
  setupFee: number;   // 390€ la toate — platit o singura data, la semnare
  lunar: boolean;     // mereu true in modelul curent
  recomandat: boolean;
  retainere: { nume: string; pret: number; nota?: string }[]; // gol in modelul curent — Ads e deja in pachet
  items: { label: string; inclus: boolean; bold?: boolean }[];
  accentBg: string;
  accentBorder: string;
  accentBadge: string;
  accentText: string;
};

const STIL = {
  neutru: {
    accentBg: "bg-slate-50", accentBorder: "border-slate-200",
    accentBadge: "bg-slate-100 text-slate-600", accentText: "text-slate-700",
  },
  accent: {
    accentBg: "bg-blue-50", accentBorder: "border-blue-300",
    accentBadge: "bg-blue-600 text-white", accentText: "text-blue-700",
  },
  premium: {
    accentBg: "bg-violet-50", accentBorder: "border-violet-200",
    accentBadge: "bg-violet-100 text-violet-700", accentText: "text-violet-700",
  },
};

function opt(
  id: string,
  eticheta: Optiune["eticheta"],
  pachet: PachetComplet,
  subtitlu: string,
  stil: typeof STIL.neutru,
  recomandat: boolean
): Optiune {
  return {
    id,
    eticheta,
    nume: pachet.nume,
    subtitlu,
    pretBaza: pachet.lunar,
    setupFee: pachet.setup,
    lunar: true,
    recomandat,
    retainere: [],
    items: pachet.include.map((l, i) => ({ label: l, inclus: true, bold: i === 0 })),
    ...stil,
  };
}

/**
 * Trei opțiuni, mereu Lansare / Creștere / Scalare — modelul principal
 * (memory/business.md). Creștere e mereu ancora recomandata: "Pornesc
 * întotdeauna de la Creștere" (regula de vânzare, sectiunea din business.md).
 * Subtitlurile se adapteaza la semnalele lead-ului, dar pachetele si preturile
 * raman fixe — oferta productizata inseamna pret fix, nu negociat pe nisa.
 */
export function propunere3Optiuni(s: SemnaleLead): Optiune[] {
  const { LANSARE, CRESTERE, SCALARE } = PACHETE_COMPLET;

  const subtitluLansare = !s.areWebsite
    ? "Intri online rapid, cu ce contează cel mai mult"
    : "Site nou, simplu, fără reclame incluse";

  const subtitluCrestere = esteShop(s.nisa)
    ? "Site + reclame, gata de comenzi online din prima lună"
    : "Site complet + reclame, gestionat de la un capăt la altul";

  const subtitluScalare = esteShop(s.nisa)
    ? "Shop dedicat + reclame pe toate canalele + manager de cont"
    : "Site sau shop dedicat + reclame multi-platformă + manager de cont";

  return [
    opt("lansare", "Bun", LANSARE, subtitluLansare, STIL.neutru, false),
    opt("crestere", "Mai bun", CRESTERE, subtitluCrestere, STIL.accent, true),
    opt("scalare", "Cel mai bun", SCALARE, subtitluScalare, STIL.premium, false),
  ];
}

function esteShop(nisa?: string): boolean {
  if (!nisa) return false;
  return /magazin|shop|retail|mobil|produc|depozit|comert|market|boutique|florar|cofetar|brutar|piese/i.test(nisa);
}

export function etichetaScenariu(s: SemnaleLead): string {
  if (esteShop(s.nisa) && !s.areWebsite) return "Magazin/produse fără prezență online — Creștere e ancora naturală";
  if (!s.areWebsite) return "Fără website — Creștere rămâne propunerea implicită";
  if (s.scorViteza != null && s.scorViteza < 50) return "Site lent — Creștere înlocuiește ce au cu ceva funcțional";
  return "Are deja site — Creștere aduce reclamele pe care nu le au";
}
