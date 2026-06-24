"use client";

import { useEffect, useState, useRef } from "react";
import {
  Loader2, ChevronDown, ChevronRight, Copy, CheckCheck,
  Search, Target, TrendingUp, Zap, Calendar, BarChart2,
  Tag, MousePointerClick, Users, MessageSquare, DollarSign,
} from "lucide-react";
import { genereazaSOSTAC, LeadSOSTACInput, SOSTACData } from "@/lib/sostac";

// ─── Storage helpers ──────────────────────────────────────────────────────────

function loadSaved(leadId: string): Partial<SOSTACData> | null {
  try {
    const raw = localStorage.getItem(`sostac_${leadId}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveLocal(leadId: string, data: SOSTACData) {
  try { localStorage.setItem(`sostac_${leadId}`, JSON.stringify(data)); } catch {}
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectiuneCard({
  icon: Icon, culoare, litera, titlu, children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  culoare: string;
  litera: string;
  titlu: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${culoare}`}>
          <span className="text-sm font-black text-white">{litera}</span>
        </div>
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="font-semibold text-slate-800 text-sm flex-1 text-left">{titlu}</span>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-slate-100 pt-4">{children}</div>}
    </div>
  );
}

function EditableText({
  value, onChange, rows = 5,
}: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono"
    />
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copiat, setCopiat] = useState(false);
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text).then(() => { setCopiat(true); setTimeout(() => setCopiat(false), 2000); })}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${copiat ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
    >
      {copiat ? <><CheckCheck className="w-3.5 h-3.5" /> Copiat</> : <><Copy className="w-3.5 h-3.5" /> Copiaza</>}
    </button>
  );
}

function KeywordPill({ kw, match }: { kw: string; match: "broad" | "phrase" | "exact" | "negative" }) {
  const styles = {
    broad: "bg-blue-50 text-blue-700 border-blue-200",
    phrase: "bg-amber-50 text-amber-700 border-amber-200",
    exact: "bg-emerald-50 text-emerald-700 border-emerald-200",
    negative: "bg-red-50 text-red-600 border-red-200",
  };
  const prefix = { broad: "", phrase: `"`, exact: "[", negative: "-" };
  const suffix = { broad: "", phrase: `"`, exact: "]", negative: "" };
  return (
    <span className={`inline-flex items-center border text-xs px-2.5 py-1 rounded-lg font-mono cursor-pointer select-all ${styles[match]}`}>
      {prefix[match]}{kw}{suffix[match]}
    </span>
  );
}

