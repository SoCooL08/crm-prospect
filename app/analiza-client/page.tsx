"use client";

import { useState } from "react";
import {
  ExternalLink, Download, Globe,
  TrendingUp, Loader2, Plus, Trash2,
} from "lucide-react";
import * as XLSX from "xlsx";

// ── Types ──────────────────────────────────────────────────────────────────

type ProfilSocial = {
  urmaritori: string;
  posturi: string;
  posturi_pe_saptamana: string;
  engagement_rate: string;
  tip_continut: string;
  cel_mai_bun_post: string;
  bio: string;
  link_in_bio: string;
  stories_active: string;
  reclame_active: string;
  nota_generala: string;
};

type ClientProfil = {
  nume: string;
  nisa: string;
  oras: string;
  website: string;
  facebook_url: string;
  instagram_url: string;
  facebook: ProfilSocial;
  instagram: ProfilSocial;
  obs_generale: string;
  puncte_forte: string;
  puncte_slabe: string;
  oportunitati: string;
  recomandari: string;
};

const profilGol = (): ProfilSocial => ({
  urmaritori: "", posturi: "", posturi_pe_saptamana: "", engagement_rate: "",
  tip_continut: "", cel_mai_bun_post: "", bio: "", link_in_bio: "",
  stories_active: "", reclame_active: "", nota_generala: "",
});

const clientGol = (): ClientProfil => ({
  nume: "", nisa: "", oras: "", website: "",
  facebook_url: "", instagram_url: "",
  facebook: profilGol(), instagram: profilGol(),
  obs_generale: "", puncte_forte: "", puncte_slabe: "",
  oportunitati: "", recomandari: "",
});

// ── Rows definition ────────────────────────────────────────────────────────

const SOCIAL_ROWS: { key: keyof ProfilSocial; label: string; placeholder: string }[] = [
  { key: "urmaritori", label: "Urmăritori", placeholder: "Ex: 2.4K" },
  { key: "posturi", label: "Nr. total posturi", placeholder: "Ex: 187" },
  { key: "posturi_pe_saptamana", label: "Posturi/săptămână", placeholder: "Ex: 3-4" },
  { key: "engagement_rate", label: "Engagement Rate (ER%)", placeholder: "Ex: 2.1%" },
  { key: "tip_continut", label: "Tip conținut predominant", placeholder: "Ex: Reels, foto produs, stories promotii" },
  { key: "cel_mai_bun_post", label: "Cel mai bun post (link/descriere)", placeholder: "Ex: Reel cu transformare înainte/după — 12K views" },
  { key: "bio", label: "BIO / Antet", placeholder: "Ex: 💅 Salon unghii Sibiu | ☎️ 07xx | 📍 Str..." },
  { key: "link_in_bio", label: "Link în BIO", placeholder: "Ex: Linktree, website, Whatsapp direct" },
  { key: "stories_active", label: "Stories active?", placeholder: "Da / Nu / Rar" },
  { key: "reclame_active", label: "Reclame plătite detectate?", placeholder: "Da / Nu — verificat Meta Ad Library" },
  { key: "nota_generala", label: "Notă generală (1-10)", placeholder: "Ex: 6 — prezență activă dar conținut slab" },
];

// ── Field input ────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, placeholder, big,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; big?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</label>
      {big ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
}

// ── Social panel ───────────────────────────────────────────────────────────

