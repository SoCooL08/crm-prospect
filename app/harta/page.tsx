"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, MapPin } from "lucide-react";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { ssr: false });

const STATUSURI = ["Nou", "Contactat", "Interesat", "Oferta", "Client", "Pierdut"];

const PIN_COLORS: Record<string, string> = {
  Client: "#10b981", Oferta: "#f59e0b", Interesat: "#8b5cf6",
  Contactat: "#3b82f6", Nou: "#94a3b8", Pierdut: "#ef4444",
};

export default function HartaPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtruStatus, setFiltruStatus] = useState("");
  const [cautare, setCautare] = useState("");

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((d) => setLeads(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const afisate = leads.filter((l) => {
    if (filtruStatus && l.status !== filtruStatus) return false;
    if (cautare && !l.nume?.toLowerCase().includes(cautare.toLowerCase()) &&
        !l.nisa?.toLowerCase().includes(cautare.toLowerCase()) &&
        !l.oras?.toLowerCase().includes(cautare.toLowerCase())) return false;
    return true;
  });

  const countPerStatus = STATUSURI.map((s) => ({
    status: s,
    count: leads.filter((l) => l.status === s).length,
  })).filter((x) => x.count > 0);

  return (
    <div className="flex flex-col h-screen p-6 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-500" /> Hartă Leaduri
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {afisate.length} leaduri afișate
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <input
            value={cautare}
            onChange={(e) => setCautare(e.target.value)}
            placeholder="Caută..."
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
          />
          <select
            value={filtruStatus}
            onChange={(e) => setFiltruStatus(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toate statusurile</option>
            {STATUSURI.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 flex-wrap shrink-0">
        {countPerStatus.map(({ status, count }) => (
          <button
            key={status}
            onClick={() => setFiltruStatus(filtruStatus === status ? "" : status)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
              filtruStatus === status
                ? "ring-2 ring-offset-1"
                : "border-slate-200 hover:border-slate-300"
            }`}
            style={filtruStatus === status ? { borderColor: PIN_COLORS[status], outline: `2px solid ${PIN_COLORS[status]}`, outlineOffset: "1px" } : {}}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: PIN_COLORS[status] }}
            />
            {status}
            <span className="text-slate-400 ml-0.5">({count})</span>
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="flex-1 min-h-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Se încarcă harta...
          </div>
        ) : (
          <LeafletMap leads={afisate} />
        )}
      </div>
    </div>
  );
}
