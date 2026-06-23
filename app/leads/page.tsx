"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, Globe2, Gauge, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const STATUSURI = ["Nou", "Contactat", "Interesat", "Oferta", "Client", "Pierdut"];

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtruFaraSite, setFiltruFaraSite] = useState(false);
  const [analizez, setAnalizez] = useState<string | null>(null);

  async function incarca() {
    setLoading(true);
    let q = supabase.from("leads").select("*").order("scor", { ascending: false });
    if (filtruFaraSite) q = q.eq("are_website", false);
    const { data } = await q;
    setLeads(data || []);
    setLoading(false);
  }

  useEffect(() => {
    incarca();
  }, [filtruFaraSite]);

  async function schimbaStatus(id: string, status: string) {
    await supabase.from("leads").update({ status }).eq("id", id);
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

  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Leadurile mele</h1>
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← Cautare noua
        </Link>
      </div>

      <label className="flex items-center gap-2 text-sm mb-4">
        <input
          type="checkbox"
          checked={filtruFaraSite}
          onChange={(e) => setFiltruFaraSite(e.target.checked)}
        />
        Doar cele fara website
      </label>

      {loading ? (
        <p className="text-gray-500 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Se incarca...
        </p>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => (
            <div key={l.id} className="border rounded-xl p-4 bg-white">
              <div className="flex justify-between items-start gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="font-medium">
                    <Link href={`/leads/${l.id}`} className="hover:underline hover:text-blue-600">
                      {l.nume}
                    </Link>{" "}
                    <span className="text-xs text-gray-400 font-normal">
                      · {l.nisa} · {l.oras}
                    </span>
                  </div>
                  <div className="text-sm mt-1 flex items-center gap-3 flex-wrap">
                    {l.telefon && (
                      <a href={`tel:${l.telefon}`} className="text-blue-600 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {l.telefon}
                      </a>
                    )}
                    {!l.are_website && (
                      <span className="text-red-600 flex items-center gap-1">
                        <Globe2 className="w-3.5 h-3.5" /> fara website
                      </span>
                    )}
                    {l.scor_viteza != null && (
                      <span
                        className={`flex items-center gap-1 ${
                          l.scor_viteza < 50 ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        <Gauge className="w-3.5 h-3.5" /> viteza {l.scor_viteza}/100
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-md bg-gray-100">scor {l.scor}</span>
                  {l.are_website && l.scor_viteza == null && (
                    <button
                      onClick={() => analizeazaSite(l)}
                      disabled={analizez === l.id}
                      className="text-xs border rounded-md px-2 py-1 flex items-center gap-1 disabled:opacity-50"
                    >
                      {analizez === l.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Gauge className="w-3 h-3" />
                      )}
                      Analizeaza site
                    </button>
                  )}
                  <select
                    value={l.status}
                    onChange={(e) => schimbaStatus(l.id, e.target.value)}
                    className="text-xs border rounded-md px-2 py-1"
                  >
                    {STATUSURI.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
          {leads.length === 0 && (
            <p className="text-gray-500">Niciun lead inca. Mergi la cautare si salveaza cateva.</p>
          )}
        </div>
      )}
    </main>
  );
}
