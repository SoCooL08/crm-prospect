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
      setEroare("Parola gresita");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm border rounded-xl p-6 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5" />
          <h1 className="text-xl font-medium">CRM Prospectare</h1>
        </div>
        <input
          type="password"
          value={parola}
          onChange={(e) => setParola(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && intra()}
          placeholder="Parola"
          className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
        />
        {eroare && <p className="text-red-600 text-sm mb-3">{eroare}</p>}
        <button
          onClick={intra}
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Intra
        </button>
      </div>
    </main>
  );
}
