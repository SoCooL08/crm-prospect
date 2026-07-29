// Sursa unica de adevar pentru pipeline, audit si cadenta.
// Valorile trebuie sa ramana identice cu listele de validare din sheet-ul
// PIPELINE (NVT-Tracking-Aug-Dec-2026.xlsx).

// ─── Pipeline — 9 stadii (sectiunea 5.2) ─────────────────────────────────────

export const STADII = [
  "1 LEAD BRUT",
  "2 CALIFICAT",
  "3 IN APELARE",
  "4 CONTACTAT",
  "5 AUDIT TRIMIS",
  "6 DISCUTIE PROGRAMATA",
  "7 OFERTA TRIMISA",
  "8 NEGOCIERE",
  "9a CASTIGAT",
  "9b PIERDUT",
  "9c NURTURE",
] as const;

export type Stadiu = (typeof STADII)[number];

export const STADIU_LABEL: Record<Stadiu, string> = {
  "1 LEAD BRUT": "1 · Lead brut",
  "2 CALIFICAT": "2 · Calificat",
  "3 IN APELARE": "3 · În apelare",
  "4 CONTACTAT": "4 · Contactat",
  "5 AUDIT TRIMIS": "5 · Audit trimis",
  "6 DISCUTIE PROGRAMATA": "6 · Discuție programată",
  "7 OFERTA TRIMISA": "7 · Ofertă trimisă",
  "8 NEGOCIERE": "8 · Negociere",
  "9a CASTIGAT": "9a · Câștigat",
  "9b PIERDUT": "9b · Pierdut",
  "9c NURTURE": "9c · Nurture",
};

export const STADIU_SCURT: Record<Stadiu, string> = {
  "1 LEAD BRUT": "Lead brut",
  "2 CALIFICAT": "Calificat",
  "3 IN APELARE": "În apelare",
  "4 CONTACTAT": "Contactat",
  "5 AUDIT TRIMIS": "Audit trimis",
  "6 DISCUTIE PROGRAMATA": "Discuție",
  "7 OFERTA TRIMISA": "Ofertă",
  "8 NEGOCIERE": "Negociere",
  "9a CASTIGAT": "Câștigat",
  "9b PIERDUT": "Pierdut",
  "9c NURTURE": "Nurture",
};

type Culori = {
  dot: string; header: string; headerText: string;
  dropBg: string; cardBorder: string; badge: string; text: string;
};

export const STADIU_UI: Record<Stadiu, Culori> = {
  "1 LEAD BRUT": {
    dot: "bg-slate-400", header: "bg-slate-100", headerText: "text-slate-600",
    dropBg: "bg-slate-100/70", cardBorder: "border-slate-200",
    badge: "bg-slate-100 text-slate-700", text: "text-slate-400",
  },
  "2 CALIFICAT": {
    dot: "bg-cyan-500", header: "bg-cyan-50", headerText: "text-cyan-700",
    dropBg: "bg-cyan-50/70", cardBorder: "border-cyan-200",
    badge: "bg-cyan-100 text-cyan-700", text: "text-cyan-600",
  },
  "3 IN APELARE": {
    dot: "bg-sky-500", header: "bg-sky-50", headerText: "text-sky-700",
    dropBg: "bg-sky-50/70", cardBorder: "border-sky-200",
    badge: "bg-sky-100 text-sky-700", text: "text-sky-600",
  },
  "4 CONTACTAT": {
    dot: "bg-blue-500", header: "bg-blue-50", headerText: "text-blue-700",
    dropBg: "bg-blue-50/70", cardBorder: "border-blue-200",
    badge: "bg-blue-100 text-blue-700", text: "text-blue-500",
  },
  "5 AUDIT TRIMIS": {
    dot: "bg-indigo-500", header: "bg-indigo-50", headerText: "text-indigo-700",
    dropBg: "bg-indigo-50/70", cardBorder: "border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700", text: "text-indigo-500",
  },
  "6 DISCUTIE PROGRAMATA": {
    dot: "bg-violet-500", header: "bg-violet-50", headerText: "text-violet-700",
    dropBg: "bg-violet-50/70", cardBorder: "border-violet-200",
    badge: "bg-violet-100 text-violet-700", text: "text-violet-500",
  },
  "7 OFERTA TRIMISA": {
    dot: "bg-amber-500", header: "bg-amber-50", headerText: "text-amber-700",
    dropBg: "bg-amber-50/70", cardBorder: "border-amber-200",
    badge: "bg-amber-100 text-amber-700", text: "text-amber-500",
  },
  "8 NEGOCIERE": {
    dot: "bg-orange-500", header: "bg-orange-50", headerText: "text-orange-700",
    dropBg: "bg-orange-50/70", cardBorder: "border-orange-200",
    badge: "bg-orange-100 text-orange-700", text: "text-orange-500",
  },
  "9a CASTIGAT": {
    dot: "bg-emerald-500", header: "bg-emerald-50", headerText: "text-emerald-700",
    dropBg: "bg-emerald-50/70", cardBorder: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700", text: "text-emerald-500",
  },
  "9b PIERDUT": {
    dot: "bg-red-400", header: "bg-red-50", headerText: "text-red-600",
    dropBg: "bg-red-50/70", cardBorder: "border-red-200",
    badge: "bg-red-100 text-red-700", text: "text-red-400",
  },
  "9c NURTURE": {
    dot: "bg-teal-500", header: "bg-teal-50", headerText: "text-teal-700",
    dropBg: "bg-teal-50/70", cardBorder: "border-teal-200",
    badge: "bg-teal-100 text-teal-700", text: "text-teal-500",
  },
};