function PanelSocial({
  platform, url, profil, onChange, onUrlChange,
}: {
  platform: "facebook" | "instagram";
  url: string;
  profil: ProfilSocial;
  onChange: (p: ProfilSocial) => void;
  onUrlChange: (v: string) => void;
}) {
  const isFb = platform === "facebook";
  const bg = isFb ? "bg-blue-50 border-blue-200" : "bg-pink-50 border-pink-200";
  const header = isFb ? "bg-blue-600" : "bg-gradient-to-r from-pink-500 to-violet-600";
  const label = isFb ? "Facebook" : "Instagram";

  return (
    <div className={`border rounded-2xl overflow-hidden ${bg}`}>
      <div className={`${header} px-5 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-lg">{isFb ? "f" : "📷"}</span>
          <span className="text-white font-bold">{label}</span>
        </div>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-medium transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Deschide profil
          </a>
        )}
      </div>

      <div className="p-5 space-y-4">
        <Field
          label={`URL ${label}`}
          value={url}
          onChange={onUrlChange}
          placeholder={isFb ? "https://facebook.com/numeafacere" : "https://instagram.com/numeafacere"}
        />
        {SOCIAL_ROWS.map((row) => (
          <Field
            key={row.key}
            label={row.label}
            value={profil[row.key]}
            onChange={(v) => onChange({ ...profil, [row.key]: v })}
            placeholder={row.placeholder}
            big={["tip_continut", "cel_mai_bun_post", "bio"].includes(row.key)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function AnalizaClientPage() {
  const [clienti, setClienti] = useState<ClientProfil[]>([clientGol()]);
  const [activ, setActiv] = useState(0);

  const client = clienti[activ];

  function updateClient(patch: Partial<ClientProfil>) {
    setClienti((prev) => prev.map((c, i) => (i === activ ? { ...c, ...patch } : c)));
  }

  function adaugaClient() {
    setClienti((prev) => [...prev, clientGol()]);
    setActiv(clienti.length);
  }

  function stergeClient(i: number) {
    if (clienti.length === 1) return;
    const nou = clienti.filter((_, idx) => idx !== i);
    setClienti(nou);
    setActiv(Math.min(activ, nou.length - 1));
  }

  function exportExcel() {
    const wb = XLSX.utils.book_new();

    clienti.forEach((c, idx) => {
      const numeSheet = (c.nume || `Client ${idx + 1}`).slice(0, 28).replace(/[:\\/?*[\]]/g, "_");

      const rows: (string | number)[][] = [
        ["ANALIZA CLIENT", ""],
        ["Nume business", c.nume],
        ["Nisa", c.nisa],
        ["Oras", c.oras],
        ["Website", c.website],
        ["Facebook", c.facebook_url],
        ["Instagram", c.instagram_url],
        ["", ""],
        ["FACEBOOK", ""],
        ...SOCIAL_ROWS.map((r) => [r.label, c.facebook[r.key]]),
        ["", ""],
        ["INSTAGRAM", ""],
        ...SOCIAL_ROWS.map((r) => [r.label, c.instagram[r.key]]),
        ["", ""],
        ["ANALIZA", ""],
        ["Observatii generale", c.obs_generale],
        ["Puncte forte", c.puncte_forte],
        ["Puncte slabe", c.puncte_slabe],
        ["Oportunitati Nova Visio", c.oportunitati],
        ["Recomandari / pitch", c.recomandari],
        ["", ""],
        ["PROMPT PENTRU CLAUDE DESKTOP", ""],
        [
          `Esti un expert in marketing digital si social media din Romania.\n\nAnalizeaza profilul urmatorului business si completeaza sectiunile goale:\n\nBusiness: ${c.nume || "?"}\nNisa: ${c.nisa || "?"}\nOras: ${c.oras || "?"}\nFacebook: ${c.facebook_url || "N/A"}\nInstagram: ${c.instagram_url || "N/A"}\nWebsite: ${c.website || "N/A"}\n\nAnalizeaza paginile lor de social media si completeaza:\n1. Toate campurile goale din sectiunile Facebook si Instagram\n2. Observatii generale despre prezenta lor online\n3. Puncte forte (ce fac bine)\n4. Puncte slabe (ce lipseste sau e slab)\n5. Oportunitati concrete pentru Nova Visio Tech (ce servicii le-ar aduce valoare)\n6. Pitch recomandat pentru intalnirea de vanzari\n\nFii specific, cu exemple concrete din nisa lor.`,
          "",
        ],
      ];

      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws["!cols"] = [{ wch: 30 }, { wch: 80 }];
      XLSX.utils.book_append_sheet(wb, ws, numeSheet);
    });

    XLSX.writeFile(wb, `analiza_clienti_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            Analiză Client
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Analiza prezentei social media pentru întâlniri de vânzări.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={adaugaClient}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Plus className="w-4 h-4" /> Client nou
          </button>
          <button
            onClick={exportExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Excel + Prompt AI
          </button>
        </div>
      </div>

      {/* Client tabs */}
      {clienti.length > 1 && (
        <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
          {clienti.map((c, i) => (
            <div key={i} className="flex items-center">
              <button
                onClick={() => setActiv(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activ === i ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {c.nume || `Client ${i + 1}`}
              </button>
              <button
                onClick={() => stergeClient(i)}
                className="text-slate-400 hover:text-red-500 ml-0.5 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Info business */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4" /> Informații Business
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Nume business" value={client.nume} onChange={(v) => updateClient({ nume: v })} placeholder="Ex: Salon Glamour" />
          <Field label="Nișă" value={client.nisa} onChange={(v) => updateClient({ nisa: v })} placeholder="Ex: Saloane înfrumusețare" />
          <Field label="Oraș" value={client.oras} onChange={(v) => updateClient({ oras: v })} placeholder="Ex: Sibiu" />
          <Field
            label="Website"
            value={client.website}
            onChange={(v) => updateClient({ website: v })}
            placeholder="https://..."
          />
        </div>
        {client.website && (
          <a
            href={client.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Deschide website
          </a>
        )}
      </div>

      {/* Social panels */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <PanelSocial
          platform="facebook"
          url={client.facebook_url}
          profil={client.facebook}
          onChange={(p) => updateClient({ facebook: p })}
          onUrlChange={(v) => updateClient({ facebook_url: v })}
        />
        <PanelSocial
          platform="instagram"
          url={client.instagram_url}
          profil={client.instagram}
          onChange={(p) => updateClient({ instagram: p })}
          onUrlChange={(v) => updateClient({ instagram_url: v })}
        />
      </div>

      {/* Analiza text */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Analiză & Pitch
        </h2>

        <Field
          label="Observații generale"
          value={client.obs_generale}
          onChange={(v) => updateClient({ obs_generale: v })}
          placeholder="Prezenta online generala, consistenta, frecventa..."
          big
        />
        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="✅ Puncte forte"
            value={client.puncte_forte}
            onChange={(v) => updateClient({ puncte_forte: v })}
            placeholder="Ce fac bine — design, frecventa, engagement..."
            big
          />
          <Field
            label="❌ Puncte slabe"
            value={client.puncte_slabe}
            onChange={(v) => updateClient({ puncte_slabe: v })}
            placeholder="Ce lipseste — reclame, website, viteza, continut..."
            big
          />
        </div>
        <Field
          label="🎯 Oportunități Nova Visio Tech"
          value={client.oportunitati}
          onChange={(v) => updateClient({ oportunitati: v })}
          placeholder="Ce servicii le-ar aduce valoare concreta: Ads, SEO, web, SMM..."
          big
        />
        <Field
          label="💬 Pitch recomandat pentru întâlnire"
          value={client.recomandari}
          onChange={(v) => updateClient({ recomandari: v })}
          placeholder="Cum deschizi discutia, ce problema ridici, ce propui..."
          big
        />
      </div>

      {/* Export hint */}
      <div className="mt-6 p-4 bg-violet-50 border border-violet-200 rounded-xl text-sm text-violet-700">
        <p className="font-semibold mb-1">💡 Workflow cu Claude Desktop</p>
        <ol className="list-decimal list-inside space-y-1 text-violet-600">
          <li>Completezi URL-urile Facebook / Instagram de mai sus</li>
          <li>Deschizi profilurile (buton &quot;Deschide profil&quot;) și notezi datele cheie</li>
          <li>Apeși <strong>Export Excel + Prompt AI</strong> — se descarcă fișierul</li>
          <li>Trimiți fișierul la Claude Desktop — el completează automat analiza</li>
          <li>Copiezi analiza înapoi în câmpurile de mai sus</li>
        </ol>
      </div>
    </div>
  );
}
