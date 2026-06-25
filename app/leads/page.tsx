"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, Globe2, Gauge, Loader2, Search, Star, MessageSquare, Download } from "lucide-react";
import { etichetaScor } from "@/lib/scoring";
import ServiciiBreakdown from "@/components/ServiciiBreakdown";

const STATUSURI = ["Nou", "Contactat", "Interesat", "Oferta", "Client", "Pierdut"];

const statusColor = (s: string) =>
  ({
    Nou: "bg-slate-100 text-slate-700",
    Contactat: "bg-blue-100 text-blue-700",
    Interesat: "bg-violet-100 text-violet-700",
    Oferta: "bg-amber-100 text-amber-700",
    Client: "bg-emerald-100 text-emerald-700",
    Pierdut: "bg-red-100 text-red-700",
  }[s] ?? "bg-slate-100 text-slate-700");

const scorBadge = (et: string) =>
  ({
    Fierbinte: "bg-red-50 text-red-700 border border-red-200",
    Cald: "bg-amber-50 text-amber-700 border border-amber-200",
    Rece: "bg-slate-50 text-slate-600 border border-slate-200",
  }[et] ?? "bg-slate-50 text-slate-600 border border-slate-200");

const reviewsColor = (nr: number) => {
  if (nr > 200) return "text-emerald-600 font-semibold";
  if (nr > 50) return "text-blue-600 font-semibold";
  return "text-slate-400";
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState("");
  const [filtruFaraSite, setFiltruFaraSite] = useState(false);
  const [filtruStatus, setFiltruStatus] = useState("");
  const [cautare, setCautare] = useState("");
  const [analizez, setAnalizez] = useState<string | null>(null);

  async function incarca() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filtruFaraSite) params.set("faraSite", "true");
    if (filtruStatus) params.set("status", filtruStatus);

    const res = await fetch(`/api/leads?${params}`);
    const data = await res.json();
    if (data.error) { setEroare(data.error); }
    else { setLeads(data); }
    setLoading(false);
  }

  useEffect(() => { incarca(); }, [filtruFaraSite, filtruStatus]);

  async function schimbaStatus(id: string, status: string) {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    incarca();
  }

  async function analizeazaSite(lead: any) {
    setAnalizez(lead.id);
    await fetch("/api/analiza", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: lead.id, website: lead.website }),
    });
    setAnalizez(null);
    incarca();
  }

  function exportCSV() {
    const cols = [
      ["Nume", "nisa", "Nisa"],
      ["Oras", "oras", "Oras"],
      ["Judet", "judet", "Judet"],
      ["Telefon", "telefon", "Telefon"],
      ["Status", "status", "Status"],
      ["Rating", "rating", "Rating"],
      ["Nr Recenzii", "nr_reviews", "Nr Recenzii"],
      ["Are Website", "are_website", "Are Website"],
      ["Scor Viteza", "scor_viteza", "Scor Viteza"],
      ["Scor", "scor", "Scor"],
      ["Adresa", "adresa", "Adresa"],
      ["Website", "website", "Website"],
    ] as const;

    const header = ["Nume", "Nisa", "Oras", "Judet", "Telefon", "Status", "Rating", "Nr Recenzii", "Are Website", "Scor Viteza", "Scor", "Adresa", "Website"];
    const rows = afisate.map((l) => [
      l.nume, l.nisa, l.oras, l.judet, l.telefon, l.status,
      l.rating, l.nr_reviews, l.are_website ? "Da" : "Nu",
      l.scor_viteza ?? "", l.scor, l.adresa, l.website,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leaduri_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const afisate = leads.filter(
    (l) =>
      cautare.trim() === "" ||
      l.nume?.toLowerCase().includes(cautare.toLowerCase()) ||
      l.oras?.toLowerCase().includes(cautare.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Leadurile mele</h1>
        <p className="text-slate-500 text-sm mt-1">{leads.length} leaduri salvate in CRM</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={cautare}
            onChange={(e) => setCautare(e.target.value)}
            placeholder="Cauta dupa nume sau oras..."
            className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filtruStatus}
          onChange={(e) => setFiltruStatus(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Toate statusurile</option>
          {STATUSURI.map((s) => <option key={s}>{s}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filtruFaraSite}
            onChange={(e) => setFiltruFaraSite(e.target.checked)}
            className="rounded"
          />
          Fara website
        </label>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {eroare && <p className="text-red-600 text-sm mb-4">Eroare: {eroare}</p>}

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 py-8">
          <Loader2 className="w-4 h-4 animate-spin" /> Se incarca...
        </div>
      ) : (
        <div className="space-y-2">
          {afisate.map((l) => {
            const et = etichetaScor(l.scor);
            return (
              <div
                key={l.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/leads/${l.id}`}
                        className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {l.nume}
                      </Link>
                      <span className="text-xs text-slate-400">{l.nisa} · {l.oras}</span>
                    </div>
                    <div className="text-sm mt-1.5 flex items-center gap-3 flex-wrap">
                      {l.telefon && (
                        <a href={`tel:${l.telefon}`} className="text-blue-600 flex items-center gap-1 font-medium">
                          <Phone className="w-3.5 h-3.5 shrink-0" /> {l.telefon}
                        </a>
                      )}
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                        <span className="font-medium text-slate-700">{l.rating}</span>
                      </span>
                      <span className={`flex items-center gap-1 text-xs ${reviewsColor(l.nr_reviews)}`}>
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        {l.nr_reviews} recenzii
                      </span>
                      {!l.are_website && (
                        <span className="text-red-600 flex items-center gap-1 text-xs font-medium">
                          <Globe2 className="w-3.5 h-3.5 shrink-0" /> fara website
                        </span>
                      )}
                      {l.scor_viteza != null && (
                        <span className={`flex items-center gap-1 text-xs ${l.scor_viteza < 50 ? "text-red-600" : "text-slate-500"}`}>
                          <Gauge className="w-3.5 h-3.5 shrink-0" /> viteza {l.scor_viteza}/100
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${scorBadge(et)}`}>
                      {et} · {l.scor}
                    </span>
                    {l.are_website && l.scor_viteza == null && (
                      <button
                        onClick={() => analizeazaSite(l)}
                        disabled={analizez === l.id}
                        className="text-xs border border-slate-200 rounded-md px-2.5 py-1 flex items-center gap-1 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                      >
                        {analizez === l.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Gauge className="w-3 h-3" />}
                        Analizeaza
                      </button>
                    )}
                    <select
                      value={l.status}
                      onChange={(e) => schimbaStatus(l.id, e.target.value)}
                      className={`text-xs rounded-md px-2.5 py-1 font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusColor(l.status)}`}
                    >
                      {STATUSURI.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <ServiciiBreakdown
                  semnale={{ areWebsite: l.are_website, rating: l.rating, reviews: l.nr_reviews, scorViteza: l.scor_viteza }}
                  compact
                />
              </div>
          );
          })}
          {afisate.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">Niciun lead gasit.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
