"use client";

import { useState } from "react";
import { ChevronDown, Copy, CheckCheck, MessageCircle, Phone, Mail, Repeat } from "lucide-react";
import { CADENTA, MESAJE_EXTRA, MesajCadenta, completeaza, lipsuri, ContextMesaj } from "@/lib/cadenta";

const ICON = { WhatsApp: MessageCircle, Apel: Phone, Email: Mail };
const CULOARE = {
  WhatsApp: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Apel: "bg-blue-50 text-blue-700 border-blue-200",
  Email: "bg-violet-50 text-violet-700 border-violet-200",
};

function telInternational(tel: string): string {
  const c = tel.replace(/\D/g, "");
  if (c.startsWith("40")) return c;
  if (c.startsWith("0")) return "4" + c;
  return "40" + c;
}

function Card({ m, ctx, telefon }: { m: MesajCadenta; ctx: ContextMesaj; telefon?: string | null }) {
  const [open, setOpen] = useState(false);
  const [copiat, setCopiat] = useState(false);

  const text = completeaza(m.text, ctx);
  const necompletate = lipsuri(text);
  const Icon = ICON[m.canal];

  function copiaza() {
    const complet = m.subiect ? `Subiect: ${m.subiect}\n\n${text}` : text;
    navigator.clipboard.writeText(complet).then(() => {
      setCopiat(true);
      setTimeout(() => setCopiat(false), 2000);
    });
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        {m.atingere !== null ? (
          <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
            {m.atingere}
          </span>
        ) : (
          <Repeat className="w-4 h-4 text-slate-400 shrink-0" />
        )}
        <span className="min-w-0 flex-1">
          <span className="text-sm font-semibold text-slate-800 block leading-snug">{m.titlu}</span>
          <span className="text-xs text-slate-400">{m.cand}</span>
        </span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border shrink-0 ${CULOARE[m.canal]}`}>
          <Icon className="w-3 h-3 inline mr-1" />
          {m.canal}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 bg-slate-50 border-t border-slate-100 pt-3">
          {m.subiect && (
            <p className="text-xs text-slate-500 mb-2">
              <span className="font-semibold">Subiect:</span> {m.subiect}
            </p>
          )}
          <pre className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">{text}</pre>

          {m.nota && (
            <p className="text-xs text-slate-500 mt-3 pl-3 border-l-2 border-slate-300 leading-snug">{m.nota}</p>
          )}

          {necompletate.length > 0 && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
              Completează înainte să trimiți: {necompletate.map((x) => `{${x}}`).join(", ")}
            </p>
          )}

          <div className="flex gap-2 mt-3">
            <button
              onClick={copiaza}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                copiat ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {copiat ? <><CheckCheck className="w-3.5 h-3.5" /> Copiat</> : <><Copy className="w-3.5 h-3.5" /> Copiază</>}
            </button>
            {m.canal === "WhatsApp" && telefon && (
              <a
                href={`https://wa.me/${telInternational(telefon)}?text=${encodeURIComponent(text)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Deschide WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CadentaPanel({
  ctx, telefon, atingereCurenta,
}: {
  ctx: ContextMesaj;
  telefon?: string | null;
  atingereCurenta?: number;
}) {
  const [open, setOpen] = useState(false);
  const urmatoarea = Math.min((atingereCurenta ?? 0) + 1, 7);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-6 py-4 hover:bg-slate-50 transition-colors"
      >
        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
          <Repeat className="w-4 h-4 text-emerald-500" />
          Cadență — 7 atingeri
          <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-bold">
            urmează {urmatoarea}
          </span>
        </h2>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-6 pb-5 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            80% din vânzările din cold calling se închid între atingerea 4 și 8. Majoritatea se opresc la 2 —
            de asta cadența contează mai mult decât scriptul. Variabilele știute sunt deja completate.
          </p>
          <div className="space-y-2">
            {CADENTA.map((m) => <Card key={m.id} m={m} ctx={ctx} telefon={telefon} />)}
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-6 mb-2">
            În afara cadenței
          </p>
          <div className="space-y-2">
            {MESAJE_EXTRA.map((m) => <Card key={m.id} m={m} ctx={ctx} telefon={telefon} />)}
          </div>
        </div>
      )}
    </div>
  );
}
