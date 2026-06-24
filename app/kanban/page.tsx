"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Loader2, Phone, Globe2, Star, Euro } from "lucide-react";
import { etichetaScor } from "@/lib/scoring";

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUSURI = ["Nou", "Contactat", "Interesat", "Oferta", "Client", "Pierdut"] as const;
type Status = typeof STATUSURI[number];

const COL: Record<Status, {
  dot: string; header: string; headerText: string;
  dropBg: string; cardBorder: string;
}> = {
  Nou:       { dot: "bg-slate-400",   header: "bg-slate-100",   headerText: "text-slate-600",  dropBg: "bg-slate-100/70",   cardBorder: "border-slate-200" },
  Contactat: { dot: "bg-blue-500",    header: "bg-blue-50",     headerText: "text-blue-700",   dropBg: "bg-blue-50/70",     cardBorder: "border-blue-200"  },
  Interesat: { dot: "bg-violet-500",  header: "bg-violet-50",   headerText: "text-violet-700", dropBg: "bg-violet-50/70",   cardBorder: "border-violet-200"},
  Oferta:    { dot: "bg-amber-500",   header: "bg-amber-50",    headerText: "text-amber-700",  dropBg: "bg-amber-50/70",    cardBorder: "border-amber-200" },
  Client:    { dot: "bg-emerald-500", header: "bg-emerald-50",  headerText: "text-emerald-700",dropBg: "bg-emerald-50/70",  cardBorder: "border-emerald-200"},
  Pierdut:   { dot: "bg-red-400",     header: "bg-red-50",      headerText: "text-red-600",    dropBg: "bg-red-50/70",      cardBorder: "border-red-200"   },
};

const SCOR_BADGE: Record<string, string> = {
  Fierbinte: "bg-red-50 text-red-700 border border-red-200",
  Cald:      "bg-amber-50 text-amber-700 border border-amber-200",
  Rece:      "bg-slate-100 text-slate-500 border border-slate-200",
};

// ─── Card ─────────────────────────────────────────────────────────────────────

function LeadCard({
  lead,
  onDragStart,
}: {
  lead: any;
  onDragStart: (id: string) => void;
}) {
  const et = etichetaScor(lead.scor ?? 0);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(lead.id);
      }}
      className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm cursor-grab active:cursor-grabbing active:opacity-60 active:scale-95 transition-all select-none"
    >
      {/* Name + score */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <Link
          href={`/leads/${lead.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors leading-tight line-clamp-2"
        >
          {lead.nume}
        </Link>
        <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold shrink-0 ${SCOR_BADGE[et]}`}>
          {lead.scor}
        </span>
      </div>

      {/* Nisa + oras */}
      <p className="text-xs text-slate-400 mb-2 truncate">{lead.nisa} · {lead.oras}</p>

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        {lead.telefon && (
          <a
            href={`tel:${lead.telefon}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline"
          >
            <Phone className="w-3 h-3 shrink-0" />
            {lead.telefon}
          </a>
        )}
        {!lead.are_website && (
          <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
            <Globe2 className="w-3 h-3 shrink-0" /> fara site
          </span>
        )}
        {lead.rating > 0 && (
          <span className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
            {lead.rating}
          </span>
        )}
      </div>

      {/* Valoare estimata */}
      {lead.valoare_estimata > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 text-xs text-emerald-600 font-semibold">
          <Euro className="w-3 h-3 shrink-0" />
          {Number(lead.valoare_estimata).toLocaleString("ro-RO")} €
        </div>
      )}
    </div>
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────

function KanbanCol({
  status,
  leads,
  isOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
}: {
  status: Status;
  leads: any[];
  isOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (status: Status) => void;
  onDragStart: (id: string) => void;
}) {
  const c = COL[status];
  const valTotala = leads.reduce((s, l) => s + (l.valoare_estimata ?? 0), 0);

  return (
    <div className="flex flex-col min-w-[220px] max-w-[240px] flex-shrink-0">
      {/* Header */}
      <div className={`rounded-xl px-3 py-2.5 mb-2 ${c.header}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
            <span className={`text-xs font-bold uppercase tracking-wide ${c.headerText}`}>
              {status}
            </span>
          </div>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md bg-white/60 ${c.headerText}`}>
            {leads.length}
          </span>
        </div>
        {valTotala > 0 && (
          <p className={`text-xs mt-1 ml-4 font-semibold ${c.headerText} opacity-70`}>
            {valTotala.toLocaleString("ro-RO")} €
          </p>
        )}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={() => onDrop(status)}
        className={`flex-1 rounded-xl min-h-[120px] p-2 transition-all duration-150 space-y-2 ${
          isOver
            ? `${c.dropBg} ring-2 ring-inset ${c.dot.replace("bg-", "ring-")}`
            : "bg-slate-100/40"
        }`}
      >
        {leads.map((l) => (
          <LeadCard key={l.id} lead={l} onDragStart={onDragStart} />
        ))}

        {leads.length === 0 && (
          <div className={`text-center py-6 text-xs ${c.headerText} opacity-40`}>
            Trage un lead aici
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KanbanPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<Status | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((d) => { setLeads(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  async function mutaLead(id: string, newStatus: Status) {
    // Optimistic update
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l));
    setUpdating(id);
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setUpdating(null);
  }

  function handleDrop(targetStatus: Status) {
    if (!draggingId) return;
    const lead = leads.find((l) => l.id === draggingId);
    if (lead && lead.status !== targetStatus) {
      mutaLead(draggingId, targetStatus);
    }
    setDraggingId(null);
    setOverCol(null);
  }

  // Stats for header
  const valoarePipeline = leads
    .filter((l) => !["Pierdut", "Nou"].includes(l.status))
    .reduce((s, l) => s + (l.valoare_estimata ?? 0), 0);

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-2 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" /> Se incarca pipeline...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Pipeline Kanban</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            {leads.length} leaduri · trage cartele intre coloane ca sa schimbi statusul
          </p>
        </div>
        <div className="flex items-center gap-4">
          {updating && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Loader2 className="w-3 h-3 animate-spin" /> Salvez...
            </span>
          )}
          {valoarePipeline > 0 && (
            <div className="text-right">
              <p className="text-xs text-slate-400">Valoare pipeline activ</p>
              <p className="text-base font-black text-emerald-600">
                {valoarePipeline.toLocaleString("ro-RO")} €
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-3 p-4 h-full items-start min-w-max">
          {STATUSURI.map((status) => (
            <KanbanCol
              key={status}
              status={status}
              leads={leads.filter((l) => l.status === status).sort((a, b) => b.scor - a.scor)}
              isOver={overCol === status}
              onDragOver={(e) => { e.preventDefault(); setOverCol(status); }}
              onDragLeave={() => setOverCol(null)}
              onDrop={handleDrop}
              onDragStart={setDraggingId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
