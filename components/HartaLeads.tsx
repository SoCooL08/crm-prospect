"use client";

import { useEffect, useRef } from "react";

// Incarca scriptul Google Maps o singura data
let mapsPromise: Promise<void> | null = null;
function incarcaMaps(): Promise<void> {
  if (mapsPromise) return mapsPromise;
  mapsPromise = new Promise((resolve) => {
    if ((window as any).google?.maps) return resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`;
    s.async = true;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
  return mapsPromise;
}

function culoarePin(scor: number): string {
  if (scor >= 65) return "#dc2626"; // rosu - fierbinte
  if (scor >= 40) return "#f59e0b"; // portocaliu - cald
  return "#9ca3af"; // gri - rece
}

export default function HartaLeads({ leads }: { leads: any[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cuCoord = leads.filter((l) => l.lat && l.lng);
    if (cuCoord.length === 0) return;

    incarcaMaps().then(() => {
      const g = (window as any).google;
      const centru = { lat: Number(cuCoord[0].lat), lng: Number(cuCoord[0].lng) };
      const map = new g.maps.Map(ref.current, { center: centru, zoom: 12 });
      const info = new g.maps.InfoWindow();
      const bounds = new g.maps.LatLngBounds();

      cuCoord.forEach((l) => {
        const pos = { lat: Number(l.lat), lng: Number(l.lng) };
        bounds.extend(pos);
        const marker = new g.maps.Marker({
          position: pos,
          map,
          title: l.nume,
          icon: {
            path: g.maps.SymbolPath.CIRCLE,
            fillColor: culoarePin(l.scor),
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
            scale: 9,
          },
        });
        marker.addListener("click", () => {
          info.setContent(
            `<div style="font-family:sans-serif;font-size:13px;max-width:200px">
              <b>${l.nume}</b><br/>
              ${l.telefon ? `📞 ${l.telefon}<br/>` : ""}
              ${l.are_website ? "🌐 are website" : "❌ fara website"}<br/>
              Scor: <b>${l.scor}</b>
            </div>`
          );
          info.open(map, marker);
        });
      });

      map.fitBounds(bounds);
    });
  }, [leads]);

  const cuCoord = leads.filter((l) => l.lat && l.lng);
  if (cuCoord.length === 0) return null;

  return (
    <div className="mb-4">
      <div ref={ref} className="w-full h-[400px] rounded-xl border" />
      <div className="flex gap-4 text-xs text-gray-500 mt-2">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-600 inline-block" /> Fierbinte
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Cald
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-gray-400 inline-block" /> Rece
        </span>
      </div>
    </div>
  );
}
