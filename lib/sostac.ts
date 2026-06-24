// ─── Types ────────────────────────────────────────────────────────────────────

export interface KeywordsAds {
  principale: string[];       // broad – volum mare
  cuIntentie: string[];       // phrase/exact – gata să cumpere
  longTail: string[];         // exact – conversii mari
  negative: string[];         // ce excludem
}

export interface AdMessage {
  titluri: string[];          // 3 titluri (max 30 char)
  descrieri: string[];        // 2 descrieri (max 90 char)
  cta: string;
}

export interface CampanieSugerata {
  tip: string;
  bugetZiMin: number;
  bugetZiMax: number;
  bidStrategy: string;
  extensii: string[];
  motiv: string;
}

export interface SOSTACData {
  situatie: string;
  obiective: string;
  strategie: string;
  tactici: {
    keywords: KeywordsAds;
    audienta: string;
    mesaje: AdMessage;
    campanie: CampanieSugerata;
  };
  actiuni: string;
  control: string;
}

// ─── Nișă detection ───────────────────────────────────────────────────────────

type NisaCategory =
  | "dental"
  | "medical"
  | "restaurant"
  | "hotel"
  | "constructii"
  | "auto"
  | "beauty"
  | "fitness"
  | "legal"
  | "imobiliare"
  | "florarie"
  | "optica"
  | "veterinar"
  | "educatie"
  | "generic";

function detectNisa(nisa?: string): NisaCategory {
  if (!nisa) return "generic";
  const n = nisa.toLowerCase();
  if (/stomat|dentist|dental|dinte|ortodont/.test(n)) return "dental";
  if (/clinic|medic|doctor|psiholog|kinetot|nutrit|fizioter/.test(n)) return "medical";
  if (/restaurant|cafenea|bar|pizz|bistro|fast.?food|catering|cofet|patiserie|brutarie/.test(n)) return "restaurant";
  if (/hotel|pensiune|cazare|vila|hostel|agroturism|motel/.test(n)) return "hotel";
  if (/construct|renovat|amenaj|instalat|electric|zugrav|tampl|pardos|placare|acoperis/.test(n)) return "constructii";
  if (/service.?auto|vulcani|vopsitor|detailing|dealer|auto|masini|moto/.test(n)) return "auto";
  if (/frizerie|coafura|salon|cosmet|masaj|spa|tatuaj|unghii|makeup/.test(n)) return "beauty";
  if (/fitness|sala|gym|yoga|pilates|kickbox|box|inot|aerobic/.test(n)) return "fitness";
  if (/avocat|notar|contabil|fiscal|juridic|consultant/.test(n)) return "legal";
  if (/imobiliar|agenti.?imob|chirii|vanzari.?cas|apartament/.test(n)) return "imobiliare";
  if (/florarie|flori|aranjament/.test(n)) return "florarie";
  if (/optic|ochelari/.test(n)) return "optica";
  if (/veterinar|cabinet.?vet|animale/.test(n)) return "veterinar";
  if (/gradinit|scoal|meditatii|after.?school|cursuri/.test(n)) return "educatie";
  return "generic";
}

// ─── Keyword templates ────────────────────────────────────────────────────────

