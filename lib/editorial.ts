// Calendar editorial 3 august – 1 septembrie 2026.
//
// Rolul continutului nu e sa aduca lead-uri in luna 1. Rolul lui e sa faca
// cold call-ul sa functioneze: firma pe care o suni te cauta pe Facebook in
// timp ce vorbiti. Daca gaseste 30 de postari in care explici clar lucruri,
// apelul se transforma. Daca nu gaseste nimic, esti un necunoscut care vinde.

export type Format = "V" | "C" | "T" | "L" | "S";
export type Pilon = "P1" | "P2" | "P3" | "P4" | "P5";

export const FORMATE: Record<Format, { nume: string; culoare: string }> = {
  V: { nume: "Clip vertical", culoare: "bg-blue-100 text-blue-700" },
  C: { nume: "Carusel", culoare: "bg-violet-100 text-violet-700" },
  T: { nume: "Postare text", culoare: "bg-slate-200 text-slate-700" },
  L: { nume: "Video lung", culoare: "bg-amber-100 text-amber-700" },
  S: { nume: "Story / GBP", culoare: "bg-pink-100 text-pink-700" },
};

export const PILONI: Record<Pilon, { nume: string; rol: string; tinta: number; culoare: string }> = {
  P1: { nume: "Educație", rol: "Construiește încredere — cel mai mult conținut", tinta: 40, culoare: "bg-blue-500" },
  P2: { nume: "Dovadă", rol: "Convinge — before/after, cifre, case study", tinta: 25, culoare: "bg-emerald-500" },
  P3: { nume: "Contrarian", rol: "Cel mai bun reach — oprește scroll-ul", tinta: 15, culoare: "bg-red-500" },
  P4: { nume: "Uman", rol: "Construiește relația locală — subestimat masiv", tinta: 10, culoare: "bg-amber-500" },
  P5: { nume: "Ofertă", rol: "Convertește — maximum 2 pe lună", tinta: 10, culoare: "bg-violet-500" },
};

// ─── Cele 4 video-uri deja filmate ───────────────────────────────────────────

/** Din 1 video lung obtii ~11 piese. 4 video-uri = ~44 de piese = 30 de zile cu surplus. */
export const SPARGERE = [
  { piesa: "Clipuri verticale 20–60 sec (Reels / TikTok / Shorts)", cantitate: "6–8" },
  { piesa: "Carusele 5–7 slide-uri din ideile principale", cantitate: "2–3" },
  { piesa: "Postări text pure (Facebook / LinkedIn)", cantitate: "2–3" },
  { piesa: "Un articol de blog (transcriere + editare)", cantitate: "1" },
  { piesa: "Un newsletter / email", cantitate: "1" },
  { piesa: "Story-uri / poll-uri", cantitate: "3–4" },
];

export const FLUX_EXTRAGERE = [
  { pas: "Transcriere", detaliu: "Descript, Whisper local, sau CapCut — are transcriere în română decentă" },
  { pas: "Marchează momentele auto-suficiente", detaliu: "O idee completă în 20–60 secunde, care se înțelege fără context" },
  { pas: "Hook în primele 2 secunde", detaliu: "Aici se câștigă sau se pierde totul. Fără hook, restul clipului nu contează" },
  { pas: "Subtitrări arse, obligatoriu", detaliu: "85% se uită fără sunet" },
  { pas: "Format vertical 9:16", detaliu: "Safe zone sus și jos — nu pune text unde cade interfața" },
  { pas: "Un CTA la fiecare 3 clipuri", detaliu: "Nu la fiecare clip. Altfel nu te mai urmărește nimeni" },
];

// ─── Calendarul de 30 de zile ────────────────────────────────────────────────

export type ZiCalendar = {
  zi: number;
  data: string;
  ziSapt: string;
  format: Format;
  pilon: Pilon;
  titlu: string;
  sursa: "video" | "nou" | "muncă";
  nota?: string;
};

