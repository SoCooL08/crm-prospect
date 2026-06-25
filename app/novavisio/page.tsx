"use client";

import { useState, useEffect } from "react";
import { Target, Image, TrendingUp, Users, Zap, Plus, Trash2 } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type CampaniaAgentie = {
  id: string;
  platforma: "Facebook" | "Instagram" | "Ambele";
  obiectiv: "Urmăritori" | "Awareness" | "Lead Gen" | "Engagement";
  buget: string;
  audienta: string;
  varsta: string;
  interese: string;
  titlu: string;
  text: string;
  cta: string;
  format: string;
  status: "de setat" | "activa" | "in pauza" | "test" | "optimizare";
  note: string;
};

type PostAgentie = {
  id: string;
  platforma: "Facebook" | "Instagram" | "Ambele";
  tip: "Reel" | "Post" | "Story" | "Carusel" | "Video";
  tema: string;
  descriere: string;
  caption: string;
  hashtags: string;
  status: "idee" | "productie" | "gata" | "publicat";
  data: string;
};

type TabNV = "overview" | "campanii" | "posturi" | "strategie";

// ── Defaults ───────────────────────────────────────────────────────────────

const campanii0: CampaniaAgentie[] = [
  {
    id: "c1",
    platforma: "Facebook",
    obiectiv: "Lead Gen",
    buget: "300 lei/lună",
    audienta: "Antreprenori, proprietari de business, manageri marketing, Sibiu + România",
    varsta: "28-50",
    interese: "marketing digital, publicitate facebook, reclame google, business online, antreprenoriat",
    titlu: "Vrei mai mulți clienți din online?",
    text: "Nova Visio transformă bugetul tău de marketing în clienți reali. Google Ads + Meta Ads + SMM — campanii care aduc ROI măsurabil.\n\n✓ Audit gratuit al campaniilor actuale\n✓ Strategie personalizată în 48h\n✓ Rapoarte transparente lunar\n\nLucrăm cu business-uri din Sibiu și România care vor să crească real. →",
    cta: "Cere audit gratuit",
    format: "Video 30s testimonial client + rezultate reale",
    status: "de setat",
    note: "Target: antreprenori care au deja un business și vor să scaleze cu paid ads. Evită audiențe prea largi.",
  },
  {
    id: "c2",
    platforma: "Instagram",
    obiectiv: "Urmăritori",
    buget: "200 lei/lună",
    audienta: "Antreprenori tineri, marketeri, oameni de business 25-40 ani",
    varsta: "22-40",
    interese: "marketing digital, social media, antreprenoriat, startup, ecommerce",
    titlu: "Agenție de marketing Sibiu 📈",
    text: "De la 0 la rezultate reale cu Google Ads + Meta Ads. Urmărește-ne pentru tips de marketing pe care le poți aplica azi 👇",
    cta: "Urmărește pagina",
    format: "Reel educațional 15-30s cu tip rapid de marketing",
    status: "de setat",
    note: "Obiectiv: follower growth organic + paid. Conținut valoros (edu) convertește mai bine decât promovare directă.",
  },
];