const KEYWORDS: Record<NisaCategory, Omit<KeywordsAds, "principale" | "cuIntentie" | "longTail"> & {
  base: string[];
  intentie: string[];
  longTail: string[];
}> = {
  dental: {
    base: ["dentist", "cabinet stomatologic", "clinica dentara", "stomatologie"],
    intentie: ["dentist urgenta", "programare dentist", "extractie dinte", "albire dinti pret", "implant dentar", "aparat dentar"],
    longTail: ["cel mai bun dentist", "dentist fara durere", "fatete dentare pret", "reconstructie dentara", "tratament de canal", "detartraj"],
    negative: ["curs stomatologie", "facultate medicina dentara", "job dentist", "angajare cabinet", "material dentar"],
  },
  medical: {
    base: ["medic", "clinica medicala", "cabinet medical", "consultatii medicale"],
    intentie: ["programare medic", "consultatii cardiologie", "analize medicale", "ecografie pret", "medic specialist"],
    longTail: ["medic familie program", "cabinet ginecologie", "consultatii psiholog", "kinetoterapie recuperare", "nutritionist online"],
    negative: ["curs medicina", "facultate", "job medic", "material medical", "angajare clinica"],
  },
  restaurant: {
    base: ["restaurant", "meniu pranz", "masa"],
    intentie: ["rezervare restaurant", "restaurant cu terasa", "restaurant nunti", "catering botez", "livrare mancare"],
    longTail: ["restaurant romantic", "restaurant familie copii", "meniu zilei pret", "restaurant traditional", "restaurant gratar", "pensiune cu restaurant"],
    negative: ["retet", "cum se face", "ingrediente", "curs bucatar", "angajare bucatar", "job ospatar"],
  },
  hotel: {
    base: ["hotel", "cazare", "pensiune"],
    intentie: ["rezervare hotel", "cazare weekend", "hotel piscina", "pensiune mic dejun inclus", "cazare ieftina"],
    longTail: ["hotel nunta", "pensiune familie", "cazare 2 nopti", "hotel spa wellness", "cazare animale acceptate"],
    negative: ["review hotel", "tripadvisor", "booking.com comparare", "angajare hotel", "curs ospitalitate"],
  },
  constructii: {
    base: ["renovare", "constructii", "amenajare interioara"],
    intentie: ["deviz renovare", "renovare apartament pret", "constructie casa pret", "firma constructii", "amenajare baie"],
    longTail: ["renovare completa apartament", "rigips montaj pret", "gresie faianta montaj", "parchet laminat montaj", "zugraveala apartament pret", "instalatii sanitare"],
    negative: ["bricolaj", "cum sa renovez singur", "tutorial", "cursuri constructii", "angajare muncitor"],
  },
  auto: {
    base: ["service auto", "reparatii auto", "mecanica auto"],
    intentie: ["service auto urgent", "vulcanizare", "schimb ulei pret", "ITP", "reparatie motor"],
    longTail: ["service auto revizie", "diagnoza auto", "climatizare auto", "ambreiaj reparatie pret", "frane discuri"],
    negative: ["cursuri auto", "scoala soferi", "cumpar masina", "vand masina", "piese auto second hand"],
  },
  beauty: {
    base: ["salon frumusete", "coafura", "frizerie", "cosmetica"],
    intentie: ["programare frizerie", "salon unghii gel", "epilare definitiva pret", "masaj relaxare", "spa voucher"],
    longTail: ["tunsoare barbat", "coafura mireasa", "extensii gene pret", "tratament facial antiaging", "tatuaj microblading"],
    negative: ["curs cosmetica", "scoala coafura", "angajare salon", "produse cosmetice cumpar", "kit acasa"],
  },
  fitness: {
    base: ["sala fitness", "gym", "antrenament"],
    intentie: ["abonament sala fitness", "personal trainer", "yoga grup", "kickboxing incepatori", "piscina abonament"],
    longTail: ["sala fitness deschisa noaptea", "fitness femei", "antrenament slabit rapid", "pilates gravide", "recuperare accidentari sport"],
    negative: ["curs instructor fitness", "angajare trainer", "echipament fitness cumpar", "suplimente nutritive", "dieta online"],
  },
  legal: {
    base: ["avocat", "cabinet avocatura", "consultant juridic"],
    intentie: ["avocat divort", "avocat recuperare creante", "birou notarial", "contabil firma", "consultanta fiscala"],
    longTail: ["avocat drept penal", "infiintare firma rapid", "declaratii contabile", "avocat dreptul muncii", "executor judecatoresc"],
    negative: ["studii drept", "facultate juridica", "model contract gratuit", "consultanta gratuita", "curs avocat"],
  },
  imobiliare: {
    base: ["agentie imobiliara", "imobiliare", "vanzari apartamente"],
    intentie: ["cumpar apartament", "inchiriez apartament", "evaluat imobil", "vand casa rapid"],
    longTail: ["apartament 2 camere", "casa cu gradina", "spatiu comercial de inchiriat", "teren intravilan", "apartament nou direct dezvoltator"],
    negative: ["forum imobiliare", "cum sa cumpar singur", "cursuri agent imobiliar", "angajare agent"],
  },
  florarie: {
    base: ["florarie", "buchete flori", "aranjamente florale"],
    intentie: ["buchet flori livrare", "aranjament nunta", "flori eveniment", "coronita funerar", "flori aniversare"],
    longTail: ["buchet trandafiri", "aranjament masa nunta", "flori ziua mamei", "aranjamente botez", "livrat flori acasa"],
    negative: ["seminte flori", "cum ingrijesti flori", "curse floristica", "angajare florarie"],
  },
  optica: {
    base: ["optica medicala", "ochelari de vedere", "lentile contact"],
    intentie: ["consultatie oftalmologica", "ochelari progresivi pret", "lentile contact lunare", "control vedere"],
    longTail: ["ochelari de soare cu dioptrii", "ochelari copii", "lentile fotocromatice", "ochelari de calculator anti-reflectie"],
    negative: ["ochelari de soare moda", "ochelari sport", "angajare optica", "cursuri optica"],
  },
  veterinar: {
    base: ["veterinar", "cabinet veterinar", "clinica veterinara"],
    intentie: ["urgenta veterinara", "vaccinare caine", "castrat pisica pret", "consult veterinar pret"],
    longTail: ["veterinar noapte", "veterinar reptile", "tratament purici pisica", "ecografie animal", "veterinar la domiciliu"],
    negative: ["hrana animale", "cusca caine", "adopta caine", "angajare veterinar", "curs veterinar"],
  },
  educatie: {
    base: ["gradinita", "meditatii", "after school", "cursuri"],
    intentie: ["inscriere gradinita", "meditatii matematica", "after school program", "curs engleza copii"],
    longTail: ["gradinita privata pret", "meditatii bac", "after school program zilnic", "cursuri programare copii", "balet copii"],
    negative: ["gradinita de stat", "scoala publica", "angajare educator", "curs pedagogie", "bursa"],
  },
  generic: {
    base: ["servicii profesionale", "firma specializata"],
    intentie: ["oferta servicii", "pret servicii", "programare"],
    longTail: ["servicii de calitate", "recomandat", "cu experienta"],
    negative: ["cursuri", "angajare", "job", "gratuit"],
  },
};

