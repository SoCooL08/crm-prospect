// Cadenta de 7 atingeri (sectiunea 6.6) + mesajele de care ai nevoie in prima
// saptamana. Actualizata pe 6 nov 2026 pe oferta curenta: pagina de la 260 €,
// fara auditul video. Mesajele nu cer numele, fiindca lead-urile noi nu il au.
//
// 80% din vanzarile din cold calling se inchid intre atingerea 4 si 8.
// Majoritatea celor care fac cold calling se opresc la 2. De asta cadenta e
// mai importanta decat scriptul.

export type Canal = "WhatsApp" | "Apel" | "Email";

export type MesajCadenta = {
  id: string;
  atingere: number | null;   // null = mesaj din afara cadentei de 7
  titlu: string;
  cand: string;
  canal: Canal;
  subiect?: string;
  text: string;
  nota?: string;
};

export const CADENTA: MesajCadenta[] = [
  {
    id: "a1",
    atingere: 1,
    titlu: "Apelul principal",
    cand: "ziua 0",
    canal: "Apel",
    text: "Scriptul principal: deschidere, observația de pe card, întrebarea, oferta. Îl ai în ecranul Apelare, la „Scriptul”.",
    nota: "Vinzi pagina simplă, de la 260 €. La sălile din Sibiu ceri o vizită de 10 minute.",
  },
  {
    id: "a2",
    atingere: 2,
    titlu: "Exemplul și prețurile",
    cand: "ziua 0, imediat după apel",
    canal: "WhatsApp",
    text:
`Bună ziua, sunt Șerban Hila de la Nova Visio Tech, cum am vorbit la telefon. Așa arată o pagină făcută de mine:
https://demo.novavisiotech.ro/denttara-vut22/

Prețurile sunt aici:
https://novavisiotech.ro/preturi/

Dacă vă place, vă spun ce am nevoie ca să pornim.`,
    nota: "Trimite doar dacă ți-au spus la telefon că pot primi mesajul.",
  },
  {
    id: "a3",
    atingere: 3,
    titlu: "Ați apucat să vă uitați?",
    cand: "+2 zile",
    canal: "Apel",
    text:
`„Bună ziua, Șerban de la Nova Visio Tech. V-am trimis pe WhatsApp exemplul și prețurile. Ați apucat să vă uitați?”

DACĂ DA → „Ce v-a atras atenția cel mai mult?”
   (taci și ascultă, răspunsul îți spune ce să propui)

DACĂ NU → „E în regulă. Când vă prind mai bine, azi după-amiază sau mâine dimineață?”`,
  },
  {
    id: "a4",
    atingere: 4,
    titlu: "Ce am mai văzut",
    cand: "+5 zile",
    canal: "WhatsApp",
    text:
`Bună ziua, nu vă deranjez cu vânzare.

Mi-am amintit de discuția noastră și am căutat pe Google „{nisa} {oras}”, ca un client. Am văzut că [ce ai văzut concret azi].

Atât voiam să vă arăt.`,
    nota: "Scrie doar ce ai văzut tu în ziua aia, fără cifre inventate. Fără întrebare la final: mesajul nu cere nimic.",
  },
  {
    id: "a5",
    atingere: 5,
    titlu: "Unghi complet nou",
    cand: "+9 zile",
    canal: "Apel",
    text:
`„Bună ziua, Șerban de la Nova Visio Tech. Vă sun cu altceva decât data trecută.

M-am uitat din nou și am observat că [alt lucru, pe care nu l-ai spus la primul apel]. Asta e de fapt mai urgent decât ce v-am spus data trecută, pentru că [motiv concret].

Vă fur 3 minute să vă explic sau vă trimit tot pe WhatsApp?”`,
    nota: "Uită-te din nou pe profilul lor înainte să suni și nu repeta prima observație. Dacă pagina li s-a părut mult, propui profilul de Google, 149 €.",
  },
  {
    id: "a6",
    atingere: 6,
    titlu: "Valoare pură, zero vânzare",
    cand: "+16 zile",
    canal: "Email",
    subiect: "12 lucruri de verificat pe site înainte de Black Friday",
    text:
`Bună ziua,

Nu vă scriu ca să vă vând ceva. Am făcut un checklist pe care îl folosesc când pregătesc un magazin sau un site de firmă pentru sezonul de final de an. Sunt 12 puncte, le puteți verifica singur în 20 de minute sau le poate verifica cine se ocupă de site la dumneavoastră:

[link către articolul de pe blog]

Punctul 4 e cel pe care îl ratează aproape toată lumea și e și cel mai scump.

Dacă aveți întrebări pe vreunul dintre ele, răspundeți la mail și vă spun ce știu, fără obligații.

Numai bine,
Șerban — Nova Visio Tech, Sibiu
novavisiotech.ro

—
Dacă preferați să nu mai primiți mesaje de la mine, răspundeți cu „STOP” și vă scot din listă.`,
    nota: "Opt-out-ul e obligatoriu la email rece către persoane juridice (interes legitim). Nu-l scoate.",
  },
  {
    id: "a7",
    atingere: 7,
    titlu: "Închid dosarul",
    cand: "+25 zile",
    canal: "WhatsApp",
    text:
`Bună ziua,

V-am căutat de câteva ori și nu am reușit să vorbim. Probabil nu e momentul, ceea ce e absolut în regulă. Închid subiectul din partea mea și nu vă mai deranjez.

Dacă vreodată devine relevant, aveți numărul meu.

Toate bune!`,
    nota: "Cele mai mari rate de răspuns din toată cadența. Oamenii răspund când presiunea dispare. Dacă tot nimic → NURTURE, revii în 90 de zile.",
  },
];

