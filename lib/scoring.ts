export interface SemnaleLead {
  areWebsite: boolean;
  rating: number;
  reviews: number;
  scorViteza?: number | null;
  nisa?: string;
}

// ─── Scorer complex ──────────────────────────────────────────────────────────

export interface ServiciuRecomandat {
  nume: string;
  scor: number;   // 0-100 cat de mult au nevoie
  motiv: string;
}

export interface ScorOpportunitate {
  total: number;          // scor general oportunitate 0-100
  probabilitate: number;  // probabilitate conversie 0-100
  servicii: ServiciuRecomandat[];
  prioritate: "Urgent" | "Ridicata" | "Medie" | "Scazuta";
  motivPrincipal: string;
}

export function scorOpportunitate(s: SemnaleLead): ScorOpportunitate {
  const servicii: ServiciuRecomandat[] = [];

  // 1. Website / Redesign
  if (!s.areWebsite) {
    const sc = s.reviews > 150 ? 100 : s.reviews > 50 ? 88 : 72;
    servicii.push({
      nume: "Website nou",
      scor: sc,
      motiv: s.reviews > 50
        ? `Afacere activa (${s.reviews} recenzii) fara website — pierd clienti zilnic`
        : "Prezenta online zero — cea mai clara oportunitate",
    });
  } else if (s.scorViteza != null) {
    if (s.scorViteza < 30)
      servicii.push({ nume: "Redesign urgent", scor: 90, motiv: `Site extrem de lent (${s.scorViteza}/100) — Google il penalizeaza sever` });
    else if (s.scorViteza < 50)
      servicii.push({ nume: "Optimizare site", scor: 68, motiv: `Viteza slaba (${s.scorViteza}/100) — pierd 53% din vizitatori` });
    else if (s.scorViteza < 70)
      servicii.push({ nume: "Optimizare site", scor: 38, motiv: `Site mediu (${s.scorViteza}/100) — loc de imbunatatire` });
  }

  // 2. Google Ads
  if (s.areWebsite && s.rating >= 4.0 && s.reviews > 50) {
    const sc = Math.min(62 + Math.floor(s.reviews / 8), 94);
    servicii.push({ nume: "Google Ads", scor: sc, motiv: `Afacere activa cu reputatie buna — ads pot scala rapid` });
  } else if (s.areWebsite && s.rating >= 3.5) {
    servicii.push({ nume: "Google Ads", scor: 52, motiv: "Are website si rating decent — gata pentru campanii" });
  } else if (!s.areWebsite && s.reviews > 100) {
    servicii.push({ nume: "Google Ads (dupa site)", scor: 30, motiv: "Potential mare, dar necesita site mai intai" });
  }

  // 3. SEO Local
  if (s.areWebsite) {
    if (s.scorViteza != null && s.scorViteza < 50) {
      servicii.push({ nume: "SEO Local", scor: 82, motiv: `Viteza slaba = ranking slab — SEO tehnic urgent` });
    } else if (s.reviews < 30) {
      servicii.push({ nume: "SEO Local", scor: 68, motiv: "Putine recenzii — SEO local ii poate dubla vizibilitatea" });
    } else {
      servicii.push({ nume: "SEO Local", scor: 48, motiv: "Are website — SEO aduce trafic organic constant" });
    }
  }

  // 4. Management Reputatie
  if (s.rating > 0 && s.rating < 3.5 && s.reviews > 20) {
    servicii.push({ nume: "Management Reputatie", scor: 92, motiv: `Rating critic (${s.rating}★) cu ${s.reviews} recenzii — pierd clienti activ` });
  } else if (s.rating >= 3.5 && s.rating < 4.0 && s.reviews > 30) {
    servicii.push({ nume: "Management Reputatie", scor: 65, motiv: `Rating sub medie (${s.rating}★) — concurentii cu 4.5+ ii depasesc` });
  }

  // Sort descending
  servicii.sort((a, b) => b.scor - a.scor);

  // Scor total — ponderat top 3 servicii
  const top = servicii.slice(0, 3).map((s) => s.scor);
  const total = Math.min(
    Math.round((top[0] ?? 0) * 0.55 + (top[1] ?? 0) * 0.30 + (top[2] ?? 0) * 0.15),
    100
  );

  // Probabilitate conversie
  let prob = 35;
  if (!s.areWebsite) prob += 28;               // durere evidenta
  if (s.reviews > 200) prob += 22;              // afacere mare, are buget
  else if (s.reviews > 50) prob += 13;
  if (s.rating > 0 && s.rating < 4.0) prob += 16; // durere resimtita
  if (s.scorViteza != null && s.scorViteza < 50) prob += 14; // problema demonstrabila
  const probabilitate = Math.min(prob, 95);

  // Prioritate
  let prioritate: ScorOpportunitate["prioritate"];
  if (total >= 72 && probabilitate >= 60) prioritate = "Urgent";
  else if (total >= 55 || probabilitate >= 58) prioritate = "Ridicata";
  else if (total >= 35) prioritate = "Medie";
  else prioritate = "Scazuta";

  return {
    total,
    probabilitate,
    servicii,
    prioritate,
    motivPrincipal: servicii[0]?.motiv ?? "Oportunitate generala de marketing",
  };
}

