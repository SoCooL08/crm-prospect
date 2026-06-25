"use client";

import { useState, useEffect } from "react";
import {
  Sparkles, Target, TrendingUp, Calendar, Image, Users,
  CheckCircle2, Circle, Phone, Euro, Zap, ChevronDown, ChevronUp,
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
  id: string; luna: string; tip: string; serviciu: string; descriere: string; status: "idee" | "productie" | "gata" | "publicat";
};

// ── Defaults ───────────────────────────────────────────────────────────────

const googleDefault: CampaniaGoogle = {
  nume: "Episculp — Epilare Definitivă Search",
  tip: "Search",
  buget_zilnic: "50",
  cpc_tinta: "10",
  cuvinte_cheie: [
    "epilare definitiva sibiu", "laser epilare sibiu", "epilare definitiva pret",
    "salon epilare sibiu", "epilare definitiva femei sibiu", "epilare definitiva barbati sibiu",
    "epilare laser pret sedinta",
  ],
  cuvinte_negative: [
    "gratuit", "acasa", "aparat", "cumpara aparat", "ipl acasa", "tutorial",
  ],
  titluri: [
    "Epilare Definitivă Sibiu | Episculp",
    "Laser Epilare | Rezultate Permanente",
    "Fără Păr Nedorit — Rezervă Acum",
    "Bărbați & Femei | 8-10 Ședințe",
    "Consultație Gratuită Epilare Laser",
  ],
  descrieri: [
    "Epilare definitivă cu laser în Sibiu. Femei 6-8 ședințe, bărbați 8-10 ședințe. Consultație inclusă. Rezervă online!",
    "Rezultate permanente în 12 luni. Tehnologie profesională Mikadis. Prețuri accesibile. Sună acum pentru consultație.",
  ],
  extensii: ["Apel telefonic", "Locație", "Prețuri servicii", "Promoții sezoniere"],
  landing_page: "pagina dedicata epilare definitiva cu formular lead + WhatsApp",
  status: "de setat",
  note: "1 singură campanie Google. CPC țintă 10 lei/click. Prioritate: epilare definitivă.",
};

const metaDefaults: CampaniaMeta[] = [
  {
    nume: "Meta C1 — Lead Gen Epilare Definitivă",
    obiectiv: "Lead Generation",
    buget: "250 lei / 7 zile (boost săptămânal)",
    durata: "rulare continuă cu analiză săptămânală",
    audienta: "Doamne 22-45 ani, Sibiu + împrejurimi, care lucrează la birou sau au firme",
    varsta: "22-45",
    interese: ["beauty", "estetică", "îngrijire personală", "epilare", "salon", "fitness", "wellness", "business women"],
    formate: ["Reel 9:16", "Carusel înainte/după", "Story cu CTA WhatsApp", "Video testimonial"],
    titlu_ad: "Scapă de brici pentru totdeauna 👙",
    text_ad: "Epilare definitivă în Sibiu — rezultate vizibile după prima ședință. Femei: 6-8 ședințe. Bărbați: 8-10 ședințe. Consultație gratuită inclusă! 📞 Rezervă acum →",
    cta: "Trimite mesaj / Completează formularul",
    tip_form: "Meta Lead Form + Typeform landing page",
    status: "de setat",
    note: "Reclame cu buton de info/WhatsApp. Formulare Meta native + Typeform. 0.3 lei per follow-up retargeting.",
  },
  {
    nume: "Meta C2 — Brand Awareness + Boost Organic",
    obiectiv: "Reach / Engagement",
    buget: "150 lei / 7 zile",
    durata: "boost posturi organice performante",
    audienta: "Lookalike din clienți existenți + interese beauty Sibiu",
    varsta: "25-50",
    interese: ["remodelare corporala", "facial", "acnee", "îngrijire ten", "beauty sibiu", "wellness"],
    formate: ["Post organic boosted", "Reel educațional", "Story ofertă lunară"],
    titlu_ad: "Episculp Sibiu — Frumusețe Redefinită",
    text_ad: "Shining Body, Remodelare Corporală, Facial profesional. 3 servicii complete, 1 singur salon. Vino pentru consultație și descoperă ce e potrivit pentru tine.",
    cta: "Află mai multe / Sună acum",
    tip_form: "trafic spre profil Instagram + WhatsApp",
    status: "de setat",
    note: "Boost posturi ce funcționează organic. Materiale beauty din nișă. Clienți fideli — program fidelizare sezon.",
  },
];