const UI_FALLBACK = STADIU_UI["1 LEAD BRUT"];

export function uiStadiu(s: string): Culori {
  return STADIU_UI[s as Stadiu] ?? UI_FALLBACK;
}

export function labelStadiu(s: string): string {
  return STADIU_SCURT[s as Stadiu] ?? s;
}

/** Stadii active — un lead aflat aici e "in joc" si intra in valoarea de pipeline. */
export const STADII_ACTIVE: Stadiu[] = [
  "2 CALIFICAT", "3 IN APELARE", "4 CONTACTAT", "5 AUDIT TRIMIS",
  "6 DISCUTIE PROGRAMATA", "7 OFERTA TRIMISA", "8 NEGOCIERE",
];

/** Stadii inchise — nu mai cer nicio actiune. */
export const STADII_INCHISE: Stadiu[] = ["9a CASTIGAT", "9b PIERDUT"];

/**
 * Sectiunea 5.4 #2 — next action obligatoriu.
 * Din momentul in care ai atins lead-ul, nu-l mai poti lasa fara data
 * urmatoarei actiuni. Un lead fara next action e un lead mort (5.2).
 */
export const STADII_CU_NEXT_ACTION: Stadiu[] = [
  "3 IN APELARE", "4 CONTACTAT", "5 AUDIT TRIMIS",
  "6 DISCUTIE PROGRAMATA", "7 OFERTA TRIMISA", "8 NEGOCIERE", "9c NURTURE",
];

export function cereNextAction(stadiu: string): boolean {
  return STADII_CU_NEXT_ACTION.includes(stadiu as Stadiu);
}

/** Stadiile din care se alimenteaza coada de apelare. */
export const STADII_DE_APELAT: Stadiu[] = [
  "2 CALIFICAT", "3 IN APELARE", "4 CONTACTAT", "5 AUDIT TRIMIS",
  "6 DISCUTIE PROGRAMATA", "7 OFERTA TRIMISA", "8 NEGOCIERE", "9c NURTURE",
];

// ─── Dropdown-uri (identice cu sheet-ul PIPELINE) ────────────────────────────

export const MOTIVE_PIERDERE = [
  "Pret", "Timing", "Are agentie", "Fara nevoie",
  "Nu raspunde", "Face intern", "Do Not Call",
] as const;

export const SURSE = [
  "Cold call", "Referral", "Organic", "Ads", "Reactivare", "Targ",
] as const;

export const PACHETE = ["LAUNCH", "AUTHORITY", "COMMERCE", "COMMERCE PRO"] as const;

export const FUNCTII = ["Administrator", "Patron", "Marketing", "Altul"] as const;

// ─── Scorul de audit — 10 semnale (sectiunea 3.2) ───────────────────────────

export type CheieSemnal =
  | "fara_site" | "nu_e_mobile" | "pagespeed_sub_50" | "fara_https"
  | "design_vechi" | "fara_gbp" | "nu_e_top10" | "ads_lp_slab"
  | "fara_cta" | "fizic_fara_shop";

export type Semnal = {
  cheie: CheieSemnal;
  puncte: number;
  label: string;
  cum: string;   // cum verifici, in 90 de secunde
  chip: string;  // formulare scurta, afisata in coada in timpul apelului
};