function genereazaKeywords(nisa: string | undefined, oras: string, judet: string): KeywordsAds {
  const cat = detectNisa(nisa);
  const kw = KEYWORDS[cat];

  const locale = [oras.toLowerCase(), judet.toLowerCase()].filter(Boolean);

  const principale = kw.base.flatMap((b) => [
    b,
    ...locale.map((l) => `${b} ${l}`),
  ]);

  const cuIntentie = kw.intentie.flatMap((k) => [
    ...locale.map((l) => `${k} ${l}`),
    k,
  ]).slice(0, 12);

  const longTail = kw.longTail.flatMap((k) => [
    ...locale.slice(0, 1).map((l) => `${k} ${l}`),
    k,
  ]).slice(0, 12);

  return {
    principale: [...new Set(principale)].slice(0, 10),
    cuIntentie: [...new Set(cuIntentie)].slice(0, 10),
    longTail: [...new Set(longTail)].slice(0, 10),
    negative: kw.negative,
  };
}

// ─── Ad messages ──────────────────────────────────────────────────────────────

function genereazaMesaje(cat: NisaCategory, oras: string, nisa?: string): AdMessage {
  const nisaLabel = nisa ?? "servicii";

  const templates: Record<NisaCategory, AdMessage> = {
    dental: {
      titluri: [`Dentist ${oras} | Fara Durere`, "Programare Online Rapida", "Clinica Moderna | Preturi Corecte"],
      descrieri: [
        `Cabinet stomatologic cu experienta in ${oras}. Consultatii, tratamente si urgente. Rezerva acum!`,
        "Tehnologie de ultima generatie. Albire, implanturi, aparat dentar. Suna sau programeaza-te online.",
      ],
      cta: "Programeaza-te acum",
    },
    medical: {
      titluri: [`Medic Specialist ${oras}`, "Programare Rapida Online", "Clinica | Rezultate Garantate"],
      descrieri: [
        `Consultatii medicale in ${oras}. Specialisti cu experienta, investigatii moderne. Rezerva-ti locul!`,
        "Echipa medicala dedicata. Rezultate rapide, tratamente personalizate. Suna acum.",
      ],
      cta: "Rezerva consultatia",
    },
    restaurant: {
      titluri: [`Restaurant ${oras} | Meniu Variat`, "Rezerva Masa Online | Livrare", "Bucatarie Traditionala | ${oras}"],
      descrieri: [
        `Restaurant cu specific traditional in ${oras}. Meniu zilnic, evenimente, catering. Rezerva masa azi!`,
        "Ingrediente proaspete, retete autentice. Perfect pentru familie sau eveniment. Suna acum!",
      ],
      cta: "Rezerva masa acum",
    },
    hotel: {
      titluri: [`Cazare ${oras} | Pret Bun`, "Rezerva Direct | Mic Dejun Inclus", "Hotel Central ${oras}"],
      descrieri: [
        `Cazare confortabila in ${oras}. Camere moderne, mic dejun inclus, parcare gratuita. Rezerva acum!`,
        "Preturi speciale la rezervare directa. Locatie centrala, toate facilitatile. Verifica disponibilitatea.",
      ],
      cta: "Verifica disponibilitatea",
    },
    constructii: {
      titluri: [`Renovari ${oras} | Deviz Gratuit`, "Constructii & Amenajari | Rapid", "Echipa Serioasa | Garantie"],
      descrieri: [
        `Firma constructii si renovari in ${oras}. Deviz gratuit in 24h, materiale incluse. Suna acum!`,
        "Executie rapida si curata. Renovari complete apartamente si case. Preturi corecte, garantie lucrari.",
      ],
      cta: "Cere deviz gratuit",
    },
    auto: {
      titluri: [`Service Auto ${oras} | Rapid`, "Reparatii Auto | Pret Corect", "ITP + Revizie | ${oras}"],
      descrieri: [
        `Service auto autorizat in ${oras}. Reparatii rapide, piese originale, garantie. Programeaza-te azi!`,
        "Diagnoza computerizata, mecanici calificati. Toate marcile. Transparenta totala la preturi.",
      ],
      cta: "Programeaza revizia",
    },
    beauty: {
      titluri: [`Salon ${oras} | Programare Azi`, "Cosmetica & Coafura | Top", "Tratamente Premium | ${oras}"],
      descrieri: [
        `Salon de frumusete in ${oras}. Coafura, cosmetica, manichiura. Programare online sau telefonic!`,
        "Produse profesionale, specialiste cu experienta. Rezultate garantate. Rezerva locul tau acum.",
      ],
      cta: "Rezerva programarea",
    },
    fitness: {
      titluri: [`Sala Fitness ${oras} | Abonament`, "Antrenament Personal | Rezultate", "Gym ${oras} | Prima Sedinta Gratis"],
      descrieri: [
        `Sala fitness moderna in ${oras}. Echipamente noi, antrenori certificati. Prima sedinta gratuita!`,
        "Abonamente flexibile, program 6-22. Personal trainers disponibili. Incepe transformarea azi!",
      ],
      cta: "Incearca gratuit",
    },
    legal: {
      titluri: [`Avocat ${oras} | Consultatie`, "Cabinet Avocatura | Rapid", "Consultanta Juridica | Expert"],
      descrieri: [
        `Cabinet de avocatura in ${oras}. Consultatie initiala, solutii rapide si eficiente. Suna acum!`,
        "Experienta in drept civil, penal, comercial. Reprezentare competenta. Confidentialitate garantata.",
      ],
      cta: "Cere consultatie",
    },
    imobiliare: {
      titluri: [`Imobiliare ${oras} | Oferte Noi`, "Vanzari & Inchirieri | Rapid", "Agentie Imobiliara ${oras}"],
      descrieri: [
        `Agentie imobiliara in ${oras}. Sute de oferte actualizate zilnic. Gasim imobilul potrivit pentru tine!`,
        "Consultanta gratuita, tranzactii sigure. Apartamente, case, terenuri. Suna agentul tau acum.",
      ],
      cta: "Vezi ofertele",
    },
    florarie: {
      titluri: [`Florarie ${oras} | Livrare Azi`, "Buchete & Aranjamente | Premium", "Flori ${oras} | Comenzi Online"],
      descrieri: [
        `Florarie in ${oras} cu livrare rapida. Buchete romantice, aranjamente nunti, corporate. Comanda acum!`,
        "Flori proaspete zilnic. Aranjamente personalizate pentru orice eveniment. Livrare in aceeasi zi.",
      ],
      cta: "Comanda acum",
    },
    optica: {
      titluri: [`Optica ${oras} | Control Gratuit`, "Ochelari & Lentile | Pret Bun", "Cabinet Oftalmologic ${oras}"],
      descrieri: [
        `Optica medicala in ${oras}. Control vedere gratuit, ochelari la comanda rapida. Viziteaza-ne!`,
        "Cea mai mare gama de rame. Lentile progresive, fotocromatice, de contact. Pret corect, calitate top.",
      ],
      cta: "Programeaza controlul",
    },
    veterinar: {
      titluri: [`Veterinar ${oras} | Urgente 24/7`, "Cabinet Veterinar | Vaccinari", "Clinica Animale ${oras}"],
      descrieri: [
        `Cabinet veterinar in ${oras}. Consultatii, vaccinari, sterilizari. Urgente tratate rapid. Suna acum!`,
        "Medici veterinari cu experienta, echipamente moderne. Toate speciile. Programeaza-te online.",
      ],
      cta: "Programeaza acum",
    },
    educatie: {
      titluri: [`Meditatii ${oras} | Rezultate`, "Gradinita Privata ${oras}", "After School | Program Complet"],
      descrieri: [
        `Meditatii si cursuri in ${oras}. Profesori calificati, grupe mici, rezultate garantate. Inscrie-te!`,
        "Program dupa scoala, teme supravegheate, activitati extra. Locuri limitate. Rezerva locul acum.",
      ],
      cta: "Inscrie-te acum",
    },
    generic: {
      titluri: [`${nisaLabel} ${oras} | Profesional`, "Servicii de Calitate | Garantie", "Oferta Speciala | Suna Acum"],
      descrieri: [
        `Servicii profesionale de ${nisaLabel.toLowerCase()} in ${oras}. Calitate garantata, preturi corecte.`,
        "Echipa cu experienta, rezultate demonstrate. Suna acum pentru o oferta personalizata.",
      ],
      cta: "Suna acum",
    },
  };

  const t = templates[cat];
  // Replace ${oras} placeholder
  return {
    titluri: t.titluri.map((s) => s.replace("${oras}", oras).substring(0, 30)),
    descrieri: t.descrieri.map((s) => s.replace("${oras}", oras).substring(0, 90)),
    cta: t.cta,
  };
}

