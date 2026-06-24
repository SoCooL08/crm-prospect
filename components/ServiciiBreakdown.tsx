import { scorOpportunitate, SemnaleLead } from "@/lib/scoring";

const prioritateStyle = {
  Urgent: "bg-red-50 text-red-700 border border-red-200",
  Ridicata: "bg-amber-50 text-amber-700 border border-amber-200",
  Medie: "bg-blue-50 text-blue-700 border border-blue-200",
  Scazuta: "bg-slate-100 text-slate-500 border border-slate-200",
};

const scorBar = (scor: number) => {
  if (scor >= 75) return "bg-red-500";
  if (scor >= 55) return "bg-amber-500";
  if (scor >= 35) return "bg-blue-500";
  return "bg-slate-300";
};

interface Props {
  semnale: SemnaleLead;
  compact?: boolean;
}

export default function ServiciiBreakdown({ semnale, compact = false }: Props) {
  const { total, probabilitate, servicii, prioritate, motivPrincipal } =
    scorOpportunitate(semnale);

  if (compact) {
    // Versiune compacta pentru carduri din lista
    return (
      <div className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-md font-semibold ${prioritateStyle[prioritate]}`}
          >
            {prioritate}
          </span>
          <span className="text-xs text-slate-400">
            Conversie{" "}
            <span
              className={
                probabilitate >= 65
                  ? "text-emerald-600 font-semibold"
                  : probabilitate >= 50
                  ? "text-amber-600 font-semibold"
                  : "text-slate-500 font-semibold"
              }
            >
              {probabilitate}%
            </span>
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {servicii.slice(0, 3).map((sv) => (
            <span
              key={sv.nume}
              title={sv.motiv}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md cursor-help"
            >
              {sv.nume}{" "}
              <span
                className={
                  sv.scor >= 75
                    ? "text-red-600 font-bold"
                    : sv.scor >= 55
                    ? "text-amber-600 font-bold"
                    : "text-slate-400"
                }
              >
                {sv.scor}
              </span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Versiune completa pentru fisa lead
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${prioritateStyle[prioritate]}`}>
          Prioritate {prioritate}
        </span>
        <span className="text-sm text-slate-500">
          Probabilitate conversie:{" "}
          <span
            className={`font-bold ${
              probabilitate >= 65
                ? "text-emerald-600"
                : probabilitate >= 50
                ? "text-amber-600"
                : "text-slate-600"
            }`}
          >
            {probabilitate}%
          </span>
        </span>
        <span className="text-sm text-slate-500">
          Scor oportunitate:{" "}
          <span className="font-bold text-slate-800">{total}/100</span>
        </span>
      </div>

      <p className="text-sm text-slate-600 italic bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
        {motivPrincipal}
      </p>

      <div className="space-y-2">
        {servicii.map((sv) => (
          <div key={sv.nume}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-slate-700">{sv.nume}</span>
              <span
                className={`text-xs font-bold ${
                  sv.scor >= 75
                    ? "text-red-600"
                    : sv.scor >= 55
                    ? "text-amber-600"
                    : "text-slate-500"
                }`}
              >
                {sv.scor}/100
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${scorBar(sv.scor)}`}
                style={{ width: `${sv.scor}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{sv.motiv}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
