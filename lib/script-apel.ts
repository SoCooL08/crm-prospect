// Scriptul primului apel, cap-coada, pentru fiecare lead din coada.
// Fiecare element se citeste legat; intre elemente il lasi pe celalalt sa raspunda.

type LeadScript = {
  nume: string;
  nisa: string | null;
  nota_personalizare: string | null;
};

const DESCHIDERE_SALA =
  "Bună ziua, sunt Șerban de la Nova Visio Tech, tot din Sibiu. Vorbesc cu cine se ocupă de sală? Vă rețin un minut.";
const INTREBARE_SALA =
  "De unde vin acum cei mai mulți membri noi: recomandări, Facebook sau Google?";
const VIZITA_SALA =
  "Sunt din Sibiu, pot trece pe la sală 10 minute săptămâna viitoare, să vă arăt pe telefon. Marți sau joi vă e mai bine?";
const PAGINA_SALA =
  "Fac o pagină simplă: abonamente, program, poze cu sala, buton de apel și WhatsApp, harta. Pornește de la 260 €.";

const SALI: { potrivire: RegExp; script: string[] }[] = [
  {
    potrivire: /wolf gym/i,
    script: [
      DESCHIDERE_SALA,
      `Aveți 311 recenzii, nota 4,8, cel mai mult dintre sălile pe care le-am văzut în Sibiu. Doar că pe Google, la site, apare Facebook. Cine vă caută de pe telefon vrea rapid prețul abonamentului, programul și cum ajunge la voi. ${INTREBARE_SALA}`,
      `${PAGINA_SALA} ${VIZITA_SALA}`,
    ],
  },
  {
    potrivire: /avangard/i,
    script: [
      DESCHIDERE_SALA,
      `Aveți 61 de recenzii, nota 4,7, dar pe profil nu apare niciun site. Cine se mută în Șelimbăr și caută o sală aproape nu află de la voi prețuri, program sau cum arată sala. ${INTREBARE_SALA}`,
      `${PAGINA_SALA} ${VIZITA_SALA}`,
    ],
  },
  {
    potrivire: /24fit/i,
    script: [
      DESCHIDERE_SALA,
      `Aveți 257 de recenzii, nota 4,9, deci sala merge foarte bine. Doar că pe site, primul anunț e din 2023 și jos scrie 2017. Cine intră prima dată poate crede că nu mai sunteți activi, deși clasele sunt pline. ${INTREBARE_SALA}`,
      `Vă propun Site Start, 550 €, în 3 tranșe. Păstrăm conținutul bun pe care îl aveți, clasele și partea de nutriție. ${VIZITA_SALA}`,
    ],
  },
  {
    potrivire: /bebe[sș]elea/i,
    script: [
      DESCHIDERE_SALA,
      `Aveți o poveste pe care nu o mai are nimeni în Sibiu: din 1989, prima sală privată, cu certificat de la Ben Weider. Pe site însă abia se vede. ${INTREBARE_SALA}`,
      `Se poate face o pagină care arată povestea asta, cu buton de apel, WhatsApp și hartă, și păstrăm prețurile cum le aveți. Pornește de la 260 €, iar dacă vreți și istoria pe larg, Site Start e 550 €. ${VIZITA_SALA}`,
    ],
  },
  {
    potrivire: /terrasportika/i,
    script: [
      "Bună ziua, sunt Șerban de la Nova Visio Tech, tot din Sibiu. Vorbesc cu cine se ocupă de club? Vă rețin un minut.",
      "Aveți nota 5,0 pe Google și clubul merge din 2005, cu medalii la campionate, deci munca se vede. Am intrat pe site de pe telefon, ca un părinte care caută karate pentru copil. Programul e o poză care iese foarte mică, numărul e doar la Contact și nu se poate apăsa, iar prețul sau cum se înscrie copilul nu le-am găsit. De unde vin acum cei mai mulți copii noi: recomandări sau internet?",
      "Aveți ședință de probă?",
      "Vă pot face o pagină „Karate copii”, gândită pentru telefon: program ușor de citit, preț, buton de apel și WhatsApp, și înscriere la ședința de probă. Costă 260 €, o singură plată, și nu trebuie să renunțați la site-ul pe care îl aveți. Sunt din Sibiu, pot trece pe la club 10 minute săptămâna viitoare, să vă arăt pe telefon. Marți sau joi vă e mai bine?",
    ],
  },
  {
    potrivire: /unic gym/i,
    script: [
      DESCHIDERE_SALA,
      "Nu vă sun pentru site, îl aveți bun. Am văzut sala în poze și arată foarte bine. Fac clipuri scurte pentru firme: voi filmați 20 de minute cu telefonul, restul fac eu. Ați încerca un clip de probă, 39 €?",
      `Dacă sunt interesați: ${VIZITA_SALA}`,
    ],
  },
  {
    potrivire: /power kick/i,
    script: [
      DESCHIDERE_SALA,
      "Site-ul vostru arată foarte bine. Am văzut însă că pe Google aveți 25 de recenzii, iar alte săli din Sibiu au peste 200. Cine compară vede întâi Google. Pot să vă pun profilul la punct, costă 149 €.",
      `Dacă sunt interesați: ${VIZITA_SALA}`,
    ],
  },
];

/** Fraza dintre ghilimele din nota lead-ului; fara ghilimele, toata nota. */
function observatie(nota: string): string {
  return nota.match(/„([\s\S]*?)”/)?.[1] ?? nota.trim();
}

export function scriptApel(lead: LeadScript): string[] {
  const sala = SALI.find((s) => s.potrivire.test(lead.nume));
  if (sala) return sala.script;

  const obs = observatie(lead.nota_personalizare ?? "");
  const urgente = lead.nisa === "Instalator" || /deblo|interven|non stop/i.test(lead.nume);

  if (urgente) {
    return [
      "Bună ziua, sunt Șerban de la Nova Visio Tech, din Sibiu. Fac site-uri pentru firme mici. Vă rețin un minut?",
      `${obs} La urgențe omul sună primul număr care îi inspiră încredere. O pagină cu poze, zonele unde ajungeți și un buton mare de apel face diferența. Pornește de la 260 €. Vă trimit pe WhatsApp un exemplu, să vedeți cum arată?`,
    ];
  }

  return [
    "Bună ziua, sunt Șerban de la Nova Visio Tech, din Sibiu. Fac site-uri pentru firme mici. Vă rețin un minut?",
    `${obs} Cine compară trei firme caută poze, ce faceți, prețuri. Dacă nu le găsește la voi, sună la următorul. Fac o pagină simplă: ce faceți, poze, prețuri orientative, buton de apel și WhatsApp, harta. Pornește de la 260 €. Vă trimit pe WhatsApp un exemplu, să vedeți cum arată?`,
  ];
}