export const SEMNALE_AUDIT: Semnal[] = [
  { cheie: "fara_site",        puncte: 5, label: "Site inexistent sau „în construcție”", cum: "Google",                 chip: "fără site" },
  { cheie: "nu_e_mobile",      puncte: 4, label: "Site nu e mobile-friendly",            cum: "Deschide pe telefon",    chip: "nu e mobil" },
  { cheie: "pagespeed_sub_50", puncte: 3, label: "PageSpeed mobil sub 50",               cum: "PageSpeed Insights",     chip: "site lent" },
  { cheie: "fara_https",       puncte: 4, label: "Fără HTTPS / certificat expirat",      cum: "Bara de browser",        chip: "fără HTTPS" },
  { cheie: "design_vechi",     puncte: 4, label: "Design vizibil vechi (pre-2018)",      cum: "Ochiometric",            chip: "design vechi" },
  { cheie: "fara_gbp",         puncte: 3, label: "Fără Google Business Profile sau sub 10 recenzii", cum: "Google Maps", chip: "fără GBP / puține recenzii" },
  { cheie: "nu_e_top10",       puncte: 3, label: "Nu apare în top 10 pe „[serviciu] + [oraș]”", cum: "Google incognito", chip: "nu e în top 10" },
  { cheie: "ads_lp_slab",      puncte: 5, label: "Rulează reclame dar are landing page slab", cum: "Meta Ads Library", chip: "plătește ads, LP slab" },
  { cheie: "fara_cta",         puncte: 3, label: "Fără formular / fără CTA / fără telefon vizibil", cum: "Site",        chip: "fără CTA" },
  { cheie: "fizic_fara_shop",  puncte: 4, label: "Magazin fizic fără shop online",       cum: "Site + Google",          chip: "fără shop online" },
];

export const SCOR_AUDIT_MAX = SEMNALE_AUDIT.reduce((s, x) => s + x.puncte, 0); // 38

export type SemnaleAudit = Partial<Record<CheieSemnal, boolean>>;

export function calculScorAudit(semnale: SemnaleAudit | null | undefined): number {
  if (!semnale) return 0;
  return SEMNALE_AUDIT.reduce((s, x) => (semnale[x.cheie] ? s + x.puncte : s), 0);
}

export function semnaleBifate(semnale: SemnaleAudit | null | undefined): Semnal[] {
  if (!semnale) return [];
  return SEMNALE_AUDIT.filter((x) => semnale[x.cheie]);
}

export type Prioritate = "MAX" | "SUNA" | "NU SUNA";

/** Scor 8+ → sună. Scor 12+ → prioritate maximă, sună primul. (3.2) */
export function prioritateAudit(scor: number): Prioritate {
  if (scor >= 12) return "MAX";
  if (scor >= 8) return "SUNA";
  return "NU SUNA";
}

export const PRIORITATE_UI: Record<Prioritate, string> = {
  MAX: "bg-red-600 text-white",
  SUNA: "bg-amber-100 text-amber-800 border border-amber-300",
  "NU SUNA": "bg-slate-100 text-slate-500 border border-slate-200",
};

// ─── Rezultatele apelului — cele 4 butoane (sectiunea 5.4 #1) ───────────────

export type Rezultat = "nu_raspunde" | "interesat" | "nu" | "callback";

export type ConfigRezultat = {
  cheie: Rezultat;
  label: string;
  tasta: string;
  stadiu: Stadiu;
  /** cere dată de la tine inainte de a salva */
  cereData: boolean;
  /** cere motiv de pierdere */
  cereMotiv: boolean;
  /** zile lucratoare pana la urmatoarea atingere, cand data e automata */
  zileAuto?: number;
  clasa: string;
};

export const REZULTATE: ConfigRezultat[] = [
  {
    cheie: "nu_raspunde", label: "Nu răspunde", tasta: "1",
    stadiu: "3 IN APELARE", cereData: false, cereMotiv: false, zileAuto: 2,
    clasa: "bg-slate-700 hover:bg-slate-800 text-white",
  },
  {
    cheie: "interesat", label: "Vorbit — interesat", tasta: "2",
    stadiu: "4 CONTACTAT", cereData: true, cereMotiv: false,
    clasa: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  {
    cheie: "nu", label: "Vorbit — nu", tasta: "3",
    stadiu: "9b PIERDUT", cereData: false, cereMotiv: true,
    clasa: "bg-red-600 hover:bg-red-700 text-white",
  },
  {
    cheie: "callback", label: "Callback", tasta: "4",
    stadiu: "4 CONTACTAT", cereData: true, cereMotiv: false,
    clasa: "bg-amber-500 hover:bg-amber-600 text-white",
  },
];

export function configRezultat(r: string): ConfigRezultat | undefined {
  return REZULTATE.find((x) => x.cheie === r);
}

// ─── Date ───────────────────────────────────────────────────────────────────

/** Adauga n zile lucratoare, la ora 09:30 (inceputul blocului de apeluri). */
export function zileLucratoare(n: number, deLa: Date = new Date()): Date {
  const d = new Date(deLa);
  let ramase = n;
  while (ramase > 0) {
    d.setDate(d.getDate() + 1);
    const zi = d.getDay();
    if (zi !== 0 && zi !== 6) ramase--;
  }
  d.setHours(9, 30, 0, 0);
  return d;
}

export function sfarsitulZilei(d: Date = new Date()): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