export function calculScor(s: SemnaleLead): number {
  return scorOpportunitate(s).total;
}

export function etichetaScor(scor: number): "Fierbinte" | "Cald" | "Rece" {
  if (scor >= 65) return "Fierbinte";
  if (scor >= 40) return "Cald";
  return "Rece";
}

export function oferta(s: SemnaleLead): string {
  if (!s.areWebsite) return "Site web nou";
  if (s.scorViteza != null && s.scorViteza < 50) return "Redesign + optimizare viteza";
  if (s.rating > 0 && s.rating < 4.0) return "Google Ads + reputatie";
  return "Audit / optimizare";
}

export interface BriefApel {
  cuvinte_cheie: string[];
  deschidere: string;
  observatie: string;
  observatii: string[];
  dovadaNisa: string | null;
  micro_intrebare: string;
  pitch: string;
  confirmare: string;
}

/** Semnalele de audit (cheile din lib/stadii.ts SEMNALE_AUDIT), optionale. */
export type SemnaleAuditPartial = Partial<Record<string, boolean>>;

/**
 * Dovada de nisa — singurele doua case study-uri reale documentate
 * (memory/business.md, sectiunea ICP). Nu se inventeaza altele: fara dovada
 * in nisa, linia se omite, nu se completeaza generic.
 */
function dovadaDinNisa(nisa?: string): string | null {
  if (!nisa) return null;
  const n = nisa.toLowerCase();
  if (/auto|service|dealer|piese|vulcaniz/i.test(n)) {
    return "Am mai livrat recent pentru un dealer auto din zonă — știu exact ce contează la o firmă din nișa asta.";
  }
  if (/confec|metal|utilaj|industria|ambalaj|tamplarie|componente/i.test(n)) {
    return "Am mai livrat recent pentru un producător industrial din zonă (utilaje grele) — nu vin dintr-o nișă complet străină.";
  }
  return null;
}

/**
 * Observatii concrete pe baza semnalelor REALE de audit (nu doar are_website).
 * Ordinea e ordinea din SEMNALE_AUDIT (lib/stadii.ts) — cele mai puternice
 * semnale de durere primele. Returneaza max 2, ca la telefon: prea multe
 * probleme deodata paralizeaza, nu conving.
 */
