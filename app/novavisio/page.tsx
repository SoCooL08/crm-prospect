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

type TabNV = "overview" | "strategie" | "campanii" | "posturi";

type SostacItem = { titlu: string; label: string; color: string; continut: string };

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

const SOSTAC_NV: SostacItem[] = [
  {
    label: "S",
    titlu: "Situation — Situație actuală",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    continut: `BUSINESS: Nova Visio Tech — agenție de marketing digital din Sibiu.
Servicii: creare site-uri WordPress/custom, Google Ads, Meta Ads (Facebook + Instagram), mentenanță site-uri, SEO on-page + off-page.

PIAȚA LOCALĂ SIBIU:
→ Cerere ridicată pentru servicii digitale — business-uri locale realizează că au nevoie de prezență online
→ Competiție: câteva agenții mici în Sibiu, freelanceri, agenții naționale care lucrează remote
→ Oportunitate: puține agenții locale cu portfolio vizibil, transparență și prețuri clare
→ CPC estimat Google pentru "agentie marketing sibiu" sau "creare site sibiu": 2-5 lei (competiție scăzută!)

SITUAȚIE SOCIALĂ ACTUALĂ:
→ Pagini Facebook/Instagram existente, probabil cu engagement redus și fără strategie paid
→ Fără campanii Google Ads proprii active (sau budget minimal)
→ Site novavisiotech.ro existent dar trafic organic probabil scăzut

OPORTUNITATE CHEIE:
Agențiile care investesc în propria lor promovare — și arată rezultatele — câștigă încredere rapid.
"Dacă îți promovezi tu bine afacerea, înseamnă că poți face asta și pentru mine."`,
  },
  {
    label: "O",
    titlu: "Objectives — Obiective (6 luni)",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    continut: `OBIECTIV #1 — LEAD GENERATION:
→ 5-10 lead-uri calificate/lună (antreprenori cu buget real, nu curioși)
→ Cost per lead țintă: <200 lei
→ Conversie lead → client: >25%
→ Valoare medie client nou: 2.000-5.000 lei/lună (pachet ads + site + SEO)

OBIECTIV #2 — BRAND AWARENESS SIBIU:
→ Top 3 Google pentru "agentie marketing sibiu", "creare site sibiu", "google ads sibiu"
→ +500 urmăritori reali Instagram/lună
→ +300 followeri Facebook/lună
→ Recunoscut ca voce de autoritate în marketing digital în Sibiu

OBIECTIV #3 — SOCIAL MEDIA GROWTH:
→ Engagement rate Instagram: >5%
→ Reach organic: 3.000+ conturi/lună pe Instagram
→ DM-uri cu intenție de colaborare: 10+/lună
→ Recenzii Google Business: 4.8+ stele, 20+ recenzii

KPI SECUNDARI:
→ CTR Google Ads proprii: >6%
→ Cost/click Google: <5 lei
→ Vizitatori site din social: +100/lună`,
  },
  {
    label: "S",
    titlu: "Strategy — Strategie de poziționare",
    color: "bg-violet-50 border-violet-200 text-violet-700",
    continut: `POZIȚIONARE: "Agenția care arată cifrele, nu promisiunile."
→ Transparență totală: rapoarte lunare cu cifre reale, fără bullshit
→ ROI măsurabil: fiecare leu cheltuit are o explicație
→ Expert local Sibiu + capacitate națională
→ Partener pe termen lung, nu furnizor de servicii

DIFERENȚIATORI VS. CONCURENȚĂ:
✓ Rapoarte transparente lunar (concurența le evită)
✓ Prețuri pachete clare pe site (raritate în piață)
✓ Arătăm rezultatele reale ale clienților noștri
✓ Răspuns în 24h, nu săptămâni
✓ Nova Visio = agentie care face ADS + SITE + SEO sub același acoperiș

FUNNEL PRINCIPAL:
Organic Social (Awareness) → Conținut Educațional (Considerare) → Audit Gratuit (Lead) → Propunere Personalizată (Vânzare) → Client Recurent (Retenție)

CANALE ÎN ORDINE DE PRIORITATE:
1. Facebook Ads — intent moderat, CPC mic, audienta antreprenori buna
2. Google Search Ads — intent MAXIM ("creare site sibiu" = cineva vrea să cumpere ACUM)
3. Instagram Organic — brand building, reach, credibilitate
4. Facebook Organic — comunitate, studii de caz, engagement
5. SEO propriu — durată lungă dar gratuit după implementare
6. Google Business — trafic local gratuit (critică pentru Sibiu)`,
  },
  {
    label: "T",
    titlu: "Tactics — Tactici detaliate per canal",
    color: "bg-amber-50 border-amber-200 text-amber-700",
    continut: `━━━ FACEBOOK ADS (start imediat) ━━━
C1 — Lead Gen Servicii (MUST HAVE):
• Obiectiv: Lead Generation cu formular Meta nativ
• Buget: 300-400 lei/lună
• Audiență: Antreprenori + proprietari de business 28-50 ani, România + focus Sibiu
• Interese: antreprenoriat, marketing digital, business online, ecommerce, publicitate
• Format: Video testimonial client real (30s) SAU carusel "Înainte/După" campanie
• Titlu: "Câți clienți pierzi lunar pentru că nu ești online?"
• CTA: "Cere audit gratuit" → Formular: Nume, telefon, tip business, buget lunar

C2 — Retargeting vizitatori site:
• Buget: 100 lei/lună
• Audiență: Custom Audience — vizitatori novavisiotech.ro din ultimele 30 zile
• Format: Post cu ofertă specifică + countdown
• Mesaj: "Ai vizitat site-ul nostru. Hai să vorbim — audit gratuit, fără obligații."

━━━ GOOGLE ADS (recomandat puternic!) ━━━
DA, Google Ads e esențial pentru agenție — iată de ce:
Cineva care caută "creare site sibiu" sau "agentie google ads sibiu" VREA SĂ CUMPERE ACUM.
CPC estimat: 2-5 lei (competiție scăzută vs. beauty/medical)

Campanie 1 — "Creare Site Web":
• Cuvinte cheie: "creare site sibiu", "creare site wordpress sibiu", "web design sibiu",
  "firma creare site sibiu", "site web profesional sibiu"
• CPC țintă: <5 lei | Buget zilnic: 30 lei
• Landing page: pagina Servicii Site-uri cu portofoliu + formular + WhatsApp

Campanie 2 — "Ads + Marketing Digital":
• Cuvinte cheie: "agentie google ads sibiu", "campanii facebook sibiu",
  "agentie marketing digital sibiu", "seo sibiu", "agentie publicitate sibiu"
• CPC țintă: <5 lei | Buget zilnic: 30 lei

━━━ INSTAGRAM ORGANIC ━━━
• Frecvență: 4-5 posturi/săpt + Story zilnic
• Piloni: Educație 40%, Rezultate 30%, BTS 20%, Ofertă 10%
• Formate prioritare: Reel educațional (30-60s) + Carusel tips

━━━ FACEBOOK ORGANIC ━━━
• Frecvență: 3-4 posturi/săpt
• Focus: Studii de caz detaliate, știri marketing, oferte cu CTA clar
• Grupuri: Participare activă în "Antreprenori Sibiu", "Marketing Digital România"`,
  },
  {
    label: "A",
    titlu: "Action — Plan de acțiune concret",
    color: "bg-rose-50 border-rose-200 text-rose-700",
    continut: `SĂPTĂMÂNA 1 — SETUP (fără buget, doar timp):
□ Optimizare completă profil Instagram: Bio clar cu servicii, link în bio, highlight-uri (Servicii / Rezultate / Despre noi / Contact)
□ Optimizare pagină Facebook: Cover profesional, buton "Contactați-ne", secțiunea Servicii completată, număr telefon și WhatsApp
□ Google Business Profile: actualizat cu servicii, poze, orar, răspuns recenzii existente
□ Instalare Meta Pixel pe novavisiotech.ro (5 minute cu plugin)
□ Creare WhatsApp Business cu mesaj automat de bun venit

SĂPTĂMÂNA 2 — PRIMUL CONȚINUT:
□ Reel #1: "Ce face o agenție de marketing digital în 60 de secunde" — intro autentic
□ Post Carusel: "5 semne că ai nevoie de o agenție de marketing" (educațional, fără pitch)
□ Story zilnic: poll "Tu cum îți găsești clienți acum?" (date pentru targeting)
□ Post Facebook: Studiu de caz client (anonimizat sau cu acordul lor): buget X → Y leads

SĂPTĂMÂNA 3 — CAMPANII PAID:
□ Activare Facebook Ads C1 Lead Gen (300 lei/lună → ~75 lei/săpt să testezi)
□ Formular Meta completat: Nume, Telefon, Tip business, "Ce serviciu te interesează?"
□ Activare Google Ads Campanie 1 "Creare Site" (30 lei/zi să testezi)
□ Setare Google Ads Campanie 2 "Marketing Digital" (30 lei/zi)

LUNA 2 — OPTIMIZARE:
□ Analiză primelor campanii: care ad a costat mai puțin pe lead?
□ A/B test 2 creative Facebook (video vs. imagine statică)
□ Activare retargeting vizitatori site (C2 — 100 lei/lună)
□ Cerere recenzii Google de la clienții existenți (email/WhatsApp personalizat)
□ Boost posturile organice cu reach >500 (50 lei/post/7 zile)

LUNA 3-6 — SCALARE:
□ Creștere buget campaniilor cu ROI pozitiv
□ Campanie Lookalike audience (1% similar cu clienții existenți)
□ Blog posts SEO propriu: "Cum aleg o agenție de marketing în Sibiu", "Cât costă Google Ads"
□ Testimoniale video de la 2-3 clienți mulțumiți (cel mai puternic material)`,
  },
  {
    label: "C",
    titlu: "Control — KPI și monitorizare",
    color: "bg-slate-50 border-slate-200 text-slate-700",
    continut: `RAPORT SĂPTĂMÂNAL (15 minute):
• Leads noi din Facebook Ads (formular completat)
• Click-uri și cost Google Ads
• Urmăritori noi Instagram + Facebook
• Mesaje/DM-uri primite cu intenție
• Postul cu cel mai mare reach din săptămână

RAPORT LUNAR (complet):
• Total leads vs. target (5-10)
• Cost per lead pe platformă (Facebook vs. Google)
• Conversie lead → apel → client
• ROI: venit din clienți noi / buget marketing cheltuit
• Top 3 posturi organice (reach + engagement)
• Urmăritori noi vs. pierduți

DECIZII PE BAZA DATELOR:
• CTR Facebook Ads <1% → schimbă imaginea/video-ul (nu textul)
• CTR Facebook Ads >3%, leads puține → problema e la formular sau follow-up
• Cost/lead Facebook >300 lei → redu audiența, specifică mai mult interesele
• Google Ads CTR <3% → rescrie titlurile anunțurilor
• Google Ads CTR >5%, conversii puține → problema e landing page-ul
• Post organic cu reach >1.000 → boostează imediat cu 50-100 lei

INSTRUMENTE (toate gratuite sau incluse):
• Meta Ads Manager — campanii Facebook/Instagram
• Google Ads Dashboard — campanii search
• Google Analytics 4 — trafic site
• Google Business Profile — recenzii + prezență locală
• Meta Business Suite — programare posturi + statistici
• Acest CRM — tracking leads și follow-up`,
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
  const [buget, setBuget] = useState({ fb: "150", ig: "150", boost: "100", google: "180" });
  const [sostacOpen, setSostacOpen] = useState<number | null>(0);
  const [sostac, setSostac] = useState<SostacItem[]>(SOSTAC_NV);

  useEffect(() => {
    const saved = localStorage.getItem("novavisio_data");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.campanii) setCampanii(d.campanii);
        if (d.posturi) setPosturi(d.posturi);
        if (d.buget) setBuget(d.buget);
        if (d.sostac) setSostac(d.sostac);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("novavisio_data", JSON.stringify({ campanii, posturi, buget, sostac }));
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

  const totalBugetPaid = (Number(buget.fb) || 0) + (Number(buget.ig) || 0) + (Number(buget.boost) || 0) + (Number(buget.google) || 0);
  const totalBuget = totalBugetPaid;

  const TABS = [
    { id: "overview" as TabNV, label: "📊 Overview" },
    { id: "strategie" as TabNV, label: "🎯 SOSTAC + SMM" },
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
            <h2 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Buget Paid Lunar — Nova Visio
            </h2>
            <p className="text-xs text-slate-400 mb-4">Ajustează bugetul per canal — totalul se calculează automat.</p>
            <div className="grid md:grid-cols-2 gap-3 mb-4">
              {[
                { label: "🔵 Facebook Ads (Lead Gen + Urmăritori)", key: "fb" as const, color: "border-blue-300 bg-blue-50" },
                { label: "📷 Instagram Ads (Urmăritori + Reel boost)", key: "ig" as const, color: "border-pink-300 bg-pink-50" },
                { label: "🔍 Google Ads (Creare site + Marketing digital)", key: "google" as const, color: "border-emerald-300 bg-emerald-50" },
                { label: "⚡ Boost posturi organice performante", key: "boost" as const, color: "border-amber-300 bg-amber-50" },
              ].map(({ label, key, color }) => (
                <div key={key} className={`rounded-xl border p-3 ${color}`}>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>
                  <div className="flex items-center gap-1.5">
                    <input type="number" value={buget[key]}
                      onChange={(e) => setBuget({ ...buget, [key]: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <span className="text-sm text-slate-500 shrink-0">lei/lună</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-900 rounded-xl">
              <div>
                <p className="text-slate-400 text-xs">Total buget paid / lună</p>
                <p className="text-white font-bold text-2xl">{totalBuget} lei</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs">Estimat / săptămână</p>
                <p className="text-white font-semibold text-lg">{Math.round(totalBuget / 4.3)} lei</p>
              </div>
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

      {/* ── STRATEGIE SOSTAC ──────────────────────────────────────────────── */}
      {tab === "strategie" && (
        <div className="space-y-5">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-violet-700 rounded-2xl p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">SOSTAC + Strategie SMM — Nova Visio Tech</h2>
                <p className="text-blue-100 text-sm mt-1">Agenție marketing digital Sibiu · Site-uri · Google Ads · Meta Ads · SEO · Mentenanță</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-blue-200 text-xs">Buget total paid</p>
                <p className="text-white font-bold text-xl">{totalBuget} lei/lună</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Facebook Ads", "Google Search Ads", "Instagram Organic", "Lead Generation", "Brand Awareness Sibiu"].map((t) => (
                <span key={t} className="text-xs bg-white/20 rounded-full px-3 py-1">{t}</span>
              ))}
            </div>
          </div>

          {/* Recomandare imediată */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <h3 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Recomandare imediată — Unde să începi
            </h3>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { nr: "1", canal: "Facebook Ads — Lead Gen", desc: "Cel mai rapid ROI. Formular Meta + WhatsApp. Antreprenori care vor site/ads. Buget minim 300 lei/lună.", badge: "START ACUM", badgeColor: "bg-red-100 text-red-700" },
                { nr: "2", canal: "Google Search Ads", desc: '"Creare site sibiu" + "agentie google ads sibiu" = oameni care vor să cumpere ADA. CPC mic (2-5 lei). ROI rapid.', badge: "RECOMANDAT PUTERNIC", badgeColor: "bg-amber-100 text-amber-700" },
                { nr: "3", canal: "Instagram Organic", desc: "Gratuit. 4-5 posturi/săptămână educaționale. Construiești credibilitate și te găsesc viitorii clienți.", badge: "PARALEL", badgeColor: "bg-blue-100 text-blue-700" },
              ].map(({ nr, canal, desc, badge, badgeColor }) => (
                <div key={nr} className="bg-white rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">{nr}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm mb-1">{canal}</p>
                  <p className="text-xs text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SOSTAC accordion */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800">Framework SOSTAC</h3>
                <p className="text-xs text-slate-400">Analiză completă + plan de execuție. Click pentru a deschide și edita.</p>
              </div>
            </div>
            {sostac.map((s, i) => {
              const isOpen = sostacOpen === i;
              return (
                <div key={i} className="border-b border-slate-100 last:border-0">
                  <button onClick={() => setSostacOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${s.color}`}>{s.label}</span>
                      <span className="font-semibold text-slate-800 text-sm">{s.titlu.split("—")[1]?.trim() ?? s.titlu}</span>
                    </div>
                    <span className="text-slate-400 text-sm shrink-0 ml-2">{isOpen ? "▲" : "▼"}</span>
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
                        rows={14}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none bg-slate-50 leading-relaxed"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Piloni conținut SMM */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">📱 Piloni Conținut Social Media</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  platforma: "Instagram", pct: "4-5 posturi/săpt + Story zilnic",
                  icon: "📷", color: "from-pink-500 to-violet-500",
                  piloni: [
                    { p: "EDUCAȚIE", proc: 40, desc: "Tips Google Ads, Meta, SEO, UX — valoare pură, fără pitch", color: "bg-blue-500" },
                    { p: "REZULTATE", proc: 30, desc: "Cazuri reale (cifre, înainte/după, % creștere)", color: "bg-emerald-500" },
                    { p: "BEHIND THE SCENES", proc: 20, desc: "Procesul, echipa, cultura agenției — umanizare brand", color: "bg-amber-500" },
                    { p: "OFERTĂ", proc: 10, desc: "Audit gratuit, servicii — max 1 din 10 posturi", color: "bg-rose-500" },
                  ],
                },
                {
                  platforma: "Facebook", pct: "3-4 posturi/săpt + Grupuri",
                  icon: "f", color: "from-blue-500 to-blue-700",
                  piloni: [
                    { p: "STUDII DE CAZ", proc: 35, desc: "Detaliate, cu cifre reale — antreprenorii de 35+ apreciază substanța", color: "bg-blue-500" },
                    { p: "ȘTIRI MARKETING", proc: 25, desc: "Actualizări algoritm Google/Meta cu implicații practice", color: "bg-violet-500" },
                    { p: "OFERTE + CTA", proc: 25, desc: "Audit gratuit, pachete, consultanță — cu CTA clar", color: "bg-emerald-500" },
                    { p: "COMUNITATE", proc: 15, desc: "Poll-uri, întrebări, participare grupuri antreprenori Sibiu/RO", color: "bg-amber-500" },
                  ],
                },
              ].map(({ platforma, pct, icon, color, piloni }) => (
                <div key={platforma} className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className={`bg-gradient-to-r ${color} px-4 py-3 flex items-center gap-2`}>
                    <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-sm">{icon}</div>
                    <div>
                      <p className="text-white font-bold text-sm">{platforma}</p>
                      <p className="text-white/70 text-xs">{pct}</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {piloni.map(({ p, proc, desc, color: c }) => (
                      <div key={p}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="font-semibold text-slate-700">{p}</span>
                          <span className="text-slate-400">{proc}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full mb-0.5">
                          <div className={`h-full rounded-full ${c}`} style={{ width: `${proc}%` }} />
                        </div>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget split recomandat */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">💰 Buget Paid Recomandat — {totalBuget} lei/lună</h3>
            <div className="space-y-3">
              {[
                { canal: "Facebook Ads Lead Gen", val: Number(buget.fb), color: "bg-blue-500", nota: "Formular Meta + WhatsApp → antreprenori cu business" },
                { canal: "Google Search Ads", val: Number(buget.google), color: "bg-emerald-500", nota: "Creare site + Marketing digital + SEO sibiu" },
                { canal: "Instagram Ads", val: Number(buget.ig), color: "bg-pink-500", nota: "Urmăritori + boost Reels educaționale" },
                { canal: "Boost posturi organice", val: Number(buget.boost), color: "bg-amber-500", nota: "Amplifică posturile cu reach organic >500" },
              ].map(({ canal, val, color, nota }) => {
                const proc = totalBuget > 0 ? Math.round(val / totalBuget * 100) : 0;
                return (
                  <div key={canal}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700 font-medium">{canal}</span>
                      <span className="font-bold text-slate-800">{val} lei ({proc}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full mb-0.5">
                      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${proc}%` }} />
                    </div>
                    <p className="text-xs text-slate-400">{nota}</p>
                  </div>
                );
              })}
            </div>
          </div>

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
