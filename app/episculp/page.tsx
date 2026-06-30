"use client";

import { useState, useEffect } from "react";
import {
  Sparkles, Users, Phone, Euro, MapPin, Clock,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type CampaniaGoogle = {
  nume: string; tip: string; buget_zilnic: string; cpc_tinta: string;
  cuvinte_cheie: string[]; cuvinte_negative: string[]; titluri: string[];
  descrieri: string[]; extensii: string[]; landing_page: string; status: string; note: string;
};

type CampaniaMeta = {
  nume: string; obiectiv: string; buget: string; durata: string;
  audienta: string; varsta: string; interese: string[]; formate: string[];
  titlu_ad: string; text_ad: string; cta: string; tip_form: string; status: string; note: string;
};

type Material = {
  id: string; luna: string; tip: string; serviciu: string; descriere: string;
  status: "idee" | "productie" | "gata" | "publicat";
};

// ── Pre-filled campaign data ───────────────────────────────────────────────

const googleDefault: CampaniaGoogle = {
  nume: "Episculp — Epilare Definitivă Laser Sibiu",
  tip: "Search",
  buget_zilnic: "50",
  cpc_tinta: "10",
  cuvinte_cheie: [
    "epilare definitiva sibiu",
    "laser epilare sibiu",
    "epilare definitiva pret sibiu",
    "salon epilare laser sibiu",
    "epilare definitiva femei sibiu",
    "epilare definitiva barbati sibiu",
    "primelase sibiu",
    "epilare full body sibiu",
    "epilare definitiva selimbar",
    "tratamente estetice sibiu",
    "criolipoliza sibiu",
    "hydrafacial sibiu",
  ],
  cuvinte_negative: [
    "gratuit", "acasa", "aparat ipl", "cumpara aparat", "ipl acasa",
    "tutorial", "diy", "aparat de epilare", "Brasov", "Cluj", "Bucuresti",
  ],
  titluri: [
    "Epilare Definitivă Laser | Sibiu",
    "Primelase HR — Rezultate Permanente",
    "Episculp Beauty | Selimbar Sibiu",
    "Full Body 910 Lei | -30% Acum",
    "Consultație Inclusă | Rezervă Online",
    "Fără Durere, Fără Brici — Definitiv",
  ],
  descrieri: [
    "Epilare definitivă cu laser Primelase HR Excellence — singura clinică cu Hydrafacial Syndeo în Sibiu. Femei 6-8 ședințe, bărbați 8-10 ședințe. Consultație gratuită!",
    "Tehnologie FDA & CE certificată. Zero timp de recuperare. Program L-V 10:00-20:00. Str. Doamna Stanca 5F, Șelimbăr. Sună acum: 0758 620 996",
  ],
  extensii: [
    "Apel telefonic: 0758 620 996",
    "Locație: Str. Doamna Stanca 5F, Șelimbăr",
    "Epilare Full Body 910 lei",
    "Consultație gratuită inclusă",
    "Program L-V 10:00-20:00",
  ],
  landing_page: "pagina dedicata epilare definitiva cu galerie rezultate + formular rezervare + WhatsApp",
  status: "de setat",
  note: "1 singură campanie Google. CPC țintă 10 lei/click. Boost 250 lei / 7 zile analiză săptămânală. Prioritate: epilare definitivă Primelase.",
};

const metaDefaults: CampaniaMeta[] = [
  {
    nume: "Meta C1 — Lead Gen Epilare Definitivă",
    obiectiv: "Lead Generation",
    buget: "250 lei / 7 zile (boost săptămânal + analiză)",
    durata: "Rulare continuă, analiză și optimizare săptămânală",
    audienta: "Doamne 22-45 ani, Sibiu + Șelimbăr + împrejurimi (30km), angajate sau cu firme proprii",
    varsta: "22-45",
    interese: [
      "epilare", "beauty", "estetică", "spa & wellness",
      "îngrijire personală", "salon frumusețe",
      "business women", "fitness", "moda",
    ],
    formate: [
      "Reel 9:16 — înainte/după epilare",
      "Carusel zone corporale + preturi",
      "Story cu CTA WhatsApp Direct",
      "Video testimonial clientă mulțumită",
    ],
    titlu_ad: "Scapă definitiv de brici 🪒✨",
    text_ad: "Epilare definitivă cu laser Primelase HR Excellence în Sibiu. Rezultate permanente — femei 6-8 ședințe, bărbați 8-10 ședințe în 12 luni. Consultație gratuită inclusă!\n\n📍 Str. Doamna Stanca 5F, Șelimbăr\n📞 0758 620 996\n\nRezervă acum →",
    cta: "Trimite mesaj WhatsApp / Completează formularul",
    tip_form: "Meta Lead Form nativ + Typeform landing page",
    status: "de setat",
    note: "Reclame cu buton WhatsApp Direct. Formulare Meta native + Typeform. Retargeting cu oferte 0.3 lei per follow-up. Accent pe diferențiator: Primelase HR = cea mai modernă tehnologie.",
  },
  {
    nume: "Meta C2 — Brand Awareness + Boost Organic",
    obiectiv: "Reach / Engagement",
    buget: "150 lei / 7 zile boost posturi organice performante",
    durata: "Boost cele mai bune posturi organice — rotație lunară",
    audienta: "Lookalike din clienți existenți + interese beauty premium Sibiu. Femei 25-55 ani cu venit mediu-ridicat.",
    varsta: "25-55",
    interese: [
      "remodelare corporala", "criolipoliza", "hydrafacial",
      "tratamente faciale", "radiofrecventa", "rejuvenare faciala",
      "acnee tratament", "beauty premium",
    ],
    formate: [
      "Post educațional — Cum funcționează Hydrafacial Syndeo",
      "Reel Criolipolizã — înainte/după 4 săptămâni",
      "Story ofertă lunară cu countdown",
      "Carusel tehnologii Episculp (Primelase, Cooltech, Viora V10)",
    ],
    titlu_ad: "Episculp Sibiu — Estetică Non-Invazivă",
    text_ad: "Singura clinică din Sibiu cu Hydrafacial Syndeo. Criolipolizã, radiofrecvență, epilare laser — rezultate vizibile fără timp de recuperare. Vino pentru o consultație personalizată.",
    cta: "Află mai multe / Rezervă consultație",
    tip_form: "Trafic spre Instagram + WhatsApp + pagina servicii",
    status: "de setat",
    note: "Boost posturi organice cu cel mai mare engagement. Materiale beauty din nișă care funcționează. Clienți fideli — program fidelizare sezon. 3 materiale noi/lună.",
  },
];

const luniCalendar = [
  { luna: "Ianuarie", sezon: "Pauza", note: "Sezon slab — buget minim sau pauza. Menținere clienți fideli, trimitere ofertă Valentine's." },
  { luna: "Februarie", sezon: "Pauza", note: "Pauza sau buget minim. Pregătire campanie primăvară. Valentine's Day — ofertă pachet cuplu." },
  { luna: "Martie", sezon: "Activ", note: "Relansare campanii! Mesaj: 'Pregătește-te pentru vară — începe acum epilarea'. Sezon nou." },
  { luna: "Aprilie", sezon: "Activ", note: "Peak sezon. Buget maxim epilare definitivă. 'Vara vine — mai ai 6-8 ședințe de parcurs'." },
  { luna: "Mai", sezon: "Activ", note: "Cel mai bun moment — sezon de vârf. Push agresiv lead gen. Criolipolizã + remodelare corporală." },
  { luna: "Iunie", sezon: "Activ", note: "Vară — campanii running. Facial + corp. Analiză săptămânală boost. Clienți noi și fidelizare." },
  { luna: "Iulie", sezon: "Activ", note: "Vară plină. Target doamne cu firme (concediu mai târziu). Hydrafacial — ten după soare." },
  { luna: "August", sezon: "Pauza", note: "Concedii generalizate — pauza campanii sau buget minimal. Pregătire materiale septembrie." },
  { luna: "Septembrie", sezon: "Target special", note: "🎯 TARGET: Mămici revenite! Mesaj specific: 're-start corp post-vară, elimină vergeturile, epilare nouă serie'. Push puternic." },
  { luna: "Octombrie", sezon: "Activ", note: "Toamnă — remodelare corporală, facial anti-aging. Hydrafacial post-vară. Buget normal." },
  { luna: "Noiembrie", sezon: "Activ", note: "Pre-sărbători. Oferte pachet cadou (Gift vouchers). Facial + epilare zone mici = cadou." },
  { luna: "Decembrie", sezon: "Activ", note: "Sărbători — gift vouchers Episculp, oferte pachet. Crăciun = cadou de estetică." },
];

const sezonColor = (s: string) =>
  s === "Pauza" ? "bg-red-50 border-red-200 text-red-700" :
  s === "Target special" ? "bg-violet-50 border-violet-200 text-violet-700" :
  "bg-emerald-50 border-emerald-200 text-emerald-700";

const materialStatusColor = (s: string) => ({
  idee: "bg-slate-100 text-slate-600",
  productie: "bg-amber-100 text-amber-700",
  gata: "bg-blue-100 text-blue-700",
  publicat: "bg-emerald-100 text-emerald-700",
}[s] ?? "bg-slate-100 text-slate-600");

// ── Field components ───────────────────────────────────────────────────────

function F({ label, value, onChange, big }: {
  label: string; value: string; onChange?: (v: string) => void; big?: boolean;
}) {
  if (!onChange) {
    return (
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm text-slate-800">{value || "—"}</p>
      </div>
    );
  }
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</label>
      {big ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      )}
    </div>
  );
}

