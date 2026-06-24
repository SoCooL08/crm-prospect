"use client";

import { useState } from "react";
import { Search, MapPin, Star, Phone, Globe, Globe2, Loader2, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { etichetaScor, oferta, genereazaBrief } from "@/lib/scoring";
import HartaLeads from "@/components/HartaLeads";

const JUDETE = [
  "Alba","Arad","Arges","Bacau","Bihor","Bistrita-Nasaud","Botosani",
  "Braila","Brasov","Bucuresti","Buzau","Calarasi","Cluj","Constanta",
  "Covasna","Dambovita","Dolj","Galati","Giurgiu","Gorj","Harghita",
  "Hunedoara","Ialomita","Iasi","Ilfov","Maramures","Mehedinti","Mures",
  "Neamt","Olt","Prahova","Salaj","Satu Mare","Sibiu","Suceava",
  "Teleorman","Timis","Tulcea","Valcea","Vaslui","Vrancea",
];

const NISE = [
  "Restaurante","Pizzerii","Cafenele","Fast food",
  "Saloane infrumusetare","Frizerii","Saloane unghii",
  "Cabinete stomatologice","Cabinete medicale","Farmacii","Optici",
  "Cabinete veterinare","Cabinete psihologie",
  "Service auto","Vulcanizari","Spalatorii auto",
  "Sali de fitness","Sali de sport",
  "Cabinete avocatura","Notariate","Contabili","Firme consultanta",
  "Agentii imobiliare","Firme constructii","Firme instalatii",
  "Hoteluri","Pensiuni","Sali de evenimente",
  "Gradinite private","Florarii","Brutarii","Patiserii",
  "Agentii turism","Firme transport",
];

const scorBadge = (et: string) =>
  ({
    Fierbinte: "bg-red-50 text-red-700 border border-red-200",
    Cald: "bg-amber-50 text-amber-700 border border-amber-200",
    Rece: "bg-slate-50 text-slate-600 border border-slate-200",
  }[et] ?? "bg-slate-50 text-slate-600 border border-slate-200");

const reviewsColor = (nr: number) => {
  if (nr > 200) return "text-emerald-600 font-semibold";
  if (nr > 50) return "text-blue-600 font-semibold";
  return "text-slate-500";
};

function BriefCard({ lead }: { lead: any }) {
  const [deschis, setDeschis] = useState(false);
  const brief = genereazaBrief({
    areWebsite: lead.are_website,
    rating: lead.rating,
    reviews: lead.nr_reviews,
    scorViteza: lead.scor_viteza,
    nisa: lead.nisa,
  });

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <button
        onClick={() => setDeschis((d) => !d)}
        className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        Brief apel
        {deschis ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {deschis && (
        <div className="mt-2 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {brief.cuvinte_cheie.map((k) => (
              <span key={k} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-md font-medium">
                {k}
              </span>
            ))}
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 border border-slate-100">
            <p className="font-medium text-slate-500 text-xs uppercase tracking-wide mb-1">Deschidere</p>
            <p className="italic">{brief.deschidere}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-900 border border-blue-100">
            <p className="font-medium text-blue-500 text-xs uppercase tracking-wide mb-1">Pitch</p>
            <p>{brief.pitch}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [judet, setJudet] = useState("Sibiu");
  const [oras, setOras] = useState("");
  const [nisa, setNisa] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mesaj, setMesaj] = useState("");

  async function cauta() {
    if (!nisa.trim()) return;
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

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Cautare leaduri</h1>
        <p className="text-slate-500 text-sm mt-1">
          Gaseste afaceri dupa judet si nisa, direct din Google Maps
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Judet</label>
            <select
              value={judet}
              onChange={(e) => setJudet(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {JUDETE.map((j) => <option key={j}>{j}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs font-medium text-slate-600 block mb-1.5">
              Oras / Zona <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              value={oras}
              onChange={(e) => setOras(e.target.value)}
              placeholder="ex. Medias, Cisnadie..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Nisa</label>
            <input
              list="nise-list"
              value={nisa}
              onChange={(e) => setNisa(e.target.value)}
              placeholder="ex. Restaurante..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="nise-list">
              {NISE.map((n) => <option key={n} value={n} />)}
            </datalist>
          </div>
          <button
            onClick={cauta}
            disabled={loading || !nisa.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition-colors shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Cauta
          </button>
        </div>
      </div>

      {mesaj && (
        <p className="text-sm text-slate-600 mb-5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block shrink-0" />
          {mesaj}
        </p>
      )}

      {leads.length > 0 && <HartaLeads leads={leads} />}

      <div className="space-y-3">
        {leads.map((l) => {
          const et = etichetaScor(l.scor);
          const semnale = { areWebsite: l.are_website, rating: l.rating, reviews: l.nr_reviews };
          return (
            <div
              key={l.google_place_id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-900">{l.nume}</div>
                  <div className="text-sm text-slate-500 mt-1.5 flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" /> {l.adresa}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
                      <span className="font-medium text-slate-700">{l.rating}</span>
                    </span>
                    <span className={`flex items-center gap-1 ${reviewsColor(l.nr_reviews)}`}>
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      {l.nr_reviews} recenzii
                    </span>
                  </div>
                  <div className="text-sm mt-2 flex items-center gap-3 flex-wrap">
                    {l.telefon && (
                      <a href={`tel:${l.telefon}`} className="text-blue-600 flex items-center gap-1 font-medium">
                        <Phone className="w-3.5 h-3.5 shrink-0" /> {l.telefon}
                      </a>
                    )}
                    {l.are_website ? (
                      <span className="text-slate-400 flex items-center gap-1 text-xs">
                        <Globe className="w-3.5 h-3.5 shrink-0" /> are website
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1 text-xs font-medium">
                        <Globe2 className="w-3.5 h-3.5 shrink-0" /> fara website
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${scorBadge(et)}`}>
                    {et} · {l.scor}
                  </span>
                  <div className="text-xs text-slate-500">
                    <span className="text-slate-400">Ofera: </span>
                    <span className="font-medium text-slate-700">{oferta(semnale)}</span>
                  </div>
                </div>
              </div>

              <BriefCard lead={l} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
