"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Plus, Trash2, Loader2, CheckCircle2, Users, BarChart2, Target,
  Sparkles, Megaphone,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type Segment = Record<string, string> & { id: string; nume: string };
type Concurent = Record<string, string> & { id: string; nume: string; link: string };
type SOSTACData = {
  situatie: string; obiective: string; strategie: string;
  tactici: string; actiuni: string; control: string;
};
type AdsData = {
  google?: {
    tip_campanie?: string;
    obiectiv?: string;
    cuvinte_cheie?: string[];
    cuvinte_negative?: string[];
    titluri?: string[];
    descrieri?: string[];
    targeting_geo?: string;
    buget_recomandat?: string;
    bid_strategy?: string;
    extensii?: string[];
    landing_page?: string;
  };
  meta?: {
    tip_campanie?: string;
    obiectiv?: string;
    audienta_primara?: string;
    audienta_lookalike?: string;
    interese_targeting?: string[];
    varsta_targeting?: string;
    locatii_targeting?: string;
    formate_reclama?: string[];
    titlu_reclama?: string;
    text_principal?: string;
    cta?: string;
    buget_recomandat?: string;
    durata_campanie?: string;
    retargeting?: string;
  };
};

// ── Row definitions ────────────────────────────────────────────────────────

const AUDIENTA_ROWS: { group?: string; label?: string; key?: string; placeholder?: string }[] = [
  { group: "GEO" },
  { label: "Locatie geografica", key: "geo_locatie", placeholder: "Ex: Predominant Sibiu, urban, aproape de licee..." },
  { label: "Alte locatii fizice", key: "geo_alte_locatii", placeholder: "Ex: cafenele, centre comerciale, sali sport..." },
  { label: "Prezenta online (retele, platforme)", key: "geo_online", placeholder: "Ex: Instagram, TikTok, Facebook grupuri..." },
  { label: "Zona (urban/rural/agrement)", key: "geo_zona", placeholder: "Ex: Sibiu, Selimbar, Cisnadie — zona urbana" },
  { group: "SOCIO-DEMOGRAFIC" },
  { label: "Varsta", key: "socio_varsta", placeholder: "Ex: 18-24" },
  { label: "Sex", key: "socio_sex", placeholder: "Ex: Feminin" },
  { label: "Ocupatia", key: "socio_ocupatie", placeholder: "Ex: studenta, job part-time, freelancer" },
  { label: "Statut social", key: "socio_statut", placeholder: "Ex: Single, Relatie" },
  { label: "Educatie", key: "socio_educatie", placeholder: "Ex: Liceu, Universitate" },
  { label: "Venit", key: "socio_venit", placeholder: "Ex: Venit parinti, job part-time" },
  { group: "PSIHO-GRAFICE" },
  { label: "Motivatia interna", key: "psiho_motivatie", placeholder: "Ex: Dorinta de a arata bine, de a fi in tendinte" },
  { label: "Valori", key: "psiho_valori", placeholder: "Ex: Ingrijire profesionala, tendinte actuale" },
  { label: "Convingeri", key: "psiho_convingeri", placeholder: "Ex: Nu stiu daca ii avantajeaza rezultatele" },
  { label: "Persoana-model", key: "psiho_model", placeholder: "Ex: Influencer, vedeta, persoana publica" },
  { label: "Atitudinea fata de inovatii", key: "psiho_inovatie", placeholder: "Ex: Pozitiva / Neutra / Sceptica" },
  { group: "COMPORTAMENT" },
  { label: "Tipul cumparatorului online", key: "comp_tip", placeholder: "Ex: Activ, impulsiv, influentat de feed" },
  { label: "Nivel constientizare (Scara Hant)", key: "comp_hant", placeholder: "Ex: Mediu — cauta activ solutii" },
  { label: "Factorul decisiv in cumparare", key: "comp_factor", placeholder: "Ex: Calitate, pret, recenzii, autoritate" },
  { label: "Nivel incredere si risc", key: "comp_incredere", placeholder: "Ex: Mediu — ar putea risca" },
  { label: "Nivelul riscului achizitiei", key: "comp_risc", placeholder: "Ex: Scazut / Mediu / Ridicat" },
  { label: "Atitudinea fata de vanzare online", key: "comp_online", placeholder: "Ex: Pozitiva, prefera canale digitale" },
  { label: "Ciclul de achizitie / decizie", key: "comp_ciclu", placeholder: "Ex: Cateva minute / Cateva zile" },
  { label: "Independenta in decizie", key: "comp_independenta", placeholder: "Ex: Independenta sau sfatuita de prieteni" },
  { group: "FRICI & INTERESE" },
  { label: "Frici", key: "fi_frici", placeholder: "Ex: Daca nu iasa cum vrea, daca e prea scump" },
  { label: "Interese", key: "fi_interese", placeholder: "Ex: Lifestyle, Beauty, Fashion, Travel" },
  { group: "ATITUDINEA FATA DE PRODUS" },
  { label: "De ce cumpara produsul/serviciul tau?", key: "prod_de_ce", placeholder: "Ex: Au nevoie de serviciu la un eveniment" },
  { label: "Beneficii pentru client", key: "prod_beneficii", placeholder: "Ex: Stare de multumire, incredere de sine" },
  { label: "Probleme pe care vor sa le rezolve", key: "prod_probleme", placeholder: "Ex: Sa arate bine la eveniment" },
  { label: "Cum rezolva acum problema?", key: "prod_solutie", placeholder: "Ex: Alte saloane, produse cosmetice acasa" },
  { label: "Solutii alternative", key: "prod_alternative", placeholder: "Ex: Alte saloane, operatii estetice" },
  { label: "Obiectii fata de produs", key: "prod_obiectii", placeholder: "Ex: Pretul, rezultatele nu vin destul de repede" },
  { label: "De ce serviciul tau e cel mai potrivit? (min 3)", key: "prod_de_ce_tu", placeholder: "Ex: Pret corect, produse profesionale, expertiza" },
  { label: "Nivelul de cunoastere a produsului", key: "prod_cunostinte", placeholder: "Ex: Mediu / Ridicat" },
  { label: "Factori decisivi in achizitie", key: "prod_factori", placeholder: "Ex: Calitate, reputatie, statut, livrar" },
];