const luniCalendar = [
  { luna: "Ianuarie", sezon: "Pauza", note: "Sezon slab — pauza sau buget minim. Clienti fideli retention." },
  { luna: "Februarie", sezon: "Pauza", note: "Continuare pauza. Pregătire materiale pentru martie." },
  { luna: "Martie", sezon: "Activ", note: "Reluare campanii. Primăvara — mesaj: pregătire vară." },
  { luna: "Aprilie", sezon: "Activ", note: "Peak sezon. Buget maxim epilare definitivă. Vacanțe se apropie." },
  { luna: "Mai", sezon: "Activ", note: "Cel mai bun moment — vară se apropie. Push agresiv lead gen." },
  { luna: "Iunie", sezon: "Activ", note: "Sezon de vârf. Campanii running, analiză săptămânală boost." },
  { luna: "Iulie", sezon: "Activ", note: "Vară — continuare. Target doamne cu firme (concediu mai târziu)." },
  { luna: "August", sezon: "Pauza", note: "Concedii — pauza campanii sau buget minimal." },
  { luna: "Septembrie", sezon: "Target special", note: "🎯 TARGET: Mămici revenite din concediu. Mesaj specific: re-start epilare, corp post-vară." },
  { luna: "Octombrie", sezon: "Activ", note: "Toamna — remodelare corporală, facial. Buget normal." },
  { luna: "Noiembrie", sezon: "Activ", note: "Pre-sezon sărbători. Oferte pachet. Facial + epilare." },
  { luna: "Decembrie", sezon: "Activ", note: "Sărbători — gift vouchers, oferte. Sezon bun facial + corp." },
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

// ── Editable field ─────────────────────────────────────────────────────────

function F({ label, value, onChange, big, mono }: {
  label: string; value: string; onChange?: (v: string) => void; big?: boolean; mono?: boolean;
}) {
  if (!onChange) {
    return (
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className={`text-sm text-slate-800 ${mono ? "font-mono bg-slate-50 rounded px-2 py-1" : ""}`}>{value || "—"}</p>
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
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Adaugă și Enter..."
          className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button onClick={add} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">+</button>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

type Tab = "overview" | "google" | "meta1" | "meta2" | "calendar" | "materiale";

export default function EpisculpPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [google, setGoogle] = useState<CampaniaGoogle>(googleDefault);
  const [meta, setMeta] = useState<CampaniaMeta[]>(metaDefaults);
  const [materiale, setMateriale] = useState<Material[]>([
    { id: "1", luna: "Iulie 2025", tip: "Reel", serviciu: "Epilare definitivă", descriere: "Transformare înainte/după — femei", status: "idee" },
    { id: "2", luna: "Iulie 2025", tip: "Story", serviciu: "Remodelare corporală", descriere: "Testimonial clientă + rezultate 10 zile", status: "idee" },
    { id: "3", luna: "Iulie 2025", tip: "Post", serviciu: "Facial", descriere: "Educațional: tipuri de ten + soluții Episculp", status: "idee" },
  ]);
  const [leaduri, setLeaduri] = useState({ total_luna: "", cost_per_lead: "", conversie: ">30", buget_cheltuit: "" });

  // Persist în localStorage
  useEffect(() => {
    const saved = localStorage.getItem("episculp_data");
    if (saved) {
      const d = JSON.parse(saved);
      if (d.google) setGoogle(d.google);
      if (d.meta) setMeta(d.meta);
      if (d.materiale) setMateriale(d.materiale);
      if (d.leaduri) setLeaduri(d.leaduri);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("episculp_data", JSON.stringify({ google, meta, materiale, leaduri }));
  }, [google, meta, materiale, leaduri]);

  function updateMaterial(id: string, patch: Partial<Material>) {
    setMateriale((prev) => prev.map((m) => m.id === id ? { ...m, ...patch } : m));
  }

  function addMaterial() {
    const id = Date.now().toString();
    setMateriale((prev) => [...prev, { id, luna: "", tip: "Reel", serviciu: "", descriere: "", status: "idee" }]);
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "overview", label: "📊 Overview" },
    { id: "google", label: "🔵 Google Ads" },
    { id: "meta1", label: "📘 Meta C1 — Lead Gen" },
    { id: "meta2", label: "📗 Meta C2 — Boost" },
    { id: "calendar", label: "📅 Calendar Sezoane" },
    { id: "materiale", label: "🎬 Materiale" },
  ];

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">E</div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Episculp</h1>
            <p className="text-slate-500 text-sm">Ionuț Volnea · Contact: Adi · Salon estetică Sibiu</p>
          </div>
          <div className="ml-auto flex gap-2">
            <a href="tel:" className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600">
              <Phone className="w-4 h-4" /> Sună Adi
            </a>
          </div>
        </div>

        {/* KPI bar */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: "Buget total / lună", value: "9.000 lei", color: "text-slate-900" },
            { label: "Target leads / lună", value: "80–90", color: "text-blue-600" },
            { label: "Conv. țintă", value: ">30%", color: "text-emerald-600" },
            { label: "CPC țintă Google", value: "≤10 lei", color: "text-amber-600" },
          ].map((k) => (
            <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <p className="text-xs text-slate-400 uppercase tracking-wide">{k.label}</p>
              <p className={`text-xl font-bold mt-0.5 ${k.color}`}>{k.value}</p>
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
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
      {tab === "overview" && (
        <div className="space-y-5">
          {/* Servicii */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-pink-500" /> Servicii Episculp</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { s: "Epilare Definitivă", d: "Femei: 6–8 ședințe / Bărbați: 8–10 ședințe · 12 luni · Consultație inclusă", hot: true },
                { s: "Shyning Body / Mikadis", d: "Tratamente corporale de strălucire și tonifiere", hot: false },
                { s: "Remodelare Corporală", d: "Program 10 zile sau 1 lună jumătate · Rezultate vizibile garantate", hot: false },
                { s: "Facial", d: "Consultație inclusă · Tratamente ten (acnee, anti-aging, hidratare)", hot: false },
                { s: "Acnee", d: "Protocol specializat acnee · Inclus în servicii facial", hot: false },
              ].map(({ s, d, hot }) => (
                <div key={s} className={`rounded-xl p-4 border ${hot ? "bg-pink-50 border-pink-200" : "bg-slate-50 border-slate-200"}`}>
                  <p className={`font-semibold text-sm ${hot ? "text-pink-800" : "text-slate-800"}`}>
                    {hot && "🔥 "}{s}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Target audience */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" /> Audiență Principală</h2>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { t: "🏢 Doamne la birou", d: "22–45 ani, angajate corporate, venit mediu-ridicat, Sibiu" },
                { t: "👩‍💼 Doamne cu firme", d: "Antreprenoare, businesswomen, timp limitat, valorizează eficiența" },
                { t: "👩 Mămici (Septembrie)", d: "Revenite din concediu, sezon special — mesaj dedicat" },
              ].map(({ t, d }) => (
                <div key={t} className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="font-semibold text-sm text-blue-800">{t}</p>
                  <p className="text-xs text-blue-600 mt-0.5">{d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Budget tracker */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Euro className="w-4 h-4 text-emerald-500" /> Urmărire Buget Lunar</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "Leaduri generate luna aceasta", key: "total_luna" as const, placeholder: "ex: 45" },
                { label: "Cost per lead (lei)", key: "cost_per_lead" as const, placeholder: "ex: 112" },
                { label: "Rată conversie (%)", key: "conversie" as const, placeholder: ">30" },
                { label: "Buget cheltuit (lei)", key: "buget_cheltuit" as const, placeholder: "ex: 4500" },
              ].map(({ label, key, placeholder }) => (
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
                📊 <strong>{leaduri.total_luna} leads</strong> × <strong>{leaduri.cost_per_lead} lei</strong> = {Number(leaduri.total_luna) * Number(leaduri.cost_per_lead)} lei cheltuit
                {leaduri.buget_cheltuit && ` · Buget rămas: ${9000 - Number(leaduri.buget_cheltuit)} lei`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── GOOGLE ADS ──────────────────────────────────────────────────────── */}
      {tab === "google" && (
        <div className="bg-white border border-blue-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">G</span>
              </div>
              <div>
                <p className="text-white font-bold">Google Ads — 1 Campanie</p>
                <p className="text-blue-200 text-xs">Search · Epilare Definitivă Sibiu</p>
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
            <TagsField label="Cuvinte negative" tags={google.cuvinte_negative} onChange={(t) => setGoogle({ ...google, cuvinte_negative: t })} />
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

      {/* ── META C1 ──────────────────────────────────────────────────────────── */}
      {(tab === "meta1" || tab === "meta2") && (() => {
        const idx = tab === "meta1" ? 0 : 1;
        const c = meta[idx];
        const update = (patch: Partial<CampaniaMeta>) => setMeta((prev) => prev.map((m, i) => i === idx ? { ...m, ...patch } : m));
        const headerColor = idx === 0 ? "bg-blue-700" : "bg-emerald-700";
        return (
          <div className={`bg-white border ${idx === 0 ? "border-blue-200" : "border-emerald-200"} rounded-2xl shadow-sm overflow-hidden`}>
            <div className={`${headerColor} px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-sm" style={{ color: idx === 0 ? "#1d4ed8" : "#15803d" }}>f</div>
                <div>
                  <p className="text-white font-bold">{c.nume}</p>
                  <p className="text-white/70 text-xs">{c.obiectiv}</p>
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
              <div className="grid md:grid-cols-2 gap-4">
                <F label="Call to Action" value={c.cta} onChange={(v) => update({ cta: v })} />
              </div>
              <F label="Note" value={c.note} onChange={(v) => update({ note: v })} big />
            </div>
          </div>
        );
      })()}

      {/* ── CALENDAR ─────────────────────────────────────────────────────────── */}
      {tab === "calendar" && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 mb-2">Campanii per sezoane — pauze: <strong>Ian-Feb</strong> și <strong>Aug</strong>. Target special: <strong>Septembrie = Mămici</strong>.</p>
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

      {/* ── MATERIALE ────────────────────────────────────────────────────────── */}
      {tab === "materiale" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">3 materiale noi / lună · organic + boost. Tipuri: Reel, Story, Post, Video testimonial.</p>
            <button onClick={addMaterial} className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl bg-pink-600 text-white hover:bg-pink-700 transition-colors">
              + Material nou
            </button>
          </div>
          {materiale.map((m) => (
            <div key={m.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="grid md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Lună</label>
                  <input value={m.luna} onChange={(e) => updateMaterial(m.id, { luna: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="ex: Iulie 2025" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Tip</label>
                  <select value={m.tip} onChange={(e) => updateMaterial(m.id, { tip: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {["Reel", "Story", "Post", "Video testimonial", "Carusel", "Boost organic"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Serviciu</label>
                  <select value={m.serviciu} onChange={(e) => updateMaterial(m.id, { serviciu: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {["Epilare definitivă", "Shyning Body", "Remodelare corporală", "Facial", "Acnee", "General brand"].map((s) => <option key={s}>{s}</option>)}
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
              <div className="mt-2">
                <input value={m.descriere} onChange={(e) => updateMaterial(m.id, { descriere: e.target.value })}
                  placeholder="Descriere material / concept..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-slate-400 text-center">Salvat automat în browser · Episculp Campaign Workspace</p>
    </div>
  );
}
