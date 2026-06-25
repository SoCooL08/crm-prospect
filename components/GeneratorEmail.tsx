"use client";

import { useState } from "react";
import { Mail, Copy, CheckCheck, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  semnale: {
    areWebsite: boolean;
    rating: number;
    reviews: number;
    scorViteza?: number | null;
    nisa: string;
  };
  numeLead: string;
}

type Variant = { scenariu: string; subiect: string; corp: string };

function genereazaEmailuri({ semnale, numeLead }: Props): Variant[] {
  const { areWebsite, rating, reviews, scorViteza, nisa } = semnale;
  const nisaLower = nisa.toLowerCase();
  const variants: Variant[] = [];

  if (!areWebsite) {
    variants.push({
      scenariu: "Fara website",
      subiect: `Cum poate ${numeLead} atrage mai multi clienti online`,
      corp: `Buna ziua,

Am gasit afacerea dumneavoastra, ${numeLead}, pe Google Maps si am observat ca nu aveti inca un site web.

In 2025, peste 80% din clienti cauta servicii de ${nisaLower} online inainte de a suna sau vizita. Fara un site, pierdeti acesti clienti in favoarea concurentilor care au deja prezenta digitala.

Nova Visio Tech creeaza site-uri profesionale pentru afaceri de ${nisaLower} in 7-14 zile lucratoare, cu:
• Design modern, optimizat pentru mobile
• Aparitie in Google Maps si cautari locale
• Formular de contact si posibilitate de rezervari online

Ati dori sa programam un apel de 15 minute fara obligatii?

Cu stima,
Echipa Nova Visio Tech
Tel: 0755 123 456`,
    });
  }

  if (areWebsite && scorViteza != null && scorViteza < 60) {
    variants.push({
      scenariu: "Site lent",
      subiect: `Site-ul ${numeLead} pierde clienti din cauza vitezei`,
      corp: `Buna ziua,

Am analizat site-ul ${numeLead} cu Google PageSpeed si am descoperit un scor de performanta de ${scorViteza}/100 pe mobil.

Studiile arata ca 53% din utilizatori abandoneaza un site care se incarca in mai mult de 3 secunde. Asta inseamna clienti pierduti in fiecare zi.

Nova Visio Tech ofera optimizare completa pentru site-uri de ${nisaLower}:
• Reducerea timpului de incarcare cu 60-80%
• Cresterea pozitiei in Google (viteza este factor de ranking SEO)
• Mai putine bounce-uri, mai multe rezervari si contacte

Va propun un audit gratuit al site-ului, fara obligatii. Cand aveti 15 minute pentru un apel?

Cu stima,
Echipa Nova Visio Tech
Tel: 0755 123 456`,
    });
  }

  const punctSlabitate =
    rating < 4
      ? `un rating de ${rating} stele (sub media din ${nisaLower})`
      : reviews < 50
      ? `un numar redus de recenzii (${reviews} pana acum)`
      : `potential de crestere in zona`;

  variants.push({
    scenariu: "Crestere Google & Ads",
    subiect: `Mai multi clienti din Google pentru ${numeLead}`,
    corp: `Buna ziua,

Am analizat prezenta online a ${numeLead} si am identificat ${punctSlabitate}.

Concurentii din ${nisaLower} din zona dumneavoastra investesc activ in Google Ads si SEO pentru a aparea primii in cautari locale. Fara o strategie digitala clara, este din ce in ce mai greu sa cresteti baza de clienti.

Nova Visio Tech ofera:
• Campanii Google Ads optimizate pentru ${nisaLower} — platiti doar pentru clienti reali
• SEO local pentru prima pagina Google in cautarile din zona
• Rapoarte lunare transparente cu rezultate masurabile

Avem experienta cu zeci de afaceri de ${nisaLower} in Romania si stim ce functioneaza in piata locala.

Ati fi interesat de o analiza gratuita a potentialului de crestere?

Cu stima,
Echipa Nova Visio Tech
Tel: 0755 123 456`,
  });

  return variants;
}

export default function GeneratorEmail({ semnale, numeLead }: Props) {
  const [deschis, setDeschis] = useState(false);
  const [copiat, setCopiat] = useState<string | null>(null);

  const variante = genereazaEmailuri({ semnale, numeLead });

  function copiaza(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiat(key);
      setTimeout(() => setCopiat(null), 2000);
    });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-4">
      <button
        onClick={() => setDeschis((d) => !d)}
        className="w-full flex justify-between items-center"
      >
        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
          <Mail className="w-4 h-4 text-violet-500" /> Generator email
        </h2>
        {deschis ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {deschis && (
        <div className="mt-5 space-y-5">
          {variante.map((v) => (
            <div key={v.scenariu} className="border border-slate-100 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {v.scenariu}
                </span>
              </div>

              {/* Subject */}
              <div className="px-4 pt-3 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">Subiect</p>
                    <p className="text-sm font-semibold text-slate-800">{v.subiect}</p>
                  </div>
                  <button
                    onClick={() => copiaza(v.subiect, `subj-${v.scenariu}`)}
                    className={`shrink-0 flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      copiat === `subj-${v.scenariu}`
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {copiat === `subj-${v.scenariu}` ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copiaza
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-4 pb-4">
                <div className="flex items-start justify-between gap-2 mt-2">
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 font-medium mb-1.5">Corp email</p>
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100">
                      {v.corp}
                    </pre>
                  </div>
                </div>
                <button
                  onClick={() => copiaza(v.corp, `corp-${v.scenariu}`)}
                  className={`mt-2 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    copiat === `corp-${v.scenariu}`
                      ? "bg-emerald-500 text-white"
                      : "bg-violet-600 text-white hover:bg-violet-700"
                  }`}
                >
                  {copiat === `corp-${v.scenariu}` ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiat === `corp-${v.scenariu}` ? "Copiat!" : "Copiaza email complet"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