const posturi0: PostAgentie[] = [
  {
    id: "p1", platforma: "Instagram", tip: "Reel",
    tema: "Rezultate client real",
    descriere: "Arată un caz real: client X, buget Y, rezultat Z leads în 30 zile. Fără a numi clientul dacă nu e de acord.",
    caption: "De la 0 la 47 de clienți noi într-o lună 🚀\n\nAsta e puterea campaniilor corecte de Google Ads.\n\nBuget modest. Strategie clară. Execuție precisă.\n\nVrei să știi cum am făcut-o? Scrie-ne în DM 👇\n\n#marketing #googleads #rezultate #agentiemarketing #sibiu",
    hashtags: "#marketing #googleads #metaads #agentiemarketing #sibiu #rezultate #publicitate #digitalmarketing",
    status: "idee", data: "",
  },
  {
    id: "p2", platforma: "Ambele", tip: "Carusel",
    tema: "5 greșeli Google Ads",
    descriere: "Carusel educațional: 5 greșeli comune pe care le fac business-urile cu Google Ads și cum le evitem noi.",
    caption: "5 greșeli de Google Ads care îți ard bugetul 🔥\n\nSlide 1: Fără cuvinte negative\nSlide 2: Landing page slab\nSlide 3: Audiență prea largă\nSlide 4: Fără remarketing\nSlide 5: Nu măsoară conversiile\n\nTu faci vreuna din ele? Scrie în comentarii 👇\n\n#googleads #marketingdigital #greselippc #agentiemarketing",
    hashtags: "#googleads #ppc #digitalmarketing #marketing #agentiemarketing #sibiu #publicitate",
    status: "idee", data: "",
  },
  {
    id: "p3", platforma: "Instagram", tip: "Reel",
    tema: "Behind the scenes agentie",
    descriere: "O zi din viața agenției — setup campanie, analiză date, apeluri cu clienți. Uman și autentic.",
    caption: "O zi din viața noastră la Nova Visio 📱\n\nDe la analiza datelor din dimineață, la optimizarea campaniilor, la raportul de seară.\n\nFiecare leu cheltuit de clienții noștri e urmărit. Asta facem noi.\n\n#agentiemarketing #behindthescenes #marketing #sibiu #digitalmarketing",
    hashtags: "#agentiemarketing #behindthescenes #marketing #sibiu #viatalagentie",
    status: "idee", data: "",
  },
  {
    id: "p4", platforma: "Facebook", tip: "Post",
    tema: "Ofertă audit gratuit",
    descriere: "Post cu CTA clar pentru audit gratuit campanii. Include rezultate anterioare ca dovadă.",
    caption: "🎁 AUDIT GRATUIT pentru campaniile tale de marketing\n\nDacă rulezi Google Ads sau Meta Ads și nu ești mulțumit de rezultate — hai să vedem EXACT unde se pierd banii.\n\nCe include auditul:\n✓ Analiza contului Google / Meta Ads\n✓ Identificarea pierderilor de buget\n✓ 3 recomandări concrete\n✓ 0 lei\n\nLimitată la 5 locuri pe lună. Scrie-ne pe WhatsApp →\n\n#audit #marketingdigital #googleads #agentiesibiu",
    hashtags: "#auditmarketing #googleads #metaads #agentiemarketing #sibiu",
    status: "idee", data: "",
  },
];