function observatiiDinAuditSemnale(
  audit: SemnaleAuditPartial | undefined,
  s: SemnaleLead
): string[] {
  const out: string[] = [];
  if (!audit) return out;

  if (audit.fara_site) {
    out.push(
      s.reviews > 50
        ? `nu am găsit un site al firmei, deși aveți ${s.reviews} recenzii pe Google — aveți clienți, dar cine vă caută acum pe internet nu are unde ajunge`
        : `nu am găsit un site al firmei — când cineva caută ${s.nisa?.toLowerCase() ?? "serviciul"} în zonă, apar concurenții, dumneavoastră nu apăreți deloc`
    );
  }
  if (audit.design_vechi && out.length < 2) {
    out.push("site-ul arată vizibil vechi — genul de design pe care Google îl arată tot mai jos cu timpul");
  }
  if (audit.fara_cta && out.length < 2) {
    out.push("pe site nu am găsit niciun formular de contact, doar un telefon — dacă cineva vă caută seara, n-are cum să vă lase un mesaj");
  }
  if (audit.pagespeed_sub_50 && out.length < 2) {
    out.push("site-ul se încarcă foarte greu pe telefon — Google penalizează asta, iar 6 din 10 oameni închid înainte să apuce să vadă ce oferiți");
  }
  if (audit.fara_gbp && out.length < 2) {
    out.push(`aveți doar ${s.reviews} recenzii pe Google — la căutare locală ăsta e tot meciul, cine are 100+ apare deasupra indiferent cât de bine lucrați`);
  }
  if (audit.nu_e_top10 && out.length < 2) {
    out.push(`nu apăreți în primele rezultate pe "${s.nisa?.toLowerCase() ?? "serviciul dvs"} + orașul" — apar doar concurenții`);
  }
  return out;
}

/**
 * Deschiderea e identica la fiecare apel si nu se improvizeaza.
 * „Vă prind într-un moment nepotrivit” dă control celuilalt și primește
 * „nu, spuneți” în ~70% din cazuri; „aveți 2 minute?” primește „nu”.
 */
const DESCHIDERE =
  '„Bună ziua, domnul/doamna [Nume]?” — pauză, aștepți confirmarea — „Sunt Șerban de la Nova Visio Tech, din Sibiu. Vă prind într-un moment nepotrivit?”';

/** Nu vinzi site la telefon. Vinzi auditul video de 3 minute. */
const CTA_AUDIT =
  '„Uite ce vă propun, fără nicio obligație: îmi iau 15 minute și înregistrez un video de 3 minute în care vă arăt pe ecran exact ce vede un client când intră pe site-ul dumneavoastră, ce se pierde și ce ar schimba cel mai mult. Vi-l trimit pe WhatsApp, îl vedeți când aveți timp. Dacă vi se pare util, vorbim. Dacă nu, l-ați văzut gratis și tot ați aflat ceva. Vă trimit pe numărul ăsta de WhatsApp?”';

const MICRO_INTREBARE =
  '„Vă întreb un lucru: din clienții care vin la dumneavoastră acum, cam câți vin de pe internet și câți din recomandări?” — ascultă până termină, nu completa tu.';

const CONFIRMARE =
  '„Perfect. Îl aveți până mâine la ora [oră concretă]. Vă scriu când l-am trimis. Îmi spuneți numele complet, ca să vi-l personalizez?”';