const CONCURENTI_ROWS: { group?: string; label?: string; key?: string }[] = [
  { group: "PRODUS" },
  { label: "Ce produse/servicii ofera", key: "prod_ce_are" },
  { label: "Cele mai vandute", key: "prod_best" },
  { label: "Criterii unice fata de tine", key: "prod_unic" },
  { group: "STRATEGIE" },
  { label: "Sediu & atmosfera", key: "strat_sediu" },
  { label: "Fac reclama platita?", key: "strat_reclama" },
  { label: "Bloggeri / influenceri", key: "strat_bloggeri" },
  { label: "Puncte de contact", key: "strat_contact" },
  { label: "Tipul de content", key: "strat_content" },
  { label: "Engagement Rate (ER)", key: "strat_er" },
  { label: "Canale de promovare", key: "strat_canale" },
  { group: "VANZARI" },
  { label: "Algoritmul vanzarilor", key: "vanz_algoritm" },
  { label: "Canale de vanzari", key: "vanz_canale" },
  { label: "Lantul lucrului cu clientul", key: "vanz_lant" },
  { label: "Timp raspuns / chatbot?", key: "vanz_raspuns" },
  { label: "Ce atrage la BIO / antet?", key: "vanz_bio" },
  { label: "Cum lucreaza cu comentariile?", key: "vanz_comentarii" },
  { label: "Script vanzari", key: "vanz_script" },
  { group: "FINANTE" },
  { label: "Cec mediu", key: "fin_cec" },
  { label: "Nr vanzari pe luna", key: "fin_vanzari" },
  { group: "CLIENTI" },
  { label: "Urmaritori + medie likes", key: "clt_urmaritori" },
  { label: "Nr clienti pe zi", key: "clt_zi" },
  { group: "PARERE PERSONALA" },
  { label: "Ce ai schimba? (min 5 lucruri)", key: "par_schimba" },
  { label: "Cat ti-a placut site/pagina? (1-10)", key: "par_nota" },
];

