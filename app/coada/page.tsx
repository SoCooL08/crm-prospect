"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Phone, PhoneOff, Loader2, ExternalLink, Star, Globe2, Globe, MapPin,
  AlertTriangle, ChevronRight, SkipForward, Play, CheckCircle2, Clock,
  MessageCircle, Ban, X, BookOpen, ChevronDown,
} from "lucide-react";
import {
  REZULTATE, ConfigRezultat, MOTIVE_PIERDERE, configRezultat,
  calculScorAudit, semnaleBifate, prioritateAudit, PRIORITATE_UI,
  labelStadiu, uiStadiu, SCOR_AUDIT_MAX,
} from "@/lib/stadii";
import { scriptApel } from "@/lib/script-apel";

// ─── Tipuri ──────────────────────────────────────────────────────────────────

type LeadCoada = {
  id: string;
  nume: string;
  telefon: string | null;
  telefon_secundar: string | null;
  website: string | null;
  are_website: boolean;
  adresa: string | null;
  oras: string | null;
  judet: string | null;
  nisa: string | null;
  rating: number | null;
  nr_reviews: number | null;
  scor: number | null;
  scor_viteza: number | null;
  status: string;
  nota_personalizare: string | null;
  scor_audit: number | null;
  audit_semnale: Record<string, boolean> | null;
  nume_decident: string | null;
  functie_decident: string | null;
  nr_atingeri: number | null;
  data_urmatoarei_actiuni: string | null;
};

type Bilant = { apeluri: number; interesati: number; nuRaspund: number; refuzuri: number; callbackuri: number };

// ─── Helperi ─────────────────────────────────────────────────────────────────

/** 0745 123 456 -> +40745123456, pentru wa.me */
function telInternational(tel: string): string {
  const cifre = tel.replace(/\D/g, "");
  if (cifre.startsWith("40")) return `+${cifre}`;
  if (cifre.startsWith("0")) return `+4${cifre}`;
  return `+40${cifre}`;
}

function inputDateTime(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function maine(ora = 9, minut = 30): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  if (d.getDay() === 6) d.setDate(d.getDate() + 2);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  d.setHours(ora, minut, 0, 0);
  return d;
}

function pesteOre(ore: number): Date {
  const d = new Date();
  d.setHours(d.getHours() + ore, 0, 0, 0);
  return d;
}