export const CALENDAR: ZiCalendar[] = [
  { zi: 1, data: "3 aug", ziSapt: "Lu", format: "T", pilon: "P4", sursa: "nou", titlu: "„Am o agenție web în Sibiu. Un an am așteptat să vină clienții. De azi public zilnic ce am învățat.”", nota: "Postarea de start. Declari public ce faci — te obligă să continui." },
  { zi: 2, data: "4 aug", ziSapt: "Ma", format: "V", pilon: "P3", sursa: "video", titlu: "„Site-ul tău arată bine. Și exact de asta nu vinde.”" },
  { zi: 3, data: "5 aug", ziSapt: "Mi", format: "C", pilon: "P1", sursa: "nou", titlu: "Testul de 5 secunde: ce trebuie să vadă un client imediat ce intră" },
  { zi: 4, data: "6 aug", ziSapt: "Jo", format: "V", pilon: "P1", sursa: "video", titlu: "„Cât se încarcă site-ul tău pe telefon? Uite cum verifici în 30 de secunde”" },
  { zi: 5, data: "7 aug", ziSapt: "Vi", format: "S", pilon: "P4", sursa: "nou", titlu: "Story: sesiunea de filmare / biroul / cum arată o zi" },
  { zi: 6, data: "8 aug", ziSapt: "Sâ", format: "V", pilon: "P1", sursa: "video", titlu: "„De ce nu apari în Google pe «[serviciu] Sibiu» — motivul numărul 1”" },
  { zi: 7, data: "9 aug", ziSapt: "Du", format: "T", pilon: "P3", sursa: "nou", titlu: "„Nu ai nevoie de un site nou. Ai nevoie de 3 lucruri pe cel actual.”" },
  { zi: 8, data: "10 aug", ziSapt: "Lu", format: "V", pilon: "P2", sursa: "nou", titlu: "Before / after: un site refăcut + ce s-a schimbat concret" },
  { zi: 9, data: "11 aug", ziSapt: "Ma", format: "C", pilon: "P1", sursa: "video", titlu: "Anatomia unei pagini de servicii care aduce clienți — 7 elemente" },
  { zi: 10, data: "12 aug", ziSapt: "Mi", format: "L", pilon: "P1", sursa: "video", titlu: "Video lung: „Cum arată un site care vinde — analiză completă, 8 minute”" },
  { zi: 11, data: "13 aug", ziSapt: "Jo", format: "V", pilon: "P3", sursa: "video", titlu: "„Dacă plătești reclame și trimiți lumea pe prima pagină, arunci banii.”" },
  { zi: 12, data: "14 aug", ziSapt: "Vi", format: "S", pilon: "P4", sursa: "nou", titlu: "Poll: „Ce te blochează cel mai mult — site, Google sau reclame?”", nota: "Răspunsurile îți dau subiecte de conținut pentru 2 săptămâni." },
  { zi: 13, data: "15 aug", ziSapt: "Sâ", format: "V", pilon: "P1", sursa: "video", titlu: "„Concurentul tău are 180 de recenzii. Tu ai 4. Restul e ușor de ghicit.”" },
  { zi: 14, data: "16 aug", ziSapt: "Du", format: "T", pilon: "P5", sursa: "nou", titlu: "OFERTĂ: „Fac 5 audituri video gratuite săptămâna asta. Firme din Sibiu / Brașov. Scrie-mi «audit».”", nota: "Prima din cele două oferte directe ale lunii." },
  { zi: 15, data: "17 aug", ziSapt: "Lu", format: "V", pilon: "P2", sursa: "muncă", titlu: "Audit anonimizat: „Am analizat un site de [nișă]. Uite ce am găsit.”", nota: "Din auditurile pe care le faci oricum pentru vânzare. Un efort, două rezultate." },
  { zi: 16, data: "18 aug", ziSapt: "Ma", format: "C", pilon: "P1", sursa: "nou", titlu: "„Cât costă un site în România în 2026 — cifre reale, pe categorii”", nota: "Aici spui 790 / 1.290 / 1.690. Transparența pe preț te separă de toți ceilalți." },
  { zi: 17, data: "19 aug", ziSapt: "Mi", format: "V", pilon: "P4", sursa: "nou", titlu: "„Cea mai mare greșeală pe care am făcut-o cu un client. Și ce am schimbat.”" },
  { zi: 18, data: "20 aug", ziSapt: "Jo", format: "V", pilon: "P1", sursa: "video", titlu: "„3 setări Google Business Profile pe care 9 din 10 firme nu le-au atins”" },
  { zi: 19, data: "21 aug", ziSapt: "Vi", format: "S", pilon: "P4", sursa: "nou", titlu: "Behind the scenes: cum arată un proiect în lucru" },
  { zi: 20, data: "22 aug", ziSapt: "Sâ", format: "V", pilon: "P3", sursa: "video", titlu: "„SEO nu e mort. Doar că tu nu faci SEO — faci doar site.”" },
  { zi: 21, data: "23 aug", ziSapt: "Du", format: "T", pilon: "P2", sursa: "muncă", titlu: "Case study scris: problemă → ce am făcut → rezultat în cifre" },
  { zi: 22, data: "24 aug", ziSapt: "Lu", format: "V", pilon: "P1", sursa: "nou", titlu: "„Black Friday e pe 27 noiembrie. Dacă începi shop-ul în octombrie, ai pierdut.”", nota: "Aici începe unghiul cel mai profitabil al anului. Îl plantezi acum, îl culegi în septembrie." },
  { zi: 23, data: "25 aug", ziSapt: "Ma", format: "C", pilon: "P1", sursa: "nou", titlu: "„Checklist: e magazinul tău pregătit pentru Black Friday? 12 puncte”", nota: "Ăsta e și linkul din atingerea 6 a cadenței. Un articol, două întrebuințări." },
  { zi: 24, data: "26 aug", ziSapt: "Mi", format: "L", pilon: "P2", sursa: "nou", titlu: "Video lung: case study complet, de la prima discuție la rezultate" },
  { zi: 25, data: "27 aug", ziSapt: "Jo", format: "V", pilon: "P1", sursa: "video", titlu: "„Formularul de contact care pierde 40% din lead-uri (îl are aproape toată lumea)”" },
  { zi: 26, data: "28 aug", ziSapt: "Vi", format: "S", pilon: "P4", sursa: "nou", titlu: "Story: recap de săptămână / întrebări primite" },
  { zi: 27, data: "29 aug", ziSapt: "Sâ", format: "V", pilon: "P3", sursa: "video", titlu: "„Nu-ți trebuie mai mult trafic. Îți trebuie să nu-l mai pierzi.”" },
  { zi: 28, data: "30 aug", ziSapt: "Du", format: "T", pilon: "P1", sursa: "muncă", titlu: "„Am sunat 200 de firme luna asta. Iată ce mi-au spus despre site-urile lor.”", nota: "Conținut generat de muncă. Notează în timpul apelurilor — sunt cele mai bune postări pe care le vei scrie." },
  { zi: 29, data: "31 aug", ziSapt: "Lu", format: "V", pilon: "P2", sursa: "muncă", titlu: "Testimonial client — video sau screenshot cu voce peste" },
  { zi: 30, data: "1 sep", ziSapt: "Ma", format: "C", pilon: "P5", sursa: "nou", titlu: "OFERTĂ: „Deschid 4 locuri pentru proiecte în septembrie. Iată cum arată colaborarea.”", nota: "A doua și ultima ofertă directă. Septembrie e luna cea mai importantă din an." },
];

