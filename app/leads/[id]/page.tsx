"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Phone, Globe, Globe2, Star, MapPin, Gauge, Loader2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

const STATUSURI = ["Nou", "Contactat", "Interesat", "Oferta", "Client", "Pierdut"];
const TIPURI = ["apel", "email", "intalnire", "nota"];

export default function FisaLead() {
  const params = useParams();
  const id = params.id as string;

  const [lead, setLead] = useState<any>(null);
  const [activitati, setActivitati] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [tip, setTip] = useState("apel");
  const [nota, setNota] = useState("");
  const [followup, setFollowup] = useState("");

  async function incarca() {
    const { data: l } = await supabase.from("leads").select("*").eq("id", id).single();
    const { data: a } = await supabase
      .from("activitati")
      .select("*")
      .eq("lead_id", id)
      .order("data", { ascending: false });
    setLead(l);
    setActivitati(a || []);
    setLoading(false);
  }

  useEffect(() => {
    incarca();
  }, [id]);

  async function adaugaActivitate() {
    if (!nota.trim()) return;
    await supabase.from("activitati").insert({
      lead_id: id,
      tip,
      nota,
      urmator_followup: followup || null,
    });
    setNota("");
    setFollowup("");
    incarca();
  }

  async function schimbaStatus(status: string) {
    await supabase.from("leads").update({ status }).eq("id", id);
    incarca();
  }

  if (loading)
    return (
      <main className="max-w-3xl mx-auto p-6">
        <Loader2 className="w-5 h-5 animate-spin" />
      </main>
    );

  if (!lead)
    return (
      <main className="max-w-3xl mx-auto p-6">
        <p>Lead negasit.</p>
        <Link href="/leads" className="text-blue-600">
          ← Inapoi
        </Link>
      </main>
    );

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href="/leads" className="text-blue-600 hover:underline text-sm">
        ← Toate leadurile
      </Link>

      <div className="border rounded-xl p-5 bg-white mt-4">
        <div className="flex justify-between items-start gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-medium">{lead.nume}</h1>
            <div className="text-sm text-gray-500 mt-1">
              {lead.nisa} · {lead.oras}, {lead.judet}
            </div>
          </div>
          <select
            value={lead.status}
            onChange={(e) => schimbaStatus(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            {STATUSURI.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" /> {lead.adresa || "-"}
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-gray-400" /> {lead.rating} ({lead.nr_reviews} recenzii)
          </div>
          <div className="flex items-center gap-2">
            {lead.telefon ? (
              <a href={`tel:${lead.telefon}`} className="text-blue-600 flex items-center gap-2">
                <Phone className="w-4 h-4" /> {lead.telefon}
              </a>
            ) : (
              <span className="text-gray-400 flex items-center gap-2">
                <Phone className="w-4 h-4" /> fara telefon
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {lead.are_website ? (
              <a
                href={lead.website}
                target="_blank"
                className="text-blue-600 flex items-center gap-2"
              >
                <Globe className="w-4 h-4" /> vezi website
              </a>
            ) : (
              <span className="text-red-600 flex items-center gap-2">
                <Globe2 className="w-4 h-4" /> fara website
              </span>
            )}
          </div>
          {lead.scor_viteza != null && (
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-gray-400" /> Viteza site: {lead.scor_viteza}/100
            </div>
          )}
          <div className="flex items-center gap-2">
            Scor oportunitate: <b>{lead.scor}</b>
          </div>
        </div>
      </div>

      <div className="border rounded-xl p-5 bg-white mt-4">
        <h2 className="font-medium mb-3">Adauga activitate</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          <select
            value={tip}
            onChange={(e) => setTip(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            {TIPURI.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Reaminteste pe:
            <input
              type="datetime-local"
              value={followup}
              onChange={(e) => setFollowup(e.target.value)}
              className="border rounded-lg px-2 py-1.5 text-sm"
            />
          </div>
        </div>
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Ce ati discutat? Ex: a cerut oferta, suna inapoi luni..."
          className="w-full border rounded-lg px-3 py-2 text-sm h-20"
        />
        <button
          onClick={adaugaActivitate}
          className="mt-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Salveaza
        </button>
      </div>

      <div className="mt-4">
        <h2 className="font-medium mb-3">Istoric</h2>
        {activitati.length === 0 && (
          <p className="text-gray-500 text-sm">Nicio activitate inca.</p>
        )}
        <div className="space-y-2">
          {activitati.map((a) => (
            <div key={a.id} className="border rounded-lg p-3 bg-white text-sm">
              <div className="flex justify-between text-gray-500 text-xs mb-1">
                <span className="uppercase tracking-wide">{a.tip}</span>
                <span>{new Date(a.data).toLocaleString("ro-RO")}</span>
              </div>
              <div>{a.nota}</div>
              {a.urmator_followup && (
                <div className="text-amber-600 text-xs mt-1">
                  ⏰ Follow-up: {new Date(a.urmator_followup).toLocaleString("ro-RO")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
