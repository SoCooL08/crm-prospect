"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Phone, Globe, Globe2, Star, MapPin, Gauge,
  Loader2, Plus, ArrowLeft, ExternalLink, MessageSquare,
  Link2, CheckCheck, AlertTriangle, LayoutTemplate, ScanSearch, CalendarClock,
} from "lucide-react";
import { etichetaScor, genereazaBrief } from "@/lib/scoring";
import {
  STADII, STADIU_LABEL, uiStadiu, cereNextAction, zileLucratoare,
  SEMNALE_AUDIT, SemnaleAudit, calculScorAudit, prioritateAudit,
  PRIORITATE_UI, SCOR_AUDIT_MAX, MOTIVE_PIERDERE as MOTIVE, FUNCTII,
} from "@/lib/stadii";
import ServiciiBreakdown from "@/components/ServiciiBreakdown";
import ObiectiiPanel from "@/components/ObiectiiPanel";
import GeneratorOferta from "@/components/GeneratorOferta";
import GeneratorEmail from "@/components/GeneratorEmail";

const STATUSURI = STADII;
const TIPURI = ["apel", "email", "intalnire", "nota"];
const MOTIVE_PIERDERE = MOTIVE;

const statusColor = (s: string) => uiStadiu(s).badge;

function inputDateTime(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

const scorBadge = (et: string) =>
  ({
    Fierbinte: "bg-red-50 text-red-700 border border-red-200",
    Cald: "bg-amber-50 text-amber-700 border border-amber-200",
    Rece: "bg-slate-50 text-slate-600 border border-slate-200",
  }[et] ?? "bg-slate-50 text-slate-600 border border-slate-200");

const tipColor = (t: string) =>
  ({
    apel: "bg-blue-50 text-blue-700",
    email: "bg-violet-50 text-violet-700",
    intalnire: "bg-emerald-50 text-emerald-700",
    nota: "bg-slate-100 text-slate-600",
  }[t] ?? "bg-slate-100 text-slate-600");

export default function FisaLead() {
  const params = useParams();
  const id = params.id as string;

  const [lead, setLead] = useState<any>(null);
  const [activitati, setActivitati] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState("");
  const [tip, setTip] = useState("apel");
  const [nota, setNota] = useState("");
  const [followup, setFollowup] = useState("");
  const [salvand, setSalvand] = useState(false);
  const [copiat, setCopiat] = useState(false);
  const [valoare, setValoare] = useState<string>("");
  const [salvandValoare, setSalvandValoare] = useState(false);
  const [verificandSocial, setVerificandSocial] = useState(false);
  const [socialGasit, setSocialGasit] = useState<{ facebook_url?: string; instagram_url?: string; error?: string } | null>(null);

  // Motiv pierdere
  const [motivModal, setMotivModal] = useState(false);
  const [motivSelectat, setMotivSelectat] = useState<string>(MOTIVE_PIERDERE[0]);

  // Scan 90 sec (3.2) + next action (5.4 #2)
  const [semnale, setSemnale] = useState<SemnaleAudit>({});
  const [notaPers, setNotaPers] = useState("");
  const [decident, setDecident] = useState("");
  const [functie, setFunctie] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [salvandAudit, setSalvandAudit] = useState(false);
  const [salvatAudit, setSalvatAudit] = useState(false);

  // Cerere de next action la schimbarea stadiului
  const [nextModal, setNextModal] = useState<string | null>(null);
  const [nextModalData, setNextModalData] = useState("");

  async function incarca() {
    const [resLead, resAct] = await Promise.all([
      fetch(`/api/leads/${id}`),
      fetch(`/api/activitati?leadId=${id}`),
    ]);
    const leadData = await resLead.json();
    const actData = await resAct.json();
    if (leadData.error) { setEroare(leadData.error); setLoading(false); return; }
    setLead(leadData);
    setValoare(leadData.valoare_estimata ? String(leadData.valoare_estimata) : "");
    setSemnale(leadData.audit_semnale ?? {});
    setNotaPers(leadData.nota_personalizare ?? "");
    setDecident(leadData.nume_decident ?? "");
    setFunctie(leadData.functie_decident ?? "");
    setNextAction(
      leadData.data_urmatoarei_actiuni
        ? inputDateTime(new Date(leadData.data_urmatoarei_actiuni))
        : ""
    );
    setActivitati(Array.isArray(actData) ? actData : []);
    setLoading(false);
  }

  useEffect(() => { incarca(); }, [id]);

  async function adaugaActivitate() {
    if (!nota.trim()) return;
    setSalvand(true);
    await fetch("/api/activitati", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_id: id,
        tip,
        nota,
        urmator_followup: followup || null,
      }),
    });
    setNota("");
    setFollowup("");
    setSalvand(false);
    incarca();
  }

  async function schimbaStatus(status: string) {
    if (status === "9b PIERDUT") {
      setMotivModal(true);
      return;
    }
    // 5.4 #2 — un lead atins nu poate ramane fara data urmatoarei actiuni.
    if (cereNextAction(status) && !lead?.data_urmatoarei_actiuni) {
      setNextModalData(inputDateTime(zileLucratoare(2)));
      setNextModal(status);
      return;
    }
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    incarca();
  }

  async function confirmaNextAction() {
    if (!nextModal || !nextModalData) return;
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: nextModal,
        data_urmatoarei_actiuni: new Date(nextModalData).toISOString(),
      }),
    });
    setNextModal(null);
    incarca();
  }

  async function confirmaPierdut() {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "9b PIERDUT",
        motiv_pierdere: motivSelectat,
        data_urmatoarei_actiuni: null,
      }),
    });
    setMotivModal(false);
    incarca();
  }

  async function salveazaAudit() {
    setSalvandAudit(true);
    const patch: Record<string, unknown> = {
      audit_semnale: semnale,
      nota_personalizare: notaPers.trim() || null,
      nume_decident: decident.trim() || null,
      functie_decident: functie || null,
    };
    if (nextAction) patch.data_urmatoarei_actiuni = new Date(nextAction).toISOString();

    // Scanul e facut si scorul trece pragul -> lead-ul devine CALIFICAT si
    // intra automat in coada de apelare (5.2, stadiul 2).
    const scor = calculScorAudit(semnale);
    if (lead?.status === "1 LEAD BRUT" && scor >= 8 && notaPers.trim()) {
      patch.status = "2 CALIFICAT";
    }

    const r = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setSalvandAudit(false);
    if (r.ok) {
      setSalvatAudit(true);
      setTimeout(() => setSalvatAudit(false), 2500);
      incarca();
    }
  }

  async function verificaSocial() {
    setVerificandSocial(true);
    setSocialGasit(null);
    const res = await fetch(`/api/leads/${id}/verifica-social`, { method: "POST" });
    const data = await res.json();
    setSocialGasit(data);
    setVerificandSocial(false);
    if (data.facebook_url || data.instagram_url) incarca();
  }

  async function salveazaValoare() {
    if (!valoare) return;
    setSalvandValoare(true);
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valoare_estimata: Number(valoare) }),
    });
    setSalvandValoare(false);
    incarca();
  }

  if (loading)
    return (
      <div className="p-8 flex items-center gap-2 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" /> Se incarca...
      </div>
    );

  if (eroare || !lead)
    return (
      <div className="p-8">
        <p className="text-red-600 text-sm mb-4">{eroare || "Lead negasit."}</p>
        <Link href="/leads" className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Inapoi la leaduri
        </Link>
      </div>
    );

  const et = etichetaScor(lead.scor);
  const scorAudit = calculScorAudit(semnale);
  const prioritate = prioritateAudit(scorAudit);
  const nextActionLipsa = cereNextAction(lead.status) && !lead.data_urmatoarei_actiuni;
  const brief = genereazaBrief({
    areWebsite: lead.are_website,
    rating: lead.rating,
    reviews: lead.nr_reviews,
    scorViteza: lead.scor_viteza,
    nisa: lead.nisa,
  });

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/leads"
        className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-6 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Toate leadurile
      </Link>

      {/* Modal motiv pierdere */}
      {motivModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-slate-900">De ce s-a pierdut?</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Selecteaza motivul pierderii acestui deal. Ajuta la identificarea pattern-urilor.
            </p>
            <div className="space-y-2 mb-5">
              {MOTIVE_PIERDERE.map((m) => (
                <button
                  key={m}
                  onClick={() => setMotivSelectat(m)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                    motivSelectat === m
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setMotivModal(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Anuleaza
              </button>
              <button
                onClick={confirmaPierdut}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Marcheaza Pierdut
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal next action obligatoriu */}
      {nextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarClock className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-slate-900">Când revii la el?</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Stadiul „{STADIU_LABEL[nextModal as keyof typeof STADIU_LABEL]}” nu se poate salva fără dată de follow-up.
              Un lead fără next action e un lead mort.
            </p>
            <input
              type="datetime-local"
              value={nextModalData}
              onChange={(e) => setNextModalData(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2 mb-5">
              {[
                { l: "+2 zile", z: 2 },
                { l: "+5 zile", z: 5 },
                { l: "+9 zile", z: 9 },
                { l: "+25 zile", z: 25 },
              ].map((o) => (
                <button
                  key={o.l}
                  onClick={() => setNextModalData(inputDateTime(zileLucratoare(o.z)))}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  {o.l}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setNextModal(null)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Anuleaza
              </button>
              <button
                onClick={confirmaNextAction}
                disabled={!nextModalData}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Salveaza
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerta next action lipsa */}
      {nextActionLipsa && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-red-800 text-sm">Lead fără next action.</p>
            <p className="text-xs text-red-700">
              E în „{STADIU_LABEL[lead.status as keyof typeof STADIU_LABEL] ?? lead.status}” dar n-are dată de follow-up. Pune una în blocul de mai jos.
            </p>
          </div>
        </div>
      )}

      {/* Fisa */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-4">
        <div className="flex justify-between items-start gap-4 flex-wrap mb-5">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{lead.nume}</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {lead.nisa} · {lead.oras}, {lead.judet}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/strategie/${id}`}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors"
            >
              <LayoutTemplate className="w-3.5 h-3.5" /> Strategie
            </Link>
            <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${scorBadge(et)}`}>
              {et} · {lead.scor}
            </span>
            <select
              value={lead.status}
              onChange={(e) => schimbaStatus(e.target.value)}
              className={`text-sm rounded-lg px-3 py-1.5 font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusColor(lead.status)}`}
            >
              {STATUSURI.map((s) => <option key={s} value={s}>{STADIU_LABEL[s]}</option>)}
            </select>
          </div>
        </div>

        {/* Motiv pierdere afisat */}
        {lead.status === "9b PIERDUT" && lead.motiv_pierdere && (
          <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Motiv pierdere: <span className="font-semibold">{lead.motiv_pierdere}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm border-t border-slate-100 pt-5">
          <div className="flex items-start gap-2 text-slate-600">
            <MapPin className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
            <span>{lead.adresa || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
            <span>
              <span className="font-semibold text-slate-900">{lead.rating}</span>{" "}
              <span className="text-slate-400">· {lead.nr_reviews} recenzii</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {lead.telefon ? (
              <a href={`tel:${lead.telefon}`} className="text-blue-600 flex items-center gap-2 font-medium">
                <Phone className="w-4 h-4 shrink-0" /> {lead.telefon}
              </a>
            ) : (
              <span className="text-slate-400 flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" /> fara telefon
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {lead.are_website ? (
              <a href={lead.website} target="_blank" className="text-blue-600 flex items-center gap-1.5 font-medium">
                <Globe className="w-4 h-4 shrink-0" /> website <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-red-600 flex items-center gap-2 font-medium">
                <Globe2 className="w-4 h-4 shrink-0" /> fara website
              </span>
            )}
          </div>
          {lead.scor_viteza != null && (
            <div className="flex items-center gap-2 text-slate-600">
              <Gauge className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Viteza site:{" "}
                <b className={lead.scor_viteza < 50 ? "text-red-600" : "text-emerald-600"}>
                  {lead.scor_viteza}/100
                </b>
              </span>
            </div>
          )}
          {/* Social media */}
          <div className="col-span-2 pt-1 border-t border-slate-100 mt-1">
            <div className="flex items-center gap-3 flex-wrap">
              {(lead.facebook_url || (socialGasit?.facebook_url)) && (
                <a
                  href={lead.facebook_url || socialGasit?.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-blue-700 font-medium hover:underline"
                >
                  <span className="w-4 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">f</span>
                  Facebook <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {(lead.instagram_url || (socialGasit?.instagram_url)) && (
                <a
                  href={lead.instagram_url || socialGasit?.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-pink-700 font-medium hover:underline"
                >
                  <span className="w-4 h-4 bg-gradient-to-br from-pink-500 to-violet-600 rounded text-white text-xs flex items-center justify-center">📷</span>
                  Instagram <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {lead.are_website && !lead.facebook_url && !socialGasit?.facebook_url && (
                <button
                  onClick={verificaSocial}
                  disabled={verificandSocial}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  {verificandSocial ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Caut socials...</>
                  ) : (
                    <><Link2 className="w-3.5 h-3.5" /> Detecteaza FB / Instagram</>
                  )}
                </button>
              )}
              {socialGasit && !socialGasit.facebook_url && !socialGasit.instagram_url && !socialGasit.error && (
                <span className="text-xs text-slate-400">Nu s-au găsit linkuri sociale pe site.</span>
              )}
              {socialGasit?.error && (
                <span className="text-xs text-red-500">{socialGasit.error}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 col-span-2 pt-1 border-t border-slate-100 mt-1">
            <span className="text-slate-400 text-sm shrink-0">Valoare estimata deal:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={valoare}
                onChange={(e) => setValoare(e.target.value)}
                onBlur={salveazaValoare}
                onKeyDown={(e) => e.key === "Enter" && salveazaValoare()}
                placeholder="ex. 1500"
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-slate-500 text-sm font-medium">€</span>
              {salvandValoare && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
              {lead.valoare_estimata && !salvandValoare && (
                <span className="text-xs text-emerald-600 font-semibold">
                  {Number(lead.valoare_estimata).toLocaleString("ro-RO")} € salvat
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scan 90 sec — alimenteaza coada de apelare */}
      <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 shadow-sm mb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <ScanSearch className="w-4 h-4 text-amber-500" /> Scan 90 secunde
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-900 text-white">
              {scorAudit}/{SCOR_AUDIT_MAX}
            </span>
            <span className={`text-xs font-black px-3 py-1.5 rounded-lg ${PRIORITATE_UI[prioritate]}`}>
              {prioritate === "MAX" ? "SUNĂ PRIMUL" : prioritate}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Bifezi ce vezi în 90 de secunde. Scor 8+ → suni. 12+ → suni primul. Lead-urile calificate intră automat în coada de apelare.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-5">
          {SEMNALE_AUDIT.map((s) => (
            <label
              key={s.cheie}
              className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                semnale[s.cheie]
                  ? "bg-amber-50 border-amber-200"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <input
                type="checkbox"
                checked={!!semnale[s.cheie]}
                onChange={(e) => setSemnale((p) => ({ ...p, [s.cheie]: e.target.checked }))}
                className="w-4 h-4 mt-0.5 accent-amber-500 shrink-0"
              />
              <span className="min-w-0">
                <span className="text-sm text-slate-800 leading-snug block">{s.label}</span>
                <span className="text-xs text-slate-400">{s.cum} · +{s.puncte}</span>
              </span>
            </label>
          ))}
        </div>

        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
          Nota de personalizare — o propoziție, o spui la telefon
        </label>
        <textarea
          value={notaPers}
          onChange={(e) => setNotaPers(e.target.value)}
          placeholder="Ex: site din 2015, PageSpeed mobil 23, rulează Meta Ads către homepage, 7 recenzii față de 180 la concurentul de pe Turnului."
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none mb-4"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Decident</label>
            <input
              value={decident}
              onChange={(e) => setDecident(e.target.value)}
              placeholder="Nume complet"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Funcție</label>
            <select
              value={functie}
              onChange={(e) => setFunctie(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">—</option>
              {FUNCTII.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Next action {cereNextAction(lead.status) && <span className="text-red-500">*</span>}
            </label>
            <input
              type="datetime-local"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                nextActionLipsa ? "border-red-300 bg-red-50" : "border-slate-200"
              }`}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={salveazaAudit}
            disabled={salvandAudit || (cereNextAction(lead.status) && !nextAction)}
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {salvandAudit ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
            Salvează scanul
          </button>
          {salvatAudit && <span className="text-sm text-emerald-600 font-medium">Salvat.</span>}
          {cereNextAction(lead.status) && !nextAction && (
            <span className="text-xs text-red-600">Pune o dată de next action ca să poți salva.</span>
          )}
        </div>
      </div>

      {/* Analiza oportunitate */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-4">
        <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <span className="text-base">📊</span> Analiza oportunitate
        </h2>
        <ServiciiBreakdown
          semnale={{ areWebsite: lead.are_website, rating: lead.rating, reviews: lead.nr_reviews, scorViteza: lead.scor_viteza, nisa: lead.nisa }}
        />
      </div>

      {/* Scripturi obiectii */}
      <ObiectiiPanel
        semnale={{ areWebsite: lead.are_website, rating: lead.rating, reviews: lead.nr_reviews, scorViteza: lead.scor_viteza, nisa: lead.nisa }}
      />

      {/* Generator oferta */}
      <GeneratorOferta
        semnale={{ areWebsite: lead.are_website, rating: lead.rating, reviews: lead.nr_reviews, scorViteza: lead.scor_viteza, nisa: lead.nisa }}
        numeLead={lead.nume}
        telefon={lead.telefon}
      />

      {/* Generator email */}
      <GeneratorEmail
        semnale={{ areWebsite: lead.are_website, rating: lead.rating, reviews: lead.nr_reviews, scorViteza: lead.scor_viteza, nisa: lead.nisa }}
        numeLead={lead.nume}
      />

      {/* Brief cold calling */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-4">
        <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-500" /> Brief cold calling
        </h2>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {brief.cuvinte_cheie.map((k) => (
            <span key={k} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-medium">
              {k}
            </span>
          ))}
        </div>
        <div className="space-y-3">
          {[
            { t: "1 · Deschidere — 8 sec", v: brief.deschidere, bg: "bg-slate-50 border-slate-100", lbl: "text-slate-400", txt: "text-slate-700 italic" },
            { t: "2 · Motivul — 15 sec · aici e tot apelul", v: notaPers.trim() ? `„Vă sun direct la obiect. M-am uitat înainte să vă sun pe site-ul ${lead.nume} și am observat că ${notaPers.trim()}”` : brief.observatie, bg: "bg-amber-50 border-amber-200", lbl: "text-amber-600", txt: "text-slate-900 font-medium" },
            { t: "3 · Micro-întrebare — 10 sec", v: brief.micro_intrebare, bg: "bg-slate-50 border-slate-100", lbl: "text-slate-400", txt: "text-slate-700 italic" },
            { t: "4 · CTA — nu vinzi site, vinzi auditul", v: brief.pitch, bg: "bg-blue-50 border-blue-100", lbl: "text-blue-400", txt: "text-blue-900" },
            { t: "5 · Confirmare + ancorare", v: brief.confirmare, bg: "bg-emerald-50 border-emerald-100", lbl: "text-emerald-500", txt: "text-emerald-900" },
          ].map((sec) => (
            <div key={sec.t} className={`rounded-xl p-4 border ${sec.bg}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1.5 ${sec.lbl}`}>{sec.t}</p>
              <p className={`text-sm leading-relaxed ${sec.txt}`}>{sec.v}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Nu improviza în primele 300 de apeluri. Dacă nota de personalizare e completată în scanul de 90 sec, pasul 2 o folosește automat.
        </p>
      </div>

      {/* Audit Report */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-4">
        <h2 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-violet-500" /> Audit Report
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Trimite prospectului un raport personalizat cu problemele detectate si serviciile recomandate.
          Se deschide fara login — ideal de trimis pe WhatsApp in timpul apelului.
        </p>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <span className="text-xs text-slate-500 truncate flex-1 font-mono select-all">
            {typeof window !== "undefined" ? `${window.location.origin}/audit/${id}` : `/audit/${id}`}
          </span>
          <button
            onClick={() => {
              const url = `${window.location.origin}/audit/${id}`;
              navigator.clipboard.writeText(url).then(() => {
                setCopiat(true);
                setTimeout(() => setCopiat(false), 2500);
              });
            }}
            className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              copiat
                ? "bg-emerald-500 text-white"
                : "bg-slate-900 text-white hover:bg-slate-700"
            }`}
          >
            {copiat ? (
              <><CheckCheck className="w-3.5 h-3.5" /> Copiat!</>
            ) : (
              <><Link2 className="w-3.5 h-3.5" /> Copiaza link</>
            )}
          </button>
        </div>
        <a
          href={`/audit/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-800 transition-colors"
        >
          <ExternalLink className="w-3 h-3" /> Preview audit
        </a>
      </div>

      {/* Adauga activitate */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-4">
        <h2 className="font-semibold text-slate-900 mb-4">Adauga activitate</h2>
        <div className="flex flex-wrap gap-3 mb-3 items-center">
          <div className="flex gap-1.5">
            {TIPURI.map((t) => (
              <button
                key={t}
                onClick={() => setTip(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                  tip === t ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            type="datetime-local"
            value={followup}
            onChange={(e) => setFollowup(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ml-auto"
          />
        </div>
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Ce ati discutat? Ex: a cerut oferta, suna inapoi luni..."
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <button
          onClick={adaugaActivitate}
          disabled={salvand || !nota.trim()}
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
        >
          {salvand ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Salveaza activitate
        </button>
      </div>

      {/* Istoric */}
      {activitati.length > 0 && (
        <div>
          <h2 className="font-semibold text-slate-900 mb-3">Istoric activitati</h2>
          <div className="space-y-2">
            {activitati.map((a) => (
              <div key={a.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-semibold uppercase tracking-wide ${tipColor(a.tip)}`}>
                    {a.tip}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(a.data).toLocaleString("ro-RO")}
                  </span>
                </div>
                <p className="text-sm text-slate-700">{a.nota}</p>
                {a.urmator_followup && (
                  <div className="text-amber-600 text-xs mt-2 font-medium">
                    ⏰ Follow-up: {new Date(a.urmator_followup).toLocaleString("ro-RO")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
