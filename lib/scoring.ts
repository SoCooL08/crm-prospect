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
  pitch: string;
}

export function genereazaBrief(
  s: SemnaleLead & { nisa?: string }
): BriefApel {
  const cuvinte: string[] = [];
  let deschidere = "";
  let pitch = "";

  if (!s.areWebsite) {
    cuvinte.push("Fara website");
    if (s.reviews > 50) {
      cuvinte.push("Afacere activa", "Clienti existenti");
      deschidere = `"Buna ziua, sun de la Nova Visio. Stiu ca aveti ${s.reviews} recenzii pe Google — sunteti activi, dar clientii noi nu va gasesc online."`;
      pitch = `Cu un site profesional, clientii care cauta ${s.nisa?.toLowerCase() ?? "servicii"} in zona va contacteaza direct. Pot sa va arat cum ar arata in 2 minute?`;
    } else {
      cuvinte.push("Prezenta online");
      deschidere = `"Buna ziua, sun de la Nova Visio. Am cautat ${s.nisa?.toLowerCase() ?? "afaceri"} in zona si nu am gasit site-ul vostru — vi s-a intamplat sa piardeti clienti din cauza asta?"`;
      pitch = "Un site simplu si rapid poate aduce cereri noi in fiecare saptamana, fara reclame platite.";
    }
  } else if (s.scorViteza != null && s.scorViteza < 50) {
    cuvinte.push("Site lent", "Redesign", "Optimizare");
    deschidere = `"Buna ziua, am testat site-ul vostru si se incarca greu — scor ${s.scorViteza}/100. Clientii inchid paginile lente inainte sa vada ce oferiti."`;
    pitch = "Putem optimiza site-ul astfel incat sa se incarce in sub 2 secunde si sa converteasca de 2x mai bine.";
  } else if (s.rating > 0 && s.rating < 4.0) {
    cuvinte.push("Rating slab", "Reputatie online", "Google Ads");
    deschidere = `"Buna ziua, sun de la Nova Visio. Ratingul de ${s.rating} pe Google va afecteaza direct — multi clienti filtreaza dupa stele inainte sa sune."`;
    pitch = "Avem un program de imbunatatire a reputatiei online — clientii nostri cu situatii similare au ajuns la 4.5+ in 3 luni.";
  } else if (s.reviews > 200) {
    cuvinte.push("Brand cunoscut", "Scalare", "Publicitate");
    deschidere = `"Buna ziua, sun de la Nova Visio. Aveti ${s.reviews} recenzii — sunteti un brand cunoscut in zona. Vreau sa va arat cum sa aduceti si mai multi clienti online."`;
    pitch = "Cu Google Ads si SEO targetat pe zona, puteti dubla numarul de cereri fara sa mariti echipa.";
  } else {
    cuvinte.push("Vizibilitate online", "Crestere", "Optimizare");
    deschidere = `"Buna ziua, sun de la Nova Visio. Lucram cu ${s.nisa?.toLowerCase() ?? "afaceri"} din zona si vreau sa va arat ce rezultate am obtinut pentru clientii nostri."`;
    pitch = "Facem un audit gratuit al prezentei voastre online si va spunem exact ce oportunitati pierdeti acum.";
  }

  return { cuvinte_cheie: cuvinte, deschidere, pitch };
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
