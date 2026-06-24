import { nevoiMarketing, SemnaleLead } from "@/lib/scoring";

const adsBadge = (v: string) =>
  ({
    Ideal: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Potential: "bg-amber-50 text-amber-700 border border-amber-200",
    "Nu inca": "bg-slate-100 text-slate-500 border border-slate-200",
  }[v] ?? "bg-slate-100 text-slate-500");

const seoBadge = (v: string) =>
  ({
    Urgent: "bg-red-50 text-red-700 border border-red-200",
    Recomandat: "bg-violet-50 text-violet-700 border border-violet-200",
    "N/A": "bg-slate-100 text-slate-400 border border-slate-200",
  }[v] ?? "bg-slate-100 text-slate-400");

export default function MarketingBadges({ semnale }: { semnale: SemnaleLead }) {
  const { ads, adsMotiv, seo, seoMotiv } = nevoiMarketing(semnale);

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span
        title={adsMotiv}
        className={`text-xs px-2 py-0.5 rounded-md font-medium cursor-help ${adsBadge(ads)}`}
      >
        Ads · {ads}
      </span>
      <span
        title={seoMotiv}
        className={`text-xs px-2 py-0.5 rounded-md font-medium cursor-help ${seoBadge(seo)}`}
      >
        SEO · {seo}
      </span>
    </div>
  );
}