// ─── Campaign structure ───────────────────────────────────────────────────────

function genereazaCampanie(
  cat: NisaCategory,
  areWebsite: boolean,
  scorViteza: number | null | undefined,
  reviews: number
): CampanieSugerata {
  if (!areWebsite) {
    return {
      tip: "Google Ads — Cautare locala (dupa creare site)",
      bugetZiMin: 20,
      bugetZiMax: 50,
      bidStrategy: "Maximize Clicks (inceput) → Target CPA dupa 50 conversii",
      extensii: ["Extensie apel telefonic", "Extensie locatie (GMB)", "Extensie sitelinks", "Extensie structura (servicii)"],
      motiv: "Fara website, campania nu poate incepe. Prioritate: creare site optimizat, apoi Ads.",
    };
  }

  if (scorViteza != null && scorViteza < 50) {
    return {
      tip: "Google Ads — Cautare + Performance Max",
      bugetZiMin: 25,
      bugetZiMax: 60,
      bidStrategy: "Target CPA — optimizare dupa apeluri/formulare",
      extensii: ["Extensie apel (numarul de telefon)", "Extensie locatie", "Extensie sitelinks (3+)", "Snippets structurate"],
      motiv: `Site lent (${scorViteza}/100) — risc de pierdere a traficului platit. Recomandam redesign inainte de Ads.`,
    };
  }

  const bugetBase = reviews > 200 ? 60 : reviews > 50 ? 40 : 25;

  return {
    tip: reviews > 100 ? "Google Ads — Cautare + Display + Remarketing" : "Google Ads — Cautare locala",
    bugetZiMin: bugetBase,
    bugetZiMax: bugetBase * 2.5,
    bidStrategy: "Maximize Conversions → Target ROAS dupa 30 zile",
    extensii: [
      "Extensie apel (numar telefon)",
      "Extensie locatie (Google Business Profile)",
      "Extensie sitelinks (minim 4)",
      "Extensie promotie (oferta actuala)",
      ...(reviews > 50 ? ["Extensie evaluari Google (rating)"] : []),
    ],
    motiv:
      reviews > 100
        ? "Afacere activa cu reputatie buna — ideal pentru campanii cu remarketing si audienta similara."
        : "Potential solid pentru campanie de cautare locala cu conversii rapide.",
  };
}