export const STATUSURI_ZI = ["de făcut", "filmat", "editat", "programat", "publicat"] as const;
export type StatusZi = (typeof STATUSURI_ZI)[number];

export const STATUS_UI: Record<StatusZi, string> = {
  "de făcut": "bg-slate-100 text-slate-500",
  "filmat": "bg-amber-100 text-amber-700",
  "editat": "bg-blue-100 text-blue-700",
  "programat": "bg-violet-100 text-violet-700",
  "publicat": "bg-emerald-100 text-emerald-700",
};

// ─── Ce funcționează ─────────────────────────────────────────────────────────

export const HOOKURI = [
  { text: "Site-ul tău arată bine. Și exact de asta nu vinde.", tip: "Contrazice o certitudine" },
  { text: "Am deschis 50 de site-uri de firme din Sibiu. 43 aveau aceeași problemă.", tip: "Cifră + specific local" },
  { text: "Dacă plătești reclame și trimiți lumea pe prima pagină, arunci banii.", tip: "Pierdere concretă" },
  { text: "Nu ai nevoie de site nou. Ai nevoie de asta.", tip: "Îi spui să NU cumpere — cel mai bun tip" },
  { text: "Cât costă un site? Îți spun cifre reale, nu «depinde».", tip: "Transparență pe preț" },
  { text: "Greșeala de 3.000 de lei pe care o face aproape orice firmă la primul site.", tip: "Cost al inacțiunii" },
  { text: "Un client m-a întrebat de ce site-ul lui nu apare în Google. I-am arătat asta.", tip: "Poveste cu demonstrație" },
  { text: "Concurentul tău are 180 de recenzii. Tu ai 4. Restul e ușor de ghicit.", tip: "Comparație incomodă" },
];

export const STRUCTURA_REEL = [
  { interval: "0–2 sec", ce: "Hook. O afirmație care contrazice ceva ce publicul crede. Fără intro, fără „bună, sunt...”" },
  { interval: "2–15 sec", ce: "Problema, formulată ca durere concretă a lui, nu ca temă generală" },
  { interval: "15–45 sec", ce: "Demonstrația. Arăți pe ecran, nu explici verbal. Un singur lucru, nu trei" },
  { interval: "45–60 sec", ce: "Concluzia într-o propoziție. CTA doar la fiecare al treilea clip" },
];