function cronometru(secunde: number): string {
  const m = Math.floor(secunde / 60);
  const s = secunde % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Cadenta de 7 atingeri (sectiunea 6.6) — ce spui la atingerea curenta. */
function ghidAtingere(nr: number): string | null {
  switch (nr) {
    case 1: return "Atingerea 1 — primul apel. Citești scriptul de mai jos.";
    case 2:
    case 3: return "Atingerea 3 — „V-am trimis pe WhatsApp exemplul și prețurile. Ați apucat să vă uitați? Ce v-a atras atenția?”";
    case 4:
    case 5: return "Atingerea 5 — unghi nou: alt lucru observat pe profilul lor, sau profilul de Google, 149 €.";
    case 6:
    case 7: return "Atingerea 7 — „Închid dosarul”. Presiunea dispare, aici sunt cele mai mari rate de răspuns.";
    default: return nr > 7 ? "Peste 7 atingeri — mută-l în Nurture și revii în 90 de zile." : null;
  }
}

// ─── Scriptul, mereu la îndemână ────────────────────────────────────────────

function StripScript({ lead }: { lead: LeadCoada }) {
  const [open, setOpen] = useState(false);
  const sala = lead.nisa === "Sala de sport";

  return (
    <div className="border-t border-slate-800 bg-slate-900 text-slate-300 shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide hover:bg-slate-800 transition-colors"
      >
        <BookOpen className="w-3.5 h-3.5" />
        Obiecții și prețuri
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        <span className="ml-auto font-normal normal-case tracking-normal text-slate-500">
          stai în picioare · nu ești „gata” niciodată
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs leading-relaxed max-h-[50vh] overflow-y-auto">
          <div className="bg-slate-800/60 rounded-xl p-3 md:col-span-3">
            <p className="text-slate-500 font-semibold uppercase mb-1.5">Obiecții</p>
            {!sala && <p className="mb-1"><b className="text-white">„Cum lucrați, că nu sunteți de aici?”</b> „Lucrez de la distanță: totul se face pe WhatsApp și la telefon. Pozele le faceți cu telefonul, vă spun eu ce să pozați.”</p>}
            <p><b className="text-white">„E scump.”</b> „Pagina se plătește o singură dată. Se poate și în 2 rate, 130 € + 130 €. Dacă vreți să începem mai mic, profilul de Google e 149 €.”</p>
            <p className="mt-1"><b className="text-white">„Avem Facebook.”</b> „Pe Facebook vă găsesc cei care vă știu deja. Pe Google vă caută cei care încă nu vă știu.”</p>
            <p className="mt-1"><b className="text-white">{sala ? "„Avem destui membri.”" : "„Avem destui clienți.”"}</b> {sala ? "„Foarte bine. Atunci rămâne pentru perioadele mai slabe, vara de exemplu. Vă las numărul?”" : "„Foarte bine. Atunci rămâne pentru când vreți să alegeți voi lucrările. Vă las numărul pe WhatsApp?”"}</p>
            <p className="mt-1"><b className="text-white">„Avem pe cineva pentru site.”</b> „Perfect, nu încerc să-l înlocuiesc. Vă pot trimite ce am observat, ca să-i transmiteți.”</p>
            <p className="mt-1"><b className="text-white">„Trimiteți mail.”</b> „Sigur. Pe ce adresă? Vă trimit azi o pagină cu ce am văzut și prețul.”</p>
            <p className="mt-1"><b className="text-white">„N-am timp.”</b> „Când vă prind mai bine, azi după-amiază sau mâine dimineață?”</p>
            {sala && <p className="mt-1"><b className="text-white">„Vrem mai multe pagini.”</b> „Pentru primele 3 săli din Sibiu fac 3 pagini la 390 €, în loc de 550 €, în 3 rate: 150 + 120 + 120.”</p>}
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3">
            <p className="text-slate-500 font-semibold uppercase mb-1.5">Prețuri</p>
            <p>Pagină: <b className="text-white">260 €</b> (130 + 130)</p>
            <p>Site Start: <b className="text-white">550 €</b> (250 + 150 + 150)</p>
            <p>Profil Google: <b className="text-white">149 €</b></p>
            <p>Mentenanță: <b className="text-white">49 €/lună</b></p>
            <p className="mt-1.5 text-slate-400">Nu promite locul 1 pe Google, rezultate în bani sau termene sub 5 zile lucrătoare.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dialog de rezultat ─────────────────────────────────────────────────────

function DialogRezultat({
  cfg, lead, onAnuleaza, onConfirma, salvand,
}: {
  cfg: ConfigRezultat;
  lead: LeadCoada;
  onAnuleaza: () => void;
  onConfirma: (p: { nota: string; urmator_followup?: string; motiv_pierdere?: string }) => void;
  salvand: boolean;
}) {
  const [nota, setNota] = useState("");
  const [data, setData] = useState(() =>
    inputDateTime(cfg.cheie === "callback" ? pesteOre(3) : maine())
  );
  const [motiv, setMotiv] = useState<string>(MOTIVE_PIERDERE[0]);
  const refNota = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { refNota.current?.focus(); }, []);

  function confirma() {
    if (cfg.cereData && !data) return;
    onConfirma({
      nota,
      urmator_followup: cfg.cereData ? new Date(data).toISOString() : undefined,
      motiv_pierdere: cfg.cereMotiv ? motiv : undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">
            {cfg.label} — <span className="text-slate-500 font-normal">{lead.nume}</span>
          </h3>
          <button onClick={onAnuleaza} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {cfg.cereMotiv && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Motiv pierdere — obligatoriu
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MOTIVE_PIERDERE.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMotiv(m)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors text-left ${
                      motiv === m
                        ? "bg-red-50 text-red-700 border-red-300"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {cfg.cereData && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Data următoarei acțiuni — obligatorie
              </label>
              <input
                type="datetime-local"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2 mt-2">
                {[
                  { l: "Mâine 09:30", d: () => maine() },
                  { l: "În 3 ore", d: () => pesteOre(3) },
                  { l: "Peste 2 zile", d: () => { const x = maine(); x.setDate(x.getDate() + 1); return x; } },
                  { l: "Peste o săptămână", d: () => { const x = maine(); x.setDate(x.getDate() + 6); return x; } },
                ].map((o) => (
                  <button
                    key={o.l}
                    onClick={() => setData(inputDateTime(o.d()))}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Notă {cfg.cheie === "interesat" && <span className="font-normal normal-case text-slate-400">— ce a spus, cu cuvintele lui</span>}
            </label>
            <textarea
              ref={refNota}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) confirma(); }}
              placeholder="Ex: a zis că are deja pe cineva, dar nu primește raport lunar. Trimit exemplul pe WhatsApp."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onAnuleaza}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Înapoi
          </button>
          <button
            onClick={confirma}
            disabled={salvand}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors ${cfg.clasa}`}
          >
            {salvand ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
            Salvează și treci la următorul
            <span className="text-xs font-normal opacity-70">Ctrl+Enter</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pagina ─────────────────────────────────────────────────────────────────

export default function CoadaApelare() {
  const [coada, setCoada] = useState<LeadCoada[]>([]);
  const [meta, setMeta] = useState({ scadente: 0, noi: 0 });
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState("");

  const [pornit, setPornit] = useState(false);
  const [idx, setIdx] = useState(0);
  const [dialog, setDialog] = useState<ConfigRezultat | null>(null);
  const [salvand, setSalvand] = useState(false);
  const [bilant, setBilant] = useState<Bilant>({ apeluri: 0, interesati: 0, nuRaspund: 0, refuzuri: 0, callbackuri: 0 });

  // Setari de bloc
  const [tinta, setTinta] = useState(40);
  const [includeBrut, setIncludeBrut] = useState(false);
  const [scorMinim, setScorMinim] = useState(8);

  const [secunde, setSecunde] = useState(0);

  const incarca = useCallback(async () => {
    setLoading(true);
    setEroare("");
    const p = new URLSearchParams({
      includeBrut: String(includeBrut),
      scorMinim: String(scorMinim),
      limit: "80",
    });
    try {
      const r = await fetch(`/api/coada?${p}`);
      const d = await r.json();
      if (d.error) { setEroare(d.error); setCoada([]); }
      else { setCoada(d.coada ?? []); setMeta({ scadente: d.scadente ?? 0, noi: d.noi ?? 0 }); }
    } catch {
      setEroare("Nu am putut încărca coada.");
    }
    setLoading(false);
  }, [includeBrut, scorMinim]);

  useEffect(() => { incarca(); }, [incarca]);

  // Cronometrul blocului
  useEffect(() => {
    if (!pornit) return;
    const t = setInterval(() => setSecunde((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [pornit]);

  const lead = coada[idx];
  const gata = pornit && !lead;

  const trimiteRezultat = useCallback(
    async (cfg: ConfigRezultat, extra: { nota?: string; urmator_followup?: string; motiv_pierdere?: string; do_not_call?: boolean }) => {
      if (!lead) return;
      setSalvand(true);
      try {
        const r = await fetch("/api/coada/rezultat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lead_id: lead.id, rezultat: cfg.cheie, ...extra }),
        });
        const d = await r.json();
        if (!r.ok) { setEroare(d.mesaj || d.error || "Nu am putut salva."); setSalvand(false); return; }

        setBilant((b) => ({
          apeluri: b.apeluri + 1,
          interesati: b.interesati + (cfg.cheie === "interesat" ? 1 : 0),
          nuRaspund: b.nuRaspund + (cfg.cheie === "nu_raspunde" ? 1 : 0),
          refuzuri: b.refuzuri + (cfg.cheie === "nu" ? 1 : 0),
          callbackuri: b.callbackuri + (cfg.cheie === "callback" ? 1 : 0),
        }));
        setDialog(null);
        setEroare("");
        setIdx((i) => i + 1);
      } catch {
        setEroare("Conexiune pierdută — rezultatul nu s-a salvat.");
      }
      setSalvand(false);
    },
    [lead]
  );

  function alegeRezultat(cfg: ConfigRezultat) {
    if (cfg.cereData || cfg.cereMotiv) { setDialog(cfg); return; }
    // Nu răspunde — zero fricțiune, data se pune automat la +2 zile lucrătoare.
    trimiteRezultat(cfg, {});
  }

  async function marcheazaDNC() {
    const cfg = configRezultat("nu");
    if (!lead || !cfg) return;
    if (!confirm(`„${lead.nume}” a cerut să nu mai fie contactat?\n\nSe marchează permanent Do Not Call și nu mai apare niciodată în coadă.`)) return;
    await trimiteRezultat(cfg, { do_not_call: true, motiv_pierdere: "Do Not Call", nota: "A cerut să nu mai fie contactat (RNO / GDPR)." });
  }

  // Scurtături de tastatură
  useEffect(() => {
    if (!pornit || dialog || !lead) return;
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const cfg = REZULTATE.find((r) => r.tasta === e.key);
      if (cfg) { e.preventDefault(); alegeRezultat(cfg); return; }
      if (e.key === "s" || e.key === "S") { e.preventDefault(); setIdx((i) => i + 1); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pornit, dialog, lead]); // eslint-disable-line react-hooks/exhaustive-deps

  const scorAudit = lead ? (lead.scor_audit ?? calculScorAudit(lead.audit_semnale)) : 0;
  const prioritate = prioritateAudit(scorAudit);
  const bifate = useMemo(() => semnaleBifate(lead?.audit_semnale), [lead]);
  const atingere = (lead?.nr_atingeri ?? 0) + 1;
  const ghid = ghidAtingere(atingere);

  // ── Ecran de start ────────────────────────────────────────────────────────

  if (!pornit) {
    return (
      <div className="p-8 max-w-2xl">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <Phone className="w-6 h-6 text-emerald-500" /> Coadă de apelare
        </h1>
        <p className="text-slate-500 text-sm mt-1 mb-7">
          Blocurile tale: marți–joi, 09:30–11:30 și 15:30–17:30. Telefonul pe silențios pentru orice altceva. Blocul e sacru.
        </p>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-500 py-8">
            <Loader2 className="w-4 h-4 animate-spin" /> Construiesc coada...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <p className="text-3xl font-black text-slate-900">{coada.length}</p>
                <p className="text-xs text-slate-500 mt-1">în coadă</p>
              </div>
              <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm">
                <p className="text-3xl font-black text-amber-600">{meta.scadente}</p>
                <p className="text-xs text-slate-500 mt-1">urmăriri scadente</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <p className="text-3xl font-black text-slate-900">{meta.noi}</p>
                <p className="text-xs text-slate-500 mt-1">primul apel</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-5 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Ținta blocului</p>
                  <p className="text-xs text-slate-400">40 de apeluri per bloc de 2 ore</p>
                </div>
                <input
                  type="number"
                  value={tinta}
                  onChange={(e) => setTinta(Number(e.target.value))}
                  className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Scor minim de audit</p>
                  <p className="text-xs text-slate-400">Regula din plan: 8+ suni, 12+ suni primul</p>
                </div>
                <input
                  type="number"
                  value={scorMinim}
                  onChange={(e) => setScorMinim(Number(e.target.value))}
                  className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Include lead-uri nescanate</p>
                  <p className="text-xs text-slate-400">Doar dacă rămâi fără coadă. Un apel fără observație specifică e un apel slab.</p>
                </div>
                <input
                  type="checkbox"
                  checked={includeBrut}
                  onChange={(e) => setIncludeBrut(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 shrink-0"
                />
              </label>
            </div>

            {eroare && <p className="text-sm text-red-600 mb-4">{eroare}</p>}

            {coada.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
                <p className="font-semibold mb-1">Coada e goală.</p>
                <p>
                  Scanează lead-uri (audit 90 sec) din{" "}
                  <Link href="/leads" className="underline font-medium">Leaduri</Link>, trece-le pe „2 · Calificat”
                  și dă-le notă de personalizare. Sau bifează „include lead-uri nescanate” mai sus.
                </p>
              </div>
            ) : (
              <button
                onClick={() => { setPornit(true); setSecunde(0); }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-6 py-5 text-lg font-bold flex items-center justify-center gap-3 transition-colors shadow-sm"
              >
                <Play className="w-5 h-5" /> Începe apelarea
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  // ── Ecran de final ────────────────────────────────────────────────────────

  if (gata) {
    const conversatii = bilant.interesati + bilant.refuzuri + bilant.callbackuri;
    return (
      <div className="p-8 max-w-2xl">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2 mb-1">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Bloc terminat
        </h1>
        <p className="text-slate-500 text-sm mb-7">
          {cronometru(secunde)} · {bilant.apeluri} apeluri
          {bilant.apeluri > 0 && ` · ${Math.round((conversatii / bilant.apeluri) * 100)}% rată de contact`}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { l: "Apeluri", v: bilant.apeluri, c: "text-slate-900" },
            { l: "Interesați", v: bilant.interesati, c: "text-emerald-600" },
            { l: "Callback", v: bilant.callbackuri, c: "text-amber-600" },
            { l: "Nu răspund", v: bilant.nuRaspund, c: "text-slate-500" },
          ].map((x) => (
            <div key={x.l} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className={`text-3xl font-black ${x.c}`}>{x.v}</p>
              <p className="text-xs text-slate-500 mt-1">{x.l}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-5">
          <p className="text-sm text-slate-700">
            {bilant.apeluri >= tinta
              ? "Ai făcut numărul. Asta e singurul lucru pe care îl controlezi 100%."
              : `Ținta era ${tinta}. Ai făcut ${bilant.apeluri}. Diferența nu se recuperează mâine — se adaugă.`}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setPornit(false); setIdx(0); setBilant({ apeluri: 0, interesati: 0, nuRaspund: 0, refuzuri: 0, callbackuri: 0 }); incarca(); }}
            className="flex-1 bg-slate-900 hover:bg-slate-700 text-white rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
          >
            Coadă nouă
          </button>
          <Link
            href="/azi"
            className="flex-1 text-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
          >
            Vezi urmăririle
          </Link>
        </div>
      </div>
    );
  }

  if (!lead) return null;

  // ── Consola de apelare ────────────────────────────────────────────────────

  const ui = uiStadiu(lead.status);
  const progres = Math.min((bilant.apeluri / tinta) * 100, 100);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100">
      {/* Bara de progres */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="h-1 bg-slate-100">
          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progres}%` }} />
        </div>
        <div className="px-6 py-3 flex items-center gap-5 flex-wrap">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{bilant.apeluri}</span>
            <span className="text-sm text-slate-400">/ {tinta} apeluri</span>
          </div>
          <span className="flex items-center gap-1.5 text-sm text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5" /> {cronometru(secunde)}
          </span>
          <span className="text-sm text-slate-400">
            {coada.length - idx} rămase în coadă
          </span>
          {bilant.interesati > 0 && (
            <span className="text-sm font-semibold text-emerald-600">{bilant.interesati} interesați</span>
          )}
          <button
            onClick={() => setPornit(false)}
            className="ml-auto text-xs font-semibold text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
          >
            Termină blocul
          </button>
        </div>
      </div>

      {/* Cardul */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6">
          {eroare && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {eroare}
            </div>
          )}

          {/* Identificare */}
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div className="min-w-0">
              <h1 className="text-4xl font-black text-slate-900 leading-tight">{lead.nume}</h1>
              <p className="text-slate-500 mt-1">
                {[lead.nisa, lead.oras, lead.judet].filter(Boolean).join(" · ")}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <span className={`text-xs font-black px-3 py-1.5 rounded-lg ${PRIORITATE_UI[prioritate]}`}>
                {prioritate === "MAX" ? "SUNĂ PRIMUL" : prioritate}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-900 text-white">
                audit {scorAudit}/{SCOR_AUDIT_MAX}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg ${ui.badge}`}>
                {labelStadiu(lead.status)}
              </span>
            </div>
          </div>

          {/* Decident */}
          {(lead.nume_decident || lead.functie_decident) && (
            <p className="text-lg text-slate-700 mb-4">
              Ceri pe: <b className="text-slate-900">{lead.nume_decident || "administrator"}</b>
              {lead.functie_decident && <span className="text-slate-400 text-sm"> · {lead.functie_decident}</span>}
            </p>
          )}

          {/* Telefon */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              {lead.telefon ? (
                <a
                  href={`tel:${lead.telefon}`}
                  className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-4 text-2xl font-bold transition-colors"
                >
                  <Phone className="w-6 h-6" /> {lead.telefon}
                </a>
              ) : (
                <span className="text-slate-400 flex items-center gap-2"><PhoneOff className="w-5 h-5" /> fără telefon</span>
              )}
              {lead.telefon_secundar && (
                <a href={`tel:${lead.telefon_secundar}`} className="text-sm text-blue-600 font-medium hover:underline">
                  secundar: {lead.telefon_secundar}
                </a>
              )}
              {lead.telefon && (
                <a
                  href={`https://wa.me/${telInternational(lead.telefon).replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-xl px-3.5 py-2.5 hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              )}
              <span className="ml-auto text-sm text-slate-400">
                atingerea <b className="text-slate-700">{atingere}</b>
              </span>
            </div>
            {ghid && <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">{ghid}</p>}
          </div>

          {/* SCRIPTUL / NOTA DE PERSONALIZARE — cel mai important element din ecran */}
          {lead.nota_personalizare && atingere === 1 ? (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-4">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">
                Scriptul de citit
              </p>
              <p className="text-xl text-slate-900 leading-relaxed font-medium">
                {scriptApel(lead).map((bucata, i, toate) => (
                  <span key={i}>
                    {bucata}
                    {i < toate.length - 1 && (
                      <span className="text-sm font-semibold italic text-amber-700"> (pauză, îl lași să răspundă) </span>
                    )}
                  </span>
                ))}
              </p>
            </div>
          ) : lead.nota_personalizare ? (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-4">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">
                Ce ai observat la primul apel
              </p>
              <p className="text-2xl text-slate-900 leading-snug font-medium">
                {lead.nota_personalizare}
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-800">Fără notă de personalizare.</p>
                <p className="text-sm text-red-700 mt-0.5">
                  Apelul ăsta va suna a telemarketing. Deschide fișa, fă scanul de 90 de secunde, scrie o propoziție — sau sari peste.
                </p>
                <Link href={`/leads/${lead.id}`} target="_blank" className="inline-flex items-center gap-1 text-sm font-semibold text-red-800 underline mt-2">
                  Deschide fișa <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Semnalele bifate */}
          {bifate.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {bifate.map((s) => (
                <span key={s.cheie} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                  {s.chip} <span className="text-slate-400">+{s.puncte}</span>
                </span>
              ))}
            </div>
          )}

          {/* Context */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              {lead.are_website && lead.website ? (
                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 flex items-center gap-1.5 font-medium truncate">
                  <Globe className="w-4 h-4 shrink-0" /> <span className="truncate">{lead.website}</span> <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                <span className="text-red-600 flex items-center gap-2 font-medium"><Globe2 className="w-4 h-4" /> fără website</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
              <b className="text-slate-900">{lead.rating ?? "—"}</b>
              <span className="text-slate-400">· {lead.nr_reviews ?? 0} recenzii</span>
            </div>
            {lead.adresa && (
              <div className="flex items-start gap-2 text-slate-600 col-span-2">
                <MapPin className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" /> <span className="truncate">{lead.adresa}</span>
              </div>
            )}
          </div>

          {/* Actiuni secundare */}
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <Link
              href={`/leads/${lead.id}`}
              target="_blank"
              className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
            >
              Deschide fișa <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setIdx((i) => i + 1)}
              className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" /> Sari peste <kbd className="text-xs bg-slate-200 px-1.5 py-0.5 rounded">S</kbd>
            </button>
            <button
              onClick={marcheazaDNC}
              className="ml-auto text-xs text-slate-400 hover:text-red-600 flex items-center gap-1.5 transition-colors"
            >
              <Ban className="w-3.5 h-3.5" /> Nu mă mai suna (Do Not Call)
            </button>
          </div>
        </div>
      </div>

      {/* Cele 4 butoane */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 shrink-0">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {REZULTATE.map((cfg) => (
            <button
              key={cfg.cheie}
              onClick={() => alegeRezultat(cfg)}
              disabled={salvand}
              className={`rounded-xl px-4 py-4 text-sm font-bold flex flex-col items-center gap-1 disabled:opacity-50 transition-colors ${cfg.clasa}`}
            >
              {cfg.label}
              <kbd className="text-xs font-normal opacity-70">{cfg.tasta}</kbd>
            </button>
          ))}
        </div>
      </div>

      <StripScript lead={lead} />

      {dialog && (
        <DialogRezultat
          cfg={dialog}
          lead={lead}
          salvand={salvand}
          onAnuleaza={() => setDialog(null)}
          onConfirma={(p) => trimiteRezultat(dialog, p)}
        />
      )}
    </div>
  );
}
