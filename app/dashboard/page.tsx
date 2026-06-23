"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Phone, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
      <main className="max-w-4xl mx-auto p-6">
        <Loader2 className="w-5 h-5 animate-spin" />
      </main>
    );

  const total = leads.length;
  const faraSite = leads.filter((l) => !l.are_website).length;
  const fierbinti = leads.filter((l) => l.scor >= 65).length;
  const clienti = leads.filter((l) => l.status === "Client").length;

  const peStatus = ["Nou", "Contactat", "Interesat", "Oferta", "Client", "Pierdut"].map((s) => ({
    status: s,
    nr: leads.filter((l) => l.status === s).length,
  }));

  const card = (label: string, val: number, culoare = "") => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`text-2xl font-medium mt-1 ${culoare}`}>{val}</div>
    </div>
  );

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <div className="flex gap-4 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">
            Cautare
          </Link>
          <Link href="/leads" className="text-blue-600 hover:underline">
            Leaduri
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {card("Total leaduri", total)}
        {card("Fara website", faraSite, "text-red-600")}
        {card("Fierbinti", fierbinti, "text-green-600")}
        {card("Clienti", clienti, "text-blue-600")}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-5 bg-white">
          <h2 className="font-medium mb-3">Distributie pe status</h2>
          <div className="space-y-2">
            {peStatus.map((s) => (
              <div key={s.status} className="flex items-center gap-3">
                <span className="text-sm w-24 text-gray-600">{s.status}</span>
                <div className="flex-1 bg-gray-100 rounded h-5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: total ? `${(s.nr / total) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-sm w-6 text-right">{s.nr}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-xl p-5 bg-white">
          <h2 className="font-medium mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Follow-up care urmeaza
          </h2>
          {followups.length === 0 && (
            <p className="text-gray-500 text-sm">Niciun follow-up programat.</p>
          )}
          <div className="space-y-2">
            {followups.map((f) => (
              <div key={f.id} className="text-sm border rounded-lg p-2">
                <div className="font-medium">{f.leads?.nume || "Lead"}</div>
                <div className="text-gray-500 text-xs">{f.nota}</div>
                <div className="text-amber-600 text-xs mt-1">
                  {new Date(f.urmator_followup).toLocaleString("ro-RO")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
