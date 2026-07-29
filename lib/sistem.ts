// Sistemul de scalare Nova Visio Tech, 3 august – 31 decembrie 2026.
//
// Cifrele vin din NVT-Tracking-Aug-Dec-2026.xlsx (sheet MODEL AUG-DEC), dupa
// recalibrarea din 29.07.2026: podeaua de pret ridicata, valoare medie proiect
// 1.255 EUR. Nu sunt cifrele din documentul original — alea presupuneau 1.800.

export type ItemSistem = { id: string; text: string; nota?: string; termen?: string };
export type GrupSistem = { titlu: string; subtitlu?: string; items: ItemSistem[] };

// ─── Modelul financiar ───────────────────────────────────────────────────────

export const LUNI = ["Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export const MODEL: { linie: string; valori: (number | string)[]; total?: string; accent?: boolean }[] = [
  { linie: "Apeluri", valori: [500, 600, 900, 1000, 650], total: "3.650", accent: true },
  { linie: "Conversații cu decident", valori: [81, 97, 146, 162, 105], total: "591" },
  { linie: "Audituri video trimise", valori: [16, 19, 29, 32, 21], total: "118" },
  { linie: "Oferte trimise", valori: [5, 6, 9, 10, 7], total: "38" },
  { linie: "Clienți noi", valori: ["2,6", "3,9", "5,8", "6,1", "3,0"], total: "21", accent: true },
  { linie: "Încasat proiecte (EUR)", valori: ["1.632", "4.079", "6.087", "7.467", "5.710"], total: "24.975" },
  { linie: "MRR cumulat (EUR/lună)", valori: [0, "~490", "~1.500", "~2.900", "~4.375"], total: "4.375", accent: true },
];

export const REPERE = [
  { eticheta: "Valoare medie proiect", valoare: "1.255 EUR", nota: "după ridicarea podelei" },
  { eticheta: "MRR țintă 31 dec", valoare: "4.375 EUR/lună", nota: "intră în ianuarie fără să vinzi" },
  { eticheta: "Total încasat aug–dec", valoare: "~24.975 EUR", nota: "plus MRR-ul acumulat" },
  { eticheta: "Apeluri per client câștigat", valoare: "~330", nota: "scade la 180–220 după primele 300" },
];

// ─── Site — novavisiotech.ro ─────────────────────────────────────────────────

export const SITE: GrupSistem[] = [
  {
    titlu: "Oferta pe o pagină",
    subtitlu: "Fără asta nu poți trimite o propunere în aceeași zi cu apelul",
    items: [
      { id: "site_oferta_pagina", text: "Pagină cu cele 4 pachete + 3 retainere, cu prețuri scrise", termen: "3 aug" },
      { id: "site_propunere_3", text: "Template de propunere cu 3 opțiuni (Bun / Mai bun / Cel mai bun)", nota: "Generatorul din CRM produce deja textul — trebuie doar pus în format trimisibil", termen: "3 aug" },
      { id: "site_avans", text: "Regula de avans 50% scrisă în ofertă și în contract", nota: "Fără avans nu începi. Niciodată. Rezolvă 80% din problemele de cash-flow" },
    ],
  },
  {
    titlu: "Pagini care aduc căutări",
    subtitlu: "Ești agenție SEO — dacă nu apari tu, vânzarea e mult mai grea. Termen: 30 septembrie",
    items: [
      { id: "site_p_sibiu", text: "/agentie-web-sibiu" },
      { id: "site_p_shop", text: "/magazin-online-sibiu" },
      { id: "site_p_seo", text: "/seo-sibiu" },
      { id: "site_p_brasov", text: "/site-web-brasov" },
      { id: "site_p_stoma", text: "/site-web-stomatologie", nota: "Paginile de nișă convertesc mai bine decât orice altceva" },
      { id: "site_p_constr", text: "/site-firma-constructii" },
    ],
  },
  {
    titlu: "Dovadă",
    subtitlu: "Fără case study cu cifre vinzi doar preț. Cu ele poți dubla prețurile",
    items: [
      { id: "site_cs1", text: "2 case study documentate cu cifre reale", termen: "30 sep" },
      { id: "site_testimoniale", text: "Testimoniale video de la clienții existenți", nota: "2 minute, filmat pe telefonul lui, cu 4 întrebări ghidate" },
      { id: "site_portofoliu", text: "Portofoliu actualizat cu ultimele proiecte" },
    ],
  },
  {
    titlu: "Tehnic și SEO local",
    items: [
      { id: "site_gbp", text: "Google Business Profile complet, 15+ recenzii reale", termen: "30 sep" },
      { id: "site_schema", text: "Schema LocalBusiness + Organization pe site" },
      { id: "site_ga4", text: "GA4 + Search Console instalate și verificate" },
      { id: "site_blog", text: "2 articole pe blog în fiecare lună", nota: "Se pot recicla din video-urile lungi" },
    ],
  },
  {
    titlu: "Septembrie — Black Friday",
    subtitlu: "Cel mai profitabil unghi al anului. Se plantează în august",
    items: [
      { id: "site_bf_lp", text: "Landing page „Magazin online pregătit de Black Friday”", termen: "1 sep" },
      { id: "site_bf_deadline", text: "Ofertă cu termen limită: comandă până 30 septembrie" },
    ],
  },
];

