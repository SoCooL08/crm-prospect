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

type Tab = "overview" | "google" | "meta1" | "meta2" | "calendar" | "materiale" | "concurenti";

export default function EpisculpPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [google, setGoogle] = useState<CampaniaGoogle>(googleDefault);
  const [meta, setMeta] = useState<CampaniaMeta[]>(metaDefaults);
  const [materiale, setMateriale] = useState<Material[]>([
    { id: "1", luna: "Iulie 2025", tip: "Reel", serviciu: "Epilare definitivă", descriere: "Înainte/după — clientă după 6 ședințe Primelase. Text overlay: 'Definitiv scăpată de brici'", status: "idee" },
    { id: "2", luna: "Iulie 2025", tip: "Video educațional", serviciu: "Criolipolizã", descriere: "Cum funcționează Cooltech — filmulețul dispozitivului pe corp. 'Fără bisturiu, fără recuperare'", status: "idee" },
    { id: "3", luna: "Iulie 2025", tip: "Post carusel", serviciu: "Hydrafacial", descriere: "Slide 1: Ce e Hydrafacial Syndeo. Slide 2-4: Pașii procedurii. Slide 5: Rezultat. 'Unica în Sibiu'", status: "idee" },
  ]);
  const [leaduri, setLeaduri] = useState({ total_luna: "", cost_per_lead: "", conversie: ">30", buget_cheltuit: "" });

  useEffect(() => {
    const saved = localStorage.getItem("episculp_data_v2");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.google) setGoogle(d.google);
        if (d.meta) setMeta(d.meta);
        if (d.materiale) setMateriale(d.materiale);
        if (d.leaduri) setLeaduri(d.leaduri);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("episculp_data_v2", JSON.stringify({ google, meta, materiale, leaduri }));
  }, [google, meta, materiale, leaduri]);

  function updateMaterial(id: string, patch: Partial<Material>) {
    setMateriale((prev) => prev.map((m) => m.id === id ? { ...m, ...patch } : m));
  }

  function addMaterial() {
    setMateriale((prev) => [...prev, {
      id: Date.now().toString(), luna: "", tip: "Reel", serviciu: "Epilare definitivă", descriere: "", status: "idee",
    }]);
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "overview", label: "📊 Overview" },
    { id: "google", label: "🔵 Google Ads" },
    { id: "meta1", label: "📘 Meta C1 — Lead Gen" },
    { id: "meta2", label: "📗 Meta C2 — Boost" },
    { id: "calendar", label: "📅 Calendar" },
    { id: "materiale", label: "🎬 Materiale" },
    { id: "concurenti", label: "⚔️ Concurenți" },
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

        {/* KPI bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Buget total / lună", value: "9.000 lei", color: "text-slate-900", sub: "Google + Meta" },
            { label: "Target leads / lună", value: "80–90", color: "text-blue-600", sub: "min. 50 leads" },
            { label: "Conv. țintă client", value: ">30%", color: "text-emerald-600", sub: "din leads" },
            { label: "CPC țintă Google", value: "≤10 lei", color: "text-amber-600", sub: "epilare definitivă" },
          ].map((k) => (
            <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <p className="text-xs text-slate-400 uppercase tracking-wide">{k.label}</p>
              <p className={`text-xl font-bold mt-0.5 ${k.color}`}>{k.value}</p>
              <p className="text-xs text-slate-400">{k.sub}</p>
            </div>
          ))}
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

      {/* ── GOOGLE ADS ──────────────────────────────────────────────────── */}
      {tab === "google" && (
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
      {(tab === "meta1" || tab === "meta2") && (() => {
        const idx = tab === "meta1" ? 0 : 1;
        const c = meta[idx];
        const update = (patch: Partial<CampaniaMeta>) =>
          setMeta((prev) => prev.map((m, i) => i === idx ? { ...m, ...patch } : m));
        const hc = idx === 0 ? "bg-blue-700" : "bg-emerald-700";
        const bc = idx === 0 ? "border-blue-200" : "border-emerald-200";
        return (
          <div className={`bg-white border ${bc} rounded-2xl shadow-sm overflow-hidden`}>
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
      })()}

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
      {tab === "materiale" && (
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
        <div className="space-y-4">
          <p className="text-sm text-slate-500 mb-2">Analiza competiției directe în Sibiu — pentru poziționare campanii și diferențiere mesaje.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-2">
            ⚠️ <strong>Shyning Body</strong> și <strong>Mikadis</strong> sunt concurenți direcți ai Episculp — nu servicii proprii.
          </div>
          {[
            {
              nume: "Shyning Body",
              nisa: "Epilare definitivă / Estetică corporală — Sibiu",
              diferenta: "Concurent direct pe epilare definitivă. Episculp răspunde cu: tehnologie Primelase HR (mai avansată) + consultație inclusă + locație modernă Șelimbăr.",
              strategie: "Bid pe cuvinte cheie generice 'epilare definitiva sibiu' — NU pe brandul Shyning Body. Accent pe superioritatea Primelase față de tehnologiile mai vechi.",
            },
            {
              nume: "Mikadis",
              nisa: "Estetică / Tratamente corporale — Sibiu",
              diferenta: "Concurent pe remodelare corporală. Episculp diferențiere: Cooltech (criolipolizã FDA) + Viora V10 + zero timp recuperare + abordare non-invazivă.",
              strategie: "Accent pe 'zero timp recuperare', 'rezultate vizibile în 4 săptămâni', 'certificat FDA & CE' în reclame față de Mikadis.",
            },
            {
              nume: "Alte saloane estetică Sibiu",
              nisa: "Beauty general — saloane clasice",
              diferenta: "Episculp e clinică medicală estetică, nu simplu salon. Specialiști CIDESCO, protocoale clare, evaluare personalizată, tehnologie certificată.",
              strategie: "Mesaj diferențiator: 'Nu un salon — o clinică de estetică non-invazivă. Rezultate progresive, fără promisiuni exagerate.'",
            },
          ].map(({ nume, nisa, diferenta, strategie }) => (
            <div key={nume} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-slate-800">{nume}</p>
                  <p className="text-xs text-slate-500">{nisa}</p>
                </div>
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-lg shrink-0">Concurent direct</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs"><span className="font-semibold text-slate-600">Diferențiere Episculp: </span><span className="text-slate-600">{diferenta}</span></p>
                <p className="text-xs"><span className="font-semibold text-emerald-700">Strategie campanie: </span><span className="text-slate-600">{strategie}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-slate-400 text-center">Salvat automat în browser · Episculp Campaign Workspace · episculpt-beauty.ro</p>
    </div>
  );
}