export const MESAJE_EXTRA: MesajCadenta[] = [
  {
    id: "x_reactivare",
    atingere: null,
    titlu: "Reactivare client vechi",
    cand: "banii cei mai rapizi din tot planul",
    canal: "Apel",
    text:
`„Bună ziua, domnule {nume}, Șerban de la Nova Visio Tech. Nu vă sun cu vreo problemă — vă sun să vă întreb cum merge site-ul de când l-am făcut.”

(ascultă)

„Vă spun de ce v-am sunat de fapt: am făcut o verificare pe site-urile pe care le administrez și am observat [ceva concret: plugin-uri vechi, viteză scăzută, fără backup].

Am început să ofer un pachet de mentenanță la 49 de euro pe lună — update-uri, backup zilnic, monitorizare și o oră de modificări incluse. Vreți să vi-l activez?”

(și, indiferent de răspuns:)

„Încă ceva, dacă tot v-am prins: ați fi dispus să-mi dați un testimonial scurt, 2 minute filmat pe telefonul dumneavoastră? Și dacă vă vine în minte cineva care ar avea nevoie de un site, mi-ar folosi enorm o recomandare.”`,
    nota: "Fă asta în prima săptămână. Un apel, trei rezultate: CARE, testimonial, recomandare.",
  },
  {
    id: "x_confirmare",
    atingere: null,
    titlu: "Confirmare discuție de 20 de minute",
    cand: "după ce a acceptat meeting-ul",
    canal: "WhatsApp",
    text:
`Perfect, domnule {nume}. Am blocat [zi], ora [oră]. Durează 20 de minute, vă sun eu pe numărul ăsta.

Nu am prezentare și nu am PDF — vă arăt pe ecran ce văd și vă spun concret ce aș face, în ce ordine și cât costă.

Ca să nu pierdem timp: aveți acces la Google Analytics sau la contul de Google Business? Dacă da, aruncați-le un ochi înainte, ne ajută pe amândoi.`,
  },
  {
    id: "x_growth60",
    atingere: null,
    titlu: "Ofertă GROWTH la 60 de zile de la lansare",
    cand: "ziua 60 după lansare",
    canal: "Apel",
    text:
`„Domnule {nume}, s-au făcut două luni de la lansare. M-am uitat în Google Analytics înainte să vă sun.

Aveți [N] vizitatori pe lună și [M] care v-au contactat. Cifra e [bună/ok] pentru un site nou. Problema e că aproape toți vin din căutări pe numele firmei — adică oameni care vă știau deja. Zero din oameni care nu vă cunoșteau.

Asta se rezolvă, dar nu de la sine. Vă fur 15 minute săptămâna asta să vă arăt ce s-ar schimba în 6 luni?”`,
    nota: "Aici vinzi SEO 390 sau FULL GROWTH 790. Ai date reale, nu promisiuni.",
  },
];

export type ContextMesaj = {
  nume?: string | null;
  firma?: string | null;
  site?: string | null;
  nisa?: string | null;
  oras?: string | null;
  link?: string | null;
};

/** Inlocuieste variabilele cunoscute. Ce nu stim ramane vizibil ca {variabila}. */
export function completeaza(text: string, ctx: ContextMesaj): string {
  const v: Record<string, string | null | undefined> = {
    nume: ctx.nume,
    firma: ctx.firma,
    site: ctx.site,
    nisa: ctx.nisa?.toLowerCase(),
    oras: ctx.oras,
    link: ctx.link,
  };
  return text.replace(/\{(\w+)\}/g, (m, k) => {
    const val = v[k];
    return val ? String(val) : m;
  });
}

/** Ce a ramas necompletat — se evidentiaza in interfata, ca sa nu trimiti {nume}. */
export function lipsuri(text: string): string[] {
  return [...new Set([...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))];
}