// ─── Social ──────────────────────────────────────────────────────────────────

export const SOCIAL: GrupSistem[] = [
  {
    titlu: "Pornire",
    subtitlu: "Conținutul nu înlocuiește apelurile. Le multiplică rata de conversie",
    items: [
      { id: "soc_clasific", text: "Clasifică cele 4 video-uri pe piloni P1–P5", termen: "3 aug" },
      { id: "soc_12clipuri", text: "Primele 12 clipuri verticale editate", termen: "3 aug" },
      { id: "soc_prog1", text: "Prima săptămână programată în Meta Business Suite", termen: "3 aug" },
    ],
  },
  {
    titlu: "Ritmul săptămânal",
    subtitlu: "Nu filmezi zilnic. Un efort, două săptămâni de conținut",
    items: [
      { id: "soc_filmare", text: "Filmare vineri, 90 de minute → conținut pentru 2 săptămâni" },
      { id: "soc_programare", text: "Programare duminică, 30 de minute pentru toată săptămâna" },
      { id: "soc_facebook", text: "Facebook: 5–6 postări pe săptămână", nota: "Aici e patronul de firmă din România, 40–60 ani. Publicul tău e literal aici" },
      { id: "soc_ig", text: "Instagram Reels: 5–6 pe săptămână, aceleași clipuri" },
      { id: "soc_gbp", text: "Google Business Profile: 2 postări pe săptămână", nota: "SEO local direct + credibilitate când trimiți auditul" },
      { id: "soc_comentarii", text: "Răspuns la fiecare comentariu în maximum 2 ore", nota: "Comentariul e un lead" },
    ],
  },
  {
    titlu: "Distribuția pe piloni",
    subtitlu: "Doar 2 postări din 30 sunt ofertă directă. Dacă vinzi în fiecare postare, nu te mai urmărește nimeni",
    items: [
      { id: "soc_p1", text: "P1 Educație / autoritate — 40%" },
      { id: "soc_p2", text: "P2 Dovadă (before/after, cifre) — 25%" },
      { id: "soc_p3", text: "P3 Contrarian, demontare mituri — 15%", nota: "Cel mai bun reach. „Nu ai nevoie de site nou” oprește scroll-ul" },
      { id: "soc_p4", text: "P4 Uman / behind the scenes — 10%", nota: "Subestimat masiv. Construiește relația locală" },
      { id: "soc_p5", text: "P5 Ofertă — 10%" },
    ],
  },
  {
    titlu: "Canale subestimate",
    items: [
      { id: "soc_grupuri", text: "Grupuri Facebook locale: antreprenori Sibiu, Brașov, anunțuri", nota: "Nu spamezi — răspunzi la întrebări. Cel mai ieftin canal de lead-uri calde" },
      { id: "soc_audit_continut", text: "Fiecare audit video devine conținut anonimizat", nota: "Cu permisiune. Un efort, două rezultate" },
      { id: "soc_apeluri_continut", text: "Notează în timpul apelurilor ce-ți spun oamenii", nota: "Sunt cele mai bune postări pe care le vei scrie vreodată" },
    ],
  },
  {
    titlu: "Septembrie",
    items: [
      { id: "soc_editor", text: "Editor video freelancer, 150–300 EUR/lună", nota: "Primul lucru pe care îl delegi. Îți eliberează 6–8 ore/lună pentru apeluri" },
    ],
  },
];

// ─── Scalare ─────────────────────────────────────────────────────────────────

