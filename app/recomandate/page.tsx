"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2, Phone, Globe2, Star, MessageSquare,
  Flame, CheckCircle2,
} from "lucide-react";
import { genereazaBrief } from "@/lib/scoring";
import ServiciiBreakdown from "@/components/ServiciiBreakdown";

const TABS = [
  { id: "necontactate", label: "Necontactate" },
  { id: "toate", label: "Toate Fierbinte" },
] as const;

type Tab = (typeof TABS)[number]["id"];

const reviewsColor = (nr: number) => {
  if (nr > 200) return "text-emerald-600 font-semibold";
  if (nr > 50) return "text-blue-600 font-semibold";
  return "text-slate-400";
};

export default function RecomandatePage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("necontactate");
  const [marcand, setMarcand] = useState<string | null>(null);

  async function incarca() {
    setLoading(true);
    const res = await fetch("/api/leads");
    const data = await res.json();
    const fierbinti = Array.isArray(data)
      ? data.filter((l: any) => l.scor >= 65).sort((a: any, b: any) => b.scor - a.scor)
      : [];
    setLeads(fierbinti);
    setLoading(false);
  }

  useEffect(() => { incarca(); }, []);

  async function marcaSunat(id: string) {
    setMarcand(id);
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Contactat" }),
    });
    setMarcand(null);
    incarca();
  }

  const afisate = tab === "necontactate"
    ? leads.filter((l) => l.status === "Nou")
    : leads;

  const totalNoi = leads.filter((l) => l.status === "Nou").length;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Flame className="w-6 h-6 text-red-500" /> Recomandate
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Leaduri Fierbinte sortate dupa scor — cele mai bune oportunitati de vanzare
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                tab === t.id
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {t.id === "necontactate" && totalNoi > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
                  tab === t.id ? "bg-red-500 text-white" : "bg-red-100 text-red-600"
                }`}>
                  {totalNoi}
                </span>
              )}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 py-8">
          <Loader2 className="w-4 h-4 animate-spin" /> Se incarca...
        </div>
      ) : afisate.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Flame className="w-10 h-10 mx-auto mb-3 text-slate-200" />
          <p className="text-sm font-medium">
            {tab === "necontactate"
              ? "Niciun lead Fierbinte necontactat. Bine lucrat!"
              : "Nu exista inca leaduri Fierbinte. Fă o cautare noua."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {afisate.map((l) => {
            const semnale = {
              areWebsite: l.are_website,
              rating: l.rating,
              reviews: l.nr_reviews,
              scorViteza: l.scor_viteza,
            };
            const brief = genereazaBrief({ ...semnale, nisa: l.nisa });

            return (
              <div
                key={l.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-3 flex-wrap mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/leads/${l.id}`}
                        className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-lg"
                      >
                        {l.nume}
                      </Link>
                      <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-md font-medium">
                        Fierbinte · {l.scor}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mt-0.5">{l.nisa} · {l.oras}, {l.judet}</p>
                  </div>

                  {l.status === "Nou" ? (
                    <button
                      onClick={() => marcaSunat(l.id)}
                      disabled={marcand === l.id}
                      className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 shrink-0"
                    >
                      {marcand === l.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <CheckCircle2 className="w-4 h-4" />}
                      Marcat sunat
                    </button>
                  ) : (
                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg font-medium">
                      {l.status}
                    </span>
                  )}
                </div>

                {/* Info row */}
                <div className="flex items-center gap-4 flex-wrap text-sm mb-4">
                  {l.telefon && (
                    <a href={`tel:${l.telefon}`} className="text-blue-600 flex items-center gap-1 font-medium">
                      <Phone className="w-3.5 h-3.5 shrink-0" /> {l.telefon}
                    </a>
                  )}
                  <span className="flex items-center gap-1 text-slate-500">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                    <span className="font-medium text-slate-700">{l.rating}</span>
                  </span>
                  <span className={`flex items-center gap-1 text-sm ${reviewsColor(l.nr_reviews)}`}>
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    {l.nr_reviews} recenzii
                  </span>
                  {!l.are_website && (
                    <span className="text-red-600 flex items-center gap-1 text-xs font-medium">
                      <Globe2 className="w-3.5 h-3.5 shrink-0" /> fara website
                    </span>
                  )}
                </div>

                {/* Analiza + Brief */}
                <div className="space-y-3 mb-4">
                  <ServiciiBreakdown semnale={semnale} compact />
                  <div className="flex flex-wrap gap-1.5">
                    {brief.cuvinte_cheie.map((k) => (
                      <span key={k} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-md font-medium">
                        {k}
                      </span>
                    ))}
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Deschidere</p>
                    <p className="text-sm text-slate-700 italic">{brief.deschidere}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3.5 border border-blue-100">
                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1">Pitch</p>
                    <p className="text-sm text-blue-900">{brief.pitch}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <Link
                    href={`/leads/${l.id}`}
                    className="text-xs text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    Deschide fisa completa →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