export const REGULI_PRODUCTIE = [
  "Filmezi o dată pe săptămână, vineri, 90 de minute → conținut pentru 2 săptămâni",
  "Aceeași lumină, aceeași poziție, telefon pe trepied — setup identic, ca să nu pierzi 15 minute de fiecare dată",
  "Subtitrări arse pe toate clipurile — 85% se uită fără sunet",
  "Programezi totul duminică, 30 de minute pentru toată săptămâna",
  "Răspunzi la fiecare comentariu în maximum 2 ore — comentariul e un lead",
  "O zi descoperită → repostezi cea mai bună postare de acum 3 săptămâni. Un gol e mai rău decât o repetare",
];

export const CANALE = [
  { canal: "Facebook (pagină + grupuri locale)", prioritate: "1", frecventa: "5–6/săpt", de_ce: "Aici e patronul de firmă din România, 40–60 ani. Publicul tău e literal aici" },
  { canal: "Instagram Reels", prioritate: "2", frecventa: "5–6/săpt", de_ce: "Reach organic bun, aceleași clipuri, zero efort suplimentar" },
  { canal: "Google Business Profile", prioritate: "3", frecventa: "2/săpt", de_ce: "SEO local direct + credibilitate când prospectul te caută după apel" },
  { canal: "TikTok", prioritate: "opțional", frecventa: "3–4/săpt", de_ce: "Reach mare, dar public mai tânăr și calitate de lead mai slabă" },
  { canal: "LinkedIn", prioritate: "opțional", frecventa: "2–3/săpt", de_ce: "Doar dacă ataci B2B / industrial" },
];

// ─── Analiza concurenței ─────────────────────────────────────────────────────

/**
 * Nu pot masura din CRM ce performeaza la concurenta — datele de engagement nu
 * sunt publice si nu se pot citi programatic. Ce urmeaza e protocolul de 30 de
 * minute prin care le afli singur, o data, si grila in care notezi.
 */
export const PROTOCOL_CONCURENTA = [
  { pas: "Alege 5 concurenți", detaliu: "3 agenții din Sibiu/Brașov + 2 naționale care vând același lucru. Nu mai mulți — nu ai ce face cu datele" },
  { pas: "Sortează postările după reacții", detaliu: "Pe pagina de Facebook, derulează 3 luni în urmă. Notează primele 5 postări cu cele mai multe reacții și comentarii" },
  { pas: "Notează formatul, nu subiectul", detaliu: "Reel? Carusel? Text lung? Screenshot? Formatul se copiază, subiectul nu" },
  { pas: "Meta Ads Library", detaliu: "facebook.com/ads/library — caută-i după nume. Vezi ce reclame rulează ACUM și de cât timp. O reclamă care rulează de 3+ luni funcționează, altfel ar fi oprit-o" },
  { pas: "Uită-te la primele 2 secunde ale reel-urilor lor", detaliu: "Ce spun în hook. Notează structura, nu cuvintele" },
  { pas: "Verifică ce NU fac", detaliu: "Aici e oportunitatea ta. Dacă niciunul nu arată prețuri, tu arăți. Dacă niciunul nu apare la cameră, tu apari" },
];

export type RandConcurenta = {
  id: string;
  camp: string;
  ajutor: string;
};

export const GRILA_CONCURENTA: RandConcurenta[] = [
  { id: "c_nume", camp: "Nume + link pagină", ajutor: "Facebook și Instagram" },
  { id: "c_format", camp: "Ce format domină la ei", ajutor: "Reel / carusel / text / foto proiect" },
  { id: "c_frecventa", camp: "Frecvență", ajutor: "Câte postări pe săptămână" },
  { id: "c_top", camp: "Top 3 postări după reacții", ajutor: "Ce aveau în comun" },
  { id: "c_hook", camp: "Cum arată hook-ul lor", ajutor: "Primele 2 secunde din reel-urile care au prins" },
  { id: "c_ads", camp: "Rulează reclame? De cât timp", ajutor: "Meta Ads Library. Peste 3 luni = funcționează" },
  { id: "c_pret", camp: "Arată prețuri?", ajutor: "Dacă nu, ăsta e diferențiatorul tău" },
  { id: "c_fata", camp: "Apare un om la cameră?", ajutor: "Dacă nu, ăsta e al doilea diferențiator" },
  { id: "c_lipsa", camp: "Ce NU fac deloc", ajutor: "Cea mai valoroasă linie din grilă" },
];
