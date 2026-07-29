"use client";

import { useState } from "react";
import { ChevronDown, Copy, CheckCheck, Shield } from "lucide-react";
import { SemnaleLead } from "@/lib/scoring";

interface Obiectie {
  intrebare: string;
  raspuns: string;
  tag?: string;
  nota?: string;
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

// Cele 8 obiectii testate din NVT-Script-Apel-si-Cadenta.html, sectiunea 6.5.
// Formularea e cea pe care o folosesti la telefon — nu o rescrie in timpul
// apelului, ai testat-o deja.
const OBIECTII_STATICE: Obiectie[] = [
  {
    intrebare: "Avem deja site.",
    raspuns:
      "Știu, l-am văzut, de asta v-am sunat. Nu vă sun pentru un site nou. Vă sun pentru că [observația]. Întrebarea reală nu e dacă aveți site, e dacă vă aduce clienți. Câți dintre clienții de luna trecută au venit de pe el?",
  },
  {
    intrebare: "Nu ne interesează.",
    raspuns:
      "Vă înțeleg perfect, primiți zeci de apeluri de genul. Doar o întrebare și vă las: dacă luna viitoare ar veni 5 clienți în plus de pe internet, ar conta pentru firmă, sau sunteți deja la capacitate maximă?",
    nota: "Dacă spune „suntem la capacitate” → e lead real, cu timing greșit. NURTURE la 90 de zile, nu PIERDUT.",
  },
  {
    intrebare: "Trimite-mi pe mail.",
    raspuns:
      "Cu plăcere, dar hai să nu vă trimit un PDF de prezentare pe care nu-l citește nimeni. Vă trimit auditul video de 3 minute, personalizat pe site-ul dumneavoastră — ăla se vede în 3 minute. Pe ce adresă, sau mai bine pe WhatsApp, ca să știu sigur că ajunge?",
    nota: "Cea mai frecventă obiecție. De fapt înseamnă „lasă-mă în pace”. Nu accepți emailul ca ieșire — îl transformi în WhatsApp.",
  },
  {
    intrebare: "Cât costă?",
    raspuns:
      "Depinde real de ce vă trebuie — între 800 și 1.300 de euro pentru un site de prezentare, de la 1.700 pentru magazin online. Dar nu vreau să vă vând nimic acum. Vă trimit auditul, vedeți dacă are sens, și abia apoi vorbim de bani. E ok?",
    nota: "Dai întotdeauna un interval concret. „Depinde” fără cifre sună a ascunzi ceva și pierzi apelul.",
  },
  {
    intrebare: "E prea scump.",
    raspuns:
      "Înțeleg. Ca să vă ajut mai concret: prea scump față de buget, sau prea scump față de ce credeți că v-ar aduce? Sunt două discuții complet diferite.",
    nota: "Dacă e bugetul → cobori la LAUNCH sau propui plata în 3 tranșe. Nu scazi prețul — scazi scopul. Un site la 350 EUR îți consumă aceleași zile ca unul la 1.290.",
  },
  {
    intrebare: "Avem deja pe cineva care se ocupă.",
    raspuns:
      "Bine, e important să aveți. Vă întreb doar un lucru: primiți raport lunar cu ce s-a făcut și ce rezultate a adus? ... Nu? Atunci probabil aveți pe cineva care menține, nu care crește. Sunt lucruri diferite, și de obicei se vede în trafic.",
  },
  {
    intrebare: "Nu am timp acum.",
    raspuns:
      "Sigur. Doar ca să nu vă mai sun degeaba: marți dimineață sau joi după-amiază vă e mai comod pentru 5 minute?",
    nota: "Nu întrebi „când vă sun”. Dai două opțiuni concrete.",
  },
  {
    intrebare: "Suntem în concediu / e vară.",
    raspuns:
      "Perfect timing atunci, pentru că un site durează 3–4 săptămâni. Dacă începem acum, sunteți gata pentru septembrie, când revine lumea. Dacă începeți în septembrie, sunteți gata în octombrie și pierdeți exact luna cea mai bună.",
    nota: "O vei auzi mult în august. Nu e un „nu”, e un test.",
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
          {obiectie.nota && (
            <p className="text-xs text-slate-500 mt-2 pl-3 border-l-2 border-slate-300">
              {obiectie.nota}
            </p>
          )}
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