export const SCALARE: GrupSistem[] = [
  {
    titlu: "Parteneriate de referral",
    subtitlu: "Cel mai ieftin lead, cel mai ignorat canal. Țintă: 8 parteneri până 30 septembrie",
    items: [
      { id: "sc_contabili", text: "Contabili și firme de contabilitate", nota: "Vorbesc lunar cu 50–200 de patroni. Cel mai bun partener posibil" },
      { id: "sc_tipografii", text: "Tipografii și firme de print / signalistică" },
      { id: "sc_it", text: "Firme de IT support / service" },
      { id: "sc_foto", text: "Fotografi și videografi de business" },
      { id: "sc_fonduri", text: "Firme de consultanță fonduri europene", nota: "Proiectele includ digitalizare cu buget deja aprobat" },
      { id: "sc_oferta_partener", text: "Ofertă scrisă de partener: 10% la încasarea integrală" },
    ],
  },
  {
    titlu: "Reactivare — banii cei mai rapizi",
    subtitlu: "Cel mai ieftin client e cel pe care îl ai deja",
    items: [
      { id: "sc_react_care", text: "Cine nu are CARE → i-l oferi", termen: "3 aug" },
      { id: "sc_react_redesign", text: "Cine are site vechi de 3+ ani → ofertă de redesign" },
      { id: "sc_react_growth", text: "Cine nu face SEO/Ads → audit gratuit + ofertă GROWTH" },
      { id: "sc_react_testim", text: "Cine e mulțumit → testimonial video + 2 recomandări" },
    ],
  },
  {
    titlu: "Angajări, în ordinea asta",
    subtitlu: "Angajezi întotdeauna mai întâi pentru cerere, apoi pentru livrare",
    items: [
      { id: "sc_h1", text: "1. Editor video freelancer — septembrie, 150–300 EUR/lună" },
      { id: "sc_h2", text: "2. SDR part-time — octombrie, 400–700 EUR + bonus per client", nota: "Bază mică + 10–15 EUR per audit acceptat + 50–100 EUR per client închis" },
      { id: "sc_h3", text: "3. Implementator web freelancer — noiembrie, 30–40% din valoarea proiectului" },
      { id: "sc_h4", text: "4. Specialist SEO/Ads — 2027, la 8+ retainere GROWTH" },
    ],
  },
  {
    titlu: "Regulile care te protejează",
    subtitlu: "Scrise în contract, spuse la vânzare",
    items: [
      { id: "sc_r1", text: "Avans 50%, fără excepții", nota: "Excepțiile devin regula în 2 luni" },
      { id: "sc_r2", text: "Maximum 2 runde de revizii. Runda 3+ = 60 EUR/oră" },
      { id: "sc_r3", text: "Clauză de blocare: conținut netrimis în 10 zile → deadline mutat", nota: "Cea mai frecventă cauză de întârziere e clientul, și tot pe tine te învinovățește dacă nu e scris" },
      { id: "sc_r4", text: "Un singur canal de comunicare per proiect" },
      { id: "sc_r5", text: "Scope fix. Orice cerere nouă = ofertă nouă" },
      { id: "sc_r6", text: "Găzduirea o controlezi tu, cu marjă", nota: "E MRR și îl ține pe client aproape" },
    ],
  },
  {
    titlu: "Decembrie — instrumentul de cash-flow",
    items: [
      { id: "sc_anual", text: "Ofertă de plată anuală anticipată: 12 luni la prețul a 10", nota: "Îți umple contul în decembrie și blochează clientul pe tot 2027" },
      { id: "sc_plan2027", text: "Discuție „Planul digital 2027” cu fiecare client existent" },
      { id: "sc_nurture", text: "Recuperezi tot NURTURE-ul din august–septembrie", nota: "Au trecut 3 luni, timing-ul s-a schimbat pentru mulți" },
    ],
  },
];

// ─── Greșelile care omoară scalarea ──────────────────────────────────────────

export const GRESELI = [
  { titlu: "Programezi CRM în loc să vinzi", text: "Cea mai confortabilă formă de amânare pentru cineva tehnic. Maximum 2 ore/săptămână de dezvoltare CRM, vineri, după apeluri." },
  { titlu: "Oprești apelurile când ai proiecte", text: "Livrezi 3 luni, pipeline-ul se golește, luna 4 e zero. Apelurile nu se opresc niciodată, nici în cea mai bună lună." },
  { titlu: "Nu ceri avans", text: "Ajungi să lucrezi pe credit pentru firme care te plătesc la 90 de zile." },
  { titlu: "Accepți scope creep", text: "„Doar mai adaugă o pagină” × 10 clienți = o lună de muncă neplătită." },
  { titlu: "Vinzi doar proiecte", text: "Fără MRR ești în vânătoare permanentă. La 21 de retainere ai baza care îți permite să spui „nu”." },
  { titlu: "Nu documentezi rezultatele", text: "Fără case study cu cifre vinzi doar preț." },
  { titlu: "Ataci 12 nișe simultan", text: "Diluează scriptul, conținutul, portofoliul, autoritatea. Maximum 3." },
  { titlu: "Renunți în săptămâna 3", text: "Ai făcut 300 de apeluri, ai 1 client, conținutul are 40 de vizualizări. Exact acolo începe să funcționeze pentru cei care nu se opresc." },
];

// ─── KPI săptămânali ─────────────────────────────────────────────────────────

export const KPI = [
  { kpi: "Apeluri efectuate", aug: "125", oct: "225" },
  { kpi: "Conversații cu decident", aug: "34", oct: "60" },
  { kpi: "Audituri video trimise", aug: "4", oct: "10" },
  { kpi: "Discuții de 20 min", aug: "1", oct: "4" },
  { kpi: "Oferte trimise", aug: "1–2", oct: "4" },
  { kpi: "Postări publicate", aug: "6", oct: "6" },
  { kpi: "Lead-uri noi în CRM", aug: "200", oct: "250" },
];

/** Regula de diagnostic — se verifică în ordinea asta, nu la întâmplare. */
export const DIAGNOSTIC = [
  "Am făcut numărul de apeluri? Dacă nu, asta e problema. Stop, nu căuta mai departe.",
  "Rata de contact sub 20%? Problema e lista sau ora la care suni.",
  "Rata de audit sub 15%? Problema e deschiderea sau observația nu e specifică.",
  "Rata de închidere sub 20%? Problema e prețul, oferta sau calificarea.",
  "Toate ratele bune dar venitul mic? Problema e valoarea medie. Ridici prețurile sau schimbi nișa.",
];
