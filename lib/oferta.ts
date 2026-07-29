// Grila de preturi Nova Visio Tech — recalibrata 29.07.2026.
//
// Decizia din spate: podeaua a fost ridicata in loc sa fie dublate apelurile.
// Un site de 350 EUR consuma aceleasi zile de livrare ca unul de 1.290 si
// blocheaza calendarul exact in septembrie-octombrie. Preturile sunt fixe,
// nu se ajusteaza pe nisa — asta e ideea de oferta productizata (sectiunea
// 2.1): scop fix, pret fix, durata fixa. Se pot edita manual in generator,
// dar valoarea implicita e mereu grila.
//
// Regula 1:1 (sectiunea 2.3): la fiecare proiect vandut se ataseaza cel putin
// un retainer. CARE se ataseaza la 100% din proiecte — nu e optiune, e parte
// din livrare.

import { SemnaleLead } from "./scoring";

// ─── Proiecte (venit one-off) ────────────────────────────────────────────────

export type Proiect = {
  nume: string;
  pret: number;
  livrare: string;
  include: string[];
};

export const PROIECTE: Record<"LAUNCH" | "AUTHORITY" | "COMMERCE" | "COMMERCE_PRO", Proiect> = {
  LAUNCH: {
    nume: "LAUNCH",
    pret: 790,
    livrare: "10 zile lucrătoare",
    include: [
      "Site de prezentare, 5 pagini — template premium personalizat",
      "Copywriting de bază pe fiecare pagină",
      "SEO on-page: title, meta, structură H, viteză, schema",
      "Google Business Profile setat și optimizat",
      "Formular + WhatsApp + Google Analytics 4",
      "Găzduire + SSL, primul an incluse",
      "1 rundă de revizii",
    ],
  },
  AUTHORITY: {
    nume: "AUTHORITY",
    pret: 1290,
    livrare: "15–20 zile lucrătoare",
    include: [
      "Site 8–12 pagini, design custom pe brandul dumneavoastră",
      "Copywriting complet, orientat pe conversie",
      "Structură SEO pentru 10–15 cuvinte cheie",
      "Pagini de servicii separate — esențial pentru SEO local",
      "Blog + 2 articole seed",
      "Fotografii și video la sediu",
      "2 runde de revizii",
    ],
  },
  COMMERCE: {
    nume: "COMMERCE",
    pret: 1690,
    livrare: "20–30 zile lucrătoare",
    include: [
      "Magazin online până la 100 de produse",
      "Plăți online (Netopia / Stripe)",
      "Curieri (Fan / Cargus / Sameday) + facturare (SmartBill / Oblio)",
      "Feed Google Merchant + Meta Catalog",
      "Structură de categorii optimizată SEO",
      "Email flows de bază: coș abandonat, welcome",
      "2 runde de revizii",
    ],
  },
  COMMERCE_PRO: {
    nume: "COMMERCE PRO",
    pret: 2490,
    livrare: "30–40 zile lucrătoare",
    include: [
      "Tot ce include COMMERCE",
      "Peste 100 de produse, import în masă",
      "Integrare ERP / gestiune existentă",
      "Filtre avansate și căutare pe atribute",
      "Email flows complete + segmentare",
      "Optimizare rată de conversie la lansare",
    ],
  },
};

// ─── Retainere (MRR — aici e scalarea) ───────────────────────────────────────

export type Retainer = {
  nume: string;
  pret: number;
  minim?: string;
  include: string[];
};

export const RETAINERE: Record<
  "CARE" | "CARE_PRO" | "SEO" | "ADS_META" | "ADS_GOOGLE" | "ADS_AMBELE" | "FULL_GROWTH",
  Retainer
