"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, Clock, AlertCircle, CalendarClock, Loader2, CheckCircle2, ArrowRight } from "lucide-react";

type Followup = {
  id: string;
  tip: string;
  nota: string;
  urmator_followup: string;
  data: string;
  lead_id: string;
  leads: {
    id: string;
    nume: string;
    nisa: string;
    oras: string;
    judet: string;
    telefon: string;
    status: string;
  } | null;
};

type Grup = "restante" | "azi" | "saptamana" | "viitoare";

function grupFollowup(dateStr: string): Grup {
  const now = new Date();
  const d = new Date(dateStr);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday.getTime() + 86400000);
  const endOfWeek = new Date(startOfToday.getTime() + 7 * 86400000);

  if (d < startOfToday) return "restante";
  if (d < endOfToday) return "azi";
  if (d < endOfWeek) return "saptamana";
  return "viitoare";
}

function formatData(dateStr: string): string {
  return new Date(dateStr).toLocaleString("ro-RO", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}

function intervalRelativ(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  const abs = Math.abs(diff);
  const minute = 60000;
  const ora = 3600000;
  const zi = 86400000;
  if (abs < ora) return `${Math.round(abs / minute)} min`;
  if (abs < zi) return `${Math.round(abs / ora)}h`;
  return `${Math.round(abs / zi)}z`;
}

const tipColor: Record<string, string> = {
  apel: "bg-blue-50 text-blue-700",
  email: "bg-violet-50 text-violet-700",
  intalnire: "bg-emerald-50 text-emerald-700",
  nota: "bg-slate-100 text-slate-600",
};

const statusColor: Record<string, string> = {
  Nou: "text-slate-400",
  Contactat: "text-blue-500",
  Interesat: "text-violet-500",
  Oferta: "text-amber-500",
  Client: "text-emerald-500",
  Pierdut: "text-red-400",
};

function FollowupCard({ f, grup }: { f: Followup; grup: Grup }) {
  const lead = f.leads;
  if (!lead) return null;

  const cardBg =
    grup === "restante"
      ? "border-red-200 bg-red-50/40"
      : grup === "azi"
      ? "border-amber-200 bg-amber-50/40"
      : "border-slate-200 bg-white";

  return (
    <div className={`border rounded-2xl p-4 shadow-sm ${cardBg}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/leads/${lead.id}`}
              className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
            >
              {lead.nume}
            </Link>
            <span className={`text-xs font-medium ${statusColor[lead.status] ?? "text-slate-400"}`}>
              {lead.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{lead.nisa} · {lead.oras}</p>
        </div>

        <div className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
          grup === "restante"
            ? "bg-red-100 text-red-700"
            : grup === "azi"
            ? "bg-amber-100 text-amber-700"
            : "bg-slate-100 text-slate-600"
        }`}>
          {grup === "restante" ? (
            <><AlertCircle className="w-3 h-3" /> +{intervalRelativ(f.urmator_followup)}</>
          ) : grup === "azi" ? (
            <><Clock className="w-3 h-3" /> {intervalRelativ(f.urmator_followup)}</>
          ) : (
            <><CalendarClock className="w-3 h-3" /> {intervalRelativ(f.urmator_followup)}</>
          )}
        </div>
      </div>

      <div className="bg-white/80 border border-slate-100 rounded-xl px-3 py-2.5 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs px-2 py-0.5 rounded-md font-semibold uppercase tracking-wide ${tipColor[f.tip] ?? tipColor.nota}`}>
            {f.tip}
          </span>
          <span className="text-xs text-slate-400">{formatData(f.data)}</span>
        </div>
        <p className="text-sm text-slate-700 leading-snug line-clamp-2">{f.nota}</p>
      </div>

      <div className="flex items-center gap-2">
        {lead.telefon && (
          <a
            href={`tel:${lead.telefon}`}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
          >
            <Phone className="w-3.5 h-3.5" /> {lead.telefon}
          </a>
        )}
        <Link
          href={`/leads/${lead.id}`}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 ml-auto transition-colors"
        >
          Deschide fisa <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <p className="text-xs text-slate-400 mt-2.5">
        Programat: {formatData(f.urmator_followup)}
      </p>
    </div>
  );
}

export default function AziPage() {
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/followups")
      .then((r) => r.json())
      .then((d) => { setFollowups(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const restante = followups.filter((f) => grupFollowup(f.urmator_followup) === "restante");
  const azi = followups.filter((f) => grupFollowup(f.urmator_followup) === "azi");
  const saptamana = followups.filter((f) => grupFollowup(f.urmator_followup) === "saptamana");
  const viitoare = followups.filter((f) => grupFollowup(f.urmator_followup) === "viitoare");

  const urgente = restante.length + azi.length;

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <CalendarClock className="w-6 h-6 text-amber-500" /> Urmariri
          {urgente > 0 && (
            <span className="text-sm bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">
              {urgente}
            </span>
          )}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Follow-up-uri programate — cele restante apar primele
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 py-8">
          <Loader2 className="w-4 h-4 animate-spin" /> Se incarca...
        </div>
      ) : followups.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-slate-200" />
          <p className="font-medium text-sm">Niciun follow-up programat</p>
          <p className="text-xs mt-1">Adauga urmariri din fisa unui lead</p>
        </div>
      ) : (
        <div className="space-y-7">
          {restante.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <h2 className="text-sm font-bold text-red-600 uppercase tracking-wide">
                  Restante — {restante.length}
                </h2>
              </div>
              <div className="space-y-3">
                {restante.map((f) => <FollowupCard key={f.id} f={f} grup="restante" />)}
              </div>
            </section>
          )}

          {azi.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-amber-600 uppercase tracking-wide">
                  Azi — {azi.length}
                </h2>
              </div>
              <div className="space-y-3">
                {azi.map((f) => <FollowupCard key={f.id} f={f} grup="azi" />)}
              </div>
            </section>
          )}

          {saptamana.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <CalendarClock className="w-4 h-4 text-slate-400" />
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                  Aceasta saptamana — {saptamana.length}
                </h2>
              </div>
              <div className="space-y-3">
                {saptamana.map((f) => <FollowupCard key={f.id} f={f} grup="saptamana" />)}
              </div>
            </section>
          )}

          {viitoare.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <CalendarClock className="w-4 h-4 text-slate-300" />
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                  Viitoare — {viitoare.length}
                </h2>
              </div>
              <div className="space-y-3">
                {viitoare.map((f) => <FollowupCard key={f.id} f={f} grup="viitoare" />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