const SOSTAC_SECTIUNI = [
  {
    key: "situatie" as keyof SOSTACData,
    label: "S — SITUATIE",
    color: "bg-blue-50 border-blue-200",
    labelColor: "text-blue-700",
    placeholder: "Situatia actuala a businessului: cati urmăritori, câte vânzări, pe ce platforme se promovează, ce instrumente folosesc la moment, ce buget au pentru reclama, au lucrat cu bloggeri, câte vânzări au și din ce canale...",
  },
  {
    key: "obiective" as keyof SOSTACData,
    label: "O — OBIECTIVE",
    color: "bg-violet-50 border-violet-200",
    labelColor: "text-violet-700",
    placeholder: "Care este scopul în cifre și limitat în timp? Ex: Creștere la 500 followers până pe 01.09.2025. Vânzări de €1500/lună. Reducerea timpului de încărcare a site-ului cu 70%...",
  },
  {
    key: "strategie" as keyof SOSTACData,
    label: "ST — STRATEGIE",
    color: "bg-amber-50 border-amber-200",
    labelColor: "text-amber-700",
    placeholder: "Cum ajungem la obiectiv? Notează minimum 3 idei principale: Ex: Crearea traficului pe pagina, ofertă de 25% la prima comandă, concurs pe pagina...",
  },
  {
    key: "tactici" as keyof SOSTACData,
    label: "T — TACTICI",
    color: "bg-emerald-50 border-emerald-200",
    labelColor: "text-emerald-700",
    placeholder: "Ce instrumente folosim pentru fiecare strategie? Platforme, formate, variante: Ex: Reclama platita pe Instagram, TikTok pentru trafic, Story cu oferta saptamanala...",
  },
  {
    key: "actiuni" as keyof SOSTACData,
    label: "A — ACTIUNI",
    color: "bg-orange-50 border-orange-200",
    labelColor: "text-orange-700",
    placeholder: "Fiecare tactică, descompusă în acțiuni concrete cu termene: Ex: Reclama platita 01.06-14.06, cream 3 Reels/saptamana, adaugam Story cu oferta luni-vineri...",
  },
  {
    key: "control" as keyof SOSTACData,
    label: "C — CONTROL",
    color: "bg-slate-50 border-slate-200",
    labelColor: "text-slate-700",
    placeholder: "Cum masurim rezultatele? Ce metrici urmarim? Cum corectam strategia daca nu functioneaza? Ex: Verificam saptamanal: reach, ER, nr programari noi, cost/click...",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

let _uid = 1;
const uid = () => String(_uid++);

function segmentGol(name = ""): Segment {
  const base: Record<string, string> = { id: uid(), nume: name };
  for (const row of AUDIENTA_ROWS) {
    if (row.key) base[row.key] = "";
  }
  return base as Segment;
}

function concurentGol(): Concurent {
  const base: Record<string, string> = { id: uid(), nume: "", link: "" };
  for (const row of CONCURENTI_ROWS) {
    if (row.key) base[row.key] = "";
  }
  return base as Concurent;
}

const sostacGol = (): SOSTACData => ({
  situatie: "", obiective: "", strategie: "", tactici: "", actiuni: "", control: "",
});

// ── Cell textarea ──────────────────────────────────────────────────────────

function Cell({
  value, onChange, placeholder, tall,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; tall?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "—"}
      rows={tall ? 4 : 2}
      className="w-full text-sm text-slate-700 placeholder-slate-300 resize-none bg-transparent focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-200 rounded px-2 py-1.5 leading-snug transition-colors"
    />
  );
}

// ── Tab: Audienta ──────────────────────────────────────────────────────────

function TabAudienta({
  segmente, onChange,
}: {
  segmente: Segment[];
  onChange: (s: Segment[]) => void;
}) {
  function updateSeg(segId: string, key: string, val: string) {
    onChange(segmente.map((s) => (s.id === segId ? { ...s, [key]: val } : s)));
  }

  function addSeg() {
    if (segmente.length >= 5) return;
    onChange([...segmente, segmentGol(`Audienta ${segmente.length + 1}`)]);
  }

  function removeSeg(segId: string) {
    onChange(segmente.filter((s) => s.id !== segId));
  }

  const colW = `minmax(180px, 1fr)`;
  const gridStyle = {
    gridTemplateColumns: `200px repeat(${segmente.length}, ${colW})`,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          Defineste profilul clientilor tinta ai businessului — pana la 5 segmente.
        </p>
        <button
          onClick={addSeg}
          disabled={segmente.length >= 5}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-40 transition-colors"
        >
          <Plus className="w-4 h-4" /> Adauga segment
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="min-w-[600px]">
          {/* Header segmente */}
          <div className="grid gap-0 border-b border-slate-200" style={gridStyle}>
            <div className="bg-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wide px-4 py-3 rounded-tl-xl">
              Criteriu
            </div>
            {segmente.map((seg, i) => (
              <div key={seg.id} className="bg-slate-800 px-3 py-2 flex items-center gap-2 border-l border-slate-700">
                <input
                  value={seg.nume}
                  onChange={(e) => updateSeg(seg.id, "nume", e.target.value)}
                  placeholder={`Segment ${i + 1}`}
                  className="flex-1 bg-transparent text-white text-sm font-semibold focus:outline-none placeholder-slate-500 min-w-0"
                />
                {segmente.length > 1 && (
                  <button onClick={() => removeSeg(seg.id)} className="text-slate-500 hover:text-red-400 transition-colors shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Rows */}
          {AUDIENTA_ROWS.map((row, ri) => {
            if (row.group) {
              return (
                <div
                  key={`grp-${ri}`}
                  className="grid border-b border-slate-200 bg-slate-50"
                  style={gridStyle}
                >
                  <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider col-span-full"
                    style={{ gridColumn: `1 / -1` }}>
                    {row.group}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={row.key}
                className="grid border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                style={gridStyle}
              >
                <div className="px-4 py-2.5 text-xs text-slate-600 border-r border-slate-100 flex items-start pt-3 font-medium leading-snug">
                  {row.label}
                </div>
                {segmente.map((seg) => (
                  <div key={seg.id} className="px-2 py-1.5 border-l border-slate-100">
                    <Cell
                      value={seg[row.key!] || ""}
                      onChange={(v) => updateSeg(seg.id, row.key!, v)}
                      placeholder={row.placeholder}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Tab: Concurenti ────────────────────────────────────────────────────────

function TabConcurenti({
  concurenti, onChange,
}: {
  concurenti: Concurent[];
  onChange: (c: Concurent[]) => void;
}) {
  function updateConc(cId: string, key: string, val: string) {
    onChange(concurenti.map((c) => (c.id === cId ? { ...c, [key]: val } : c)));
  }

  function addConc() {
    if (concurenti.length >= 5) return;
    onChange([...concurenti, concurentGol()]);
  }

  function removeConc(cId: string) {
    onChange(concurenti.filter((c) => c.id !== cId));
  }

  const gridStyle = {
    gridTemplateColumns: `200px repeat(${concurenti.length}, minmax(180px, 1fr))`,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          Analizeaza 3-5 concurenti ai businessului — produs, strategie, vanzari, finante.
        </p>
        <button
          onClick={addConc}
          disabled={concurenti.length >= 5}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-40 transition-colors"
        >
          <Plus className="w-4 h-4" /> Adauga concurent
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="min-w-[600px]">
          {/* Header */}
          <div className="grid gap-0 border-b border-slate-200" style={gridStyle}>
            <div className="bg-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wide px-4 py-3 rounded-tl-xl">
              Criteriu
            </div>
            {concurenti.map((c, i) => (
              <div key={c.id} className="bg-slate-800 px-3 py-2 border-l border-slate-700 space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    value={c.nume}
                    onChange={(e) => updateConc(c.id, "nume", e.target.value)}
                    placeholder={`Concurent ${i + 1}`}
                    className="flex-1 bg-transparent text-white text-sm font-semibold focus:outline-none placeholder-slate-500 min-w-0"
                  />
                  {concurenti.length > 1 && (
                    <button onClick={() => removeConc(c.id)} className="text-slate-500 hover:text-red-400 transition-colors shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input
                  value={c.link}
                  onChange={(e) => updateConc(c.id, "link", e.target.value)}
                  placeholder="ig: @... sau link"
                  className="w-full bg-transparent text-slate-400 text-xs focus:outline-none placeholder-slate-600 min-w-0"
                />
              </div>
            ))}
          </div>

          {/* Rows */}
          {CONCURENTI_ROWS.map((row, ri) => {
            if (row.group) {
              return (
                <div key={`grp-${ri}`} className="grid border-b border-slate-200 bg-slate-50" style={gridStyle}>
                  <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider" style={{ gridColumn: "1 / -1" }}>
                    {row.group}
                  </div>
                </div>
              );
            }
            return (
              <div key={row.key} className="grid border-b border-slate-100 hover:bg-slate-50/50 transition-colors" style={gridStyle}>
                <div className="px-4 py-2.5 text-xs text-slate-600 border-r border-slate-100 flex items-start pt-3 font-medium leading-snug">
                  {row.label}
                </div>
                {concurenti.map((c) => (
                  <div key={c.id} className="px-2 py-1.5 border-l border-slate-100">
                    <Cell
                      value={c[row.key!] || ""}
                      onChange={(v) => updateConc(c.id, row.key!, v)}
                      tall={["par_schimba", "vanz_lant", "strat_bloggeri"].includes(row.key!)}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Tab: SOSTAC ────────────────────────────────────────────────────────────

function TabSOSTAC({
  sostac, onChange,
}: {
  sostac: SOSTACData;
  onChange: (s: SOSTACData) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 mb-6">
        Completeaza strategia SOSTAC pentru acest business. Fiecare sectiune ghideaza planul de actiune digital.
      </p>
      {SOSTAC_SECTIUNI.map(({ key, label, color, labelColor, placeholder }) => (
        <div key={key} className={`border rounded-xl p-5 ${color}`}>
          <p className={`text-sm font-bold uppercase tracking-wide mb-3 ${labelColor}`}>{label}</p>
          <textarea
            value={sostac[key]}
            onChange={(e) => onChange({ ...sostac, [key]: e.target.value })}
            placeholder={placeholder}
            rows={5}
            className="w-full text-sm text-slate-700 placeholder-slate-400 bg-white/80 focus:bg-white border border-white/60 focus:border-slate-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all leading-relaxed"
          />
        </div>
      ))}
    </div>
  );
}

// ── Tab: Ads ──────────────────────────────────────────────────────────────

function TagList({ items }: { items?: string[] }) {
  if (!items?.length) return <span className="text-slate-400 text-sm">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {items.map((item, i) => (
        <span key={i} className="text-xs bg-white/60 border border-current/20 rounded-md px-2 py-0.5">
          {item}
        </span>
      ))}
    </div>
  );
}

function AdsRow({ label, value }: { label: string; value?: string | string[] }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="py-2.5 border-b border-white/30 last:border-0">
      <p className="text-xs font-semibold text-current/60 uppercase tracking-wide mb-0.5">{label}</p>
      {Array.isArray(value) ? (
        <TagList items={value} />
      ) : (
        <p className="text-sm text-current/90 leading-relaxed">{value}</p>
      )}
    </div>
  );
}

function TabAds({ ads }: { ads: AdsData }) {
  const hasGoogle = ads.google && Object.keys(ads.google).length > 0;
  const hasMeta = ads.meta && Object.keys(ads.meta).length > 0;

  if (!hasGoogle && !hasMeta) {
    return (
      <div className="text-center py-16 text-slate-400">
        <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Nicio recomandare Ads generata inca.</p>
        <p className="text-xs mt-1">Apasa &quot;Genereaza cu AI&quot; pentru a genera strategia completa.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Google Ads */}
      {hasGoogle && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-blue-900">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            <h3 className="font-bold text-blue-800">Google Ads</h3>
          </div>
          <AdsRow label="Tip campanie" value={ads.google?.tip_campanie} />
          <AdsRow label="Obiectiv" value={ads.google?.obiectiv} />
          <AdsRow label="Cuvinte cheie" value={ads.google?.cuvinte_cheie} />
          <AdsRow label="Cuvinte negative" value={ads.google?.cuvinte_negative} />
          <AdsRow label="Titluri reclame" value={ads.google?.titluri} />
          <AdsRow label="Descrieri" value={ads.google?.descrieri} />
          <AdsRow label="Targeting geografic" value={ads.google?.targeting_geo} />
          <AdsRow label="Buget recomandat" value={ads.google?.buget_recomandat} />
          <AdsRow label="Strategia de bid" value={ads.google?.bid_strategy} />
          <AdsRow label="Extensii" value={ads.google?.extensii} />
          <AdsRow label="Landing page" value={ads.google?.landing_page} />
        </div>
      )}

      {/* Meta Ads */}
      {hasMeta && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 text-indigo-900">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">f</span>
            </div>
            <h3 className="font-bold text-indigo-800">Meta Ads (Facebook + Instagram)</h3>
          </div>
          <AdsRow label="Tip campanie" value={ads.meta?.tip_campanie} />
          <AdsRow label="Obiectiv" value={ads.meta?.obiectiv} />
          <AdsRow label="Audienta primara" value={ads.meta?.audienta_primara} />
          <AdsRow label="Audienta Lookalike" value={ads.meta?.audienta_lookalike} />
          <AdsRow label="Interese targeting" value={ads.meta?.interese_targeting} />
          <AdsRow label="Varsta targeting" value={ads.meta?.varsta_targeting} />
          <AdsRow label="Locatii targeting" value={ads.meta?.locatii_targeting} />
          <AdsRow label="Formate reclama" value={ads.meta?.formate_reclama} />
          <AdsRow label="Titlu reclama" value={ads.meta?.titlu_reclama} />
          <AdsRow label="Text principal" value={ads.meta?.text_principal} />
          <AdsRow label="Call to Action" value={ads.meta?.cta} />
          <AdsRow label="Buget recomandat" value={ads.meta?.buget_recomandat} />
          <AdsRow label="Durata campanie" value={ads.meta?.durata_campanie} />
          <AdsRow label="Retargeting" value={ads.meta?.retargeting} />
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

type Tab = "audienta" | "concurenti" | "sostac" | "ads";

export default function StrategiePage() {
  const params = useParams();
  const id = params.id as string;

  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState("");

  const [tab, setTab] = useState<Tab>("audienta");
  const [segmente, setSegmente] = useState<Segment[]>([
    segmentGol("Segment 1"), segmentGol("Segment 2"),
  ]);
  const [concurenti, setConcurenti] = useState<Concurent[]>([
    concurentGol(), concurentGol(), concurentGol(),
  ]);
  const [sostac, setSOSTAC] = useState<SOSTACData>(sostacGol());
  const [ads, setAds] = useState<AdsData>({});

  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modifiedRef = useRef(false);

  // Load
  useEffect(() => {
    async function load() {
      const [resLead, resStrat] = await Promise.all([
        fetch(`/api/leads/${id}`),
        fetch(`/api/strategii/${id}`),
      ]);
      const leadData = await resLead.json();
      if (leadData.error) { setEroare(leadData.error); setLoading(false); return; }
      setLead(leadData);

      const stratData = await resStrat.json();
      if (!stratData.error) {
        if (stratData.audienta?.segmente?.length) {
          setSegmente(stratData.audienta.segmente);
        } else {
          setSegmente([segmentGol("Segment 1"), segmentGol("Segment 2")]);
        }
        if (stratData.concurenti?.length) {
          setConcurenti(stratData.concurenti);
        }
        if (stratData.sostac && Object.keys(stratData.sostac).length) {
          setSOSTAC({ ...sostacGol(), ...stratData.sostac });
        }
        if (stratData.ads) {
          setAds(stratData.ads);
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  // Auto-save (debounced 1.5s)
  const scheduleSave = useCallback(() => {
    modifiedRef.current = true;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (!modifiedRef.current) return;
      modifiedRef.current = false;
      setSaving(true);
      try {
        await fetch(`/api/strategii/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audienta: { segmente },
            concurenti,
            sostac,
            ads,
          }),
        });
        setSavedAt(new Date());
      } catch {}
      setSaving(false);
    }, 1500);
  }, [id, segmente, concurenti, sostac, ads]);

  // Trigger save when state changes
  useEffect(() => {
    if (!loading) scheduleSave();
  }, [segmente, concurenti, sostac, ads]);

  async function genereazaAI() {
    setGenerating(true);
    setGenError("");
    try {
      const res = await fetch(`/api/strategii/${id}/genereaza`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setGenError(data.error || "Eroare la generare");
        return;
      }
      // Update all state from generated data
      if (data.audienta?.segmente?.length) setSegmente(data.audienta.segmente);
      if (data.concurenti?.length) setConcurenti(data.concurenti);
      if (data.sostac && Object.keys(data.sostac).length) setSOSTAC({ ...sostacGol(), ...data.sostac });
      if (data.ads) setAds(data.ads);
      setSavedAt(new Date());
      setTab("audienta");
    } catch {
      setGenError("Eroare de retea");
    } finally {
      setGenerating(false);
    }
  }

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: "audienta", label: "Audienta", icon: Users },
    { id: "concurenti", label: "Concurenti", icon: BarChart2 },
    { id: "sostac", label: "Strategie SOSTAC", icon: Target },
    { id: "ads", label: "Google & Meta Ads", icon: Megaphone },
  ];

  if (loading)
    return (
      <div className="p-8 flex items-center gap-2 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" /> Se incarca...
      </div>
    );

  if (eroare || !lead)
    return (
      <div className="p-8">
        <p className="text-red-600 text-sm mb-3">{eroare || "Lead negasit."}</p>
        <Link href="/leads" className="text-blue-600 text-sm hover:underline">← Inapoi la leaduri</Link>
      </div>
    );

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <Link
            href={`/leads/${id}`}
            className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-3 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> {lead.nume}
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900">Strategie</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {lead.nisa} · {lead.oras}, {lead.judet}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {saving && (
            <span className="flex items-center gap-1.5 text-sm text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Se salveaza...
            </span>
          )}
          {!saving && savedAt && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Salvat {savedAt.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}

          <button
            onClick={genereazaAI}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors shadow-sm"
          >
            {generating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Se genereaza...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Genereaza cu AI</>
            )}
          </button>
        </div>
      </div>

      {genError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {genError}
        </div>
      )}

      {generating && (
        <div className="mb-4 p-4 bg-violet-50 border border-violet-200 rounded-xl text-sm text-violet-700 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          Claude analizeaza business-ul si genereaza strategia completa (audienta, concurenti, SOSTAC, Google & Meta Ads)...
          Poate dura 30-60 secunde.
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
        {TABS.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setTab(tabId)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === tabId
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {tabId === "ads" && (ads.google || ads.meta) && (
              <span className="w-2 h-2 rounded-full bg-violet-500 ml-0.5" />
            )}
          </button>
        ))}
      </div>

      {/* Nota SQL */}
      {eroare.includes("does not exist") && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <strong>SQL migration necesara:</strong> Ruleaza in Supabase:
          <code className="block mt-1 font-mono text-xs bg-amber-100 rounded p-2">
            CREATE TABLE strategii (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, lead_id uuid REFERENCES leads(id) ON DELETE CASCADE, audienta jsonb DEFAULT &apos;{"{}"}&apos;, concurenti jsonb DEFAULT &apos;[]&apos;, sostac jsonb DEFAULT &apos;{"{}"}&apos;, ads jsonb DEFAULT &apos;{"{}"}&apos;, updated_at timestamptz DEFAULT now(), CONSTRAINT strategii_lead_id_unique UNIQUE(lead_id));
          </code>
        </div>
      )}

      {/* Tab content */}
      {tab === "audienta" && (
        <TabAudienta segmente={segmente} onChange={(s) => { setSegmente(s); }} />
      )}
      {tab === "concurenti" && (
        <TabConcurenti concurenti={concurenti} onChange={(c) => { setConcurenti(c); }} />
      )}
      {tab === "sostac" && (
        <TabSOSTAC sostac={sostac} onChange={(s) => { setSOSTAC(s); }} />
      )}
      {tab === "ads" && (
        <TabAds ads={ads} />
      )}
    </div>
  );
}