> = {
  CARE: {
    nume: "CARE",
    pret: 49,
    include: [
      "Update-uri și backup zilnic",
      "Monitorizare uptime + securitate",
      "1 oră de modificări pe lună",
      "Raport lunar",
    ],
  },
  CARE_PRO: {
    nume: "CARE PRO",
    pret: 129,
    include: [
      "Tot ce include CARE",
      "3 ore de modificări pe lună",
      "Prioritate la intervenții",
      "Monitorizare performanță și viteză",
    ],
  },
  SEO: {
    nume: "SEO",
    pret: 390,
    minim: "minim 6 luni",
    include: [
      "Audit SEO inițial",
      "4 articole pe lună",
      "Link building local",
      "Management Google Business Profile + postări",
      "Optimizări on-page continue",
      "Raport lunar cu poziții și trafic",
    ],
  },
  ADS_META: {
    nume: "ADS Meta",
    pret: 250,
    minim: "minim 3 luni, plus buget media",
    include: [
      "Setup și optimizare campanii Meta",
      "Creative + copy pentru reclame",
      "Optimizare săptămânală",
      "Raport lunar",
    ],
  },
  ADS_GOOGLE: {
    nume: "ADS Google",
    pret: 290,
    minim: "minim 3 luni, plus buget media",
    include: [
      "Setup și optimizare Google Ads",
      "Cercetare cuvinte cheie + negative",
      "Optimizare săptămânală",
      "Raport lunar",
    ],
  },
  ADS_AMBELE: {
    nume: "ADS Google + Meta",
    pret: 490,
    minim: "minim 3 luni, plus buget media",
    include: [
      "Google Ads + Meta Ads gestionate împreună",
      "Landing page inclus",
      "Optimizare săptămânală pe ambele canale",
      "Raport lunar unificat",
    ],
  },
  FULL_GROWTH: {
    nume: "FULL GROWTH",
    pret: 790,
    minim: "minim 6 luni",
    include: [
      "SEO + Google Ads + Meta Ads + CARE, totul inclus",
      "4 articole pe lună + link building local",
      "Landing page-uri pentru campanii",
      "Raport lunar unificat + call de 30 min",
    ],
  },
};

/** Buget media minim recomandat clientului — sub asta nu ai date. */
export const BUGET_MEDIA_MINIM = 800;

// ─── Propunerea cu 3 opțiuni (ancorare de preț) ──────────────────────────────

