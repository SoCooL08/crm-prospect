import { supabaseAdmin } from "@/lib/supabase";
import { scorOpportunitate } from "@/lib/scoring";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Severity = "critical" | "warning" | "info";

function ProblemRow({ icon, severity, title, desc }: { icon: string; severity: Severity; title: string; desc: string }) {
  const styles: Record<Severity, string> = {
    critical: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${styles[severity]}`}>
      <span className="text-xl shrink-0 leading-none mt-0.5">{icon}</span>
      <div>
        <p className="text-sm font-semibold leading-snug">{title}</p>
        <p className="text-xs opacity-75 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default async function AuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: lead } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (!lead) notFound();

  const semnale = {
    areWebsite: lead.are_website,
    rating: lead.rating,
    reviews: lead.nr_reviews,
    scorViteza: lead.scor_viteza,
    nisa: lead.nisa,
  };

  const { total, servicii, motivPrincipal } = scorOpportunitate(semnale);

  const dataAudit = new Date().toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const scorLabel =
    total >= 65
      ? "Prezenta digitala slaba"
      : total >= 40
      ? "Prezenta digitala medie"
      : "Prezenta digitala acceptabila";

  const scorRing =
    total >= 65
      ? "stroke-red-500"
      : total >= 40
      ? "stroke-amber-500"
      : "stroke-emerald-500";

  const scorText =
    total >= 65 ? "text-red-600" : total >= 40 ? "text-amber-600" : "text-emerald-600";

  // SVG donut: circumference = 2π × 40 ≈ 251.2
  const circ = 251.2;
  const dashOffset = circ - (total / 100) * circ;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top bar */}
      <div className="bg-slate-900 px-5 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nova Visio Tech</p>
            <p className="text-white font-semibold text-sm mt-0.5">Audit Digital Gratuit</p>
          </div>
          <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1.5 rounded-full shrink-0">
            {dataAudit}
          </span>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-7 space-y-4">

        {/* Business card + score donut */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">{lead.nume}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {lead.nisa} · {lead.oras}, {lead.judet}
          </p>

          <div className="mt-6 flex items-center gap-6">
            {/* SVG donut gauge */}
            <div className="relative shrink-0 w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={dashOffset}
                  className={`transition-all ${scorRing}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-black leading-none ${scorText}`}>{total}</span>
                <span className="text-xs text-slate-400 mt-0.5">/ 100</span>
              </div>
            </div>

            <div>
              <p className={`font-bold text-base leading-snug ${scorText}`}>{scorLabel}</p>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-xs">{motivPrincipal}</p>
            </div>
          </div>
        </div>

        {/* Problems */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Probleme identificate
          </p>
          <div className="space-y-3">
            {!lead.are_website && (
              <ProblemRow
                icon="🚫"
                severity="critical"
                title="Nu aveti website"
                desc={`Clientii care cauta ${lead.nisa?.toLowerCase() ?? "servicii"} in ${lead.oras} nu va gasesc online. Estimam ${lead.nr_reviews > 50 ? "20–30%" : "10–15%"} din potentialii clienti pierduti zilnic.`}
              />
            )}

            {lead.scor_viteza != null && lead.scor_viteza < 30 && (
              <ProblemRow
                icon="🐌"
                severity="critical"
                title={`Site-ul se incarca foarte lent — scor ${lead.scor_viteza}/100`}
                desc="Google penalizeaza sever site-urile cu scor sub 30. 53% din utilizatori abandoneaza daca incarcarea depaseste 3 secunde."
              />
            )}

            {lead.scor_viteza != null && lead.scor_viteza >= 30 && lead.scor_viteza < 50 && (
              <ProblemRow
                icon="⚠️"
                severity="critical"
                title={`Viteza site slaba — scor ${lead.scor_viteza}/100`}
                desc="Site-ul se incarca prea incet si afecteaza negativ pozitia in Google si experienta clientilor."
              />
            )}

            {lead.scor_viteza != null && lead.scor_viteza >= 50 && lead.scor_viteza < 70 && (
              <ProblemRow
                icon="📉"
                severity="warning"
                title={`Viteza site sub medie — scor ${lead.scor_viteza}/100`}
                desc="Exista oportunitate clara de imbunatatire a performantei si a pozitiei in cautarile Google."
              />
            )}

            {lead.rating > 0 && lead.rating < 3.5 && (
              <ProblemRow
                icon="⭐"
                severity="critical"
                title={`Rating Google critic — ${lead.rating} din 5 stele`}
                desc="76% din clienti citesc recenziile inainte sa contacteze o afacere. Un rating sub 3.5 poate reduce contactele cu pana la 50%."
              />
            )}

            {lead.rating >= 3.5 && lead.rating < 4.0 && (
              <ProblemRow
                icon="⭐"
                severity="warning"
                title={`Rating Google sub medie — ${lead.rating} din 5 stele`}
                desc="Concurentii cu rating 4.5+ apar inaintea voastra in cautarile locale si primesc mai multe contacte."
              />
            )}

            {lead.nr_reviews < 20 && lead.are_website && (
              <ProblemRow
                icon="💬"
                severity="warning"
                title={`Putine recenzii Google — doar ${lead.nr_reviews}`}
                desc="Afacerile cu peste 50 de recenzii obtin de 2–3x mai multe contacte din cautari locale fata de cele cu sub 20."
              />
            )}

            {lead.are_website &&
              (lead.scor_viteza == null || lead.scor_viteza >= 70) &&
              lead.rating >= 4.0 &&
              lead.nr_reviews >= 20 && (
                <ProblemRow
                  icon="📈"
                  severity="info"
                  title="Potential neexploatat de crestere"
                  desc="Baza voastra online este solida. Google Ads si SEO local pot scala rapid numarul de clienti noi fara investitii mari."
                />
              )}
          </div>
        </div>

        {/* Services recommended */}
        {servicii.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Ce va recomandam
            </p>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Servicii cu cel mai mare impact pentru afacerea voastra, in ordinea prioritatii
            </p>
            <div className="space-y-4">
              {servicii.map((sv, i) => {
                const barColor =
                  sv.scor >= 75 ? "bg-red-500" : sv.scor >= 55 ? "bg-amber-500" : "bg-blue-400";
                const labelColor =
                  sv.scor >= 75 ? "text-red-600" : sv.scor >= 55 ? "text-amber-600" : "text-blue-600";
                return (
                  <div key={sv.nume}>
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">{sv.nume}</span>
                      </div>
                      <span className={`text-xs font-bold shrink-0 ${labelColor}`}>
                        {sv.scor}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full ${barColor}`}
                        style={{ width: `${sv.scor}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{sv.motiv}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Pasul urmator
          </p>
          <h2 className="font-bold text-xl leading-snug mb-2">
            Consultatie gratuita de 20 minute
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Va explicam exact ce putem face pentru afacerea voastra, cu ce investitie si cu ce
            rezultate concrete. Fara obligatii.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+40771234567"
              className="flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold text-sm px-5 py-3 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <span>📞</span> Sunati acum
            </a>
            <a
              href="https://novavisiotech.ro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-slate-800 text-slate-300 font-medium text-sm px-5 py-3 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <span>🌐</span> novavisiotech.ro
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 pb-2">
          Audit generat de Nova Visio Tech · {dataAudit}
        </p>
      </div>
    </div>
  );
}
