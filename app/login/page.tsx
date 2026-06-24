"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [parola, setParola] = useState("");
  const [eroare, setEroare] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function intra() {
    setLoading(true);
    setEroare("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parola }),
    });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setEroare("Parola gresita. Incearca din nou.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 mb-4">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-white text-2xl font-semibold">CRM Prospectare</h1>
          <p className="text-slate-400 text-sm mt-1">Nova Visio Tech</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <label className="text-sm font-medium text-slate-700 block mb-1.5">
            Parola de acces
          </label>
          <input
            type="password"
            value={parola}
            onChange={(e) => setParola(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && intra()}
            placeholder="••••••••••••"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {eroare && (
            <p className="text-red-600 text-xs mt-2">⚠ {eroare}</p>
          )}
          <button
            onClick={intra}
            disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Intra in CRM
          </button>
        </div>
      </div>
    </div>
  );
}
