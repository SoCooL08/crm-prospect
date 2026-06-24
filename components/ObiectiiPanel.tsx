"use client";

import { useState } from "react";
import { ChevronDown, Copy, CheckCheck, Shield } from "lucide-react";
import { SemnaleLead } from "@/lib/scoring";

interface Obiectie {
  intrebare: string;
  raspuns: string;
  tag?: string;
}

function getObiectiiDinamice(s: SemnaleLead): Obiectie[] {
  const obiectii: Obiectie[] = [];

  if (!s.areWebsite) {
    obiectii.push({
      intrebare: "Nu am nevoie de site, ma descurc si asa",
      raspuns: `Inteleg — si pana acum v-ati descurcat, dar acum ${s.reviews > 30 ? `aveti ${s.reviews} recenzii pe Google, adica lumea va cauta online` : "clientii cauta online inainte sa sune"}. Problema e ca daca nu va gasesc pe voi, suna concurentul. Un site simplu costa mai putin decat o luna de clienti pierduti.`,
      tag: "Fara website",
    });
  }

  if (s.scorViteza != null && s.scorViteza < 50) {
    obiectii.push({
      intrebare: "Site-ul meu merge bine, nu am probleme",
      raspuns: `Am testat site-ul inainte sa sun — scor ${s.scorViteza}/100 la viteza. Stiu ca dvs il vedeti bine, dar asta e pentru ca il aveti in cache. Un client nou pe telefon 4G il incarca in 6-8 secunde si inchide inainte sa vada ce oferiti. Va pot arata testul live in 2 minute.`,
      tag: "Site lent",
    });
  }

  if (s.rating > 0 && s.rating < 4.0) {
    obiectii.push({
      intrebare: "Recenziile nu conteaza, eu am clienti fideli",
      raspuns: `Clientii fideli sunt excelenti, dar 87% din clientii noi citesc recenziile inainte sa contacteze o afacere. Cu un rating de ${s.rating}, multi aleg concurentul cu 4.5+ fara sa va mai sune. Nu va cer sa stergeti recenzii — va arat cum sa aduceti recenzii pozitive noi care sa schimbe perceptia.`,
      tag: "Rating slab",
    });
  }

  if (s.reviews > 100 && s.areWebsite) {
    obiectii.push({
      intrebare: "Am deja clienti suficienti, nu am nevoie de mai multi",
      raspuns: `Felicitari, e un semn bun. Intrebarea e: cati clienti platesc mai putin sau negociaza? Cu Google Ads puteti filtra sa atragi exact tipul de client cu buget mai mare. Nu e vorba de volum — e vorba de calitatea clientilor.`,
      tag: "Afacere mare",
    });
  }

  return obiectii;
}

const OBIECTII_STATICE: Obiectie[] = [
  {
    intrebare: "E prea scump",
    raspuns: "Inteleg, pretul conteaza. Hai sa ne uitam impreuna: un client nou adus de site sau ads valoreaza cat? Daca serviciile dvs costa 500€, aveti nevoie de 3-4 clienti noi pe luna ca sa recuperati investitia. In zona dvs, asta e realist in prima luna. Dupa, e profit curat.",
  },
  {
    intrebare: "Nu am timp acum, suna-ma luna viitoare",
    raspuns: "Exact de asta sun acum — ca sa nu pierdeti o luna de clienti. Nu va cer mai mult de 20 de minute pentru o consultatie completa, la ora convenabila pentru dvs. Cand sunteti liber miercuri sau joi?",
  },
  {
    intrebare: "Am deja un furnizor / agentie",
    raspuns: "Perfect, asta inseamna ca stiti valoarea acestor servicii. Pot sa va intreb — sunteti multumit de rezultate? Multi clienti ai nostri au venit de la alte agentii tocmai pentru ca nu vedeau rezultate concrete. Va fac o analiza comparativa gratuita, fara nicio obligatie.",
  },
  {
    intrebare: "Trebuie sa ma gandesc / sa discut cu asociatul",
    raspuns: "Normal, e o decizie de business. Ca sa va ajut sa luati cea mai buna decizie, va trimit un audit detaliat pe email sau WhatsApp — include exact ce am identificat si ce propun concret. Asa aveti ceva in mana cand discutati. Ce numar de WhatsApp folositi?",
  },
  {
    intrebare: "Trimite-mi ceva pe email, ma uit si revin",
    raspuns: "Da, va trimit acum un audit personalizat pe afacerea dvs. Va rog sa il deschideti cat suntem la telefon, dureaza 30 de secunde, si imi spuneti daca problemele identificate vi se par reale. Aveti WhatsApp?",
  },
  {
    intrebare: "Am incercat Google Ads si nu a mers",
    raspuns: "Asta aud des si aproape intotdeauna motivul e acelasi: campania nu a fost setata corect pentru zona si nisa dvs specifica. Google Ads functioneaza — problema e configuratia. Va pot arata 2-3 exemple de campanii din acelasi domeniu care functioneaza in Romania acum.",
  },
];

function ObiectieCard({ obiectie }: { obiectie: Obiectie }) {
  const [open, setOpen] = useState(false);
  const [copiat, setCopiat] = useState(false);

  function copiaza() {
    navigator.clipboard.writeText(obiectie.raspuns).then(() => {
      setCopiat(true);
      setTimeout(() => setCopiat(false), 2000);
    });
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          {obiectie.tag && (
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-medium shrink-0">
              {obiectie.tag}
            </span>
          )}
          <span className="text-sm font-medium text-slate-700 leading-snug">
            &ldquo;{obiectie.intrebare}&rdquo;
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 bg-slate-50 border-t border-slate-100">
          <p className="text-sm text-slate-700 leading-relaxed pt-3 italic">
            &ldquo;{obiectie.raspuns}&rdquo;
          </p>
          <button
            onClick={copiaza}
            className={`mt-3 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              copiat ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {copiat ? (
              <><CheckCheck className="w-3.5 h-3.5" /> Copiat</>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> Copiaza raspuns</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ObiectiiPanel({ semnale }: { semnale: SemnaleLead }) {
  const [open, setOpen] = useState(false);
  const dinamice = getObiectiiDinamice(semnale);
  const toate = [...dinamice, ...OBIECTII_STATICE];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-6 py-4 hover:bg-slate-50 transition-colors"
      >
        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-500" />
          Scripturi obiecții
          {dinamice.length > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md font-bold">
              {dinamice.length} personalizate
            </span>
          )}
        </h2>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-6 pb-5 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400 mb-4">
            Raspunsuri gata de folosit — click pe obiectie ca sa o expandezi
          </p>
          <div className="space-y-2">
            {toate.map((o) => <ObiectieCard key={o.intrebare} obiectie={o} />)}
          </div>
        </div>
      )}
    </div>
  );
}
