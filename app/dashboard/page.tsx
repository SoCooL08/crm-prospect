"use client";

import { useEffect, useState } from "react";
import { Loader2, Clock, TrendingUp, Users, AlertCircle, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const statusBarColor = (s: string) =>
  ({
    Nou: "bg-slate-400",
    Contactat: "bg-blue-500",
    Interesat: "bg-violet-500",
    Oferta: "bg-amber-500",
    Client: "bg-emerald-500",
    Pierdut: "bg-red-400",
  }[s] ?? "bg-slate-400");

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [followups, setFollowups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: l } = await supabase.from("leads").select("*");
      const { data: f } = await supabase
        .from("activitati")
        .select("*, leads(nume)")
        .not("urmator_followup", "is", null)
        .gte("urmator_followup", new Date().toISOString())
        .order("urmator_followup", { ascending: true })
        .limit(10);
      setLeads(l || []);
      setFollowups(f || []);
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <div className="p-8 flex items-center gap-2 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" /> Se incarca...
      </div>
    );

  const total = leads.length;
  const faraSite = leads.filter((l) => !l.are_website).length;
  const fierbinti = leads.filter((l) => l.scor >= 65).length;
  const clienti = leads.filter((l) => l.status === "Client").length;

  const peStatus = ["Nou", "Contactat", "Interesat", "Oferta", "Client", "Pierdut"].map((s) => ({
    status: s,
    nr: leads.filter((l) => l.status === s).length,
  }));

  const stats = [
    { label: "Total leaduri", val: total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Fara website", val: faraSite, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Fierbinti", val: fierbinti, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Clienti", val: clienti, icon: Star, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Vedere generala asupra pipeline-ului de vanzari</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, val, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${bg} mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="text-3xl font-bold text-slate-900">{val}</div>
            <div className="text-sm text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-5">Pipeline vanzari</h2>
          <div className="space-y-3">
            {peStatus.map(({ status, nr }) => (
              <div key={status} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-24 shrink-0">{status}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${statusBarColor(status)}`}
                    style={{ width: total ? `${(nr / total) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-700 w-5 text-right">{nr}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" /> Follow-up-uri programate
          </h2>
          {followups.length === 0 ? (
            <p className="text-slate-400 text-sm">Niciun follow-up programat.</p>
          ) : (
            <div className="space-y-2">
              {followups.map((f) => (
                <Link
                  key={f.id}
                  href={`/leads/${f.lead_id}`}
                  className="block border border-slate-100 rounded-lg p-3 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-sm text-slate-900">{f.leads?.nume || "Lead"}</div>
                  {f.nota && (
                    <div className="text-slate-500 text-xs mt-0.5 line-clamp-1">{f.nota}</div>
                  )}
                  <div className="text-amber-600 text-xs mt-1 font-medium">
                    ⏰ {new Date(f.urmator_followup).toLocaleString("ro-RO")}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
