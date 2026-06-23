"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Star, Phone, Globe, Globe2, Loader2 } from "lucide-react";
import { etichetaScor, oferta } from "@/lib/scoring";
import HartaLeads from "@/components/HartaLeads";

const JUDETE = ["Sibiu", "Cluj", "Brasov", "Timis", "Bucuresti", "Iasi", "Constanta", "Mures"];
const NISE = [
  "Restaurante",
  "Saloane infrumusetare",
  "Cabinete stomatologice",
  "Service auto",
  "Sali de fitness",
  "Cabinete avocatura",
  "Firme constructii",
  "Cabinete veterinare",
];

export default function Home() {
  const [judet, setJudet] = useState(JUDETE[0]);
  const [oras, setOras] = useState("");
  const [nisa, setNisa] = useState(NISE[0]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mesaj, setMesaj] = useState("");

  async function cauta() {
    setLoading(true);
    setMesaj("");
    try {
      const res = await fetch("/api/cauta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judet, oras, nisa }),
      });
      const data = await res.json();
      if (data.error) {
        setMesaj("Eroare: " + data.error);
        setLeads([]);
      } else {
        setLeads(data.leads);
        setMesaj(`${data.leads.length} rezultate · ${data.salvate} noi salvate in CRM`);
      }
    } catch (e: any) {
      setMesaj("Eroare: " + e.message);
    }
    setLoading(false);
  }

  const fmtCuloare = (et: string) =>
    et === "Fierbinte"
      ? "bg-green-100 text-green-800"
      : et === "Cald"
      ? "bg-amber-100 text-amber-800"
      : "bg-gray-100 text-gray-600";

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">CRM Prospectare</h1>
        <div className="flex gap-4 text-sm">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Dashboard
          </Link>
          <Link href="/leads" className="text-blue-600 hover:underline">
            Leaduri →
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-end bg-gray-50 p-4 rounded-xl mb-4">
        <div className="flex-1 min-w-[140px]">
          <label className="text-xs text-gray-500 block mb-1">Judet</label>
          <select
            value={judet}
            onChange={(e) => setJudet(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            {JUDETE.map((j) => (
              <option key={j}>{j}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="text-xs text-gray-500 block mb-1">Oras (optional)</label>
          <input
            value={oras}
            onChange={(e) => setOras(e.target.value)}
            placeholder="ex. Medias"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="text-xs text-gray-500 block mb-1">Nisa</label>
          <select
            value={nisa}
            onChange={(e) => setNisa(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            {NISE.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
        <button
          onClick={cauta}
          disabled={loading}
          className="bg-blue-600 text-white rounded-lg px-5 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Cauta
        </button>
      </div>

      {mesaj && <p className="text-sm text-gray-600 mb-4">{mesaj}</p>}

      {leads.length > 0 && <HartaLeads leads={leads} />}

      <div className="space-y-3">
        {leads.map((l) => {
          const et = etichetaScor(l.scor);
          const semnale = {
            areWebsite: l.are_website,
            rating: l.rating,
            reviews: l.nr_reviews,
          };
          return (
            <div key={l.google_place_id} className="border rounded-xl p-4 bg-white">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="font-medium">{l.nume}</div>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {l.adresa}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" /> {l.rating} ({l.nr_reviews})
                    </span>
                  </div>
                  <div className="text-sm mt-2 flex items-center gap-3 flex-wrap">
                    {l.telefon && (
                      <a href={`tel:${l.telefon}`} className="text-blue-600 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {l.telefon}
                      </a>
                    )}
                    {l.are_website ? (
                      <span className="text-gray-500 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5" /> are website
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <Globe2 className="w-3.5 h-3.5" /> fara website
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-md ${fmtCuloare(et)}`}>
                    {et} · {l.scor}
                  </span>
                  <div className="text-xs text-gray-500 mt-2">
                    Vinde: <b className="font-medium">{oferta(semnale)}</b>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
