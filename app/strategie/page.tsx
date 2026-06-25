"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, LayoutTemplate, ExternalLink, Search } from "lucide-react";

const statusColor = (s: string) =>
  ({
    Nou: "bg-slate-100 text-slate-600",
    Contactat: "bg-blue-100 text-blue-700",
    Interesat: "bg-violet-100 text-violet-700",
    Oferta: "bg-amber-100 text-amber-700",
    Client: "bg-emerald-100 text-emerald-700",
    Pierdut: "bg-red-100 text-red-700",
  }[s] ?? "bg-slate-100 text-slate-600");

export default function StrategiiIndex() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((d) => setLeads(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtrate = leads.filter(
    (l) =>
      !search ||
      l.nume?.toLowerCase().includes(search.toLowerCase()) ||
      l.nisa?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <LayoutTemplate className="w-6 h-6 text-violet-500" />
          Strategie SMM
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Analiza audienta, concurenti si strategie SOSTAC pentru fiecare business prospectat.
        </p>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cauta lead dupa nume sau nisa..."
          className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Se incarca...
        </div>
      ) : (
        <div className="space-y-2">
          {filtrate.slice(0, 100).map((l) => (
            <div
              key={l.id}
              className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">{l.nume}</p>
                <p className="text-sm text-slate-500">
                  {l.nisa} · {l.oras}, {l.judet}
                </p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-md font-medium shrink-0 ${statusColor(l.status)}`}>
                {l.status}
              </span>
              <Link
                href={`/strategie/${l.id}`}
                className="shrink-0 flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
              >
                <LayoutTemplate className="w-3.5 h-3.5" /> Strategie
              </Link>
            </div>
          ))}
          {filtrate.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-10">Niciun lead gasit.</p>
          )}
        </div>
      )}
    </div>
  );
}
