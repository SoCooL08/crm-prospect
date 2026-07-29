"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, LayoutDashboard, Users, LogOut, Flame, CalendarClock, Kanban, BarChart3, ScanSearch, Map, Scissors, Building2, Phone } from "lucide-react";
import { useEffect, useState } from "react";

// Meniul urmareste saptamana de lucru din plan (sectiunea 10.1), nu lista de
// features: ce faci marti-joi sus, ce pregatesti luni la mijloc, ce citesti
// vineri jos. SOSTAC si Strategia SMM nu mai sunt aici — traiesc in fisa
// business-ului, unde le e locul.
const grupuri: {
  titlu: string;
  items: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; accent?: string }[];
}[] = [
  {
    titlu: "Vânzare",
    items: [
      { href: "/coada", label: "Apelare", icon: Phone, accent: "emerald" },
      { href: "/azi", label: "Urmăriri", icon: CalendarClock, accent: "amber" },
      { href: "/kanban", label: "Pipeline", icon: Kanban },
      { href: "/leads", label: "Leaduri", icon: Users },
    ],
  },
  {
    titlu: "Prospectare",
    items: [
      { href: "/", label: "Căutare", icon: Search },
      { href: "/recomandate", label: "Recomandate", icon: Flame, accent: "red" },
      { href: "/harta", label: "Hartă", icon: Map },
    ],
  },
  {
    titlu: "Analiză",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/statistici", label: "Statistici Nișe", icon: BarChart3, accent: "blue" },
      { href: "/analiza-client", label: "Analiză Client", icon: ScanSearch, accent: "blue" },
    ],
  },
  {
    titlu: "Clienți",
    items: [
      { href: "/episculp", label: "Episculp", icon: Scissors, accent: "pink" },
      { href: "/novavisio", label: "Nova Visio", icon: Building2, accent: "violet" },
    ],
  },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [urgente, setUrgente] = useState(0);
  const [deApelat, setDeApelat] = useState(0);

  useEffect(() => {
    fetch("/api/followups")
      .then((r) => r.json())
      .then((data: Array<{ urmator_followup: string }>) => {
        if (!Array.isArray(data)) return;
        const now = new Date();
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const count = data.filter((f) => new Date(f.urmator_followup) < endOfToday).length;
        setUrgente(count);
      })
      .catch(() => {});

    fetch("/api/coada?limit=200")
      .then((r) => r.json())
      .then((d) => setDeApelat(d?.total ?? 0))
      .catch(() => {});
  }, [path]);

  if (path === "/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 w-56 bg-slate-900 flex flex-col z-10">
        <div className="px-5 pt-6 pb-4 border-b border-slate-800">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nova Visio</p>
          <p className="text-white font-semibold text-base mt-0.5">CRM Prospect</p>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
          {grupuri.map((grup) => (
            <div key={grup.titlu} className="space-y-0.5">
              <p className="px-3 pb-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                {grup.titlu}
              </p>
              {grup.items.map(({ href, label, icon: Icon, accent }) => {
                const active = href === "/" ? path === "/" : path.startsWith(href);
                const isAzi = href === "/azi";
                const isCoada = href === "/coada";
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-blue-600 text-white"
                        : accent === "red"
                        ? "text-red-400 hover:text-white hover:bg-slate-800"
                        : accent === "amber"
                        ? "text-amber-400 hover:text-white hover:bg-slate-800"
                        : accent === "violet"
                        ? "text-violet-400 hover:text-white hover:bg-slate-800"
                        : accent === "blue"
                        ? "text-blue-400 hover:text-white hover:bg-slate-800"
                        : accent === "pink"
                        ? "text-pink-400 hover:text-white hover:bg-slate-800"
                        : accent === "emerald"
                        ? "text-emerald-400 hover:text-white hover:bg-slate-800"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{label}</span>
                    {isAzi && urgente > 0 && (
                      <span className="text-xs bg-red-500 text-white font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {urgente}
                      </span>
                    )}
                    {isCoada && deApelat > 0 && (
                      <span className="text-xs bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {deApelat}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800">
          <a
            href="/api/logout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Iesire
          </a>
        </div>
      </aside>

      <div className="flex-1 ml-56">{children}</div>
    </div>
  );
}