export function genereazaBrief(
  s: SemnaleLead & { nisa?: string },
  auditSemnale?: SemnaleAuditPartial
): BriefApel {
  const cuvinte: string[] = [];
  let observatii: string[] = [];

  // Prioritate 1: semnale REALE de audit (verificate, nu presupuse) — daca
  // exista, ele bat orice presupunere facuta doar din areWebsite/rating.
  observatii = observatiiDinAuditSemnale(auditSemnale, s);
  if (auditSemnale?.fara_site) cuvinte.push("Fara website");
  if (auditSemnale?.design_vechi) cuvinte.push("Design vechi");
  if (auditSemnale?.fara_cta) cuvinte.push("Fara CTA");
  if (auditSemnale?.pagespeed_sub_50) cuvinte.push("Site lent");
  if (auditSemnale?.fara_gbp) cuvinte.push("Putine recenzii");
  if (auditSemnale?.nu_e_top10) cuvinte.push("Nu e in top 10");

  // Fallback: fara audit real, foloseste semnalele de baza (Google Places) —
  // acelasi comportament ca inainte, pentru leaduri nescanate inca.
  if (observatii.length === 0) {
    if (!s.areWebsite) {
      cuvinte.push("Fara website");
      observatii.push(
        s.reviews > 50
          ? `nu am găsit un site al firmei, deși aveți ${s.reviews} recenzii pe Google. Practic aveți clienți mulțumiți, dar cine vă caută acum pe internet nu are unde să ajungă`
          : `nu am găsit un site al firmei. Când cineva caută ${s.nisa?.toLowerCase() ?? "serviciul"} în zonă, apar concurenții, iar dumneavoastră nu apăreți deloc`
      );
    } else if (s.scorViteza != null && s.scorViteza < 50) {
      cuvinte.push("Site lent", "PageSpeed " + s.scorViteza);
      observatii.push(`pe telefon se încarcă foarte greu — am măsurat ${s.scorViteza} din 100. Google penalizează peste 3 secunde, iar 6 din 10 oameni închid înainte să apuce să vadă ce oferiți`);
    } else if (s.reviews < 10) {
      cuvinte.push("Putine recenzii", "SEO local");
      observatii.push(`aveți doar ${s.reviews} recenzii pe Google. La căutare locală ăsta e tot meciul — cine are 100+ apare deasupra dumneavoastră indiferent cât de bine lucrați`);
    } else if (s.rating > 0 && s.rating < 4.0) {
      cuvinte.push("Rating slab", "Reputatie");
      observatii.push(`aveți ${s.rating} stele pe Google. Mulți oameni filtrează după stele înainte să sune, deci pierdeți clienți înainte să apucați să vorbiți cu ei`);
    } else if (s.reviews > 200) {
      cuvinte.push("Brand cunoscut", "Scalare");
      observatii.push(`aveți ${s.reviews} recenzii, sunteți clar un nume în zonă. Tocmai de asta m-a mirat ce am văzut pe site — nu lucrează pentru dumneavoastră pe cât ar putea`);
    } else {
      cuvinte.push("Verifica manual");
      observatii.push(`[SCRIE OBSERVAȚIA MANUAL — deschide site-ul și găsește un lucru concret. Fără ea nu suni.]`);
    }
  }

  const observatieText = observatii.join(". De asemenea, ") + ".";
  const dovadaNisa = dovadaDinNisa(s.nisa);

  return {
    cuvinte_cheie: cuvinte,
    deschidere: DESCHIDERE,
    observatie: `„Vă sun direct la obiect. M-am uitat înainte să vă sun pe site-ul firmei și am observat că...” „...${observatieText}”`,
    observatii,
    dovadaNisa,
    micro_intrebare: MICRO_INTREBARE,
    pitch: CTA_AUDIT,
    confirmare: CONFIRMARE,
  };
}

export interface NevoiMarketing {
  ads: "Ideal" | "Potential" | "Nu inca";
  adsMotiv: string;
  seo: "Urgent" | "Recomandat" | "N/A";
  seoMotiv: string;
}

export function nevoiMarketing(s: SemnaleLead): NevoiMarketing {
  let ads: NevoiMarketing["ads"];
  let adsMotiv: string;

  if (!s.areWebsite) {
    ads = "Nu inca";
    adsMotiv = "Necesita website inainte de ads";
  } else if (s.reviews > 50 && s.rating >= 4.0) {
    ads = "Ideal";
    adsMotiv = "Afacere activa cu reputatie buna — ads aduc ROI rapid";
  } else if (s.rating > 0 && s.rating < 4.0) {
    ads = "Nu inca";
    adsMotiv = "Rating slab — rezolva reputatia inainte de ads";
  } else {
    ads = "Potential";
    adsMotiv = "Are website — poate scala cu Google Ads";
  }

  let seo: NevoiMarketing["seo"];
  let seoMotiv: string;

  if (!s.areWebsite) {
    seo = "N/A";
    seoMotiv = "Nu are website";
  } else if (s.scorViteza != null && s.scorViteza < 30) {
    seo = "Urgent";
    seoMotiv = `Site extrem de lent (${s.scorViteza}/100) — Google il penalizeaza`;
  } else if (s.scorViteza != null && s.scorViteza < 60) {
    seo = "Urgent";
    seoMotiv = `Viteza slaba (${s.scorViteza}/100) — afecteaza rankingul`;
  } else if (s.reviews < 30 && s.areWebsite) {
    seo = "Recomandat";
    seoMotiv = "Putine recenzii — SEO local ii poate creste vizibilitatea";
  } else {
    seo = "Recomandat";
    seoMotiv = "Are website — SEO poate aduce trafic organic constant";
  }

  return { ads, adsMotiv, seo, seoMotiv };
}