function KeywordsSection({ data, onChange }: {
  data: SOSTACData["tactici"]["keywords"];
  onChange: (k: SOSTACData["tactici"]["keywords"]) => void;
}) {
  const grupe = [
    { key: "principale" as const, label: "Principale", sublabel: "Broad Match — volum mare", match: "broad" as const, culoare: "bg-blue-600" },
    { key: "cuIntentie" as const, label: "Cu Intentie", sublabel: 'Phrase Match — "..." — gata sa cumpere', match: "phrase" as const, culoare: "bg-amber-500" },
    { key: "longTail" as const, label: "Long-tail", sublabel: "[Exact Match] — conversii mari, CPC mic", match: "exact" as const, culoare: "bg-emerald-600" },
    { key: "negative" as const, label: "Negative", sublabel: "Excludem trafic irelevant", match: "negative" as const, culoare: "bg-red-500" },
  ];

  function toAdwordsFormat(): string {
    return [
      "# PRINCIPALE (Broad Match)",
      ...data.principale.map((k) => k),
      "",
      "# CU INTENTIE (Phrase Match)",
      ...data.cuIntentie.map((k) => `"${k}"`),
      "",
      "# LONG-TAIL (Exact Match)",
      ...data.longTail.map((k) => `[${k}]`),
      "",
      "# NEGATIVE",
      ...data.negative.map((k) => `-${k}`),
    ].join("\n");
  }

  return (
    <div className="space-y-4">
      {grupe.map(({ key, label, sublabel, match, culoare }) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${culoare}`} />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{label}</span>
              </div>
              <p className="text-xs text-slate-400 ml-4">{sublabel}</p>
            </div>
            <CopyBtn text={data[key].join("\n")} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data[key].map((kw) => (
              <KeywordPill key={kw} kw={kw} match={match} />
            ))}
          </div>
        </div>
      ))}

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-400">Format Google Ads (importabil direct in editor)</p>
        <CopyBtn text={toAdwordsFormat()} />
      </div>
    </div>
  );
}

function MesajeSection({ data }: { data: SOSTACData["tactici"]["mesaje"] }) {
  const charBadge = (v: string, max: number) => (
    <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${v.length > max ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"}`}>
      {v.length}/{max}
    </span>
  );

  const full = [
    "== TITLURI (max 30 caractere) ==",
    ...data.titluri.map((t, i) => `T${i + 1}: ${t}`),
    "",
    "== DESCRIERI (max 90 caractere) ==",
    ...data.descrieri.map((d, i) => `D${i + 1}: ${d}`),
    "",
    `CTA: ${data.cta}`,
  ].join("\n");

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Titluri RSA (3 variante)</p>
          <CopyBtn text={data.titluri.join("\n")} />
        </div>
        <div className="space-y-2">
          {data.titluri.map((t, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <span className="text-xs font-bold text-slate-400 shrink-0">T{i + 1}</span>
              <span className="text-sm text-slate-800 font-medium flex-1">{t}</span>
              {charBadge(t, 30)}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Descrieri RSA (2 variante)</p>
          <CopyBtn text={data.descrieri.join("\n")} />
        </div>
        <div className="space-y-2">
          {data.descrieri.map((d, i) => (
            <div key={i} className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <span className="text-xs font-bold text-slate-400 shrink-0 mt-0.5">D{i + 1}</span>
              <span className="text-sm text-slate-700 flex-1 leading-relaxed">{d}</span>
              {charBadge(d, 90)}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
        <MousePointerClick className="w-4 h-4 text-emerald-600 shrink-0" />
        <div>
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">CTA Recomandat</p>
          <p className="text-sm font-semibold text-emerald-800">{data.cta}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <CopyBtn text={full} />
      </div>
    </div>
  );
}

function CampanieSection({ data }: { data: SOSTACData["tactici"]["campanie"] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Tip campanie</p>
          <p className="text-sm font-semibold text-slate-800">{data.tip}</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Bid Strategy</p>
          <p className="text-sm font-semibold text-slate-800">{data.bidStrategy}</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5" /> Buget zilnic recomandat
        </p>
        <p className="text-2xl font-black text-amber-700">
          {data.bugetZiMin} – {data.bugetZiMax} €
          <span className="text-sm font-normal text-amber-500 ml-1">/ zi</span>
        </p>
        <p className="text-xs text-amber-600 mt-1">
          ≈ {data.bugetZiMin * 30} – {data.bugetZiMax * 30} € / luna
        </p>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Extensii recomandate</p>
        <div className="flex flex-wrap gap-1.5">
          {data.extensii.map((e) => (
            <span key={e} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg font-medium">
              {e}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Observatie</p>
        <p className="text-sm text-slate-600 leading-relaxed">{data.motiv}</p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SOSTACPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("");
  const [data, setData] = useState<SOSTACData | null>(null);
  const [search, setSearch] = useState("");
  const [copiatAll, setCopiatAll] = useState(false);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((d) => { setLeads(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  function selectLead(id: string) {
    setSelectedId(id);
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;

    const input: LeadSOSTACInput = {
      nume: lead.nume,
      nisa: lead.nisa,
      oras: lead.oras,
      judet: lead.judet,
      are_website: lead.are_website,
      rating: lead.rating,
      nr_reviews: lead.nr_reviews,
      scor_viteza: lead.scor_viteza,
      scor: lead.scor,
    };

    const generated = genereazaSOSTAC(input);
    const saved = loadSaved(id);
    setData(saved ? { ...generated, ...saved, tactici: { ...generated.tactici, ...(saved.tactici ?? {}) } } : generated);
  }

  function updateField<K extends keyof SOSTACData>(field: K, value: SOSTACData[K]) {
    if (!data || !selectedId) return;
    const next = { ...data, [field]: value };
    setData(next);
    saveLocal(selectedId, next);
  }

  function exportAll(): string {
    if (!data) return "";
    const lead = leads.find((l) => l.id === selectedId);
    return [
      `ANALIZA SOSTAC — ${lead?.nume ?? "Business"}`,
      `${lead?.nisa ?? ""} | ${lead?.oras ?? ""}, ${lead?.judet ?? ""}`,
      `Generat: ${new Date().toLocaleDateString("ro-RO")}`,
      "═".repeat(50),
      "",
      "S — SITUATIE",
      data.situatie,
      "",
      "O — OBIECTIVE",
      data.obiective,
      "",
      "S — STRATEGIE",
      data.strategie,
      "",
      "T — TACTICI",
      `\nAUDIENTA:\n${data.tactici.audienta}`,
      `\nKEYWORDS GOOGLE ADS:\n`,
      "Principale (Broad):\n" + data.tactici.keywords.principale.join(", "),
      `\nCu Intentie (Phrase):\n` + data.tactici.keywords.cuIntentie.map((k) => `"${k}"`).join(", "),
      `\nLong-tail (Exact):\n` + data.tactici.keywords.longTail.map((k) => `[${k}]`).join(", "),
      `\nNegative:\n` + data.tactici.keywords.negative.map((k) => `-${k}`).join(", "),
      `\nMESAJE RECLAMA:\nTitluri: ${data.tactici.mesaje.titluri.join(" | ")}\nDescriieri: ${data.tactici.mesaje.descrieri.join(" | ")}\nCTA: ${data.tactici.mesaje.cta}`,
      `\nCAMPANIE:\n${data.tactici.campanie.tip}\nBuget: ${data.tactici.campanie.bugetZiMin}-${data.tactici.campanie.bugetZiMax}€/zi\n${data.tactici.campanie.bidStrategy}`,
      "",
      "A — ACTIUNI",
      data.actiuni,
      "",
      "C — CONTROL",
      data.control,
    ].join("\n");
  }

  const afisate = leads.filter((l) =>
    !search || l.nume?.toLowerCase().includes(search.toLowerCase()) || l.nisa?.toLowerCase().includes(search.toLowerCase())
  );

  const lead = leads.find((l) => l.id === selectedId);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* Sidebar leads */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
        <div className="px-4 pt-5 pb-3 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900 text-sm mb-2">Selecteaza business</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cauta lead..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {loading ? (
            <div className="flex items-center justify-center py-8 gap-2 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Se incarca...
            </div>
          ) : afisate.length === 0 ? (
            <p className="text-center py-8 text-sm text-slate-400">Niciun lead gasit</p>
          ) : (
            afisate.map((l) => (
              <button
                key={l.id}
                onClick={() => selectLead(l.id)}
                className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                  selectedId === l.id ? "bg-blue-50 border-l-2 border-l-blue-500" : ""
                }`}
              >
                <p className={`text-sm font-medium leading-tight ${selectedId === l.id ? "text-blue-700" : "text-slate-800"}`}>
                  {l.nume}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{l.nisa} · {l.oras}</p>
                {!l.are_website && (
                  <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded mt-1 inline-block">fara site</span>
                )}
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {!data ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 gap-3">
            <Target className="w-12 h-12 text-slate-200" />
            <p className="font-medium text-slate-500">Selecteaza un business din lista</p>
            <p className="text-sm">Se va genera automat analiza SOSTAC + strategia Google Ads</p>
          </div>
        ) : (
          <div className="p-6 max-w-3xl space-y-4">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{lead?.nume}</h1>
                <p className="text-slate-500 text-sm mt-0.5">{lead?.nisa} · {lead?.oras}, {lead?.judet}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Analiza salvata local · modificarile se salveaza automat
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(exportAll()).then(() => {
                    setCopiatAll(true);
                    setTimeout(() => setCopiatAll(false), 2500);
                  });
                }}
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0 ${
                  copiatAll ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-slate-700"
                }`}
              >
                {copiatAll ? <><CheckCheck className="w-4 h-4" /> Copiat!</> : <><Copy className="w-4 h-4" /> Export complet</>}
              </button>
            </div>

            {/* S — Situatie */}
            <SectiuneCard icon={Search} culoare="bg-slate-700" litera="S" titlu="Situatie — Unde suntem acum">
              <EditableText value={data.situatie} onChange={(v) => updateField("situatie", v)} rows={5} />
            </SectiuneCard>

            {/* O — Obiective */}
            <SectiuneCard icon={Target} culoare="bg-blue-600" litera="O" titlu="Obiective — Ce vrem sa obtinem">
              <EditableText value={data.obiective} onChange={(v) => updateField("obiective", v)} rows={6} />
            </SectiuneCard>

            {/* S2 — Strategie */}
            <SectiuneCard icon={TrendingUp} culoare="bg-violet-600" litera="S" titlu="Strategie — Cum ajungem acolo">
              <EditableText value={data.strategie} onChange={(v) => updateField("strategie", v)} rows={6} />
            </SectiuneCard>

            {/* T — Tactici */}
            <SectiuneCard icon={Zap} culoare="bg-amber-500" litera="T" titlu="Tactici — Keywords, Mesaje, Campanie Google Ads">
              <div className="space-y-6">

                {/* Audienta */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Audienta tinta</p>
                  </div>
                  <textarea
                    value={data.tactici.audienta}
                    onChange={(e) => updateField("tactici", { ...data.tactici, audienta: e.target.value })}
                    rows={3}
                    className="w-full text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Keywords */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-slate-400" />
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Keywords Google Ads</p>
                  </div>
                  <KeywordsSection
                    data={data.tactici.keywords}
                    onChange={(k) => updateField("tactici", { ...data.tactici, keywords: k })}
                  />
                </div>

                {/* Mesaje */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Mesaje reclama (RSA format)</p>
                  </div>
                  <MesajeSection data={data.tactici.mesaje} />
                </div>

                {/* Campanie */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart2 className="w-4 h-4 text-slate-400" />
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Structura campanie + buget</p>
                  </div>
                  <CampanieSection data={data.tactici.campanie} />
                </div>
              </div>
            </SectiuneCard>

            {/* A — Actiuni */}
            <SectiuneCard icon={Calendar} culoare="bg-emerald-600" litera="A" titlu="Actiuni — Plan calendar implementare">
              <EditableText value={data.actiuni} onChange={(v) => updateField("actiuni", v)} rows={10} />
            </SectiuneCard>

            {/* C — Control */}
            <SectiuneCard icon={BarChart2} culoare="bg-red-500" litera="C" titlu="Control — KPIs si masurare rezultate">
              <EditableText value={data.control} onChange={(v) => updateField("control", v)} rows={9} />
            </SectiuneCard>

          </div>
        )}
      </div>
    </div>
  );
}
