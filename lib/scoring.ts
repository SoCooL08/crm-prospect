export interface SemnaleLead {
  areWebsite: boolean;
  rating: number;
  reviews: number;
  scorViteza?: number | null;
}

export function calculScor(s: SemnaleLead): number {
  let scor = 0;

  if (!s.areWebsite) scor += 50;
  if (s.rating > 0 && s.rating < 4.0) scor += 20;
  if (s.reviews > 100 && !s.areWebsite) scor += 15;

  if (s.areWebsite && s.scorViteza != null) {
    if (s.scorViteza < 30) scor += 40;
    else if (s.scorViteza < 50) scor += 25;
    else if (s.scorViteza < 70) scor += 10;
  }

  return Math.min(scor, 100);
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