// ─── Main SOSTAC generator ────────────────────────────────────────────────────

export interface LeadSOSTACInput {
  nume: string;
  nisa?: string;
  oras: string;
  judet: string;
  are_website: boolean;
  rating: number;
  nr_reviews: number;
  scor_viteza?: number | null;
  scor: number;
}

export function genereazaSOSTAC(lead: LeadSOSTACInput): SOSTACData {
  const cat = detectNisa(lead.nisa);
  const keywords = genereazaKeywords(lead.nisa, lead.oras, lead.judet);
  const mesaje = genereazaMesaje(cat, lead.oras, lead.nisa);
  const campanie = genereazaCampanie(cat, lead.are_website, lead.scor_viteza, lead.nr_reviews);

  const situatieProbleme: string[] = [];
  if (!lead.are_website) situatieProbleme.push("nu are prezenta online (fara website)");
  if (lead.scor_viteza != null && lead.scor_viteza < 50) situatieProbleme.push(`site-ul se incarca lent (scor ${lead.scor_viteza}/100)`);
  if (lead.rating > 0 && lead.rating < 4.0) situatieProbleme.push(`rating Google slab (${lead.rating}/5)`);
  if (lead.nr_reviews < 20) situatieProbleme.push(`putine recenzii (${lead.nr_reviews})`);

  const puncteFort: string[] = [];
  if (lead.are_website) puncteFort.push("are website");
  if (lead.rating >= 4.5) puncteFort.push(`rating excelent (${lead.rating}/5)`);
  if (lead.nr_reviews > 100) puncteFort.push(`reputatie solida (${lead.nr_reviews} recenzii)`);

  return {
    situatie: [
      `${lead.nume} este un business de tip "${lead.nisa ?? "servicii"}" din ${lead.oras}, ${lead.judet}.`,
      `Rating Google: ${lead.rating}/5 cu ${lead.nr_reviews} recenzii.`,
      puncteFort.length ? `Puncte forte: ${puncteFort.join(", ")}.` : "",
      situatieProbleme.length
        ? `Probleme identificate: ${situatieProbleme.join(", ")}.`
        : "Prezenta digitala acceptabila — oportunitate de crestere.",
      `Scor oportunitate Nova Visio: ${lead.scor}/100.`,
    ].filter(Boolean).join("\n"),

    obiective: [
      `1. Crestere trafic local organic cu 40% in primele 90 zile (SEO + Google Business)`,
      `2. Generare minim 20-30 cereri/luna noi prin Google Ads (cautari cu intentie de cumparare)`,
      `3. Imbunatatire rata de conversie site la minimum 3% din vizitatori`,
      `4. Pozitie top 3 in Google Maps pentru cuvintele cheie principale din ${lead.oras}`,
      lead.rating < 4.0 ? `5. Crestere rating Google de la ${lead.rating} la minim 4.3 in 90 zile` : "",
    ].filter(Boolean).join("\n"),

    strategie: [
      `Strategie "Local Dominance" pentru ${lead.nisa ?? "nisa"} in ${lead.oras}:`,
      ``,
      `• PULL (organic): SEO local + Google Business Profile optimizat → captam clientii care cauta activ serviciul`,
      `• PUSH (platit): Google Ads Search → targetam exact momentul intentiei de cumparare`,
      lead.nr_reviews > 50 ? `• RETENTIE: Remarketing catre vizitatori care nu au contactat — rata conversie +35%` : "",
      `• REPUTATIE: Generare recenzii pozitive sistematic → crestere organica pe termen lung`,
      ``,
      `Diferentiere fata de concurenta: viteza raspuns + dovada sociala (recenzii) + oferta clara pe site`,
    ].filter(Boolean).join("\n"),

    tactici: { keywords, audienta: genereazaAudienta(cat, lead.oras, lead.nr_reviews), mesaje, campanie },

    actiuni: [
      `LUNA 1 — Fundatie:`,
      `  Saptamana 1-2: ${lead.are_website ? "Audit site + optimizare tehnica" : "Creare site optimizat"} + setare Google Business Profile`,
      `  Saptamana 3-4: Setup campanie Google Ads + primele keyword sets activate`,
      ``,
      `LUNA 2 — Optimizare:`,
      `  • Analiza primele date campanie (CTR, CPC, conversii)`,
      `  • Ajustare biduri pe cuvinte cheie performante`,
      `  • Adaugare cuvinte negative noi bazate pe raport termeni de cautare`,
      `  • Publicare 4 postari Google Business + request recenzii clienti existenti`,
      ``,
      `LUNA 3 — Scalare:`,
      `  • Extindere campanie cu audiente similare${lead.nr_reviews > 50 ? " + Remarketing" : ""}`,
      `  • Testare 2-3 variante reclame (A/B)`,
      `  • Raport complet ROI + plan urmatoare 3 luni`,
    ].join("\n"),

    control: [
      `KPIs saptamanali:`,
      `  • CTR campanie Google Ads (target: >5%)`,
      `  • CPC mediu (benchmark nisa: ${cat === "dental" ? "3-6€" : cat === "constructii" ? "1-3€" : "0.5-2€"})`,
      `  • Numar apeluri generate (extensie apel)`,
      `  • Numar formulare completate`,
      ``,
      `KPIs lunari:`,
      `  • Cost per lead (CPL) — target: sub ${cat === "dental" || cat === "legal" ? "30€" : "15€"}`,
      `  • Pozitie medie Google Maps pentru top 3 cuvinte cheie`,
      `  • Numar recenzii noi Google Business`,
      `  • Trafic organic (Google Search Console)`,
      ``,
      `Raport lunar catre client: pozitii SEO, costuri Ads, conversii, recomandari urmatoarea luna`,
    ].join("\n"),
  };
}

