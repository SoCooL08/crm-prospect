"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Phone, Globe, Globe2, Star, MapPin, Gauge,
  Loader2, Plus, ArrowLeft, ExternalLink, MessageSquare,
  Link2, CheckCheck, AlertTriangle, LayoutTemplate,
} from "lucide-react";
import { etichetaScor, genereazaBrief } from "@/lib/scoring";
import ServiciiBreakdown from "@/components/ServiciiBreakdown";
import ObiectiiPanel from "@/components/ObiectiiPanel";
import GeneratorOferta from "@/components/GeneratorOferta";
import GeneratorEmail from "@/components/GeneratorEmail";

const STATUSURI = ["Nou", "Contactat", "Interesat", "Oferta", "Client", "Pierdut"];
const TIPURI = ["apel", "email", "intalnire", "nota"];
const MOTIVE_PIERDERE = [
  "Pret prea mare",
  "Nu era momentul",
  "A ales concurenta",
  "Nu raspunde",
  "Alt motiv",
];

const statusColor = (s: string) =>
  ({
    Nou: "bg-slate-100 text-slate-700",
    Contactat: "bg-blue-100 text-blue-700",
    Interesat: "bg-violet-100 text-violet-700",
    Oferta: "bg-amber-100 text-amber-700",
    Client: "bg-emerald-100 text-emerald-700",
    Pierdut: "bg-red-100 text-red-700",
  }[s] ?? "bg-slate-100 text-slate-700");

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
  const [motivSelectat, setMotivSelectat] = useState(MOTIVE_PIERDERE[0]);

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
    if (status === "Pierdut") {
      setMotivModal(true);
      return;
    }
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    incarca();
  }

  async function confirmaPierdut() {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Pierdut", motiv_pierdere: motivSelectat }),
    });
    setMotivModal(false);
    incarca();
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
              {STATUSURI.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Motiv pierdere afisat */}
        {lead.status === "Pierdut" && lead.motiv_pierdere && (
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
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Deschidere</p>
            <p className="text-sm text-slate-700 italic">{brief.deschidere}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1.5">Pitch</p>
            <p className="text-sm text-blue-900">{brief.pitch}</p>
          </div>
        </div>
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
