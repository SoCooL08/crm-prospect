"use client";

import { useState } from "react";
import { Copy, CheckCheck, ChevronDown, FileText, Check, X, MessageCircle, Pencil } from "lucide-react";
import { SemnaleLead } from "@/lib/scoring";
import { propunere3Optiuni, etichetaScenariu, BUGET_MEDIA_MINIM } from "@/lib/oferta";

// ─── Pachete ──────────────────────────────────────────────────────────────────
//
// Preturile si scopul vin din lib/oferta.ts (grila reala, recalibrata
// 29.07.2026). Aici nu se mai inventeaza pachete si nu se mai aplica
// multiplicator pe nisa: oferta productizata inseamna pret fix. Ce ramane
// editabil e pretul, cu click pe cifra, pentru cazurile particulare.

export default function GeneratorOferta({
  semnale,
  numeLead,
  telefon,
}: {
  semnale: SemnaleLead;
  numeLead: string;
  telefon?: string;
}) {
  const [open, setOpen] = useState(false);
  const pacheteInitiale = propunere3Optiuni(semnale);
  const [preturi, setPreturi] = useState(() => pacheteInitiale.map((p) => p.pretBaza));
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [copiatIdx, setCopiatIdx] = useState<number | null>(null);
  const [copiatAll, setCopiatAll] = useState(false);

  const pachete = pacheteInitiale.map((p, i) => ({ ...p, pret: preturi[i] }));

  const scenariuLabel = etichetaScenariu(semnale);

  function textPachet(p: typeof pachete[0]): string {
    const pret = p.lunar
      ? `${p.pret.toLocaleString("ro-RO")} €/luna`
      : `${p.pret.toLocaleString("ro-RO")} €`;
    const items = p.items
      .filter((i) => i.inclus)
      .map((i) => `  ✅ ${i.label}`)
      .join("\n");
    // Regula 1:1 — retainerul face parte din oferta, nu e o optiune separata.
    const retainere = p.retainere
      .map((r) => `\n  ➕ *${r.nume}* — ${r.pret} €/luna${r.nota ? ` (${r.nota})` : ""}`)
      .join("");
    const totalLunar = p.retainere.reduce((s, r) => s + r.pret, 0);
    const total = p.retainere.length > 1 ? `\n  = *${totalLunar} €/luna* recurent` : "";
    return `📦 *${p.eticheta}: ${p.nume}* — ${pret}${retainere}${total}\n${items}`;
  }

  function copiazaPachet(idx: number) {
    navigator.clipboard.writeText(textPachet(pachete[idx])).then(() => {
      setCopiatIdx(idx);
      setTimeout(() => setCopiatIdx(null), 2000);
    });
  }

  function copiazaToate() {
    const text = [
      `🏢 *Oferta Nova Visio Tech*`,
      `Business: *${numeLead}*`,
      `Data: ${new Date().toLocaleDateString("ro-RO")}`,
      `Scenariu: ${scenariuLabel}`,
      ``,
      ...pachete.map((p) => textPachet(p) + `\n`),
      `---`,
      `Oferta valabila 30 zile. Discutam cand doriti! 🤝`,
      `novavisiotech.ro`,
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopiatAll(true);
      setTimeout(() => setCopiatAll(false), 2500);
    });
  }

  function trimiteWhatsapp(idx: number) {
    const p = pachete[idx];
    const mesaj = [
      `Buna ziua! Sunt de la Nova Visio Tech.`,
      ``,
      `Asa cum am discutat, trimit oferta pentru *${numeLead}*:`,
      ``,
      textPachet(p),
      ``,
      `Oferta valabila 30 zile.`,
      `Astept sa discutam! 🤝`,
      `novavisiotech.ro`,
    ].join("\n");

    const nr = telefon?.replace(/\D/g, "").replace(/^0/, "40");
    const url = nr
      ? `https://wa.me/${nr}?text=${encodeURIComponent(mesaj)}`
      : `https://wa.me/?text=${encodeURIComponent(mesaj)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-6 py-4 hover:bg-slate-50 transition-colors"
      >
        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" /> Generator oferta rapida
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-normal">
            {scenariuLabel}
          </span>
        </h2>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-slate-100 px-6 py-5">
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            Trei opțiuni pentru ancorare de preț — cea din mijloc e cea pe care o vinzi.
            CARE se atașează la 100% din proiecte, nu e opțiune. Avans 50% la semnare.
            Editează prețul cu click pe cifră. La campanii plătite, buget media minim
            recomandat clientului: {BUGET_MEDIA_MINIM} €/lună.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {pachete.map((p, i) => (
              <div
                key={p.id}
                className={`relative border rounded-2xl overflow-hidden ${p.accentBorder} ${p.accentBg}`}
              >
                {p.recomandat && (
                  <div className="absolute top-0 inset-x-0 text-center">
                    <span className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-b-lg">
                      ★ Recomandat
                    </span>
                  </div>
                )}

                <div className={`px-4 pt-${p.recomandat ? "8" : "4"} pb-4`}>
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <h3 className={`font-bold text-base ${p.accentText}`}>{p.nume}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 ${p.accentBadge}`}>
                      {p.eticheta}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3 leading-snug">{p.subtitlu}</p>

                  {/* Pret editabil */}
                  <div className="flex items-baseline gap-1 mb-4">
                    {editIndex === i ? (
                      <input
                        autoFocus
                        type="number"
                        value={preturi[i]}
                        onChange={(e) =>
                          setPreturi((prev) => {
                            const n = [...prev];
                            n[i] = Number(e.target.value);
                            return n;
                          })
                        }
                        onBlur={() => setEditIndex(null)}
                        onKeyDown={(e) => e.key === "Enter" && setEditIndex(null)}
                        className={`w-28 text-2xl font-black bg-white border-b-2 focus:outline-none ${p.accentBorder} ${p.accentText}`}
                      />
                    ) : (
                      <button
                        onClick={() => setEditIndex(i)}
                        className={`text-2xl font-black ${p.accentText} flex items-center gap-1.5 hover:opacity-80 transition-opacity`}
                        title="Click sa editezi pretul"
                      >
                        {preturi[i].toLocaleString("ro-RO")}
                        <Pencil className="w-3.5 h-3.5 opacity-50" />
                      </button>
                    )}
                    <span className={`text-sm font-semibold ${p.accentText}`}>
                      €{p.lunar ? "/lună" : ""}
                    </span>
                  </div>

                  {/* Retainerele atasate — regula 1:1 din sectiunea 2.3 */}
                  {p.retainere.length > 0 && (
                    <div className="mb-4 -mt-2 space-y-0.5">
                      {p.retainere.map((r) => (
                        <div key={r.nume} className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-slate-400 text-sm">+</span>
                          <span className={`text-base font-bold ${p.accentText}`}>
                            {r.nume} {r.pret} €/lună
                          </span>
                          {r.nota && <span className="text-xs text-slate-400">({r.nota})</span>}
                        </div>
                      ))}
                      {p.retainere.length > 1 && (
                        <p className="text-xs font-semibold text-slate-500 pt-0.5">
                          = {p.retainere.reduce((s, r) => s + r.pret, 0)} €/lună recurent
                        </p>
                      )}
                    </div>
                  )}

                  {/* Items */}
                  <ul className="space-y-1.5 mb-4">
                    {p.items.map((item) => (
                      <li
                        key={item.label}
                        className={`flex items-start gap-2 text-xs ${
                          item.inclus ? "text-slate-700" : "text-slate-300"
                        }`}
                      >
                        {item.inclus ? (
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${p.accentText}`} />
                        ) : (
                          <X className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-200" />
                        )}
                        <span className={item.bold && item.inclus ? "font-semibold" : ""}>
                          {item.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Butoane per pachet */}
                  <div className="flex flex-col gap-1.5 pt-3 border-t border-black/5">
                    <button
                      onClick={() => trimiteWhatsapp(i)}
                      className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Trimite WhatsApp
                    </button>
                    <button
                      onClick={() => copiazaPachet(i)}
                      className={`flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        copiatIdx === i
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-white/70 text-slate-600 hover:bg-white border border-black/10"
                      }`}
                    >
                      {copiatIdx === i ? (
                        <><CheckCheck className="w-3.5 h-3.5" /> Copiat!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Copiaza pachet</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Copiaza toate */}
          <button
            onClick={copiazaToate}
            className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors ${
              copiatAll
                ? "bg-emerald-500 text-white"
                : "bg-slate-900 text-white hover:bg-slate-700"
            }`}
          >
            {copiatAll ? (
              <><CheckCheck className="w-4 h-4" /> Oferta completa copiata!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copiaza toate 3 pachetele</>
            )}
          </button>
          <p className="text-xs text-slate-400 mt-2">
            Text formatat pentru WhatsApp · preturile sunt editabile cu click
          </p>
        </div>
      )}
    </div>
  );
}
