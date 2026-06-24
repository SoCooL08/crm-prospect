"use client";

import { useState } from "react";
import { Copy, CheckCheck, ChevronDown, FileText, Check, X, MessageCircle, Pencil } from "lucide-react";
import { SemnaleLead } from "@/lib/scoring";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Item {
  label: string;
  inclus: boolean;
  bold?: boolean;
}

interface Pachet {
  id: string;
  nume: string;
  subtitlu: string;
  pretBaza: number;
  lunar: boolean;
  recomandat: boolean;
  accentBg: string;
  accentBorder: string;
  accentBadge: string;
  accentText: string;
  items: Item[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pretMultiplier(nisa?: string): number {
  if (!nisa) return 1;
  const n = nisa.toLowerCase();
  if (/clinic|stomatolog|medic|dentist|avocat|notar|arhitect|construct|renovat|imobiliar/.test(n))
    return 1.35;
  if (/restaurant|hotel|pensiune|auto|turism|contabilitat|transport/.test(n)) return 1.1;
  if (/frizerie|coafura|cosmet|florarie|cofetarie|brutarie/.test(n)) return 0.9;
  return 1.0;
}

function rotunjeste(v: number): number {
  return Math.round((v * pretMultiplier()) / 50) * 50;
}

function pretCuMultiplier(base: number, nisa?: string): number {
  return Math.round((base * pretMultiplier(nisa)) / 50) * 50;
}

function specPagini(nisa?: string): string {
  if (!nisa) return "";
  const n = nisa.toLowerCase();
  if (/restaurant|cafenea|bar|pizzerie|bistro/.test(n))
    return " (Acasa, Meniu, Galerie, Rezervare, Contact)";
  if (/clinic|stomatolog|medic|dentist/.test(n))
    return " (Acasa, Servicii, Echipa, Programare, Contact)";
  if (/construct|renovat|amenaj|instalat/.test(n))
    return " (Acasa, Servicii, Portofoliu, Despre, Contact)";
  if (/hotel|pensiune|cazare|villa/.test(n))
    return " (Acasa, Camere, Facilitati, Rezervare, Contact)";
  if (/frizerie|coafura|salon|spa|beauty/.test(n))
    return " (Acasa, Servicii, Galerie, Programare, Contact)";
  if (/avocat|notar|juridic/.test(n))
    return " (Acasa, Domenii, Echipa, Blog, Contact)";
  if (/auto|service|car/.test(n))
    return " (Acasa, Servicii, Preturi, Galerie, Contact)";
  return "";
}

// ─── Package generator ────────────────────────────────────────────────────────

function genereazaPachete(s: SemnaleLead): Pachet[] {
  const m = (base: number) => pretCuMultiplier(base, s.nisa);
  const spec = specPagini(s.nisa);

  // ── Scenariu 1: Nu are website ────────────────────────────────────────────
  if (!s.areWebsite) {
    return [
      {
        id: "starter",
        nume: "Prezenta Online",
        subtitlu: "Intrare rapida in mediul digital",
        pretBaza: m(900),
        lunar: false,
        recomandat: false,
        accentBg: "bg-slate-50",
        accentBorder: "border-slate-200",
        accentBadge: "bg-slate-100 text-slate-600",
        accentText: "text-slate-700",
        items: [
          { label: "Realizare site de prezentare — 3-4 pagini" + spec, inclus: true, bold: true },
          { label: "Design modern, adaptat mobil si desktop", inclus: true },
          { label: "Certificat SSL (HTTPS) + configurare", inclus: true },
          { label: "Hosting rapid 12 luni inclus", inclus: true },
          { label: "Setare Google Business Profile", inclus: true, bold: true },
          { label: "SEO de baza — titluri, meta-descrieri, H1-H2", inclus: true },
          { label: "Formular contact + harta Google Maps", inclus: true },
          { label: "Buton WhatsApp + apel cu un click", inclus: true },
          { label: "Optimizare viteza (scor 85+/100)", inclus: true },
          { label: "Panou administrare (editare continut)", inclus: false },
          { label: "Optimizare Google Business Profile", inclus: false },
          { label: "SEO local avansat (cuvinte cheie zona)", inclus: false },
          { label: "Galerie foto + portofoliu", inclus: false },
          { label: "Blog / Sectiune noutati", inclus: false },
          { label: "Raport lunar performanta", inclus: false },
          { label: "Suport tehnic extins", inclus: false },
        ],
      },
      {
        id: "standard",
        nume: "Crestere Locala",
        subtitlu: "Vizibilitate completa — esti primul gasit in zona ta",
        pretBaza: m(1650),
        lunar: false,
        recomandat: true,
        accentBg: "bg-blue-50",
        accentBorder: "border-blue-300",
        accentBadge: "bg-blue-600 text-white",
        accentText: "text-blue-700",
        items: [
          { label: "Realizare site de prezentare — 6-8 pagini" + spec, inclus: true, bold: true },
          { label: "Design premium personalizat brandului", inclus: true },
          { label: "Certificat SSL (HTTPS) + configurare", inclus: true },
          { label: "Hosting rapid 12 luni inclus", inclus: true },
          { label: "Setare + optimizare Google Business Profile", inclus: true, bold: true },
          { label: "SEO local avansat — 10 cuvinte cheie din zona", inclus: true, bold: true },
          { label: "Formular contact + harta Google Maps", inclus: true },
          { label: "Buton WhatsApp, apel si link-uri social media", inclus: true },
          { label: "Optimizare viteza (scor 90+/100)", inclus: true },
          { label: "Panou administrare — editare texte si imagini", inclus: true, bold: true },
          { label: "Galerie foto optimizata SEO", inclus: true },
          { label: "Google Analytics + Search Console configurare", inclus: true },
          { label: "Blog / Sectiune noutati", inclus: false },
          { label: "Postari lunare Google Business", inclus: false },
          { label: "Raport lunar performanta", inclus: false },
        ],
      },
      {
        id: "premium",
        nume: "Dominanta Digitala",
        subtitlu: "Prezenta completa care aduce clienti non-stop",
        pretBaza: m(2900),
        lunar: false,
        recomandat: false,
        accentBg: "bg-violet-50",
        accentBorder: "border-violet-300",
        accentBadge: "bg-violet-100 text-violet-700",
        accentText: "text-violet-700",
        items: [
          { label: "Realizare site complet — 10-15 pagini" + spec, inclus: true, bold: true },
          { label: "Design exclusivist cu identitate vizuala completa", inclus: true },
          { label: "Certificat SSL (HTTPS) + configurare", inclus: true },
          { label: "Hosting premium 24 luni inclus", inclus: true },
          { label: "Setare + optimizare Google Business Profile", inclus: true, bold: true },
          { label: "Postari lunare Google Business (4/luna, 3 luni)", inclus: true, bold: true },
          { label: "SEO tehnic complet + 20 cuvinte cheie locale", inclus: true, bold: true },
          { label: "Optimizare viteza (scor 95+/100)", inclus: true },
          { label: "Integrare programari online / sistem rezervari", inclus: true, bold: true },
          { label: "Formular contact + WhatsApp + Social media", inclus: true },
          { label: "Panou administrare + Blog / Noutati", inclus: true, bold: true },
          { label: "Google Analytics + Search Console + heatmap", inclus: true },
          { label: "Raport lunar performanta", inclus: true, bold: true },
          { label: "Suport prioritar 6 luni", inclus: true, bold: true },
        ],
      },
    ];
  }

  // ── Scenariu 2: Are website dar e lent ───────────────────────────────────
  if (s.scorViteza != null && s.scorViteza < 50) {
    return [
      {
        id: "starter",
        nume: "Optimizare Viteza",
        subtitlu: "Rezolva urgent pierderile de clienti",
        pretBaza: m(550),
        lunar: false,
        recomandat: false,
        accentBg: "bg-slate-50",
        accentBorder: "border-slate-200",
        accentBadge: "bg-slate-100 text-slate-600",
        accentText: "text-slate-700",
        items: [
          { label: `Optimizare Core Web Vitals (scor actual: ${s.scorViteza}/100 → 85+)`, inclus: true, bold: true },
          { label: "Compresie + conversie imagini WebP", inclus: true },
          { label: "Minificare si combinare CSS + JavaScript", inclus: true },
          { label: "Activare caching + CDN", inclus: true },
          { label: "Setare Google Business Profile", inclus: true, bold: true },
          { label: "SEO tehnic de baza (titluri, meta, H1)", inclus: true },
          { label: "Redesign pagini", inclus: false },
          { label: "Pagini noi de continut", inclus: false },
          { label: "SEO local avansat", inclus: false },
          { label: "Raport lunar", inclus: false },
        ],
      },
      {
        id: "standard",
        nume: "Redesign + SEO",
        subtitlu: "Site rapid, nou, vizibil in Google — recomandat",
        pretBaza: m(1900),
        lunar: false,
        recomandat: true,
        accentBg: "bg-blue-50",
        accentBorder: "border-blue-300",
        accentBadge: "bg-blue-600 text-white",
        accentText: "text-blue-700",
        items: [
          { label: "Redesign complet al tuturor paginilor existente", inclus: true, bold: true },
          { label: "Viteza 90+/100 garantata (Core Web Vitals)", inclus: true, bold: true },
          { label: "Design modern, responsive", inclus: true },
          { label: "Hosting rapid 12 luni inclus", inclus: true },
          { label: "Setare + optimizare Google Business Profile", inclus: true, bold: true },
          { label: "SEO local avansat — 10 cuvinte cheie din zona", inclus: true, bold: true },
          { label: "Formular contact + WhatsApp optimizate", inclus: true },
          { label: "Panou administrare actualizat", inclus: true },
          { label: "Google Analytics + Search Console", inclus: true },
          { label: "Postari lunare Google Business", inclus: false },
          { label: "Google Ads setup", inclus: false },
          { label: "Raport lunar performanta", inclus: false },
        ],
      },
      {
        id: "premium",
        nume: "Dominanta Digitala",
        subtitlu: "Redesign + SEO + Ads — clienti din toate canalele",
        pretBaza: m(2900),
        lunar: false,
        recomandat: false,
        accentBg: "bg-violet-50",
        accentBorder: "border-violet-300",
        accentBadge: "bg-violet-100 text-violet-700",
        accentText: "text-violet-700",
        items: [
          { label: "Redesign complet + pagini noi de continut", inclus: true, bold: true },
          { label: "Viteza 95+/100 garantata", inclus: true },
          { label: "Design premium cu identitate vizuala", inclus: true },
          { label: "Hosting premium 24 luni inclus", inclus: true },
          { label: "Setare + optimizare Google Business Profile", inclus: true, bold: true },
          { label: "Postari lunare Google Business (4/luna, 3 luni)", inclus: true, bold: true },
          { label: "SEO tehnic complet + 20 cuvinte cheie", inclus: true, bold: true },
          { label: "Google Ads — setup + prima luna gestionata", inclus: true, bold: true },
          { label: "Landing page dedicat pentru Ads", inclus: true },
          { label: "Panou administrare + Blog / Noutati", inclus: true },
          { label: "Raport lunar performanta", inclus: true, bold: true },
          { label: "Suport prioritar 6 luni", inclus: true, bold: true },
        ],
      },
    ];
  }

  // ── Scenariu 3: Are website ok — focus pe crestere (Ads + SEO) ───────────
  return [
    {
      id: "starter",
      nume: "Vizibilitate Locala",
      subtitlu: "SEO local si Google Business optimizat",
      pretBaza: m(650),
      lunar: false,
      recomandat: false,
      accentBg: "bg-slate-50",
      accentBorder: "border-slate-200",
      accentBadge: "bg-slate-100 text-slate-600",
      accentText: "text-slate-700",
      items: [
        { label: "Audit SEO complet al site-ului actual", inclus: true, bold: true },
        { label: "Optimizare + completare Google Business Profile", inclus: true, bold: true },
        { label: "SEO local — 8 cuvinte cheie principale din zona", inclus: true },
        { label: "Optimizare meta-taguri, titluri, structura URL", inclus: true },
        { label: "Optimizare viteza site (daca e nevoie)", inclus: true },
        { label: "Google Search Console + Analytics configurare", inclus: true },
        { label: "Google Ads", inclus: false },
        { label: "Postari lunare Google Business", inclus: false },
        { label: "Raport lunar", inclus: false },
      ],
    },
    {
      id: "standard",
      nume: "Crestere Accelerata",
      subtitlu: "SEO + Ads — clienti organici si platiti simultan",
      pretBaza: m(950),
      lunar: true,
      recomandat: true,
      accentBg: "bg-blue-50",
      accentBorder: "border-blue-300",
      accentBadge: "bg-blue-600 text-white",
      accentText: "text-blue-700",
      items: [
        { label: "SEO local complet — 15 cuvinte cheie din zona", inclus: true, bold: true },
        { label: "Optimizare tehnica site (viteza, structura)", inclus: true },
        { label: "Optimizare Google Business Profile", inclus: true, bold: true },
        { label: "Postari Google Business (4 postari/luna)", inclus: true },
        { label: "Google Ads — campanie cautare locala activa", inclus: true, bold: true },
        { label: "Management continuu campanii + optimizare", inclus: true },
        { label: "Raport lunar detaliat (pozitii, trafic, conversii)", inclus: true, bold: true },
        { label: "Remarketing", inclus: false },
        { label: "Campanii Display", inclus: false },
        { label: "Account manager dedicat", inclus: false },
      ],
    },
    {
      id: "premium",
      nume: "Dominanta Online",
      subtitlu: "Pozitia 1 in zona — SEO + Ads complet gestionat",
      pretBaza: m(1600),
      lunar: true,
      recomandat: false,
      accentBg: "bg-violet-50",
      accentBorder: "border-violet-300",
      accentBadge: "bg-violet-100 text-violet-700",
      accentText: "text-violet-700",
      items: [
        { label: "SEO tehnic avansat + 25 cuvinte cheie locale", inclus: true, bold: true },
        { label: "Optimizare si extindere continut site", inclus: true },
        { label: "Google Business — optimizare + raspuns recenzii", inclus: true, bold: true },
        { label: "Postari Google Business (8 postari/luna)", inclus: true },
        { label: "Google Ads — Cautare + Display + Remarketing", inclus: true, bold: true },
        { label: "Landing page dedicat pentru campanii Ads", inclus: true, bold: true },
        { label: "A/B testing anunturi pentru maxim ROI", inclus: true },
        { label: "Raport saptamanal + lunar (pozitii, ROI, conversii)", inclus: true, bold: true },
        { label: "Account manager dedicat — raspuns in 2h", inclus: true, bold: true },
      ],
    },
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────

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
  const pacheteInitiale = genereazaPachete(semnale);
  const [preturi, setPreturi] = useState(() => pacheteInitiale.map((p) => p.pretBaza));
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [copiatIdx, setCopiatIdx] = useState<number | null>(null);
  const [copiatAll, setCopiatAll] = useState(false);

  const pachete = pacheteInitiale.map((p, i) => ({ ...p, pret: preturi[i] }));

  const scenariuLabel = !semnale.areWebsite
    ? "Fara website — Creare prezenta"
    : semnale.scorViteza != null && semnale.scorViteza < 50
    ? "Site lent — Redesign + optimizare"
    : "Site existent — Crestere si marketing";

  function textPachet(p: typeof pachete[0]): string {
    const pret = p.lunar
      ? `${p.pret.toLocaleString("ro-RO")} €/luna`
      : `${p.pret.toLocaleString("ro-RO")} €`;
    const items = p.items
      .filter((i) => i.inclus)
      .map((i) => `  ✅ ${i.label}`)
      .join("\n");
    return `📦 *Pachet ${p.nume}* — ${pret}\n${items}`;
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
            Pachete generate pe baza semnalelor detectate. Editeaza pretul cu click pe cifra.
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
                      €{p.lunar ? "/luna" : ""}
                    </span>
                  </div>

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