function TagsField({ label, tags, onChange }: { label: string; tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");
  function add() {
    if (input.trim()) { onChange([...tags, input.trim()]); setInput(""); }
  }
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t, i) => (
          <span key={i} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-0.5">
            {t}
            <button onClick={() => onChange(tags.filter((_, j) => j !== i))} className="text-blue-400 hover:text-red-500 ml-0.5">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Adaugă și Enter..."
          className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button onClick={add} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">+</button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

// ── SOSTAC + SMM data ─────────────────────────────────────────────────────

type SostacField = { titlu: string; continut: string };
type SMMPlatforma = { platforma: string; frecventa: string; formate: string[]; teme: string[]; note: string };

const sostacDefault: SostacField[] = [
  {
    titlu: "S — Situation (Situație actuală)",
    continut: `Episculp Beauty este o clinică de estetică non-invazivă în Șelimbăr, Sibiu (Str. Doamna Stanca 5F). Fondator: Loredana Voinea, cosmetician CIDESCO.

PIAȚA: Segmentul de estetică non-invazivă în Sibiu este în creștere. Cerere ridicată pentru epilare definitivă și tratamente corporale premium.

COMPETIȚIE: Shyning Body, Mikadis și saloane estetice generice din Sibiu. Episculp se diferențiază prin tehnologie superioară (Primelase HR, Hydrafacial Syndeo — unica în Sibiu) și abordare clinică.

DIGITAL ACTUAL: Prezență pe Instagram, Facebook, TikTok, YouTube. Site episculpt-beauty.ro funcțional cu prețuri și servicii. Fără campanii paid active (sau buget mic).

OPORTUNITATE: Puțini concurenți locali cu Hydrafacial Syndeo + campanii Google Search active → cost de achiziție lead potențial sub media națională.`,
  },
  {
    titlu: "O — Objectives (Obiective)",
    continut: `OBIECTIV PRINCIPAL (6 luni):
→ 80-90 leads/lună calificați pentru epilare definitivă
→ Rată conversie lead → client: >30%
→ Cost per lead țintă: <100 lei

OBIECTIVE SECUNDARE:
→ Brand awareness în Sibiu: top 3 rezultate Google pe "epilare definitiva sibiu"
→ Instagram: +500 urmăritori/lună organici
→ Fidelizare: 60% din clienți revin pentru al 2-lea serviciu (remodelare sau facial)
→ Recenzii Google: de la 4.x la 4.8+ stele

KPI LUNARI:
• Leads generate: 80-90
• CTR Google Ads: >5%
• Cost/click Google: ≤10 lei
• Engagement rate Instagram: >4%
• WhatsApp conversații: 30+ pe lună`,
  },
  {
    titlu: "S — Strategy (Strategie)",
    continut: `POZIȚIONARE: Clinică de estetică premium non-invazivă — nu un simplu salon. Mesaj: "Rezultate vizibile, progresive, fără promisiuni exagerate."

PILONI DE COMUNICARE:
1. EDUCAȚIE — Explică tehnologia (Primelase, Cooltech, Hydrafacial) — de ce e mai bună vs. concurență
2. SOCIAL PROOF — Rezultate reale (înainte/după), testimoniale video, recenzii
3. OFERTĂ — Reduceri sezoniere clare (30-40%), pachete, promoții limitate
4. DIFERENȚIERE — "Singurul Hydrafacial Syndeo din Sibiu" — repetat constant

FUNNEL:
Awareness (Meta Reach/IG organic) → Considerare (Retargeting ofertă) → Conversie (Google Search + WhatsApp Lead Form) → Fidelizare (Email/WhatsApp follow-up)

PLATFORME PRINCIPALE: Instagram (primar) + Facebook (lead gen) + Google Search (intent ridicat) + TikTok (awareness tineret)`,
  },
  {
    titlu: "T — Tactics (Tactici)",
    continut: `GOOGLE ADS:
• 1 campanie Search — "epilare definitiva sibiu" + variante
• CPC țintă: ≤10 lei | Buget zilnic: 50 lei
• Extensii: apel, locație, prețuri
• Landing page dedicat epilare definitivă cu formular + WhatsApp

META ADS:
• C1 Lead Gen — 250 lei/7 zile, formulare Meta + Typeform, buton WhatsApp
• C2 Brand Awareness — 150 lei/7 zile, boost posturi organice performante
• Retargeting vizitatori site la 0.3 lei per interacțiune (ofertă + follow-up)

ORGANIC SOCIAL:
• 3 materiale noi/lună (Reel, Story, Post Carusel)
• Posting: Instagram 4-5x/săptămână (Story zilnic)
• TikTok: 2x/săptămână educațional
• Răspuns DM în <2h (program L-V)

EMAIL/WHATSAPP:
• Secvență follow-up lead: mesaj zi 1, zi 3, zi 7
• Newsletter lunar clienți existenți cu oferta lunii
• Reminder ședință (cu 24h înainte)`,
  },
  {
    titlu: "A — Action (Plan de acțiune)",
    continut: `LUNA 1 (Iulie 2025) — SETUP:
□ Setare campanie Google Search (cuvinte cheie + anunțuri)
□ Creare Meta Business Manager + Pixel pe site
□ Setare campanie C1 Lead Gen Meta
□ Creare landing page epilare definitivă cu formular
□ Integrare WhatsApp Business API pe site
□ Producere 3 materiale: Reel epilare, Video Cooltech, Carusel Hydrafacial

LUNA 2-3 — OPTIMIZARE:
□ Analiză săptămânală CPC, CTR, cost/lead
□ A/B test texte anunțuri Google (minim 3 variante)
□ A/B test creative Meta (imagine vs. video)
□ Ajustare audience Meta pe baza datelor reale
□ Activare retargeting (vizitatori site + cei care au deschis formularul)

LUNA 4-6 — SCALARE:
□ Creștere buget campaniile cu ROI pozitiv
□ Adăugare campanie sezonală (toamnă — remodelare corporală)
□ Lansare program fidelizare (voucher la al 3-lea serviciu)
□ Campanie recenzii Google (email post-ședință)`,
  },
  {
    titlu: "C — Control (Monitorizare & KPI)",
    continut: `RAPORT SĂPTĂMÂNAL (în CRM):
• Leads generate (Google + Meta)
• Cost per lead pe platformă
• CTR și CPC Google Ads
• Reach + Engagement Meta
• Mesaje WhatsApp primite

RAPORT LUNAR:
• Total leads vs. target (80-90)
• Conversie lead → client vs. target (>30%)
• ROI campanii: venit generat / buget cheltuit
• Top performing creative (materialul cu cel mai mult engagement)
• Cuvinte cheie Google cu cel mai mic CPC

INSTRUMENTE:
• Google Ads Dashboard (zilnic)
• Meta Ads Manager (zilnic)
• Google Analytics 4 pe site (trafic + conversii)
• WhatsApp Business (mesaje + statistici)
• CRM Nova Visio (acest sistem — tracking leaduri)

DECIZIE OPTIMIZARE:
• CTR <2% Google → rescrie titlurile anunțurilor
• CPC >15 lei → redu licitația sau adaugă negative keywords
• Cost/lead >150 lei → testează alt format creativ Meta
• Conv. rate <20% → îmbunătățește landing page-ul`,
  },
];

const smmPlatforme: SMMPlatforma[] = [
  {
    platforma: "Instagram",
    frecventa: "4-5 posturi/săptămână + Story zilnic",
    formate: ["Reel 9:16 (rezultate înainte/după)", "Carusel educațional (tehnologii)", "Story cu poll/quiz", "Video testimonial clientă", "Story ofertă cu countdown"],
    teme: ["Epilare definitivă — journey 12 luni", "Hydrafacial Syndeo — 'Unica în Sibiu'", "Criolipolizã — cum funcționează Cooltech", "Rutina de skin care post-procedură", "Behind the scenes salon"],
    note: "Platforma principală. Focus pe Reels pentru reach organic. Story zilnic pentru engagement. Răspuns DM în max 2h.",
  },
  {
    platforma: "Facebook",
    frecventa: "3 posturi/săptămână + campanii paid",
    formate: ["Post cu link spre landing page", "Album foto rezultate", "Event promoții sezoniere", "Reel cross-postat din Instagram"],
    teme: ["Oferte și reduceri (30-40% la pachete)", "Testimoniale scrise + poze", "Programări rapide via Messenger", "Pachete cadou pentru sărbători"],
    note: "Primară pentru Lead Gen ads (Meta Ads Manager). Audiență 30-55 ani. Formular de rezervare direct pe Facebook.",
  },
  {
    platforma: "TikTok",
    frecventa: "2 videouri/săptămână",
    formate: ["Video educațional scurt 30-60s", "Transformare time-lapse", "FAQ epilare definitivă", "Day in the life salon"],
    teme: ["'Ce se întâmplă la epilare laser?' — demistificat", "'3 motive să alegi Primelase vs IPL'", "Procesul complet Hydrafacial", "Rezultate criolipolizã la 4 săptămâni"],
    note: "Awareness tineret 18-35 ani. Nu pentru lead gen direct — pentru vizibilitate și redirecționare spre Instagram/site.",
  },
  {
    platforma: "Google Business",
    frecventa: "1-2 posturi/săptămână + recenzii",
    formate: ["Post ofertă lunară", "Post serviciu nou / actualizare", "Răspuns recenzii clienți"],
    teme: ["Oferta lunii (reducere actuală)", "Serviciu highlight (unul pe lună)", "Invitație recenzie post-ședință"],
    note: "CRITIC pentru SEO local. Răspunde la TOATE recenziile. Target: 4.8+ stele. Trimite link recenzie după fiecare ședință.",
  },
];

type Tab = "overview" | "google" | "meta1" | "meta2" | "calendar" | "materiale" | "concurenti" | "strategie" | "adlibrary" | "fisa" | "admin";

export default function EpisculpPage() {
  const [tab, setTab] = useState<Tab>("fisa");
  const [google, setGoogle] = useState<CampaniaGoogle>(googleDefault);
  const [meta, setMeta] = useState<CampaniaMeta[]>(metaDefaults);
  const [materiale, setMateriale] = useState<Material[]>([
    { id: "1", luna: "Iulie 2025", tip: "Reel", serviciu: "Epilare definitivă", descriere: "Înainte/după — clientă după 6 ședințe Primelase. Text overlay: 'Definitiv scăpată de brici'", status: "idee" },
    { id: "2", luna: "Iulie 2025", tip: "Video educațional", serviciu: "Criolipolizã", descriere: "Cum funcționează Cooltech — filmulețul dispozitivului pe corp. 'Fără bisturiu, fără recuperare'", status: "idee" },
    { id: "3", luna: "Iulie 2025", tip: "Post carusel", serviciu: "Hydrafacial", descriere: "Slide 1: Ce e Hydrafacial Syndeo. Slide 2-4: Pașii procedurii. Slide 5: Rezultat. 'Unica în Sibiu'", status: "idee" },
  ]);
  const [leaduri, setLeaduri] = useState({ total_luna: "", cost_per_lead: "", conversie: ">30", buget_cheltuit: "" });
  const [sostac, setSostac] = useState<SostacField[]>(sostacDefault);
  const [sostacOpen, setSostacOpen] = useState<number | null>(0);
  const [bugetTotal, setBugetTotal] = useState(9000);
  const [splits, setSplits] = useState([
    { canal: "Meta C1 — Lead Gen Epilare", key: "meta1", proc: 45, color: "bg-indigo-500", colorText: "text-indigo-700", border: "border-indigo-200" },
    { canal: "Meta C2 — Remodelare / Facial (sezon)", key: "meta2", proc: 30, color: "bg-violet-500", colorText: "text-violet-700", border: "border-violet-200" },
    { canal: "Retargeting", key: "retarget", proc: 25, color: "bg-pink-500", colorText: "text-pink-700", border: "border-pink-200" },
  ]);
  const [scenBudget, setScenBudget] = useState(5000);
  const [meetingAnswers, setMeetingAnswers] = useState<Record<string, string>>({});
  const [answerEditing, setAnswerEditing] = useState<Record<string, boolean>>({});
  const [planText, setPlanText] = useState("");
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState("");

  async function genereazaPlanFB() {
    setPlanLoading(true);
    setPlanError("");
    try {
      const res = await fetch("/api/episculp/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: meetingAnswers }),
      });
      const data = await res.json();
      if (!res.ok) setPlanError(data.error || "Eroare la generare");
      else setPlanText(data.plan || "");
    } catch (e) {
      setPlanError(e instanceof Error ? e.message : "Eroare de rețea");
    } finally {
      setPlanLoading(false);
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem("episculp_data_v2");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.google) setGoogle(d.google);
        if (d.meta) setMeta(d.meta);
        if (d.materiale) setMateriale(d.materiale);
        if (d.leaduri) setLeaduri(d.leaduri);
        if (d.bugetTotal) setBugetTotal(d.bugetTotal);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("episculp_data_v2", JSON.stringify({ google, meta, materiale, leaduri, bugetTotal, splits }));
  }, [google, meta, materiale, leaduri]);

  useEffect(() => {
    const s = localStorage.getItem("episculp_meeting_answers");
    if (s) { try { setMeetingAnswers(JSON.parse(s)); } catch {} }
    const p = localStorage.getItem("episculp_fb_plan");
    if (p) setPlanText(p);
  }, []);

  useEffect(() => {
    localStorage.setItem("episculp_meeting_answers", JSON.stringify(meetingAnswers));
  }, [meetingAnswers]);

  useEffect(() => {
    if (planText) localStorage.setItem("episculp_fb_plan", planText);
  }, [planText]);

  function updateMaterial(id: string, patch: Partial<Material>) {
    setMateriale((prev) => prev.map((m) => m.id === id ? { ...m, ...patch } : m));
  }

  function addMaterial() {
    setMateriale((prev) => [...prev, {
      id: Date.now().toString(), luna: "", tip: "Reel", serviciu: "Epilare definitivă", descriere: "", status: "idee",
    }]);
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "fisa", label: "🗂️ Fișă Client" },
    { id: "overview", label: "📊 Overview" },
    { id: "calendar", label: "📅 Calendar" },
    { id: "concurenti", label: "⚔️ Concurenți" },
    { id: "admin", label: "⚙️ Admin / Config" },
  ];

  return (
    <div className="p-8 max-w-5xl">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0">E</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">Episculp Beauty</h1>
            <p className="text-slate-500 text-sm">Loredana Voinea (fondator) · Contact: Ionuț / Adi · Clinică estetică non-invazivă, Sibiu</p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Str. Doamna Stanca 5F, Șelimbăr, Sibiu</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> 0758 620 996</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> L-V 10:00–20:00</span>
              <a href="https://episculpt-beauty.ro" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-500 hover:underline">🌐 episculpt-beauty.ro</a>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <a href="tel:0758620996"
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
              <Phone className="w-4 h-4" /> Sună
            </a>
            <a href="https://wa.me/40758620996" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 flex-wrap">
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              tab === id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── FIȘĂ CLIENT (ÎNTREBĂRI PE PILONI) ────────────────────────────── */}
      {tab === "fisa" && (() => {
        const piloni = [
          {
            id: "P1", icon: "🎯", color: "border-blue-200", chip: "bg-blue-100 text-blue-700",
            titlu: "Pilon 1 — Profil & Obiective",
            scop: "Fundația fișei: unde vor să ajungă și ce capacitate au.",
            intrebari: [
              { q: "Care e obiectivul principal pe următoarele 6 luni?", h: "Clienți noi vs. fidelizare — schimbă toată strategia." },
              { q: "Câți clienți NOI puteți onora pe lună fără să scadă calitatea?", h: "Capacitatea reală — calibrăm volumul ca să nu sufocăm agenda." },
              { q: "Care serviciu vreți cel mai mult să-l creșteți acum?", h: "Aici punem accentul în campanii." },
              { q: "Care serviciu vă aduce cea mai mare marjă de profit?", h: "Promovăm ce aduce bani, nu doar ce se vinde." },
              { q: "Aveți goluri în agendă — zile sau ore mai slabe?", h: "Putem targeta oferte pe intervalele goale." },
            ],
          },
          {
            id: "P2", icon: "💰", color: "border-emerald-200", chip: "bg-emerald-100 text-emerald-700",
            titlu: "Pilon 2 — Buget & Valoare",
            scop: "Calibrăm bugetul de campanii și cât putem plăti pe un client.",
            intrebari: [
              { q: "Ce buget alocați lunar DOAR pe reclame?", h: "Creativele le faceți voi — bugetul ăsta merge integral pe difuzare." },
              { q: "Bugetul e flexibil dacă rezultatele sunt bune?", h: "Vedem dacă putem scala în luna 2-3." },
              { q: "Cât valorează în medie un client? (ex: epilare = 6-8 ședințe)", h: "LTV-ul decide cât putem plăti pe un lead." },
              { q: "Cât sunteți dispuși să plătiți ca să aduceți un client nou?", h: "Pragul de rentabilitate al campaniilor." },
            ],
          },
          {
            id: "P3", icon: "📊", color: "border-indigo-200", chip: "bg-indigo-100 text-indigo-700",
            titlu: "Pilon 3 — Reclame actuale & Cont",
            scop: "Inventarul a ce rulează acum, accesul și tracking-ul.",
            intrebari: [
              { q: "Ce reclame rulați acum și cu ce obiectiv?", h: "Din Ad Library: boost-uri spre Instagram — confirmăm." },
              { q: "Cine vă administrează contul de reclame?", h: "Cine decide și cui cerem acces." },
              { q: "Aveți acces la Meta Business Suite / Ads Manager?", h: "Necesar ca să putem lucra ca parteneri." },
              { q: "Pixel-ul instalat ce evenimente urmărește? (doar PageView sau și Lead?)", h: "Pixel-ul EXISTĂ — verificăm dacă măsoară conversii." },
              { q: "Ați testat formulare Lead native sau mesaje WhatsApp în reclame?", h: "Captarea lead-ului vs. trafic pierdut pe Instagram." },
              { q: "Aveți audiențe salvate, lookalike sau retargeting setate?", h: "Probabil nu — oportunitate imediată." },
              { q: "Ce a funcționat și ce a fost bani aruncați până acum?", h: "Învățăm din istoric, nu repetăm greșelile." },
            ],
          },
          {
            id: "P4", icon: "🎬", color: "border-pink-200", chip: "bg-pink-100 text-pink-700",
            titlu: "Pilon 4 — Creative & Materiale",
            scop: "Ce materiale produc ei și cât de repede pot livra concepte noi.",
            intrebari: [
              { q: "Ce tip de creative produceți acum? (video, foto, carusel)", h: "Din Ad Library: doar video — putem diversifica." },
              { q: "Aveți materiale înainte/după și testimoniale (cu acordul clienților)?", h: "Cel mai puternic social proof pentru reclame." },
              { q: "Cât de repede puteți filma un creativ nou la cerere?", h: "Ritmul de testare depinde direct de asta." },
              { q: "Cine se ocupă de producția materialelor la voi?", h: "Punctul de contact pentru concepte/creative." },
            ],
          },
          {
            id: "P5", icon: "📞", color: "border-rose-200", chip: "bg-rose-100 text-rose-700",
            titlu: "Pilon 5 — Vânzare & Follow-up",
            scop: "Verificăm unde se pierd lead-urile — procesul de conversie.",
            intrebari: [
              { q: "Când cineva întreabă, cine răspunde și în cât timp?", h: "Cel mai mare leak — răspuns sub 2h e ideal." },
              { q: "Din 10 care întreabă, câți se programează?", h: "Rata de conversie — poate problema nu e traficul." },
              { q: "Aveți follow-up dacă cineva nu răspunde imediat?", h: "Secvența zi 1/3/7 recuperează interesații." },
              { q: "Folosiți WhatsApp Business (răspunsuri rapide, catalog)?", h: "Tool gratuit, de obicei subutilizat." },
              { q: "Ce întrebări pun cel mai des înainte să se programeze?", h: "Aur pentru reclame — răspundem la obiecții din start." },
            ],
          },
          {
            id: "P6", icon: "⚔️", color: "border-amber-200", chip: "bg-amber-100 text-amber-700",
            titlu: "Pilon 6 — Poziționare & Concurență",
            scop: "Mesajul de diferențiere, în vocea lor.",
            intrebari: [
              { q: "Pe cine considerați principalii concurenți?", h: "Comparăm cu analiza noastră (7 clinici Sibiu)." },
              { q: "Știați că CooLaser e la ~50m de voi, cu full body la 350 lei?", h: "Vecinul direct — detalii în tab Concurenți." },
              { q: "De ce ar alege cineva Episculp în locul altora? (în cuvintele voastre)", h: "Mesajul autentic de poziționare pentru reclame." },
              { q: "Aveți o ofertă sau promoție pe care o putem promova acum?", h: "Reclamele au nevoie de un cârlig clar." },
            ],
          },
        ];
        const allQ = piloni.flatMap((p) => p.intrebari.map((i) => i.q));
        const answered = allQ.filter((q) => meetingAnswers[q] && meetingAnswers[q].trim()).length;
        return (
          <div className="space-y-5">

            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
              <p className="text-emerald-200 text-xs uppercase tracking-wide font-semibold mb-1">Întâlnire client · Episculp Beauty</p>
              <h2 className="text-2xl font-bold mb-2">Fișa Clientului — Întrebări pe piloni</h2>
              <p className="text-emerald-100 text-sm">Pune întrebările pe rând, scrie răspunsul clientului și salvează. Fiecare pilon completează o secțiune din fișă. Răspunsurile alimentează generatorul de plan din tab-ul Admin.</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-sm font-semibold">
                ✅ {answered} / {allQ.length} întrebări completate
              </div>
            </div>

            {/* Piloni */}
            {piloni.map((p) => (
              <div key={p.id} className={`bg-white border ${p.color} rounded-2xl p-6 shadow-sm`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{p.icon}</span>
                  <h3 className="font-bold text-slate-800">{p.titlu}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-auto ${p.chip}`}>Fișă client</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">{p.scop}</p>
                <div className="space-y-3">
                  {p.intrebari.map(({ q, h }) => {
                    const hasAns = !!(meetingAnswers[q] && meetingAnswers[q].trim());
                    const isEditing = answerEditing[q] ?? !hasAns;
                    return (
                      <div key={q} className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/60">
                        <p className="text-sm font-semibold text-slate-800">{q}</p>
                        <p className="text-xs text-slate-400 mb-2">{h}</p>
                        {isEditing ? (
                          <div>
                            <textarea
                              value={meetingAnswers[q] ?? ""}
                              onChange={(e) => setMeetingAnswers((pr) => ({ ...pr, [q]: e.target.value }))}
                              placeholder="✍️ Scrie aici răspunsul clientului..."
                              rows={2}
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none bg-white"
                            />
                            <button
                              onClick={() => setAnswerEditing((pr) => ({ ...pr, [q]: false }))}
                              disabled={!hasAns}
                              className="mt-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                              💾 Salvează
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                            <p className="text-sm text-slate-700 whitespace-pre-wrap flex-1">{meetingAnswers[q]}</p>
                            <button
                              onClick={() => setAnswerEditing((pr) => ({ ...pr, [q]: true }))}
                              className="text-xs font-medium text-emerald-700 hover:text-emerald-900 shrink-0 px-2 py-1 rounded-md hover:bg-emerald-100 transition-colors">
                              ✏️ Editează
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700">
              ✅ După ce completezi răspunsurile, mergi în tab-ul <strong>⚙️ Admin / Config</strong> și apasă „Generează plan FB Ads” — AI-ul construiește planul pe baza acestor răspunsuri.
            </div>

            <p className="text-xs text-slate-400 text-center">Fișă client · Episculp Beauty · Răspunsurile se salvează automat</p>
          </div>
        );
      })()}

      {/* ── ADMIN / CONFIGURAȚIE ─────────────────────────────────────────── */}
      {tab === "admin" && (
        <div className="space-y-5">

          {/* Header */}
          <div className="bg-slate-800 rounded-2xl p-6 text-white">
            <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold mb-1">Doar pentru tine · nu arăta clientului</p>
            <h2 className="text-2xl font-bold mb-1">⚙️ Admin / Configurație</h2>
            <p className="text-slate-300 text-sm">Generatorul de plan, notele tale de vânzare, calculatorul de buget și roadmap-ul. Tot ce ții pentru tine, într-un singur loc.</p>
          </div>

          {/* AI generator */}
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🤖</span>
              <h3 className="font-bold text-slate-800 text-lg">Generează cel mai bun plan de Facebook Ads</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Pe baza TUTUROR răspunsurilor din Fișa Client, AI-ul (Claude Opus) construiește un plan complet de campanii Meta — adaptat la capacitatea, bugetul și serviciile lor.</p>
            <button
              onClick={genereazaPlanFB}
              disabled={planLoading}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {planLoading ? "⏳ Se generează planul... (30-60s)" : planText ? "🔄 Regenerează planul" : "✨ Generează plan FB Ads"}
            </button>
            {planError && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">⚠️ {planError}</div>
            )}
            {planText && !planLoading && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Plan generat</p>
                  <button onClick={() => { navigator.clipboard.writeText(planText); }} className="text-xs text-blue-600 hover:text-blue-800">📋 Copiază</button>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">{planText}</div>
              </div>
            )}
          </div>

          {/* Mindset */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="font-bold text-slate-800 text-sm mb-2">🧠 Mentalitate la întâlnire</p>
            <div className="space-y-1 text-xs text-slate-600">
              <p>• <strong>Ascultă 70%, vorbește 30%.</strong> Întrebările sunt arma — lasă-l pe el să-ți spună problemele.</p>
              <p>• <strong>Vinde clienți, nu reclame.</strong> Nu insista pe CPM/CTR — pe „agenda plină” și „clienți noi”.</p>
              <p>• <strong>Capacitate înainte de volum.</strong> Nu promite lead-uri până nu știi câți poate duce.</p>
              <p>• <strong>Nu te bate pe preț cu CooLaser.</strong> Mută mereu pe rezultat, expertiză, cost total (nu preț/ședință).</p>
            </div>
          </div>

          {/* Red flags */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="font-bold text-slate-800 text-sm mb-3">🚩 Ce să asculți</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-bold text-rose-700 uppercase mb-1.5">Red flags</p>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="bg-rose-50 rounded-md p-2">„Vrem rezultate imediat” → Meta învață 1-2 săpt., epilarea e decizie cu gândire.</li>
                  <li className="bg-rose-50 rounded-md p-2">„Am încercat reclame, n-a mers” → întreabă CE: aproape sigur boost fără tracking.</li>
                  <li className="bg-rose-50 rounded-md p-2">„N-avem timp de mesaje” → fără răspuns rapid, orice buget e irosit.</li>
                  <li className="bg-rose-50 rounded-md p-2">„Vrem cel mai mic preț” → poziționează valoare, nu intra în război de preț.</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-700 uppercase mb-1.5">Semnale de cumpărare</p>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="bg-emerald-50 rounded-md p-2">„Agenda nu e plină” → nevoie clară, vinde umplerea golurilor.</li>
                  <li className="bg-emerald-50 rounded-md p-2">„Concurența ne ia clienți” → poziționează Observ 320 + CIDESCO.</li>
                  <li className="bg-emerald-50 rounded-md p-2">„Vrem să creștem” → deschis la buget, scalăm luna 2-3.</li>
                  <li className="bg-emerald-50 rounded-md p-2">Dau deja bani pe boost → banii există, doar prost cheltuiți.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Inchidere */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="font-bold text-slate-800 text-sm mb-3">🎯 Tehnică de închidere</p>
            <div className="space-y-2">
              {[
                { p: "1", t: "Rezumă durerea cu cuvintele LOR", d: "„Deci aveți goluri marțea-miercurea, lead-urile vin haotic și nimeni nu le urmărește. Corect?” Validează înainte de soluție." },
                { p: "2", t: "Propune un prim pas MIC", d: "O lună de test: o campanie de epilare + configurare tracking. „În 30 de zile vedem cifre reale.”" },
                { p: "3", t: "Next step concret cu DATĂ", d: "„Vă trimit propunerea până vineri, ne auzim luni la 14:00.” Pune-l în calendar pe loc." },
                { p: "4", t: "Cere accesele înainte să pleci", d: "Lista de mai jos — fără ele nu poți face audit real sau lansa." },
              ].map(({ p, t, d }) => (
                <div key={p} className="flex gap-2.5 text-xs">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">{p}</span>
                  <p className="text-slate-600"><strong className="text-slate-800">{t}.</strong> {d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Accese */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="font-bold text-slate-800 text-sm mb-3">🔑 Accese de cerut la final</p>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                "Meta Business Suite ca Partener (NU parola — prin Business Manager)",
                "Acces la pixel-ul existent + Events Manager",
                "Site episculpt-beauty.ro (pentru evenimente conversie + GA4)",
                "Editor pe pagina Facebook & Instagram",
                "Google Business Profile (SEO local + recenzii)",
                "Materiale: poze, video, înainte/după (cu acord clienți)",
                "Prețuri actualizate + oferta de promovat",
                "Logo, culori, font (branding)",
              ].map((item) => (
                <div key={item} className="bg-slate-50 border border-slate-100 rounded-md p-2 text-xs text-slate-600">☐ {item}</div>
              ))}
            </div>
            <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
              ⚠️ <strong>Niciodată nu cere parolele.</strong> Accesul se dă prin Business Manager / partener — mai sigur și mai profesionist.
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center">Admin · mai jos: calculator buget + roadmap 3 luni</p>
        </div>
      )}

      {/* ── BUGET & SCENARII ─────────────────────────────────────────────── */}
      {tab === "admin" && (() => {
        const TIERS = [
          {
            id: "low", min: 0, max: 1499, eticheta: "Sub prag", badge: "bg-rose-100 text-rose-700",
            titlu: "Buget prea mic pentru rezultate stabile",
            simultane: "Niciuna recomandată",
            obiectiv: "—",
            servicii: "—",
            cpl: [0, 0] as [number, number],
            splits: [{ nume: "Strânge la minim 1.500 lei/lună înainte de start", proc: 100, color: "bg-rose-400" }],
            nota: "Sub ~50 lei/zi, Meta nu are spațiu să optimizeze. Mai bine aștepți și pornești concentrat decât să arzi bugetul.",
          },
          {
            id: "A", min: 1500, max: 2999, eticheta: "Start minim", badge: "bg-amber-100 text-amber-700",
            titlu: "1 campanie, concentrată total",
            simultane: "1 campanie COLD",
            obiectiv: "Mesaje / WhatsApp (mai ieftin ca Lead Form la buget mic)",
            servicii: "Doar Epilare Definitivă (gap-ul din piață)",
            cpl: [70, 120] as [number, number],
            splits: [{ nume: "Campanie Cold — Epilare Definitivă", proc: 100, color: "bg-blue-500" }],
            nota: "Greu iese din faza de învățare → optimizezi pe eveniment ieftin (mesaje). Un singur mesaj, o singură ofertă, toate creative-ele pe ea.",
          },
          {
            id: "B", min: 3000, max: 5999, eticheta: "Optim pentru start serios", badge: "bg-emerald-100 text-emerald-700",
            titlu: "1 campanie cold + retargeting",
            simultane: "1 COLD + 1 retargeting",
            obiectiv: "Lead Gen (formular nativ) + WhatsApp pe retargeting",
            servicii: "Epilare Definitivă (cold) · oferta pe retargeting",
            cpl: [50, 90] as [number, number],
            splits: [
              { nume: "Campanie Cold — Epilare Definitivă", proc: 80, color: "bg-blue-500" },
              { nume: "Retargeting (vizitatori + interacțiuni)", proc: 20, color: "bg-violet-500" },
            ],
            nota: "Aici bugetul cold începe să învețe corect. Retargeting-ul NU concurează — e audiență caldă separată, ieftină. NU adăuga a 2-a campanie cold încă.",
          },
          {
            id: "C", min: 6000, max: 9999, eticheta: "Creștere", badge: "bg-indigo-100 text-indigo-700",
            titlu: "2 campanii cold (servicii + audiențe diferite) + retargeting",
            simultane: "2 COLD + retargeting",
            obiectiv: "Lead Gen pe ambele + WhatsApp retargeting",
            servicii: "Epilare (22-40 ani) + Remodelare (30-55, sezonier)",
            cpl: [40, 80] as [number, number],
            splits: [
              { nume: "Cold 1 — Epilare Definitivă", proc: 45, color: "bg-blue-500" },
              { nume: "Cold 2 — Remodelare Corporală", proc: 35, color: "bg-pink-500" },
              { nume: "Retargeting", proc: 20, color: "bg-violet-500" },
            ],
            nota: "Abia acum 2 campanii cold au sens — pe servicii ȘI audiențe diferite, ca să nu se suprapună. Fiecare are buget suficient să învețe.",
          },
          {
            id: "D", min: 10000, max: Infinity, eticheta: "Scalare", badge: "bg-slate-200 text-slate-700",
            titlu: "Structură completă: prospecting + lookalike + retargeting",
            simultane: "3+ campanii",
            obiectiv: "Mix complet de obiective, testare rapidă",
            servicii: "Toate serviciile + lookalike din clienți existenți",
            cpl: [35, 70] as [number, number],
            splits: [
              { nume: "Prospecting (cold) — serviciul principal", proc: 40, color: "bg-blue-500" },
              { nume: "Lookalike din clienți existenți", proc: 25, color: "bg-cyan-500" },
              { nume: "Retargeting", proc: 20, color: "bg-violet-500" },
              { nume: "Testare creative noi", proc: 15, color: "bg-amber-500" },
            ],
            nota: "Sistem complet. Poți testa constant creative noi fără să strici campaniile care merg. Aici se scalează cu cap.",
          },
        ];

        const mediaBudget = scenBudget;
        const daily = Math.round(mediaBudget / 30.4);
        const tier = TIERS.find((t) => mediaBudget >= t.min && mediaBudget <= t.max) ?? TIERS[0];
        const leadBudget = tier.id === "D" ? Math.round(mediaBudget * 0.85) : mediaBudget;
        const leadsLow = tier.cpl[1] ? Math.round(leadBudget / tier.cpl[1]) : 0;
        const leadsHigh = tier.cpl[0] ? Math.round(leadBudget / tier.cpl[0]) : 0;

        return (
          <div className="space-y-5">

            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold mb-1">Calculator Buget & Scenarii — Doar Meta/Facebook</h2>
              <p className="text-emerald-100 text-sm">Introdu bugetul → îți spune câte campanii poți rula simultan și cu ce structură. Regula de bază: la buget mic <strong>concentrezi</strong>, nu fragmentezi.</p>
            </div>

            {/* Calculator */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">💰 Bugetul lor de reclame</h3>

              <div className="flex items-center gap-4 mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    Buget de reclame / lună (lei)
                  </label>
                  <input
                    type="number"
                    value={scenBudget}
                    onChange={(e) => setScenBudget(Math.max(0, Number(e.target.value)))}
                    className="w-full text-3xl font-bold text-slate-900 bg-transparent border-0 outline-none p-0 focus:ring-0"
                    placeholder="5000"
                  />
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Buget zilnic</p>
                  <p className="text-2xl font-bold text-blue-600">~{daily} lei</p>
                  <p className="text-xs text-slate-400">media ÷ 30,4</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700">
                ✓ <strong>Creativele le produce clientul.</strong> Bugetul de mai sus merge integral pe difuzare — fără cost de producție.
              </div>
            </div>

            {/* Recomandare dinamica */}
            <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">📋 Structura recomandată pentru bugetul tău</h3>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${tier.badge}`}>{tier.eticheta}</span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                <p className="text-lg font-bold text-emerald-800">{tier.titlu}</p>
                <p className="text-sm text-emerald-700 mt-1">Campanii simultane: <strong>{tier.simultane}</strong></p>
              </div>

              {/* Split bars */}
              <div className="space-y-3 mb-4">
                {tier.splits.map((s) => {
                  const lei = Math.round(mediaBudget * s.proc / 100);
                  const leiSapt = Math.round(lei / 4.3);
                  return (
                    <div key={s.nume}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${s.color} shrink-0`} />
                          <span className="text-sm font-medium text-slate-700">{s.nume}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {tier.id !== "low" && <span className="text-xs text-slate-400">~{leiSapt} lei/săpt.</span>}
                          <span className="text-sm font-bold text-slate-700">{tier.id === "low" ? "—" : `${lei.toLocaleString("ro")} lei`}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.proc}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detalii */}
              <div className="grid md:grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Obiectiv recomandat", value: tier.obiectiv },
                  { label: "Servicii de promovat", value: tier.servicii },
                  { label: "Lead-uri estimate / lună", value: tier.cpl[0] ? `~${leadsLow}–${leadsHigh}` : "—" },
                ].map((d) => (
                  <div key={d.label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{d.label}</p>
                    <p className="text-sm text-slate-700">{d.value}</p>
                  </div>
                ))}
              </div>

              <div className={`rounded-xl p-3 text-sm ${tier.id === "low" ? "bg-rose-50 border border-rose-200 text-rose-700" : "bg-blue-50 border border-blue-200 text-blue-700"}`}>
                💡 {tier.nota}
              </div>
              {tier.cpl[0] > 0 && (
                <p className="text-xs text-slate-400 mt-2">* Estimare la cost/lead {tier.cpl[0]}–{tier.cpl[1]} lei (benchmark estetică RO). Depinde de creative, ofertă și viteza de răspuns la lead-uri.</p>
              )}
            </div>

            {/* Tabel referinta toate scenariile */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-x-auto">
              <h3 className="font-bold text-slate-800 mb-1">📊 Toate scenariile — referință rapidă</h3>
              <p className="text-xs text-slate-400 mb-4">Doar buget media (fără fee). Rândul tău e evidențiat.</p>
              <table className="w-full text-xs min-w-[640px]">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-2 px-2 text-slate-500 font-semibold">Buget media/lună</th>
                    <th className="text-left py-2 px-2 text-slate-500 font-semibold">Structură</th>
                    <th className="text-center py-2 px-2 text-slate-500 font-semibold">Campanii simultane</th>
                    <th className="text-center py-2 px-2 text-slate-500 font-semibold">Lead-uri/lună*</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { r: "1.500–2.999 lei", s: "1 cold (epilare), obiectiv Mesaje", c: "1 cold", l: "~15–35", id: "A" },
                    { r: "3.000–5.999 lei", s: "1 cold + retargeting mic", c: "1 cold + retarget", l: "~40–80", id: "B" },
                    { r: "6.000–9.999 lei", s: "2 cold (servicii+audiențe diferite) + retargeting", c: "2 cold + retarget", l: "~80–150", id: "C" },
                    { r: "10.000+ lei", s: "Prospecting + lookalike + retargeting + testare", c: "3+", l: "150+", id: "D" },
                  ].map((row) => (
                    <tr key={row.id} className={tier.id === row.id ? "bg-emerald-50" : "hover:bg-slate-50"}>
                      <td className={`py-2.5 px-2 font-semibold ${tier.id === row.id ? "text-emerald-700" : "text-slate-700"}`}>{row.r}{tier.id === row.id && " ◄ tu"}</td>
                      <td className="py-2.5 px-2 text-slate-600">{row.s}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{row.c}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{row.l}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Reguli de aur */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">⚖️ Regulile din spate — de ce NU 2 campanii cold pe buget mic</h3>
              <div className="space-y-3">
                {[
                  { t: "Faza de învățare Meta", d: "Fiecare ad set are nevoie de ~50 rezultate/săptămână ca să iasă din 'learning'. La 50-80 lei/lead, asta înseamnă mii de lei/săptămână PER campanie. Împarți bugetul la 2 → niciuna nu învață." },
                  { t: "Audiența din Sibiu e mică", d: "Sibiu + Șelimbăr = ~80-150k femei relevante. Două campanii cold pe aceeași audiență = liciți contra ta în licitație și îți crești singur costurile." },
                  { t: "Concentrează, nu fragmenta", d: "La buget mic: un mesaj, o ofertă, tot bugetul pe ea. Un singur lucru făcut bine bate trei lucruri făcute pe jumătate." },
                  { t: "Excepția: retargeting-ul", d: "Retargeting-ul NU concurează cu cold — e audiență caldă, separată, ieftină (0,3-0,5 lei/interacțiune). De aceea poate rula în paralel de la 3.000 lei în sus." },
                ].map(({ t, d }) => (
                  <div key={t} className="flex gap-3">
                    <span className="text-emerald-500 shrink-0">✓</span>
                    <p className="text-sm text-slate-600"><strong className="text-slate-800">{t}.</strong> {d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nota creative + fee separat */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="font-bold text-amber-800 text-sm mb-2">💡 De reținut despre buget</p>
              <div className="space-y-1.5 text-sm text-amber-700">
                <p>• <strong>Creativele le fac ei</strong> — bugetul de mai sus e 100% difuzare, fără producție din partea ta.</p>
                <p>• <strong>Fee-ul tău de management e separat</strong> de bugetul de reclame — nu îl amesteca cu cifra de aici. Bugetul de campanii merge integral la Meta, fee-ul e pentru serviciul tău (strategie, setare, optimizare, raportare).</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center">Calculator buget · Doar Meta/Facebook · Episculp Beauty</p>
          </div>
        );
      })()}

      {/* ── ROADMAP & OPTIMIZARE ─────────────────────────────────────────── */}
      {tab === "admin" && (
        <div className="space-y-5">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
            <p className="text-blue-200 text-xs uppercase tracking-wide font-semibold mb-1">Plan de lucru · Nova Visio pentru Episculp Beauty</p>
            <h2 className="text-2xl font-bold mb-2">Analizăm ce aveți → optimizăm → roadmap pas cu pas pe 3 luni</h2>
            <p className="text-blue-100 text-sm">Nu reinventăm ce funcționează deja. Identificăm ce lipsește, aducem optimizarea și măsurăm impactul. Tot planul pe bugetul vostru de reclame — creativele le faceți voi.</p>
          </div>

          {/* PASUL 1 — DIAGNOSTIC */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">1</span>
              <h3 className="font-bold text-slate-800 text-lg">Diagnostic — ce aveți deja vs. ce lipsește</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 ml-9">Vestea bună: aveți deja fundație solidă. Problema nu e lipsa de calitate, ci felul în care e promovată online.</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide mb-2">✅ Ce aveți deja (puncte forte)</p>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <li>✅ <strong>SEO puternic</strong> — sunteți #1 pe Google la „epilare definitiva sibiu”</li>
                  <li>✅ Tehnologie premium (Primelase, Syndeo, Cooltech, Observ 320)</li>
                  <li>✅ Prezență activă pe Instagram, Facebook, TikTok</li>
                  <li>✅ Produceți singuri creative video</li>
                  <li>✅ Investiți deja un buget pe Meta</li>
                  <li>✅ <strong>Pixel Meta deja instalat</strong> pe site</li>
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                <p className="text-xs font-bold text-rose-800 uppercase tracking-wide mb-2">❌ Ce lipsește (de aici vin clienții pierduți)</p>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <li>❌ Reclamele sunt „boost-uri” — obiectiv greșit (engagement, nu clienți)</li>
                  <li>❌ Trimit oamenii pe Instagram, fără a le cere datele</li>
                  <li>❌ Pixel-ul există, dar nu e folosit — fără evenimente de conversie configurate</li>
                  <li>❌ Fără retargeting → pierdeți cei care v-au văzut deja</li>
                  <li>❌ Fără raport pe cifre (cost/lead, ce reclamă aduce clienți)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* DE CE NU GOOGLE ADS */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="font-bold text-amber-800 text-sm mb-2">🔍 De ce NU recomandăm Google Ads acum</p>
            <p className="text-sm text-amber-700 mb-2">Sunteți deja <strong>#1 organic</strong> pe „epilare definitiva sibiu”. Un Google Ad ar plăti pentru clicuri pe care le primiți deja gratuit prin SEO — bani dublați degeaba.</p>
            <div className="grid md:grid-cols-2 gap-3 mt-3">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs font-bold text-slate-600 mb-1">Google = cererea care vă caută deja</p>
                <p className="text-xs text-slate-500">O aveți acoperită gratuit prin SEO. Nu plătim pentru ea.</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs font-bold text-emerald-700 mb-1">Meta = cererea care încă nu vă cunoaște</p>
                <p className="text-xs text-slate-500">Aici e creșterea: ajungem la cei care nu caută activ, dar sunt clienți potențiali. Acolo punem tot bugetul.</p>
              </div>
            </div>
          </div>

          {/* PASUL 2 — CE ADUCEM IN PLUS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">2</span>
              <h3 className="font-bold text-slate-800 text-lg">Ce aducem în plus față de ce aveți</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 ml-9">Optimizarea concretă — fiecare punct rezolvă un gap de mai sus.</p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { t: "Activăm pixel-ul existent", d: "Pixel-ul e deja instalat — configurăm evenimentele de conversie (Lead) și îl folosim pentru retargeting și audiențe. Din prima zi vedem ce funcționează." },
                { t: "Obiectiv corect: Lead Gen", d: "Înlocuim boost-urile cu campanii care cer clienți reali (formular / mesaj), nu doar like-uri." },
                { t: "Captăm lead-ul, nu îl pierdem", d: "Formular nativ Meta + buton WhatsApp direct. Fiecare interesat devine un contact pe care îl puteți suna." },
                { t: "Retargeting", d: "Recuperăm ieftin (0,3-0,5 lei/interacțiune) pe cei care v-au văzut dar nu au acționat încă." },
                { t: "Structură + testare pe creativele VOASTRE", d: "Voi faceți materialele, noi le organizăm, testăm (A/B) și le punem în campanii corecte ca să scoatem maxim din ele." },
                { t: "Raport lunar cu cifre", d: "Câte lead-uri, la ce cost, ce reclamă merge, cât ați investit vs. încasat. Transparent, lunar." },
              ].map(({ t, d }) => (
                <div key={t} className="border border-slate-200 rounded-xl p-4">
                  <p className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2"><span className="text-emerald-500">+</span> {t}</p>
                  <p className="text-xs text-slate-600">{d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PASUL 3 — ROADMAP 3 LUNI */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">3</span>
              <h3 className="font-bold text-slate-800 text-lg">Roadmap pe 3 luni — pe serviciile voastre</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 ml-9">Pas cu pas. Fiecare lună are un focus, acțiuni concrete și ce măsurăm.</p>
            <div className="space-y-4">
              {[
                {
                  luna: "LUNA 1 — Iulie", faza: "Fundație + prima campanie", color: "bg-blue-50 border-blue-200", dot: "bg-blue-500",
                  focus: "Remodelare corporală (sezon vară) + Epilare definitivă (evergreen)",
                  actiuni: [
                    "Configurăm pixel-ul existent (evenimente de conversie), conectăm conturile corect",
                    "Lansăm prima campanie Lead Gen cu formular + WhatsApp",
                    "Pornim retargeting de bază pe vizitatorii site-ului",
                    "Organizăm creativele voastre în structură testabilă",
                  ],
                  masuram: "Cost/lead inițial, câte lead-uri, ce creativ prinde cel mai bine",
                },
                {
                  luna: "LUNA 2 — August", faza: "Optimizare + extindere", color: "bg-violet-50 border-violet-200", dot: "bg-violet-500",
                  focus: "Adăugăm Hydrafacial / facial (ten după soare) + Observ 320 ca ofertă de intrare",
                  actiuni: [
                    "Optimizăm pe baza datelor: oprim ce nu merge, dublăm ce merge",
                    "A/B test pe creativele voastre — găsim mesajul câștigător",
                    "Activăm retargeting cu ofertă (recuperăm interesații)",
                    "Construim funnel: Observ 320 ieftin → consultație → serviciu mare",
                  ],
                  masuram: "Tendința cost/lead (scade?), rata lead → programare",
                },
                {
                  luna: "LUNA 3 — Septembrie", faza: "Scalare + impact măsurabil", color: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500",
                  focus: "Campanie „mămici revenite din concediu” + scalăm serviciul câștigător",
                  actiuni: [
                    "Creștem bugetul pe campaniile profitabile",
                    "Lansăm mesaj de sezon (corp post-vară, re-start)",
                    "Raport complet: comparație Luna 1 vs. Luna 3",
                    "Definim planul pentru luna 4+ pe baza cifrelor reale",
                  ],
                  masuram: "IMPACT REAL: cost/client, ROI, evoluție față de start",
                },
              ].map(({ luna, faza, color, dot, focus, actiuni, masuram }) => (
                <div key={luna} className={`border rounded-xl p-4 ${color}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${dot}`} />
                    <p className="font-bold text-slate-800 text-sm">{luna}</p>
                    <span className="text-xs text-slate-500">· {faza}</span>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Focus</p>
                    <p className="text-sm text-slate-700">{focus}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Ce facem</p>
                      <ul className="space-y-1">
                        {actiuni.map((a) => <li key={a} className="text-xs text-slate-600">→ {a}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Ce măsurăm</p>
                      <p className="text-xs text-slate-600 bg-white/70 rounded-md p-2">{masuram}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nota impact L2-L3 */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
            <p className="font-bold text-indigo-800 text-sm mb-2">📈 Când se vede impactul real</p>
            <p className="text-sm text-indigo-700">Impactul măsurabil apare <strong>între luna 2 și 3</strong>, nu din prima săptămână. Două motive: (1) Meta are nevoie de ~2 săptămâni să „învețe” pe fiecare campanie; (2) epilarea definitivă e o decizie de cumpărare cu gândire — oamenii nu cumpără pe loc. <strong>Lunile 1-2 = construim și calibrăm. Luna 3 = cifrele devin concludente.</strong> De aceea evaluăm serios la finalul lunii 2 / începutul lunii 3.</p>
          </div>

          {/* Tie la buget */}
          <div className="bg-slate-800 rounded-2xl p-5 text-white">
            <p className="font-bold text-sm mb-2">💰 Totul rulează pe bugetul vostru</p>
            <p className="text-sm text-slate-300">Tot planul folosește bugetul vostru de reclame (vezi tab <strong>💰 Buget & Scenarii</strong> pentru structura exactă în funcție de sumă). Creativele le faceți voi. Noi aducem strategia, setarea corectă, optimizarea și raportarea. Fără costuri ascunse de producție.</p>
          </div>

          <p className="text-xs text-slate-400 text-center">Roadmap & Optimizare · Episculp Beauty · Plan pe 3 luni</p>
        </div>
      )}

      {/* ── OVERVIEW ──────────────────────────────────────────────────────── */}
      {tab === "overview" && (
        <div className="space-y-5">

          {/* Servicii */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" /> Servicii & Prețuri (de pe episculpt-beauty.ro)
            </h2>

            {/* Epilare */}
            <div className="mb-5">
              <p className="text-xs font-bold text-pink-700 uppercase tracking-wide mb-2">🔥 Epilare Definitivă — Prioritate #1 Campanie Google</p>
              <div className="grid md:grid-cols-2 gap-2 mb-2">
                {[
                  { s: "Full Body Femei", p: "910 lei (orig. 1.300 lei · -30%)", hot: true },
                  { s: "Inghinal Femei", p: "245 lei (orig. 350 lei · -30%)", hot: false },
                  { s: "Axile Femei", p: "154 lei (orig. 220 lei · -30%)", hot: false },
                  { s: "Axile Bărbați", p: "217 lei (orig. 310 lei · -30%)", hot: false },
                  { s: "Zone mici-medii", p: "77 – 490 lei (reducere 30%)", hot: false },
                ].map(({ s, p, hot }) => (
                  <div key={s} className={`rounded-lg px-3 py-2 flex justify-between items-center border ${hot ? "bg-pink-50 border-pink-200" : "bg-slate-50 border-slate-200"}`}>
                    <span className={`text-sm font-medium ${hot ? "text-pink-800" : "text-slate-700"}`}>{s}</span>
                    <span className={`text-xs font-semibold ${hot ? "text-pink-600" : "text-slate-500"}`}>{p}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400">Tehnologie: <strong>Primelase HR Excellence</strong> (laser diodă) · Consultație inclusă · FDA & CE · F: 6-8 ședințe · B: 8-10 ședințe / 12 luni</p>
            </div>

            {/* Remodelare */}
            <div className="mb-5">
              <p className="text-xs font-bold text-violet-700 uppercase tracking-wide mb-2">Remodelare Corporală</p>
              <div className="grid md:grid-cols-3 gap-2">
                {[
                  { s: "Criolipolizã (Cooltech)", p: "700 lei / 2 aplicatori (-30%)", d: "Grăsime localizată · Non-invaziv · FDA" },
                  { s: "Radiofrecvență Viora V10", p: "1.620 lei / 6 ședințe (-40%)", d: "Fermitate, tonifiere, conturare siluetă" },
                  { s: "Electrostimulare Wonder", p: "La cerere", d: "Tonifiere musculară · Wonder Prestige" },
                ].map(({ s, p, d }) => (
                  <div key={s} className="rounded-lg px-3 py-2 border border-violet-100 bg-violet-50">
                    <p className="text-sm font-semibold text-violet-800">{s}</p>
                    <p className="text-xs text-violet-600 font-medium">{p}</p>
                    <p className="text-xs text-violet-500 mt-0.5">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Facial */}
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">Tratamente Faciale</p>
              <div className="grid md:grid-cols-2 gap-2 mb-2">
                {[
                  { s: "Hydrafacial Syndeo + Intraceuticals + Osmosis", p: "750 lei (orig. 1.000 lei · -25%)", hot: true },
                  { s: "Radiofrecvență facială / fracționată", p: "Protocol personalizat", hot: false },
                  { s: "Curățare facială profesională", p: "Hidrodermabraziune", hot: false },
                  { s: "Acnee / Pete / Cicatrici / Riduri", p: "Evaluare + protocol dedicat", hot: false },
                ].map(({ s, p, hot }) => (
                  <div key={s} className={`rounded-lg px-3 py-2 border flex justify-between items-center ${hot ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"}`}>
                    <span className={`text-sm font-medium ${hot ? "text-blue-800" : "text-slate-700"}`}>{s}</span>
                    <span className={`text-xs ${hot ? "text-blue-600 font-semibold" : "text-slate-400"}`}>{p}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-emerald-700 font-semibold">✓ Singurul salon din Sibiu cu Hydrafacial Syndeo — diferențiator major în campanii!</p>
            </div>
          </div>

          {/* Audienta */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" /> Audiență Principală
            </h2>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { t: "🏢 Doamne la birou", d: "22–45 ani, angajate corporate sau în administrație, venit mediu-ridicat, Sibiu + Șelimbăr", prio: true },
                { t: "👩‍💼 Doamne cu firme", d: "Antreprenoare, businesswomen — timp limitat, valorizează calitatea. Potențial clienți fideli pe termen lung.", prio: true },
                { t: "👩 Mămici (Septembrie)", d: "Revenite din concediu, corp post-vară / post-sarcină. Mesaj: vergeturi, corp nou, epilare re-start.", prio: false },
              ].map(({ t, d, prio }) => (
                <div key={t} className={`rounded-xl p-4 border ${prio ? "bg-blue-50 border-blue-200" : "bg-violet-50 border-violet-200"}`}>
                  <p className={`font-bold text-sm ${prio ? "text-blue-800" : "text-violet-800"}`}>{t}</p>
                  <p className={`text-xs mt-0.5 ${prio ? "text-blue-600" : "text-violet-600"}`}>{d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Budget tracker */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Euro className="w-4 h-4 text-emerald-500" /> Urmărire Buget Lunar
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {([
                ["Leaduri generate luna aceasta", "total_luna", "ex: 45"],
                ["Cost per lead (lei)", "cost_per_lead", "ex: 112"],
                ["Rată conversie (%)", "conversie", ">30"],
                ["Buget cheltuit total (lei)", "buget_cheltuit", "ex: 4500"],
              ] as [string, keyof typeof leaduri, string][]).map(([label, key, placeholder]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</label>
                  <input value={leaduri[key]} onChange={(e) => setLeaduri({ ...leaduri, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
            </div>
            {leaduri.total_luna && leaduri.cost_per_lead && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
                📊 <strong>{leaduri.total_luna} leads</strong> × <strong>{leaduri.cost_per_lead} lei/lead</strong> = {Number(leaduri.total_luna) * Number(leaduri.cost_per_lead)} lei estimat
                {leaduri.buget_cheltuit && ` · Buget rămas: ${9000 - Number(leaduri.buget_cheltuit)} lei`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STRATEGIE SMM + SOSTAC ──────────────────────────────────────── */}
      {tab === "admin" && (
        <div className="space-y-6">

          {/* Header strategie */}
          <div className="bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-1">Strategie SMM + SOSTAC — Episculp Beauty</h2>
            <p className="text-violet-100 text-sm">Analiză completă a pieței, obiective, tactici și plan de acțiune pentru campanii Google + Meta + Organic.</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Epilare Definitivă", "Remodelare Corporală", "Hydrafacial Syndeo", "Lead Gen", "Brand Awareness"].map((tag) => (
                <span key={tag} className="text-xs bg-white/20 rounded-full px-3 py-1">{tag}</span>
              ))}
            </div>
          </div>

          {/* SOSTAC accordion */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Framework SOSTAC</h3>
              <p className="text-xs text-slate-400 mt-0.5">Click pe fiecare secțiune pentru a o deschide și edita</p>
            </div>
            {sostac.map((s, i) => {
              const colors = [
                "bg-blue-50 border-blue-200 text-blue-700",
                "bg-emerald-50 border-emerald-200 text-emerald-700",
                "bg-violet-50 border-violet-200 text-violet-700",
                "bg-amber-50 border-amber-200 text-amber-700",
                "bg-rose-50 border-rose-200 text-rose-700",
                "bg-slate-50 border-slate-200 text-slate-700",
              ];
              const isOpen = sostacOpen === i;
              return (
                <div key={i} className="border-b border-slate-100 last:border-0">
                  <button
                    onClick={() => setSostacOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${colors[i]}`}>
                        {s.titlu.split(" ")[0]}
                      </span>
                      <span className="font-semibold text-slate-800 text-sm">{s.titlu.split("(")[1]?.replace(")", "") ?? s.titlu.slice(4)}</span>
                    </div>
                    <span className="text-slate-400 text-sm">{isOpen ? "▲" : "▼"}</span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5">
                      <textarea
                        value={s.continut}
                        onChange={(e) => {
                          const next = [...sostac];
                          next[i] = { ...next[i], continut: e.target.value };
                          setSostac(next);
                        }}
                        rows={12}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none bg-slate-50"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Campanii recomandate */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">🏆 Campanii Recomandate — Prioritizate</h3>
            <div className="space-y-3">
              {[
                {
                  nr: "1", prio: "MUST HAVE", color: "bg-red-50 border-red-200",
                  titlu: "Google Search — Epilare Definitivă Sibiu",
                  buget: "350 lei/săpt.", platform: "Google Ads",
                  desc: "Intent ridicat — oamenii caută deja. CPC ~10 lei. ROI imediat. Prioritatea #1 pentru lead gen.",
                  actiuni: ["Activare cont Google Ads", "Creare campanie Search cu cuvinte cheie de mai sus", "Landing page dedicat cu formular + WhatsApp", "Extensii apel și locație"],
                },
                {
                  nr: "2", prio: "MUST HAVE", color: "bg-red-50 border-red-200",
                  titlu: "Meta Lead Gen — Epilare Definitivă (Formulare)",
                  buget: "250 lei/săpt.", platform: "Facebook + Instagram",
                  desc: "Lead form nativ Meta — fricțiune minimă, conversie maximă. WhatsApp Direct ca alternativă. Audience doamne 22-45 ani Sibiu.",
                  actiuni: ["Setare Meta Business Suite + Pixel", "Creare Lead Form nativ (nume, telefon, serviciu dorit)", "Reel 'înainte/după' ca creativ principal", "Integrare WhatsApp Business"],
                },
                {
                  nr: "3", prio: "RECOMANDAT", color: "bg-amber-50 border-amber-200",
                  titlu: "Meta Retargeting — Ofertă Specială",
                  buget: "100 lei/săpt.", platform: "Facebook + Instagram",
                  desc: "Vizitatori site care nu au completat formularul. Cost mic (0.3-0.5 lei/interacțiune). Ofertă clară: 'Rezervă azi — -30%'.",
                  actiuni: ["Activare Pixel pe site episculpt-beauty.ro", "Audiență Custom Audience vizitatori site", "Creativ: ofertă cu countdown (oferta expiră!)", "CTA: Mesaj WhatsApp direct"],
                },
                {
                  nr: "4", prio: "RECOMANDAT", color: "bg-amber-50 border-amber-200",
                  titlu: "Instagram Organic — 3 Materiale/Lună",
                  buget: "0 lei (timp)", platform: "Instagram + TikTok",
                  desc: "Construire audiență organică pe termen lung. Reach gratuit prin Reels. Social proof continuu.",
                  actiuni: ["Reel lunar epilare definitivă (înainte/după)", "Post educațional Hydrafacial Syndeo ('Singurul în Sibiu')", "Story zilnic pentru engagement + DM-uri", "Boost posturile cu >500 reach organic"],
                },
                {
                  nr: "5", prio: "OPTIONAL", color: "bg-blue-50 border-blue-200",
                  titlu: "Meta Brand Awareness — Boost Organic Performant",
                  buget: "150 lei/săpt.", platform: "Facebook + Instagram",
                  desc: "Amplifică posturile organice care merg bine. Lookalike audience din clienți existenți. Brand building pe termen lung.",
                  actiuni: ["Identificare post organic cu cel mai mult engagement", "Boost cu 100-150 lei pe 7 zile", "Audiență: Lookalike 1% clienți existenți Sibiu", "KPI: reach, engagement, urmăritori noi"],
                },
              ].map(({ nr, prio, color, titlu, buget, platform, desc, actiuni }) => (
                <div key={nr} className={`border rounded-xl p-5 ${color}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-white font-bold text-sm flex items-center justify-center text-slate-700 shrink-0 shadow-sm">{nr}</span>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{titlu}</p>
                        <p className="text-xs text-slate-500">{platform}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-xs font-bold text-slate-700">{buget}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        prio === "MUST HAVE" ? "bg-red-100 text-red-700" :
                        prio === "RECOMANDAT" ? "bg-amber-100 text-amber-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>{prio}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">{desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {actiuni.map((a, ai) => (
                      <span key={ai} className="text-xs bg-white/70 text-slate-600 border border-white rounded-lg px-2 py-0.5">✓ {a}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SMM Platforme */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">📱 Plan Social Media per Platformă</h3>
            <div className="space-y-4">
              {smmPlatforme.map(({ platforma, frecventa, formate, teme, note }) => {
                const colors: Record<string, string> = {
                  Instagram: "border-pink-200 bg-pink-50",
                  Facebook: "border-blue-200 bg-blue-50",
                  TikTok: "border-slate-200 bg-slate-50",
                  "Google Business": "border-emerald-200 bg-emerald-50",
                };
                const tc: Record<string, string> = {
                  Instagram: "text-pink-700", Facebook: "text-blue-700",
                  TikTok: "text-slate-700", "Google Business": "text-emerald-700",
                };
                return (
                  <div key={platforma} className={`border rounded-xl p-4 ${colors[platforma] ?? "border-slate-200 bg-slate-50"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <p className={`font-bold text-sm ${tc[platforma]}`}>{platforma}</p>
                      <span className="text-xs text-slate-500 font-medium">{frecventa}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Formate</p>
                        <ul className="space-y-0.5">
                          {formate.map((f) => <li key={f} className="text-xs text-slate-600">• {f}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Teme de conținut</p>
                        <ul className="space-y-0.5">
                          {teme.map((t) => <li key={t} className="text-xs text-slate-600">• {t}</li>)}
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 italic border-t border-white/60 pt-2">💡 {note}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buget dinamic */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-1">💰 Calculator Buget Lunar</h3>
            <p className="text-xs text-slate-400 mb-4">Introdu bugetul total — alocarea se calculează automat. Ajustează procentele după preferință.</p>

            {/* Input buget total */}
            <div className="flex items-center gap-4 mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Buget total / lună (lei)</label>
                <input
                  type="number"
                  value={bugetTotal}
                  onChange={(e) => setBugetTotal(Math.max(0, Number(e.target.value)))}
                  className="w-full text-2xl font-bold text-slate-900 bg-transparent border-0 outline-none p-0 focus:ring-0"
                  placeholder="9000"
                />
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Total alocat</p>
                <p className={`text-lg font-bold ${splits.reduce((s, x) => s + x.proc, 0) === 100 ? "text-emerald-600" : "text-red-500"}`}>
                  {splits.reduce((s, x) => s + x.proc, 0)}%
                </p>
                <p className="text-xs text-slate-400">{splits.reduce((s, x) => s + x.proc, 0) !== 100 ? "≠ 100%" : "✓ OK"}</p>
              </div>
            </div>

            {/* Splits */}
            <div className="space-y-4">
              {splits.map((s, i) => {
                const lei = Math.round(bugetTotal * s.proc / 100);
                const leiSapt = Math.round(lei / 4.3);
                return (
                  <div key={s.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${s.color} shrink-0`} />
                        <span className="text-sm font-medium text-slate-700">{s.canal}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">~{leiSapt} lei/săpt.</span>
                        <span className={`text-sm font-bold ${s.colorText}`}>{lei.toLocaleString("ro")} lei</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={s.proc}
                            min={0}
                            max={100}
                            onChange={(e) => {
                              const next = [...splits];
                              next[i] = { ...next[i], proc: Math.min(100, Math.max(0, Number(e.target.value))) };
                              setSplits(next);
                            }}
                            className="w-12 text-xs text-center border border-slate-200 rounded-lg py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          />
                          <span className="text-xs text-slate-400">%</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${s.color}`}
                        style={{ width: `${Math.min(s.proc, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100">
              {(() => {
                const pick = (k: string) => splits.find((s) => s.key === k)?.proc ?? 0;
                return [
                  { label: "Lead Gen (C1)", lei: Math.round(bugetTotal * pick("meta1") / 100), sub: "Epilare definitivă", color: "text-indigo-600" },
                  { label: "Brand + Retargeting", lei: Math.round(bugetTotal * (pick("meta2") + pick("retarget")) / 100), sub: "Remodelare/Facial + retargeting", color: "text-violet-600" },
                  { label: "TOTAL DIFUZARE", lei: bugetTotal, sub: `${splits.reduce((s, x) => s + x.proc, 0)}% alocat`, color: "text-emerald-600" },
                ];
              })().map(({ label, lei, sub, color }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
                  <p className={`text-lg font-bold mt-0.5 ${color}`}>{lei.toLocaleString("ro")} lei</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── GOOGLE ADS ──────────────────────────────────────────────────── */}
      {tab === "admin" && (
        <div className="bg-white border border-blue-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="font-bold text-blue-600 text-sm">G</span>
              </div>
              <div>
                <p className="text-white font-bold">Google Ads — 1 Campanie Search</p>
                <p className="text-blue-200 text-xs">Epilare Definitivă Laser · Primelase HR · Sibiu</p>
              </div>
            </div>
            <select value={google.status} onChange={(e) => setGoogle({ ...google, status: e.target.value })}
              className="text-xs rounded-lg px-3 py-1.5 font-semibold bg-white text-blue-700 border-0 cursor-pointer focus:outline-none">
              {["de setat", "activa", "in pauza", "optimizare"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid md:grid-cols-3 gap-4">
              <F label="Buget zilnic (lei)" value={google.buget_zilnic} onChange={(v) => setGoogle({ ...google, buget_zilnic: v })} />
              <F label="CPC țintă (lei)" value={google.cpc_tinta} onChange={(v) => setGoogle({ ...google, cpc_tinta: v })} />
              <F label="Tip campanie" value={google.tip} onChange={(v) => setGoogle({ ...google, tip: v })} />
            </div>
            <TagsField label="Cuvinte cheie" tags={google.cuvinte_cheie} onChange={(t) => setGoogle({ ...google, cuvinte_cheie: t })} />
            <TagsField label="Cuvinte negative (excludere)" tags={google.cuvinte_negative} onChange={(t) => setGoogle({ ...google, cuvinte_negative: t })} />
            <TagsField label="Titluri reclame (max 30 char fiecare)" tags={google.titluri} onChange={(t) => setGoogle({ ...google, titluri: t })} />
            <div className="space-y-3">
              {google.descrieri.map((d, i) => (
                <div key={i}>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Descriere {i + 1}</label>
                  <textarea value={d} onChange={(e) => { const arr = [...google.descrieri]; arr[i] = e.target.value; setGoogle({ ...google, descrieri: arr }); }}
                    rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
              ))}
            </div>
            <TagsField label="Extensii" tags={google.extensii} onChange={(t) => setGoogle({ ...google, extensii: t })} />
            <F label="Landing page" value={google.landing_page} onChange={(v) => setGoogle({ ...google, landing_page: v })} big />
            <F label="Note" value={google.note} onChange={(v) => setGoogle({ ...google, note: v })} big />
          </div>
        </div>
      )}

      {/* ── META C1 + C2 ────────────────────────────────────────────────── */}
      {tab === "admin" && (
        <div className="space-y-5">
        {meta.map((c, idx) => {
          const update = (patch: Partial<CampaniaMeta>) =>
            setMeta((prev) => prev.map((m, i) => i === idx ? { ...m, ...patch } : m));
          const hc = idx === 0 ? "bg-blue-700" : "bg-emerald-700";
          const bc = idx === 0 ? "border-blue-200" : "border-emerald-200";
          return (
          <div key={idx} className={`bg-white border ${bc} rounded-2xl shadow-sm overflow-hidden`}>
            <div className={`${hc} px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-sm"
                  style={{ color: idx === 0 ? "#1d4ed8" : "#15803d" }}>f</div>
                <div>
                  <p className="text-white font-bold">{c.nume}</p>
                  <p className="text-white/70 text-xs">{c.obiectiv} · {c.buget}</p>
                </div>
              </div>
              <select value={c.status} onChange={(e) => update({ status: e.target.value })}
                className="text-xs rounded-lg px-3 py-1.5 font-semibold bg-white border-0 cursor-pointer focus:outline-none"
                style={{ color: idx === 0 ? "#1d4ed8" : "#15803d" }}>
                {["de setat", "activa", "in pauza", "test", "optimizare"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <F label="Buget" value={c.buget} onChange={(v) => update({ buget: v })} />
                <F label="Durată / Rotație" value={c.durata} onChange={(v) => update({ durata: v })} />
                <F label="Vârstă targeting" value={c.varsta} onChange={(v) => update({ varsta: v })} />
                <F label="Tip formular / CTA" value={c.tip_form} onChange={(v) => update({ tip_form: v })} />
              </div>
              <F label="Audiență principală" value={c.audienta} onChange={(v) => update({ audienta: v })} big />
              <TagsField label="Interese targeting" tags={c.interese} onChange={(t) => update({ interese: t })} />
              <TagsField label="Formate reclamă" tags={c.formate} onChange={(t) => update({ formate: t })} />
              <F label="Titlu reclamă" value={c.titlu_ad} onChange={(v) => update({ titlu_ad: v })} />
              <F label="Text principal reclamă" value={c.text_ad} onChange={(v) => update({ text_ad: v })} big />
              <F label="Call to Action" value={c.cta} onChange={(v) => update({ cta: v })} />
              <F label="Note" value={c.note} onChange={(v) => update({ note: v })} big />
            </div>
          </div>
          );
        })}
        </div>
      )}

      {/* ── CALENDAR ──────────────────────────────────────────────────────── */}
      {tab === "calendar" && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 mb-2">
            Campanii per sezoane · Pauze: <strong>Ian–Feb</strong> și <strong>Aug</strong> · Target special: <strong>Sep = Mămici</strong>
          </p>
          {luniCalendar.map(({ luna, sezon, note }) => (
            <div key={luna} className={`border rounded-xl px-5 py-4 flex items-center gap-4 ${sezonColor(sezon)}`}>
              <div className="w-28 shrink-0">
                <p className="font-bold text-sm">{luna}</p>
                <p className="text-xs font-medium opacity-70">{sezon}</p>
              </div>
              <p className="text-sm flex-1">{note}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── MATERIALE ──────────────────────────────────────────────────────── */}
      {tab === "admin" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">3 materiale noi / lună · organic + boost Instagram / Facebook / TikTok</p>
            <button onClick={addMaterial}
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl bg-pink-600 text-white hover:bg-pink-700 transition-colors">
              + Material nou
            </button>
          </div>
          {materiale.map((m) => (
            <div key={m.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="grid md:grid-cols-4 gap-3 mb-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Lună</label>
                  <input value={m.luna} onChange={(e) => updateMaterial(m.id, { luna: e.target.value })}
                    placeholder="ex: Iulie 2025"
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Tip</label>
                  <select value={m.tip} onChange={(e) => updateMaterial(m.id, { tip: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {["Reel", "Story", "Post carusel", "Video educațional", "Video testimonial", "Boost organic"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Serviciu</label>
                  <select value={m.serviciu} onChange={(e) => updateMaterial(m.id, { serviciu: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {["Epilare definitivă", "Criolipolizã", "Remodelare corporală", "Hydrafacial Syndeo", "Facial", "Radiofrecvență", "Acnee / Pete", "General brand"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Status</label>
                  <select value={m.status} onChange={(e) => updateMaterial(m.id, { status: e.target.value as Material["status"] })}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-sm font-semibold focus:outline-none border-0 cursor-pointer ${materialStatusColor(m.status)}`}>
                    {["idee", "productie", "gata", "publicat"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <input value={m.descriere} onChange={(e) => updateMaterial(m.id, { descriere: e.target.value })}
                placeholder="Descriere concept / script / unghi de comunicare..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
        </div>
      )}

      {/* ── CONCURENȚI ──────────────────────────────────────────────────────── */}
      {tab === "concurenti" && (
        <div className="space-y-5">

          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-1">Analiză Competitivă — Date Reale din Web</h2>
            <p className="text-slate-300 text-sm">7 competitori identificați în Sibiu · Prețuri, echipamente și tactici extrase direct de pe site-urile lor</p>
            <p className="text-slate-400 text-xs mt-1">Actualizat: 26 iunie 2026 · Surse: site-uri oficiale + Google Maps</p>
            <div className="grid grid-cols-4 gap-3 mt-4">
              {[
                { label: "Competitori găsiți", value: "7", sub: "cu date reale" },
                { label: "Au Primelase HR", value: "4 din 7", sub: "+ Episculp = 5 total" },
                { label: "Au Hydrafacial", value: "3 din 7", sub: "Shining, Michaelis, Suav" },
                { label: "CooLaser — distanță", value: "< 50m", sub: "aceeași stradă!" },
              ].map((k) => (
                <div key={k.label} className="bg-white/10 rounded-xl p-3">
                  <p className="text-slate-300 text-xs">{k.label}</p>
                  <p className="text-white text-lg font-bold mt-0.5">{k.value}</p>
                  <p className="text-slate-400 text-xs">{k.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ALERTA CRITICA */}
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 space-y-2">
            <p className="font-bold text-red-800 text-base">🚨 Descoperiri critice — schimbă strategia de comunicare</p>
            <div className="space-y-1.5 text-sm text-red-700">
              <p>❌ <strong>"Singurul Hydrafacial din Sibiu"</strong> — INCORECT. Shining Body, Michaelis și Suav Studio au și ele Hydrafacial. Nu mai folosim acest mesaj!</p>
              <p>⚠️ <strong>CooLaser e la 50m distanță</strong> — Str. Doamna Stanca 5B vs Episculp 5F. Clienții pot compara pe loc. Prețurile lor sunt mai mici (350 lei full body vs 910 lei).</p>
              <p>⚠️ <strong>"Mikadis" nu există</strong> — e de fapt <strong>Clinica Michaelis</strong> (Str. Dr. Ioan Rațiu 11). Au Primelase + CoolTech + Hydrafacial — concurent major subestimat.</p>
              <p>✅ <strong>Noul diferențiator real</strong>: Observ 320 (analiză facială) — confirmat singurul din Sibiu. + Hydrafacial SYNDEO (versiunea premium, vs Hydrafacial clasic al concurenților).</p>
            </div>
          </div>

          {/* Matrice tehnologii — date reale */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-x-auto">
            <h3 className="font-bold text-slate-800 mb-1">🏆 Matrice Tehnologii — Date Reale de pe Site-urile Lor</h3>
            <p className="text-xs text-slate-400 mb-4">Verificat direct pe fiecare site. Niciun "probabil" — doar ce e confirmat.</p>
            <table className="w-full text-xs min-w-[750px]">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-2 px-2 text-slate-500 font-semibold w-40">Echipament</th>
                  <th className="text-center py-2 px-2 text-emerald-700 font-bold">Episculp</th>
                  <th className="text-center py-2 px-2 text-red-600 font-semibold">Shining Body</th>
                  <th className="text-center py-2 px-2 text-orange-600 font-semibold">Michaelis</th>
                  <th className="text-center py-2 px-2 text-purple-600 font-semibold">EC Beauty</th>
                  <th className="text-center py-2 px-2 text-blue-600 font-semibold">CooLaser</th>
                  <th className="text-center py-2 px-2 text-slate-500 font-semibold">Suav / AVA / Epilux</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { tech: "Primelase HR Excellence", ep: "✅", sh: "✅", mi: "✅", ec: "✅", co: "❌", rest: "❌" },
                  { tech: "Hydrafacial SYNDEO", ep: "✅ Syndeo", sh: "✅ clasic", mi: "✅ clasic", ec: "❌", co: "❌", rest: "Suav ✅" },
                  { tech: "Criolipoliză Cooltech (FDA)", ep: "✅", sh: "✅ Define", mi: "✅ Define", ec: "✅ + QuadFreeze", co: "❌", rest: "❌" },
                  { tech: "Analiză Observ 320", ep: "✅ SINGURUL", sh: "❌", mi: "❌", ec: "❌", co: "❌", rest: "❌" },
                  { tech: "VelaShape III", ep: "❌", sh: "✅", mi: "✅", ec: "❌", co: "❌", rest: "❌" },
                  { tech: "GentleLase Pro (Alexandrite)", ep: "❌", sh: "✅", mi: "❌", ec: "❌", co: "✅ 755nm", rest: "❌" },
                  { tech: "Elysion Pro", ep: "❌", sh: "✅", mi: "❌", ec: "❌", co: "❌", rest: "❌" },
                  { tech: "Radiofrecvență Viora V10", ep: "✅", sh: "Eximia HR77", mi: "❌", ec: "❌", co: "❌", rest: "❌" },
                  { tech: "Fondator CIDESCO", ep: "✅", sh: "❌ neclar", mi: "❌ neclar", ec: "❌ neclar", co: "❌", rest: "❌" },
                  { tech: "Meta Ads active", ep: "⚠️ boost", sh: "❌ necunoscut", mi: "❌ necunoscut", ec: "❌ necunoscut", co: "❌", rest: "❌" },
                  { tech: "Google Ads active", ep: "❌", sh: "❌", mi: "❌", ec: "❌", co: "❌", rest: "❌" },
                  { tech: "Program L-V 10-20", ep: "✅", sh: "✅ 8-22!", mi: "✅ 9-20", ec: "✅ 8-20", co: "✅ 9-19", rest: "variabil" },
                  { tech: "Nr. locații", ep: "1", sh: "2 locații!", mi: "1", ec: "1", co: "1", rest: "1 fiecare" },
                ].map(({ tech, ep, sh, mi, ec, co, rest }) => (
                  <tr key={tech} className="hover:bg-slate-50">
                    <td className="py-2 px-2 font-medium text-slate-700">{tech}</td>
                    {[ep, sh, mi, ec, co, rest].map((v, i) => (
                      <td key={i} className={`py-2 px-2 text-center text-xs font-medium ${
                        v.startsWith("✅") ? "text-emerald-700" :
                        v.startsWith("❌") ? "text-red-400" :
                        "text-amber-600"
                      }`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-slate-400 mt-3">Surse: shiningbody.ro · michaelis.ro · ecbeautycenter.ro · coolaser.ro · epilaredefinitivasibiu.ro · avasalon.ro</p>
          </div>

          {/* Fise detaliate per competitor */}

          {/* 1. Shining Body */}
          <div className="bg-white border border-red-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-base">1. Shining Body — Concurent Principal</p>
                <p className="text-red-200 text-xs">shiningbody.ro · 2 locații Sibiu · 0740 500 527 · L-V 8-22, Sâm 8-15</p>
              </div>
              <span className="text-xs font-bold bg-white text-red-700 px-3 py-1 rounded-full shrink-0">CEL MAI PUTERNIC</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Echipamente (confirmate)</p>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>• Primelase HR Excellence ✅</li>
                    <li>• GentleLase Pro U (Alexandrite)</li>
                    <li>• Elysion Pro</li>
                    <li>• CoolTech Define</li>
                    <li>• VelaShape III</li>
                    <li>• Eximia HR77</li>
                    <li>• Hydrafacial (clasic, nu Syndeo)</li>
                    <li>• Oxygen hiperbaric</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Prețuri epilare femei</p>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>• Mustață: 57-150 lei/ședință</li>
                    <li>• Axile: 87-270 lei</li>
                    <li>• Picioare întregi: 489-1.210 lei</li>
                    <li>• <strong>Full body: 900 lei (-60% promo)</strong></li>
                    <li>• Pachet 3 zone: 349 lei</li>
                    <li className="text-amber-700">⚡ Full body mai ieftin ca Episculp!</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Promoții active</p>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>• -40% pe Primelase + Elysion Pro</li>
                    <li>• -60% Full Body (2280→900 lei)</li>
                    <li>• Ședință test gratuită</li>
                    <li>• Raffle iPhone 17 Pro Max</li>
                    <li>• (mai 1 – iulie 1 2026)</li>
                    <li className="text-red-700">⚠️ Concurență agresivă pe preț!</li>
                  </ul>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-xs font-bold text-red-800 mb-2">⚠️ Avantajele LOR față de Episculp</p>
                <div className="flex flex-wrap gap-2">
                  {["2 locații vs 1", "Program mai lung (8-22 vs 10-20)", "Prețuri mai mici pe unele zone", "GentleLase Alexandrite în plus", "Raffle iPhone — marketing viral"].map(a => (
                    <span key={a} className="text-xs bg-white text-red-700 border border-red-200 rounded-md px-2 py-0.5">{a}</span>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-800 mb-3">✅ Cum îi batem</p>
                <div className="space-y-2">
                  {[
                    { canal: "Diferențiator #1", text: "Observ 320 — analiză facială unică în Sibiu. Ei nu au. Entry-offer 149 lei → upsell facial + corp." },
                    { canal: "Diferențiator #2", text: "Hydrafacial SYNDEO (versiunea premium 2024) vs Hydrafacial clasic al lor. Syndeo = 6 faze customizabile, mai avansat." },
                    { canal: "Diferențiator #3", text: "Fondator CIDESCO — credential de medic estetician. Ei nu comunică nicio certificare echivalentă." },
                    { canal: "Google Ads", text: "Lansăm imediat Google Search pe 'epilare definitiva sibiu' — niciuna din clinici nu are campanie activă. Primii câștigă." },
                    { canal: "Mesaj vs prețul lor", text: "Nu ne bătem pe preț — ne batem pe calitate și expertiză. 'Primelase e același — diferența e în mâinile care îl folosesc și protocolul aplicat.'" },
                  ].map(({ canal, text }) => (
                    <div key={canal} className="flex gap-2 text-xs">
                      <span className="font-bold text-emerald-700 shrink-0 w-32">{canal}:</span>
                      <span className="text-slate-600">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-bold text-amber-800 mb-2">💬 Scripturi obiecții</p>
                <div className="space-y-2">
                  {[
                    { o: '"Shining Body are promo -60% full body la 900 lei"', r: '"Da, și noi avem full body la 910 lei inclus consultație CIDESCO + protocol personalizat Observ 320. La noi nu e promo — e prețul standard. Verificați ce include ședința la ei: test de piele? consultație? protocol pentru tipul vostru de păr?"' },
                    { o: '"Shining Body are și Primelase ca voi"', r: '"Exact — același aparat. Diferența e în know-how-ul cosmeticianului. Loredana e certificată CIDESCO și are protocol specific per tip de piele. Veniți la o consultație gratuită să vedeți diferența în practică."' },
                  ].map(({ o, r }) => (
                    <div key={o} className="bg-white rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-700 mb-1">❓ {o}</p>
                      <p className="text-xs text-slate-600">✅ {r}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Clinica Michaelis */}
          <div className="bg-white border border-orange-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-orange-600 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-base">2. Clinica Michaelis — Concurent Serios</p>
                <p className="text-orange-200 text-xs">michaelis.ro · Str. Dr Ioan Rațiu 11, Sibiu · 0737 593 470 · L-V 9-20</p>
              </div>
              <span className="text-xs font-bold bg-white text-orange-700 px-3 py-1 rounded-full shrink-0">COMPETITOR MAJOR</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Echipamente (confirmate)</p>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>• Primelase HR Excellence ✅</li>
                    <li>• Cooltech Define ✅</li>
                    <li>• HydraFacial ✅ (clasic)</li>
                    <li>• VelaShape III</li>
                    <li>• Microneedling Exceed</li>
                    <li>• CryoTouch</li>
                    <li>• Biodermogenesi</li>
                    <li>• Xsculpt (tonifiere musc.)</li>
                    <li>• Pilates Reformer (!)</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Prețuri cheie</p>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>• Epilare femei: 110-2.130 lei</li>
                    <li>• Epilare bărbați: 95-1.100 lei</li>
                    <li>• HydraFacial: 440-700 lei</li>
                    <li>• Cooltech: 500-1.900 lei</li>
                    <li>• VelaShape III: 500-1.400 lei</li>
                    <li>• Microneedling: 450-800 lei</li>
                    <li>• Pilates: 180 lei/ședință</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Avantajele LOR</p>
                  <ul className="text-xs text-red-700 space-y-1">
                    <li>• Portofoliu mai larg (Pilates!)</li>
                    <li>• VelaShape III + Biodermogenesi</li>
                    <li>• 10 ședințe drenaj GRATIS cu Cooltech</li>
                    <li>• Brand mai vechi în Sibiu</li>
                    <li>• Xsculpt — tonifiere musculară</li>
                  </ul>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-800 mb-3">✅ Cum îi batem</p>
                <div className="space-y-2">
                  {[
                    { canal: "Observ 320", text: "Ei nu au. Analiza facială 149 lei e entry-offer unic — conversie naturală spre HydraFacial Syndeo (premium vs clasicul lor)." },
                    { canal: "Hydrafacial Syndeo vs clasic", text: "Syndeo = versiunea 2024 cu customizare pe 6 faze + boosteri injectabili. Mesaj: 'Nu orice Hydrafacial e la fel — Syndeo e generația nouă'." },
                    { canal: "Digital", text: "Ei probabil nu au Meta Ads sau Google Ads activ. Lansăm noi primii — câștigăm toate căutările online înainte ca ei să reacționeze." },
                    { canal: "Fond CIDESCO", text: "Michaelis nu comunică o certificare echivalentă CIDESCO. Asta e argumentul de autoritate al Loredanei — de pus pe toate materialele." },
                  ].map(({ canal, text }) => (
                    <div key={canal} className="flex gap-2 text-xs">
                      <span className="font-bold text-emerald-700 shrink-0 w-32">{canal}:</span>
                      <span className="text-slate-600">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. EC Beauty Center */}
          <div className="bg-white border border-purple-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-purple-600 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-base">3. EC Beauty Center — Aceleași Echipamente</p>
                <p className="text-purple-200 text-xs">ecbeautycenter.ro · Str. Strungului 12, Sibiu · 0770 845 120 · L-V 8-20, Sâm 8-14</p>
              </div>
              <span className="text-xs font-bold bg-white text-purple-700 px-3 py-1 rounded-full shrink-0">CONCURENT DIRECT</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Ce au (confirmat)</p>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>• Primelase HR Excellence ✅ (se laudă "cel mai performant laser din Sibiu")</li>
                    <li>• CoolTech ✅</li>
                    <li>• QuadFreeze (criolipoliză cu 4-6 aplicatori simultan)</li>
                    <li>• Versus 3 Color laser</li>
                    <li>• Pressotherapy, electrostimulare</li>
                    <li>• Manichiură / Pedichiură</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Prețuri epilare Primelase</p>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>• Zone mici: 110 lei</li>
                    <li>• Zone medii: 210 lei</li>
                    <li>• Zone mari: 390 lei</li>
                    <li>• Picioare întregi: 950 lei</li>
                    <li>• <strong>Full body basic: 1.850 lei</strong></li>
                    <li>• <strong>Full body premium: 2.200 lei</strong></li>
                    <li className="text-emerald-700">→ Episculp 910 lei mai ieftin!</li>
                  </ul>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                  <p className="text-xs font-bold text-purple-700 mb-2">⚠️ Avantajul LOR: QuadFreeze</p>
                  <p className="text-xs text-slate-600">QuadFreeze tratează 4-6 zone simultan (față de 1-2 la Cooltech standard). Sesiune mai rapidă. Preț: 470-1.920 lei în funcție de aplicatori.</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <p className="text-xs font-bold text-emerald-700 mb-2">✅ Cum îi batem</p>
                  <p className="text-xs text-slate-600">Ei nu au Hydrafacial + Observ 320. Prețul nostru full body (910 lei) e mult sub full body-ul lor (1.850 lei). Mesaj: "Aceleași echipamente, preț mai bun, plus servicii exclusive pe care ei nu le au."</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. CooLaser */}
          <div className="bg-white border border-blue-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-base">4. CooLaser — ACEEAȘI STRADĂ cu Episculp!</p>
                <p className="text-blue-200 text-xs">coolaser.ro · Str. Doamna Stanca 5B, Șelimbăr · 0727 046 096 · L-V 9-19, Sâm 9-14</p>
              </div>
              <span className="text-xs font-bold bg-white text-blue-700 px-3 py-1 rounded-full shrink-0">🚨 LA 50m DISTANȚĂ</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                ⚠️ <strong>Situație critică:</strong> CooLaser e la Str. Doamna Stanca <strong>5B</strong>, Episculp e la <strong>5F</strong> — aceeași stradă, probabil același bloc sau clădiri vecine. Clienții care caută pe Google Maps pot vedea ambele opțiuni una lângă alta.
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Tehnologie</p>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>• Alexandrite 755nm ✅</li>
                    <li>• Diodă 810nm ✅</li>
                    <li>• Nd:YAG 1064nm ✅</li>
                    <li className="text-blue-700 font-medium">Triplu combo = orice tip de piele, chiar și bronzată</li>
                    <li className="text-red-600">❌ Fără criolipoliză</li>
                    <li className="text-red-600">❌ Fără Hydrafacial</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Prețuri — MULT MAI MICI</p>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>• Axile: 100 lei</li>
                    <li>• Față completă: 250 lei</li>
                    <li>• Pachet 8 zone: 300 lei</li>
                    <li>• Pachet 14 zone: 350 lei</li>
                    <li>• <strong>Full body 13 zone: 350 lei!</strong></li>
                    <li className="text-red-700 font-semibold">vs. Episculp 910 lei!</li>
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Cum îi batem</p>
                  <ul className="text-xs text-emerald-700 space-y-1">
                    <li>✅ Primelase HR vs triple combo — mai puțin ședințe (6-8 vs 10+)</li>
                    <li>✅ CIDESCO + protocol</li>
                    <li>✅ Servicii complete (corp + facial + remodelare)</li>
                    <li>✅ Observ 320 unic</li>
                    <li>✅ Clinică vs salon</li>
                  </ul>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-bold text-amber-800 mb-2">💬 Cum răspundem când clienta compară prețul cu CooLaser (vecin!)</p>
                <p className="text-xs text-slate-700">"350 lei la CooLaser înseamnă 10-15 ședințe pentru un rezultat complet = 3.500-5.250 lei total. Noi cu Primelase HR: 6-8 ședințe × 910 lei = 5.460-7.280 lei, dar cu consultație CIDESCO, protocol personalizat, Observ 320 inclus și rezultate garantate mai rapide. Calculați total, nu per ședință."</p>
              </div>
            </div>
          </div>

          {/* 5-7. Concurenti secundari */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Concurenți Secundari (date reale)</h3>
            <div className="space-y-3">
              {[
                {
                  nr: "5", nume: "Suav Studio / Flash Beauty", url: "epilaredefinitivasibiu.ro",
                  adresa: "Str. Mașiniștilor 91, Sibiu · 0731 030 327",
                  tech: "EPILDREAM laser + Hydrafacial + IMAGE Skincare",
                  preturi: "90-700 lei femei, 90-1000 lei bărbați · Hydrafacial 300-480 lei · 5+1 gratuit",
                  threat: "Au și Hydrafacial — dar nu Syndeo. Prețuri mici. EPILDREAM = tehnologie mai puțin cunoscută.",
                  beat: "Hydrafacial Syndeo vs clasicul lor. Primelase HR > EPILDREAM. CIDESCO.",
                  color: "border-slate-200",
                },
                {
                  nr: "6", nume: "AVA Salon", url: "avasalon.ro",
                  adresa: "Str. Luptei 40, Ap. 31, Sibiu · 0751 525 397",
                  tech: "Laser diodă 4 lungimi de undă + e-light (IPL + radiofrequency bipolară)",
                  preturi: "Full body 650 lei · Axile 3 ședințe 220 lei · Prima ședință gratuită",
                  threat: "Prima ședință GRATUITĂ — atractiv pentru clienți noi. Full body 650 lei vs 910 lei.",
                  beat: "IPL + diodă generic vs Primelase HR specific. Fără remodelare corporală sau Hydrafacial. Eficacitate: 95% vs? Noi avem Cooltech + Observ 320.",
                  color: "border-slate-200",
                },
                {
                  nr: "7", nume: "Epilux Sibiu", url: "epilux.ro",
                  adresa: "Bdul General Vasile Milea 28A, Sibiu · 0727 796 291",
                  tech: "Laser (tip nespecificat) · Prețuri mici · 7 zile/săptămână 8-20:30",
                  preturi: "Zone mici 80 lei · Zone mari 160-360 lei · Pachete combinate",
                  threat: "Deschis 7 zile/săptămână (inclusiv duminică) — accesibilitate maximă. Prețurile cele mai mici.",
                  beat: "Tehnologie nespecificată = nu putem compara direct. Focalizat DOAR pe epilare. Noi = clinică completă. Prețul mic = rezultate mai lente.",
                  color: "border-slate-200",
                },
              ].map(({ nr, nume, url, adresa, tech, preturi, threat, beat, color }) => (
                <div key={nr} className={`border rounded-xl p-4 ${color}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">{nr}</span>
                        <p className="font-bold text-slate-800">{nume}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 ml-8">{adresa}</p>
                    </div>
                    <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline shrink-0 ml-2">{url}</a>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="font-semibold text-slate-500 mb-1">Tehnologie & Prețuri</p>
                      <p className="text-slate-600">{tech}</p>
                      <p className="text-slate-600 mt-1">{preturi}</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold text-red-600 mb-0.5">⚠️ Amenințare</p>
                        <p className="text-slate-600">{threat}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-700 mb-0.5">✅ Cum îi batem</p>
                        <p className="text-slate-600">{beat}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plan de atac + mesaje corecte */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-1">💡 Mesaje Corecte de Diferențiere — Actualizate</h3>
            <p className="text-xs text-red-600 mb-4">⚠️ Anterior am spus "singurul Hydrafacial din Sibiu" — INCORECT. Mesajele de mai jos sunt corecte și verificate.</p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { context: "Noul diferențiator #1", mesaj: "Singurul aparat Observ 320 din Sibiu — analiză facială completă înainte de orice tratament. Protocol personalizat, nu tratament standard.", tip: "✅ CORECT" },
                { context: "Noul diferențiator #2", mesaj: "Hydrafacial SYNDEO — versiunea 2024, cu 6 faze complet personalizabile. Nu orice Hydrafacial e la fel. Syndeo e generația nouă.", tip: "✅ CORECT" },
                { context: "vs. preț CooLaser (vecin!)", mesaj: "Calculați costul total, nu pe ședință. 6-8 ședințe Primelase HR vs 10-15 ședințe cu alt laser. Plus: consultație CIDESCO, Observ 320, protocol dedicat — incluse.", tip: "✅ CORECT" },
                { context: "vs. toată concurența", mesaj: "Loredana Voinea, cosmetician CIDESCO. Cel mai înalt standard de certificare în estetică. Nici Shining Body, nici Michaelis, nici EC Beauty nu comunică o certificare echivalentă.", tip: "✅ CORECT" },
                { context: "EVITĂ acest mesaj", mesaj: "❌ 'Singurul Hydrafacial din Sibiu' — FALS. Shining Body, Michaelis și Suav au și ele Hydrafacial. Folosiți: 'Singurul Hydrafacial SYNDEO' sau 'Singurul Observ 320'.", tip: "🚫 INCORECT" },
                { context: "Google Ads — copy", mesaj: "Primelase HR Excellence Sibiu | Consultație CIDESCO inclusă | 6-8 ședințe rezultate permanente | Observ 320 unic în Sibiu | Str. Doamna Stanca 5F", tip: "✅ CORECT" },
              ].map(({ context, mesaj, tip }) => (
                <div key={context} className={`border rounded-xl p-4 ${tip.startsWith("🚫") ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">{context}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${tip.startsWith("🚫") ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>{tip}</span>
                  </div>
                  <p className={`text-sm italic ${tip.startsWith("🚫") ? "text-red-700" : "text-slate-700"}`}>"{mesaj}"</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── AD LIBRARY FACEBOOK ──────────────────────────────────────────── */}
      {tab === "admin" && (
        <div className="space-y-5">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">Analiză Ad Library Facebook</h2>
                <p className="text-blue-200 text-sm">Reclame active EpiSculpt Beauty Sibiu — date extrase din Meta Ad Library</p>
                <p className="text-blue-300 text-xs mt-1">Actualizat: 25 iunie 2026 · Sortat după impresii totale</p>
              </div>
              <a
                href="https://web.facebook.com/ads/library/?active_status=active&ad_type=all&country=RO&is_targeted_country=false&media_type=all&q=EpiSculpt%20Beauty%20Sibiu&search_type=keyword_unordered&sort_data[direction]=desc&sort_data[mode]=total_impressions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-xl transition-colors shrink-0 ml-4"
              >
                🔗 Deschide Ad Library
              </a>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-4">
              {[
                { label: "Reclame active", value: "6+", color: "text-white" },
                { label: "Format dominant", value: "Video 100%", color: "text-white" },
                { label: "Campanii paid", value: "2", color: "text-amber-300" },
                { label: "Boosted posts", value: "4+", color: "text-blue-200" },
              ].map((k) => (
                <div key={k.label} className="bg-white/10 rounded-xl p-3">
                  <p className="text-blue-200 text-xs">{k.label}</p>
                  <p className={`text-lg font-bold mt-0.5 ${k.color}`}>{k.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ALERTA GAP MAJOR */}
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚨</span>
              <div>
                <p className="font-bold text-red-800 text-base">GAP MAJOR: Zero campanie paid pentru Epilare Definitivă</p>
                <p className="text-red-700 text-sm mt-1">
                  Serviciul <strong>prioritar #1</strong> (Epilare Definitivă cu Primelase HR, Full Body 910 lei) nu are nicio reclamă paid activă.
                  Episculp promovează Remodelare Corporală și Analiza Facială Observ 320, dar lasă neacoperit cel mai căutat serviciu.
                </p>
                <p className="text-red-600 text-sm mt-2 font-semibold">
                  → Oportunitate imediată: Lansăm campania Meta Lead Gen pentru epilare definitiv (Meta C1 din strategia noastră).
                </p>
              </div>
            </div>
          </div>

          {/* Reclame active */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">📋 Reclame Active — Detalii</h3>
            <div className="space-y-4">

              {/* Campanie 1 */}
              <div className="border border-violet-200 bg-violet-50 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Remodelare Corporală — Reducere 40%</p>
                      <p className="text-xs text-slate-500">Pornit: 20 mai 2026 · Multiple versiuni · FB + IG + Messenger</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                    <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">PAID</span>
                    <span className="text-xs text-slate-500">Learn More</span>
                  </div>
                </div>
                <div className="bg-white/70 rounded-lg p-3 text-xs text-slate-700 mb-2 italic">
                  "Te chinui să obții corpul tonifiat pe care ți-l dorești? 🤔 Profită de reducerile de până la 40% și ajuță-ți corpul să fie în cea mai bună formă cu tratamentul de Remodelare corporală!"
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-md">✅ Non-invaziv și fără durere</span>
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-md">✅ Elimină grăsimea localizată</span>
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-md">✅ Reduce celulita</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">🎬 Video</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">Label: Pana la 40% Reducere</span>
                </div>
              </div>

              {/* Campanie 2 */}
              <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Analiză Facială Observ 320 — 149 lei</p>
                      <p className="text-xs text-slate-500">Pornit: 27 mai 2026 · 3 variante creative · FB + IG + Messenger</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">PAID</span>
                    <span className="text-xs text-slate-500">Learn More</span>
                  </div>
                </div>
                <div className="bg-white/70 rounded-lg p-3 text-xs text-slate-700 mb-2 italic">
                  "Tu știi ce are cu adevărat nevoie tenul tău? 🌟 La EpiSculpt Beauty poți beneficia de o analiză și diagnoză facială avansată cu Observ 320 la prețul de 149 lei."
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">✅ Identifică probleme ascunse</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">🎬 Video</span>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md">⭐ Singurul aparat din Sibiu</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">Entry-point offer 149 lei</span>
                </div>
              </div>

              {/* Boost-uri organice */}
              <div className="border border-slate-200 bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-slate-400 text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <p className="font-bold text-slate-700 text-sm">Boost-uri Organice (4+ reclame) — FB + IG</p>
                    <p className="text-xs text-slate-500">Pornite: 19 iunie 2026 · CTA: Visit Instagram</p>
                  </div>
                  <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full ml-auto shrink-0">BOOST ORGANIC</span>
                </div>
                <div className="space-y-2">
                  {[
                    { titlu: "Brand storytelling — Loredana & echipa", text: '"Dacă ajuță la ceva, sunteți mereu în mintea Loredanei 🧡 — muncă permanentă, de care suntem foarte mândri."' },
                    { titlu: "Hydrafacial — Behind the scenes", text: '"Ready, set, gata de Hydrafacial sau... Loredana are o grămadă de roluri în același timp și le face pe toate extraordinar."' },
                    { titlu: "Epilare + Servicii generale Sibiu", text: '"Crazy sau nu, așteptăm telefonul tău pentru cele mai bune servicii de epilare definitivă, tratamente corporale și faciale în Sibiu 😉"' },
                    { titlu: "Alt post organic (detalii lipsă)", text: "Conținut parțial vizibil — ID: 1378285514113176, pornit 19 iunie 2026." },
                  ].map(({ titlu, text }) => (
                    <div key={titlu} className="bg-white rounded-lg p-3 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-700 mb-1">{titlu}</p>
                      <p className="text-xs text-slate-500 italic">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Analiza mesaje & tonalitate */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">🎭 Analiză Mesaje & Tonalitate</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ce fac BINE</p>
                {[
                  { icon: "✅", text: "Ton cald, autentic — vocea fondatoarei Loredana e prezentă" },
                  { icon: "✅", text: "Evidențiază diferențiatorul: 'Singurul aparat din Sibiu' (Observ 320)" },
                  { icon: "✅", text: "Oferă prețuri clare: 149 lei (Observ), -40% (Remodelare)" },
                  { icon: "✅", text: "Folosesc liste cu beneficii (✅ bullet points) — scanabil rapid" },
                  { icon: "✅", text: "Produc conținut constant — 6 reclame în 5 săptămâni" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="shrink-0">{icon}</span>{text}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ce lipsește / GAP-uri</p>
                {[
                  { icon: "❌", text: "Nicio reclamă paid pentru Epilare Definitivă (serviciul #1)" },
                  { icon: "❌", text: "Nicio reclamă cu Google Ads — traficul de intenție ridicată e neacoperit" },
                  { icon: "❌", text: "Niciun format carusel sau imagine statică — risc de oboseală vizuală" },
                  { icon: "❌", text: "Niciun retargeting vizibil (follow-up vizitatori site sau form openers)" },
                  { icon: "❌", text: "Lipsesc testimoniale video sau rezultate înainte/după în reclame" },
                  { icon: "⚠️", text: "Boost-urile organice duc pe Instagram, nu pe landing page cu formular" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="shrink-0">{icon}</span>{text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comparatie strategie noastra */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-1">⚡ Comparație: Ce rulează EI vs. Ce propunem NOI</h3>
            <p className="text-xs text-slate-400 mb-4">Bazat pe datele Ad Library — oportunități clare de diferențiere</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 text-slate-500 font-semibold">Serviciu / Canal</th>
                    <th className="text-center py-2 px-3 text-slate-500 font-semibold">Ei rulează acum</th>
                    <th className="text-center py-2 px-3 text-slate-500 font-semibold">Strategia noastră</th>
                    <th className="text-left py-2 px-3 text-slate-500 font-semibold">Oportunitate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    {
                      serviciu: "Epilare Definitivă (Primelase)",
                      ei: "❌ Nimic",
                      noi: "✅ Meta C1 Lead Gen + Google Search",
                      oportunitate: "🔥 URGENT — gap total, concurența poate câștiga leads",
                    },
                    {
                      serviciu: "Remodelare Corporală (Cooltech)",
                      ei: "✅ Campanie paid (-40%)",
                      noi: "📅 Planificată sezon (Mai-Oct)",
                      oportunitate: "Deja acoperit de ei — diferențierea prin Primelase e mai importantă",
                    },
                    {
                      serviciu: "Analiză Facială Observ 320",
                      ei: "✅ Campanie paid (149 lei)",
                      noi: "—",
                      oportunitate: "Tactic bun de entry-offer — considerăm să îl adăugăm în funnel",
                    },
                    {
                      serviciu: "Hydrafacial Syndeo",
                      ei: "⚡ Boost organic",
                      noi: "✅ Meta C2 Brand Awareness",
                      oportunitate: "Ei comunică brand, noi vom face lead gen direct cu prețul",
                    },
                    {
                      serviciu: "Google Ads (Search)",
                      ei: "❌ Nimic vizibil",
                      noi: "✅ 1 campanie Search dedicată",
                      oportunitate: "🔥 Monopol pe 'epilare definitiva sibiu' — zero concurență plătită acum",
                    },
                    {
                      serviciu: "Retargeting",
                      ei: "❌ Nimic vizibil",
                      noi: "✅ Retargeting vizitatori site (0.3 lei/interacțiune)",
                      oportunitate: "Leads care au văzut dar nu au completat — ieftini de recapturat",
                    },
                  ].map(({ serviciu, ei, noi, oportunitate }) => (
                    <tr key={serviciu} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-medium text-slate-700">{serviciu}</td>
                      <td className="py-2.5 px-3 text-center">{ei}</td>
                      <td className="py-2.5 px-3 text-center">{noi}</td>
                      <td className="py-2.5 px-3 text-slate-600">{oportunitate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recomandari actionale */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">🎯 Recomandări Acționabile — Prioritizate</h3>
            <div className="space-y-3">
              {[
                {
                  nr: "1", urgenta: "URGENT", color: "bg-red-50 border-red-200",
                  titlu: "Lansează Meta C1 — Lead Gen Epilare Definitivă",
                  desc: "Ei nu rulează nimic pe epilare. Moment perfect să ocupi spațiul. Reel înainte/după + formular Meta nativ + WhatsApp Direct. Buget: 250 lei/7 zile.",
                  actiuni: ["Creativ: Reel 9:16 — clientă după 6 ședințe Primelase", "Text: 'Full Body 910 lei — definitiv scăpată de brici'", "Lead Form Meta nativ: nume + telefon + zonă dorită", "CTA: WhatsApp Direct sau formular"],
                },
                {
                  nr: "2", urgenta: "URGENT", color: "bg-red-50 border-red-200",
                  titlu: "Activează Google Ads Search — Epilare Definitivă Sibiu",
                  desc: "Zero concurență plătită pe Google acum. 'Epilare definitiva sibiu' e neacoperit — CPC probabil sub 10 lei. ROI imediat.",
                  actiuni: ["Campanie Search cu cuvintele cheie din tab Google Ads", "Landing page dedicat cu formular + număr telefon vizibil", "Extensii apel + locație + prețuri", "Analiză săptămânală CPC și ajustare licitație"],
                },
                {
                  nr: "3", urgenta: "RECOMANDAT", color: "bg-amber-50 border-amber-200",
                  titlu: "Adaugă format carusel și imagini statice",
                  desc: "Ei folosesc 100% video. Carusel cu 'Zone corporale + prețuri cu reducere' sau 'Pas cu pas epilare la Episculp' poate performa diferit și reduce oboseala vizuală.",
                  actiuni: ["Carusel: 5 slide-uri zone epilare + prețuri -30%", "Imagine statică: înainte/după cu testimonial text", "Test A/B: video vs. imagine pe același audience"],
                },
                {
                  nr: "4", urgenta: "RECOMANDAT", color: "bg-amber-50 border-amber-200",
                  titlu: "Inspiră-te din entry-offer-ul lor (Observ 320 → 149 lei)",
                  desc: "Tactic inteligent: oferă o primă consultație la preț mic → upsell servicii mari. Considerăm 'Consultație gratuită epilare definitiva' sau 'Testare laser gratuită 1 zonă mică'.",
                  actiuni: ["Consultație 0 lei sau testare 1 zonă gratuită ca entry point", "Follow-up secvențial: zi 1 → zi 3 → zi 7 WhatsApp", "Conversie la pachet complet după consultație"],
                },
                {
                  nr: "5", urgenta: "OPTIONAL", color: "bg-blue-50 border-blue-200",
                  titlu: "Activează Retargeting",
                  desc: "Ei nu au retargeting vizibil. Vizitatorii site-ului episculpt-beauty.ro care nu au completat formularul sunt ieftini de recapturat (0.3-0.5 lei/interacțiune).",
                  actiuni: ["Instalare/verificare Meta Pixel pe site", "Custom Audience: vizitatori site ultimele 30 zile", "Creativ ofertă cu countdown: 'Rezervă azi — mai ai locuri!'", "Buget minimal: 50-100 lei/săptămână"],
                },
              ].map(({ nr, urgenta, color, titlu, desc, actiuni }) => (
                <div key={nr} className={`border rounded-xl p-4 ${color}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-white font-bold text-xs flex items-center justify-center text-slate-700 shrink-0 shadow-sm">{nr}</span>
                      <p className="font-bold text-slate-800 text-sm">{titlu}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                      urgenta === "URGENT" ? "bg-red-100 text-red-700" :
                      urgenta === "RECOMANDAT" ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>{urgenta}</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {actiuni.map((a) => (
                      <span key={a} className="text-xs bg-white/70 text-slate-600 border border-white rounded-lg px-2 py-0.5">✓ {a}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center">Date Ad Library Meta · EpiSculpt Beauty Sibiu · Analizat 25 iunie 2026</p>
        </div>
      )}

      <p className="mt-6 text-xs text-slate-400 text-center">Salvat automat în browser · Episculp Campaign Workspace · episculpt-beauty.ro</p>
    </div>
  );
}
