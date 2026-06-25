"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, Users, Trophy, AlertTriangle, BarChart3, Download } from "lucide-react";

type NisaStat = {
  nisa: string;
  total: number;
  clienti: number;
  pierduti: number;
  pipeline: number;
  conversie: number;
  rating_mediu: number | null;
  oras_principal: string;
  motiv_principal: string;
  valoare_pipeline: number;
};

type Totale = {
  leads: number;
  clienti: number;
  pierduti: number;
  pipeline: number;
  nise_unice: number;
  conversie: number;
};

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5`}>
      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500 w-6 text-right">{value}</span>
    </div>
  );
}

function ConversieBar({ conversie }: { conversie: number }) {
  const color =
    conversie >= 30 ? "bg-emerald-500" :
    conversie >= 15 ? "bg-amber-400" :
    "bg-slate-300";
  const text =
    conversie >= 30 ? "text-emerald-700" :
    conversie >= 15 ? "text-amber-700" :
    "text-slate-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(conversie, 100)}%` }} />
      </div>
      <span className={`text-sm font-bold ${text}`}>{conversie}%</span>
    </div>
  );
}

export default function StatisticiPage() {
  const [nise, setNise] = useState<NisaStat[]>([]);
  const [totale, setTotale] = useState<Totale | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"total" | "conversie" | "clienti">("total");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/statistici")
      .then((r) => r.json())
      .then((d) => {
        if (d.nise) setNise(d.nise);
        if (d.totale) setTotale(d.totale);
      })
      .finally(() => setLoading(false));
  }, []);

  function exportCSV() {
    const header = ["Nisa", "Total", "Clienti", "Pipeline", "Pierduti", "Conversie %", "Rating Mediu", "Oras Principal", "Valoare Pipeline (RON)"];
    const rows = niseFiltrate.map((n) => [
      n.nisa,
      n.total,
      n.clienti,
      n.pipeline,
      n.pierduti,
      n.conversie,
      n.rating_mediu ?? "",
      n.oras_principal,
      n.valoare_pipeline,
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "statistici_nise.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const niseFiltrate = nise
    .filter((n) => !search || n.nisa.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const maxTotal = Math.max(...nise.map((n) => n.total), 1);
  const topNisa = nise.slice().sort((a, b) => b.conversie - a.conversie)[0];

  if (loading)
    return (
      <div className="p-8 flex items-center gap-2 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" /> Se incarca statisticile...
      </div>
    );

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            Statistici Nișe
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Analiza performantei pe fiecare nisa prospectata.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Overview cards */}
      {totale && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Leaduri" value={totale.leads} sub={`${totale.nise_unice} nișe diferite`} color="text-slate-900" />
          <StatCard label="Clienti Câștigați" value={totale.clienti} sub="status = Client" color="text-emerald-600" />
          <StatCard label="În Pipeline" value={totale.pipeline} sub="Nou + Contactat + Interesat + Oferta" color="text-blue-600" />
          <StatCard label="Rată Conversie" value={`${totale.conversie}%`} sub="din total leaduri" color={totale.conversie >= 20 ? "text-emerald-600" : "text-amber-600"} />
        </div>
      )}

      {/* Top performer highlight */}
      {topNisa && topNisa.clienti > 0 && (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4">
          <Trophy className="w-8 h-8 text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm text-emerald-700 font-semibold">Cea mai buna nișă</p>
            <p className="text-lg font-bold text-emerald-900">{topNisa.nisa}</p>
            <p className="text-sm text-emerald-600">{topNisa.conversie}% conversie · {topNisa.clienti} clienti din {topNisa.total} leaduri</p>
          </div>
        </div>
      )}

      {/* Filters + sort */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cauta nisa..."
          className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {(["total", "clienti", "conversie"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                sortBy === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {s === "total" ? "Total leaduri" : s === "clienti" ? "Clienti" : "Conversie"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800 text-slate-300 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Nișa</th>
                <th className="px-4 py-3 text-left font-semibold">Leaduri</th>
                <th className="px-4 py-3 text-left font-semibold">Clienti / Pipeline / Pierduti</th>
                <th className="px-4 py-3 text-left font-semibold">Conversie</th>
                <th className="px-4 py-3 text-left font-semibold">Rating mediu</th>
                <th className="px-4 py-3 text-left font-semibold">Oraș principal</th>
              </tr>
            </thead>
            <tbody>
              {niseFiltrate.map((n, i) => (
                <tr key={n.nisa} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 text-slate-400 font-medium">{i + 1}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-slate-900">{n.nisa}</p>
                    {n.motiv_principal && (
                      <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {n.motiv_principal}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20">
                        <MiniBar value={n.total} max={maxTotal} color="bg-blue-400" />
                      </div>
                      <span className="font-bold text-slate-700">{n.total}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        {n.clienti}
                      </span>
                      <span className="flex items-center gap-1 text-blue-700 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                        {n.pipeline}
                      </span>
                      <span className="flex items-center gap-1 text-red-600 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                        {n.pierduti}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <ConversieBar conversie={n.conversie} />
                  </td>
                  <td className="px-4 py-3.5">
                    {n.rating_mediu ? (
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        ★ {n.rating_mediu}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{n.oras_principal || "—"}</td>
                </tr>
              ))}
              {niseFiltrate.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    Nicio nișă găsită.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom insight */}
      {nise.length > 0 && (
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Cele mai pierdute
            </p>
            {nise
              .filter((n) => n.pierduti > 0)
              .sort((a, b) => b.pierduti - a.pierduti)
              .slice(0, 3)
              .map((n) => (
                <div key={n.nisa} className="flex justify-between text-sm py-1 border-b border-red-100 last:border-0">
                  <span className="text-slate-700 truncate">{n.nisa}</span>
                  <span className="text-red-600 font-bold ml-2">{n.pierduti}</span>
                </div>
              ))}
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Cel mai mult prospectate
            </p>
            {nise.slice(0, 3).map((n) => (
              <div key={n.nisa} className="flex justify-between text-sm py-1 border-b border-blue-100 last:border-0">
                <span className="text-slate-700 truncate">{n.nisa}</span>
                <span className="text-blue-600 font-bold ml-2">{n.total}</span>
              </div>
            ))}
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Conversie cea mai buna
            </p>
            {nise
              .filter((n) => n.clienti > 0)
              .sort((a, b) => b.conversie - a.conversie)
              .slice(0, 3)
              .map((n) => (
                <div key={n.nisa} className="flex justify-between text-sm py-1 border-b border-emerald-100 last:border-0">
                  <span className="text-slate-700 truncate">{n.nisa}</span>
                  <span className="text-emerald-600 font-bold ml-2">{n.conversie}%</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
