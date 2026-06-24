"use client";

import { useState } from "react";
import { Copy, CheckCheck, ChevronDown, FileText } from "lucide-react";
import { SemnaleLead, scorOpportunitate } from "@/lib/scoring";

interface Pachet {
  nume: string;
  servicii: string[];
  pret: number;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  labelColor: string;
}

function genereazaPachete(semnale: SemnaleLead): Pachet[] {
  const { servicii } = scorOpportunitate(semnale);
  const top = servicii.slice(0, 3).map((s) => s.nume);

  const pretBaza: Record<string, number> = {
    "Website nou": 1200,
    "Redesign urgent": 1500,
    "Optimizare site": 600,
    "Google Ads": 500,
    "Google Ads (dupa site)": 500,
    "SEO Local": 400,
    "Management Reputatie": 350,
  };

  const s1 = top[0] ?? "Consultanta digitala";
  const s2 = top[1];
  const s3 = top[2];

  const p1 = pretBaza[s1] ?? 800;
  const p2 = s2 ? (pretBaza[s2] ?? 400) : 0;
  const p3 = s3 ? (pretBaza[s3] ?? 300) : 0;

  return [
    {
      nume: "Starter",
      servicii: [s1, "Suport 30 zile"],
      pret: p1,
      accentColor: "text-slate-700",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      labelColor: "bg-slate-100 text-slate-600",
    },
    {
      nume: "Standard",
      servicii: [s1, ...(s2 ? [s2] : []), "Raport lunar", "Suport 60 zile"],
      pret: Math.round((p1 + p2) * 0.95),
      accentColor: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      labelColor: "bg-blue-100 text-blue-700",
    },
    {
      nume: "Premium",
      servicii: [s1, ...(s2 ? [s2] : []), ...(s3 ? [s3] : []), "Rapoarte saptamanale", "Account manager dedicat", "Suport 6 luni"],
      pret: Math.round((p1 + p2 + p3) * 0.9),
      accentColor: "text-violet-700",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
      labelColor: "bg-violet-100 text-violet-700",
    },
  ];
}

export default function GeneratorOferta({ semnale, numeLead }: { semnale: SemnaleLead; numeLead: string }) {
  const [open, setOpen] = useState(false);
  const pacheteInitiale = genereazaPachete(semnale);
  const [preturi, setPreturi] = useState(() => pacheteInitiale.map((p) => p.pret));
  const [copiat, setCopiat] = useState(false);

  const pachete = pacheteInitiale.map((p, i) => ({ ...p, pret: preturi[i] }));

  function copiazaOferta() {
    const text = [
      `Oferta Nova Visio Tech pentru ${numeLead}`,
      `Data: ${new Date().toLocaleDateString("ro-RO")}`,
      "",
      ...pachete.map((p) => [
        `📦 Pachet ${p.nume} — ${p.pret.toLocaleString("ro-RO")} €`,
        ...p.servicii.map((s) => `  • ${s}`),
        "",
      ].join("\n")),
      "---",
      "Nova Visio Tech | novavisiotech.ro",
      "Oferta valabila 30 de zile",
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopiat(true);
      setTimeout(() => setCopiat(false), 2500);
    });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-6 py-4 hover:bg-slate-50 transition-colors"
      >
        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" /> Generator oferta rapida
        </h2>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-slate-100 pt-5">
          <p className="text-xs text-slate-400 mb-5">
            Pachete auto-generate pe baza nevoilor detectate. Editeaza pretul direct in casuta.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {pachete.map((p, i) => (
              <div
                key={p.nume}
                className={`border rounded-xl p-4 ${p.bgColor} ${p.borderColor}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${p.labelColor}`}>
                    {p.nume}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                  <input
                    type="number"
                    value={preturi[i]}
                    onChange={(e) =>
                      setPreturi((prev) => {
                        const next = [...prev];
                        next[i] = Number(e.target.value);
                        return next;
                      })
                    }
                    className={`w-24 text-2xl font-black bg-transparent border-b-2 focus:outline-none ${p.accentColor} ${p.borderColor}`}
                  />
                  <span className={`text-sm font-semibold ${p.accentColor}`}>€</span>
                </div>
                <ul className="space-y-1">
                  {p.servicii.map((s) => (
                    <li key={s} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-slate-400 mt-0.5 shrink-0">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <button
            onClick={copiazaOferta}
            className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors ${
              copiat ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-slate-700"
            }`}
          >
            {copiat ? (
              <><CheckCheck className="w-4 h-4" /> Oferta copiata!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copiaza oferta (text)</>
            )}
          </button>
          <p className="text-xs text-slate-400 mt-2">
            Textul copiat e gata de trimis pe WhatsApp sau email
          </p>
        </div>
      )}
    </div>
  );
}