export type Optiune = {
  id: string;
  eticheta: "Bun" | "Mai bun" | "Cel mai bun";
  nume: string;
  subtitlu: string;
  pretBaza: number;          // one-off; 0 daca oferta e doar retainer
  lunar: boolean;            // true cand pretul principal e lunar
  recomandat: boolean;
  /** Regula 1:1: CARE apare la fiecare proiect; peste el se adauga SEO/Ads. */
  retainere: { nume: string; pret: number; nota?: string }[];
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

function itemsDin(proiect: Proiect | null, retaineri: Retainer[], exclus: string[] = []) {
  return [
    ...(proiect ? proiect.include.map((l, i) => ({ label: l, inclus: true, bold: i === 0 })) : []),
    ...retaineri.flatMap((r) =>
      r.include.map((l, i) => ({ label: `${r.nume}: ${l}`, inclus: true, bold: i === 0 }))
    ),
    ...exclus.map((l) => ({ label: l, inclus: false })),
  ];
}

function esteShop(nisa?: string): boolean {
  if (!nisa) return false;
  return /magazin|shop|retail|mobil|produc|depozit|comert|market|boutique|florar|cofetar|brutar/i.test(nisa);
}

/**
 * Trei opțiuni, mereu în ordinea Bun / Mai bun / Cel mai bun.
 * Opțiunea din mijloc e cea recomandată — acolo se duce majoritatea, iar a
 * treia există ca să facă a doua să pară rezonabilă.
 */
export function propunere3Optiuni(s: SemnaleLead): Optiune[] {
  const { CARE, CARE_PRO, SEO, ADS_GOOGLE, ADS_AMBELE, FULL_GROWTH } = RETAINERE;
  void CARE_PRO;
  const { LAUNCH, AUTHORITY, COMMERCE, COMMERCE_PRO } = PROIECTE;

  const opt = (
    id: string,
    eticheta: Optiune["eticheta"],
    proiect: Proiect | null,
    retainer: Retainer | null,
    subtitlu: string,
    stil: typeof STIL.neutru,
    recomandat = false,
    exclus: string[] = []
  ): Optiune => {
    // CARE se ataseaza la 100% din proiecte (2.3). FULL GROWTH il contine deja,
    // deci nu-l dublam. Cand oferta e doar retainer, nu exista proiect de
    // intretinut, deci nici CARE.
    const retaineri: Retainer[] = [];
    if (proiect && retainer !== FULL_GROWTH && retainer !== CARE_PRO) retaineri.push(CARE);
    if (retainer && retainer !== CARE) retaineri.push(retainer);
    else if (retainer === CARE && !proiect) retaineri.push(CARE);

    return {
      id,
      eticheta,
      nume: proiect ? proiect.nume : retainer!.nume,
      subtitlu,
      pretBaza: proiect ? proiect.pret : retainer!.pret,
      lunar: !proiect,
      recomandat,
      retainere: proiect
        ? retaineri.map((r) => ({ nume: r.nume, pret: r.pret, nota: r.minim }))
        : [],
      items: itemsDin(proiect, proiect ? retaineri : [], exclus),
      ...stil,
    };
  };

  // Magazin fizic fără shop online — aici e COMMERCE.
  if (esteShop(s.nisa) && !s.areWebsite) {
    return [
      opt("c1", "Bun", COMMERCE, CARE, "Magazin online funcțional, gata de vânzări", STIL.neutru, false,
        ["Campanii plătite", "SEO continuu"]),
      opt("c2", "Mai bun", COMMERCE, ADS_AMBELE, "Shop + trafic plătit din prima lună", STIL.accent, true,
        ["Articole SEO lunare"]),
      opt("c3", "Cel mai bun", COMMERCE_PRO, FULL_GROWTH, "Shop mare + creștere pe toate canalele", STIL.premium),
    ];
  }

  // Fără website — cea mai clară durere.
  if (!s.areWebsite) {
    return [
      opt("a1", "Bun", LAUNCH, CARE, "Intri online rapid, cu ce contează", STIL.neutru, false,
        ["Pagini separate de servicii", "Campanii plătite", "SEO continuu"]),
      opt("a2", "Mai bun", AUTHORITY, ADS_GOOGLE, "Site complet + clienți din Google din luna 1", STIL.accent, true,
        ["Articole SEO lunare"]),
      opt("a3", "Cel mai bun", AUTHORITY, FULL_GROWTH, "Site complet + SEO + Ads, totul gestionat", STIL.premium),
    ];
  }

  // Are site, dar e lent sau vechi — vinzi refacerea.
  if (s.scorViteza != null && s.scorViteza < 50) {
    return [
      opt("b1", "Bun", LAUNCH, CARE, "Refacere rapidă pe structura actuală", STIL.neutru, false,
        ["Copywriting complet", "Campanii plătite", "SEO continuu"]),
      opt("b2", "Mai bun", AUTHORITY, SEO, "Site nou pe conversie + poziții în Google", STIL.accent, true,
        ["Campanii plătite"]),
      opt("b3", "Cel mai bun", AUTHORITY, FULL_GROWTH, "Site nou + SEO + Ads, totul gestionat", STIL.premium),
    ];
  }

  // Are site decent — vânzarea e retainerul, nu proiectul.
  return [
    opt("d1", "Bun", null, ADS_GOOGLE, "Clienți din Google, fără site nou", STIL.neutru, false,
      ["Articole SEO lunare", "Meta Ads"]),
    opt("d2", "Mai bun", null, FULL_GROWTH, "SEO + Ads + mentenanță, pachetul-ancoră", STIL.accent, true),
    opt("d3", "Cel mai bun", AUTHORITY, FULL_GROWTH, "Site refăcut pe conversie + creștere completă", STIL.premium),
  ];
}

export function etichetaScenariu(s: SemnaleLead): string {
  if (esteShop(s.nisa) && !s.areWebsite) return "Magazin fizic fără shop — COMMERCE";
  if (!s.areWebsite) return "Fără website — LAUNCH / AUTHORITY";
  if (s.scorViteza != null && s.scorViteza < 50) return "Site lent — refacere";
  return "Site existent — creștere pe retainer";
}

/** Intervalul pe care îl spui la telefon când te întreabă „cât costă?”. */
export const INTERVAL_LA_TELEFON =
  "între 800 și 1.300 de euro pentru un site de prezentare, de la 1.700 pentru magazin online";
