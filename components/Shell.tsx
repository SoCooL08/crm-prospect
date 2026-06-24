"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, LayoutDashboard, Users, LogOut } from "lucide-react";

const nav = [
  { href: "/", label: "Cautare", icon: Search },
  { href: "/leads", label: "Leaduri", icon: Users },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  if (path === "/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 w-56 bg-slate-900 flex flex-col z-10">
        <div className="px-5 pt-6 pb-4 border-b border-slate-800">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nova Visio</p>
          <p className="text-white font-semibold text-base mt-0.5">CRM Prospect</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? path === "/" : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
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