const STRATEGIE_NV = [
  {
    titlu: "🎯 Obiectiv principal (3 luni)",
    continut: `• +500 urmăritori reali pe Instagram (lunar)
• +200 urmăritori reali pe Facebook (lunar)
• 5-10 lead-uri/lună din organic + paid combinat
• Engagement rate Instagram: >5%
• Reach organic crescut cu 40% față de baseline`,
  },
  {
    titlu: "📱 Strategie Instagram",
    continut: `TONE: Expert accesibil — știi despre ce vorbești, dar nu ești arogant. Valoare la fiecare postare.

PILONI DE CONȚINUT:
1. EDUCAȚIE (40%) — Tips marketing aplicabile azi. "3 greșeli Google Ads", "Cum setezi Meta Pixel"
2. REZULTATE (30%) — Cazuri reale (anonimizate ok). Cifre, procente, comparații
3. BEHIND THE SCENES (20%) — Oamenii din echipă, procesul, cultura agenției
4. OFERTĂ (10%) — Audit gratuit, servicii — fără a fi agresiv

FRECVENTA: 4-5 posturi/săptămână (mix Reel + Story + Carusel)
Story ZILNIC: tip rapid, poll "Tu ce crezi?", Q&A marketing

HASHTAGS: amestec nișă (#googleads, #metaads) + local (#sibiu, #agentiesibiu) + general (#marketing, #digitalmarketing)`,
  },
  {
    titlu: "📘 Strategie Facebook",
    continut: `TONE: Mai profesional decât Instagram. Articole mai lungi, resurse, studii de caz.

PILONI DE CONȚINUT:
1. STUDII DE CAZ (35%) — Detaliate, cu cifre reale. Antrprenori de 35+ apreciează substanța.
2. ȘTIRI MARKETING (25%) — Actualizări algoritm Google/Meta cu implicații practice
3. OFERTE + CTA (25%) — Audit gratuit, consultanță, pachete servicii
4. COMUNITATE (15%) — Întrebări, polls, invitații la discuție

FRECVENTA: 3-4 posturi/săptămână
PAID: Boost posturi care depășesc organic reach normal

GRUPURI: Participare activă în grupuri de antreprenori și marketing din România`,
  },
  {
    titlu: "💰 Buget Paid pentru Pagina Proprie",
    continut: `TOTAL RECOMANDAT: 300-500 lei/lună pentru creșterea paginii proprii

ALOCARE:
• Facebook Ads (urmăritori + reach): 150 lei/lună
• Instagram Ads (urmăritori + reel boost): 150 lei/lună
• Boost posturi cu engagement ridicat: 100-200 lei/lună

AUDIENTA CAMPANII PROPRII:
• Antreprenori 28-50 ani, România
• Interese: marketing digital, business online, publicitate, ecommerce
• Lookalike din clienții existenți (1%)
• Excluziuni: studenti, angajați fără funcție de decizie`,
  },
  {
    titlu: "📊 KPI Monitorizare Lunară",
    continut: `INSTAGRAM:
• Urmăritori noi: target +500/lună
• Reach organic: minim 2.000 conturi/lună
• Engagement rate: >5% per post
• DM-uri primite: 10+/lună (intenție colaborare)

FACEBOOK:
• Urmăritori noi: target +200/lună
• Reach organic: minim 1.500 conturi/lună
• Click-uri spre site: minim 50/lună

PAID:
• Cost per urmăritor nou: <2 lei
• Reach plătit/lei: minim 500 oameni/100 lei
• Lead-uri din paid: 3-5/lună`,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  "de setat": "bg-slate-100 text-slate-600",
  activa: "bg-emerald-100 text-emerald-700",
  "in pauza": "bg-amber-100 text-amber-700",
  test: "bg-blue-100 text-blue-700",
  optimizare: "bg-violet-100 text-violet-700",
  idee: "bg-slate-100 text-slate-600",
  productie: "bg-amber-100 text-amber-700",
  gata: "bg-blue-100 text-blue-700",
  publicat: "bg-emerald-100 text-emerald-700",
};

const platColors: Record<string, string> = {
  Facebook: "bg-blue-600",
  Instagram: "bg-gradient-to-br from-pink-500 to-violet-600",
  Ambele: "bg-gradient-to-br from-blue-500 to-pink-500",
};

function F({ label, value, onChange, big }: {
  label: string; value: string; onChange: (v: string) => void; big?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</label>
      {big
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        : <input value={value} onChange={(e) => onChange(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      }
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function NovaVisioPage() {
  const [tab, setTab] = useState<TabNV>("overview");
  const [campanii, setCampanii] = useState<CampaniaAgentie[]>(campanii0);
  const [posturi, setPosturi] = useState<PostAgentie[]>(posturi0);
  const [buget, setBuget] = useState({ fb: "150", ig: "150", boost: "100" });
  const [stratOpen, setStratOpen] = useState<number | null>(0);

  useEffect(() => {
    const saved = localStorage.getItem("novavisio_data");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.campanii) setCampanii(d.campanii);
        if (d.posturi) setPosturi(d.posturi);
        if (d.buget) setBuget(d.buget);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("novavisio_data", JSON.stringify({ campanii, posturi, buget }));
  }, [campanii, posturi, buget]);

  function updateCampanie(id: string, patch: Partial<CampaniaAgentie>) {
    setCampanii((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c));
  }

  function updatePost(id: string, patch: Partial<PostAgentie>) {
    setPosturi((prev) => prev.map((p) => p.id === id ? { ...p, ...patch } : p));
  }

  function addCampanie() {
    const id = Date.now().toString();
    setCampanii((prev) => [...prev, {
      id, platforma: "Ambele", obiectiv: "Urmăritori", buget: "",
      audienta: "", varsta: "25-45", interese: "", titlu: "", text: "",
      cta: "Află mai multe", format: "Reel", status: "de setat", note: "",
    }]);
  }

  function addPost() {
    const id = Date.now().toString();
    setPosturi((prev) => [...prev, {
      id, platforma: "Instagram", tip: "Reel", tema: "", descriere: "",
      caption: "", hashtags: "", status: "idee", data: "",
    }]);
  }

  const totalBuget = (Number(buget.fb) || 0) + (Number(buget.ig) || 0) + (Number(buget.boost) || 0);

  const TABS = [
    { id: "overview" as TabNV, label: "📊 Overview" },
    { id: "strategie" as TabNV, label: "🎯 Strategie" },
    { id: "campanii" as TabNV, label: "🚀 Campanii Paid" },
    { id: "posturi" as TabNV, label: "📝 Posturi & Conținut" },
  ];

  return (
    <div className="p-8 max-w-5xl">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">NV</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">Nova Visio Tech</h1>
            <p className="text-slate-500 text-sm">Agenție marketing digital · Sibiu · Creștere Facebook & Instagram</p>
            <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-400">
              <a href="https://novavisiotech.ro" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">🌐 novavisiotech.ro</a>
              <span>facebook.com/novavisiotech</span>
              <span>instagram.com/novavisiotech</span>
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Buget paid / lună", value: `${totalBuget} lei`, color: "text-slate-900" },
            { label: "Target urmăritori/lună", value: "+500 IG / +200 FB", color: "text-blue-600" },
            { label: "Obiectiv lead-uri", value: "5-10 / lună", color: "text-emerald-600" },
          ].map((k) => (
            <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <p className="text-xs text-slate-400 uppercase tracking-wide">{k.label}</p>
              <p className={`text-lg font-bold mt-0.5 ${k.color}`}>{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1">
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ──────────────────────────────────────────────────────── */}
      {tab === "overview" && (
        <div className="space-y-5">

          {/* Buget paid */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Buget Paid Lunar — Pagina Proprie
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {[
                { label: "Facebook Ads (urmăritori + reach)", key: "fb" as const },
                { label: "Instagram Ads (urmăritori + reel boost)", key: "ig" as const },
                { label: "Boost posturi performante", key: "boost" as const },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</label>
                  <div className="flex items-center gap-1">
                    <input type="number" value={buget[key]}
                      onChange={(e) => setBuget({ ...buget, [key]: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <span className="text-xs text-slate-400 shrink-0">lei</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-sm font-semibold text-slate-700">Total buget paid / lună</span>
              <span className="text-xl font-bold text-blue-600">{totalBuget} lei</span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Acțiuni Imediate — Primele 30 de zile
            </h2>
            <div className="space-y-2">
              {[
                { nr: "1", text: "Optimizează profilul Instagram: Bio clar, link în bio spre site, highlight-uri organizate (Servicii, Rezultate, Despre noi)", done: false },
                { nr: "2", text: "Optimizează pagina Facebook: Cover actualizat, buton CTA 'Contactați-ne', secțiunea Servicii completată", done: false },
                { nr: "3", text: "Creare Meta Business Suite + Pixel instalat pe novavisiotech.ro", done: false },
                { nr: "4", text: "Primul Reel: 'Ce facem la Nova Visio în 60 de secunde' — intro autentic, fara scenarii forzate", done: false },
                { nr: "5", text: "Setare campanie urmăritori Instagram (150 lei, audiență antreprenori 25-45 ani România)", done: false },
                { nr: "6", text: "Prima postare carusel educațional: '5 greșeli care îți ard bugetul de Google Ads'", done: false },
                { nr: "7", text: "Activare WhatsApp Business pe numărul agenției + răspuns automat", done: false },
                { nr: "8", text: "Postare story zilnic timp de 30 de zile consecutiv (algoritmul recompensează consecvența)", done: false },
              ].map(({ nr, text }) => (
                <div key={nr} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{nr}</span>
                  <p className="text-sm text-slate-700">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Platforms status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-500" /> Status Platforme
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { p: "Instagram", icon: "📷", obiectiv: "+500 urmăritori/lună", tactic: "Reel 4-5x/săpt + Story zilnic + Paid 150 lei/lună", color: "from-pink-500 to-violet-600" },
                { p: "Facebook", icon: "f", obiectiv: "+200 urmăritori/lună", tactic: "Post 3-4x/săpt + Boost organic + Paid 150 lei/lună", color: "from-blue-500 to-blue-700" },
              ].map(({ p, icon, obiectiv, tactic, color }) => (
                <div key={p} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm`}>{icon}</div>
                    <div>
                      <p className="font-bold text-slate-800">{p}</p>
                      <p className="text-xs text-emerald-600 font-semibold">{obiectiv}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">{tactic}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── STRATEGIE ──────────────────────────────────────────────────────── */}
      {tab === "strategie" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-5 text-white mb-2">
            <h2 className="text-lg font-bold">Strategie Creștere Social Media — Nova Visio Tech</h2>
            <p className="text-blue-100 text-sm mt-0.5">Obiectiv: creștere organică + paid Facebook & Instagram pentru agenție. Poziționare ca expert în marketing digital Sibiu.</p>
          </div>
          {STRATEGIE_NV.map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <button onClick={() => setStratOpen(stratOpen === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors text-left">
                <span className="font-semibold text-slate-800">{s.titlu}</span>
                <span className="text-slate-400">{stratOpen === i ? "▲" : "▼"}</span>
              </button>
              {stratOpen === i && (
                <div className="px-6 pb-5">
                  <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans bg-slate-50 rounded-xl p-4 border border-slate-100 leading-relaxed">{s.continut}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── CAMPANII PAID ──────────────────────────────────────────────────── */}
      {tab === "campanii" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Campanii paid pentru creșterea paginilor Nova Visio</p>
            <button onClick={addCampanie}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> Campanie nouă
            </button>
          </div>
          {campanii.map((c) => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className={`px-5 py-3 flex items-center justify-between ${c.platforma === "Facebook" ? "bg-blue-600" : c.platforma === "Instagram" ? "bg-gradient-to-r from-pink-500 to-violet-600" : "bg-gradient-to-r from-blue-500 to-pink-500"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{c.platforma === "Facebook" ? "f" : c.platforma === "Instagram" ? "ig" : "f+ig"}</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{c.platforma} — {c.obiectiv}</p>
                    <p className="text-white/70 text-xs">{c.buget}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={c.status} onChange={(e) => updateCampanie(c.id, { status: e.target.value as CampaniaAgentie["status"] })}
                    className="text-xs rounded-lg px-2 py-1 font-semibold bg-white/20 text-white border-0 cursor-pointer focus:outline-none">
                    {["de setat", "activa", "in pauza", "test", "optimizare"].map((s) => <option key={s} className="text-slate-800">{s}</option>)}
                  </select>
                  <button onClick={() => setCampanii((prev) => prev.filter((x) => x.id !== c.id))}
                    className="text-white/60 hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Platformă</label>
                    <select value={c.platforma} onChange={(e) => updateCampanie(c.id, { platforma: e.target.value as CampaniaAgentie["platforma"] })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {["Facebook", "Instagram", "Ambele"].map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Obiectiv</label>
                    <select value={c.obiectiv} onChange={(e) => updateCampanie(c.id, { obiectiv: e.target.value as CampaniaAgentie["obiectiv"] })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {["Urmăritori", "Awareness", "Lead Gen", "Engagement"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <F label="Buget" value={c.buget} onChange={(v) => updateCampanie(c.id, { buget: v })} />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <F label="Vârstă targeting" value={c.varsta} onChange={(v) => updateCampanie(c.id, { varsta: v })} />
                  <F label="Format reclamă" value={c.format} onChange={(v) => updateCampanie(c.id, { format: v })} />
                </div>
                <F label="Audiență" value={c.audienta} onChange={(v) => updateCampanie(c.id, { audienta: v })} />
                <F label="Interese targeting" value={c.interese} onChange={(v) => updateCampanie(c.id, { interese: v })} />
                <F label="Titlu reclamă" value={c.titlu} onChange={(v) => updateCampanie(c.id, { titlu: v })} />
                <F label="Text reclamă" value={c.text} onChange={(v) => updateCampanie(c.id, { text: v })} big />
                <F label="Call to Action" value={c.cta} onChange={(v) => updateCampanie(c.id, { cta: v })} />
                <F label="Note" value={c.note} onChange={(v) => updateCampanie(c.id, { note: v })} big />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── POSTURI & CONTINUT ─────────────────────────────────────────────── */}
      {tab === "posturi" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Calendar conținut + captions gata de publicat</p>
              <div className="flex gap-3 mt-1">
                {[
                  { s: "idee", n: posturi.filter((p) => p.status === "idee").length },
                  { s: "productie", n: posturi.filter((p) => p.status === "productie").length },
                  { s: "gata", n: posturi.filter((p) => p.status === "gata").length },
                  { s: "publicat", n: posturi.filter((p) => p.status === "publicat").length },
                ].map(({ s, n }) => (
                  <span key={s} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[s]}`}>{s}: {n}</span>
                ))}
              </div>
            </div>
            <button onClick={addPost}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl bg-pink-600 text-white hover:bg-pink-700 transition-colors">
              <Plus className="w-4 h-4" /> Post nou
            </button>
          </div>
          {posturi.map((p) => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${platColors[p.platforma]} flex items-center justify-center text-white font-bold text-xs`}>
                    {p.platforma === "Facebook" ? "f" : p.platforma === "Instagram" ? "ig" : "✦"}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{p.tema || "Post nou"}</span>
                  <span className="text-xs text-slate-400">{p.tip}</span>
                </div>
                <div className="flex items-center gap-2">
                  <select value={p.status} onChange={(e) => updatePost(p.id, { status: e.target.value as PostAgentie["status"] })}
                    className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${statusColors[p.status]}`}>
                    {["idee", "productie", "gata", "publicat"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setPosturi((prev) => prev.filter((x) => x.id !== p.id))}
                    className="text-slate-300 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="grid md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Platformă</label>
                    <select value={p.platforma} onChange={(e) => updatePost(p.id, { platforma: e.target.value as PostAgentie["platforma"] })}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {["Facebook", "Instagram", "Ambele"].map((pl) => <option key={pl}>{pl}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Tip</label>
                    <select value={p.tip} onChange={(e) => updatePost(p.id, { tip: e.target.value as PostAgentie["tip"] })}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {["Reel", "Post", "Story", "Carusel", "Video"].map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <F label="Temă" value={p.tema} onChange={(v) => updatePost(p.id, { tema: v })} />
                  <F label="Dată publicare" value={p.data} onChange={(v) => updatePost(p.id, { data: v })} />
                </div>
                <F label="Concept / descriere vizual" value={p.descriere} onChange={(v) => updatePost(p.id, { descriere: v })} big />
                <F label="Caption (gata de copiat)" value={p.caption} onChange={(v) => updatePost(p.id, { caption: v })} big />
                <F label="Hashtags" value={p.hashtags} onChange={(v) => updatePost(p.id, { hashtags: v })} />
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-slate-400 text-center">Salvat automat · Nova Visio Tech — Social Media Workspace</p>
    </div>
  );
}