function genereazaAudienta(cat: NisaCategory, oras: string, reviews: number): string {
  const templates: Partial<Record<NisaCategory, string>> = {
    dental: `Persoane 25-60 ani din ${oras} si imprejurimi (30km raza), care cauta activ servicii stomatologice. Excludem: studenti la medicina, furnizori materiale dentare.`,
    medical: `Persoane 30-65 ani din ${oras} si imprejurimi, cu intentie de programare medicala. Focus pe cautari cu urgenta ("programare rapida", "azi", "urgent").`,
    restaurant: `Persoane 22-55 ani din ${oras}, cautari de tip "masa azi/diseara/weekend". Includere audiente: vizitatori site + similare cu clientii existenti.`,
    hotel: `Persoane din toata Romania si tarile vecine care planifica cazare in ${oras}. Focus: cautari cu date specifice, "mic dejun inclus", "parcare". Sezonalitate ridicata.`,
    constructii: `Proprietari de locuinte 30-60 ani din ${oras} si ${oras.length > 3 ? "judet" : "zona"}, cu intentie de renovare. Excludem: firme constructii concurente, studenti arhitectura.`,
    beauty: `Femei 20-50 ani din ${oras}, cautari de tip "programare azi/maine". Audienta remarketing: vizitatori pagina servicii care n-au rezervat.`,
    auto: `Soferi 25-60 ani din ${oras}, cautari urgente legate de service sau intretinere periodica (revizie, ITP, iarna/vara).`,
    fitness: `Tineri 18-45 ani din ${oras}, interes fitness, sanatate, sport. Sezonalitate: ianuarie (rezolutii), mai-iunie (vara). Excludem: cautari echipamente.`,
    legal: `Persoane 30-65 ani cu nevoi juridice acute (divort, accidente, firme). Focus pe cautari cu urgenta si intentie clara. CPC ridicat — calificare stricta prin extensii.`,
  };

  return (
    templates[cat] ??
    `Persoane 25-55 ani din ${oras} si imprejurimi (20-40km raza), care cauta activ servicii specifice. ${
      reviews > 100
        ? "Audienta suficient de mare pentru remarketing — recomandam activare dupa 30 zile campanie."
        : "Audienta mica local — recomandam extindere la judet intreg pentru volum suficient."
    }`
  );
}
