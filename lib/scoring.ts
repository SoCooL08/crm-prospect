// Logica de calificare a unui lead pentru cold calling.
// Scor mare = oportunitate mai buna pentru agentia de marketing.

export interface SemnaleLead {
  areWebsite: boolean;
  rating: number;
  reviews: number;
  scorViteza?: number | null; // PageSpeed 0-100, optional
}

export function calculScor(s: SemnaleLead): number {
  let scor = 0;

  // Fara website deloc = cea mai clara oportunitate (vinzi site)
  if (!s.areWebsite) scor += 50;

  // Rating slab = pot avea nevoie de reputatie / ads
  if (s.rating > 0 && s.rating < 4.0) scor += 20;

  // Multe recenzii dar fara site = afacere activa fara prezenta online
  if (s.reviews > 100 && !s.areWebsite) scor += 15;

  // Are site, dar e lent/slab (PageSpeed mic) = oportunitate redesign
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
