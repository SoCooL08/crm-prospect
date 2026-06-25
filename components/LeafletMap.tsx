"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// Fix Leaflet default icon în Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Pin colors după status ────────────────────────────────────────────────

const PIN_COLORS: Record<string, string> = {
  Client: "#10b981",    // emerald
  Oferta: "#f59e0b",    // amber
  Interesat: "#8b5cf6", // violet
  Contactat: "#3b82f6", // blue
  Nou: "#94a3b8",       // slate
  Pierdut: "#ef4444",   // red
};

function makeIcon(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}" stroke="white" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="5" fill="white"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });
}

// ── Hardcoded coordinates for Romanian cities ─────────────────────────────

const ORASE_RO: Record<string, [number, number]> = {
  "Alba Iulia": [46.067, 23.567], "Arad": [46.166, 21.319], "Pitesti": [44.860, 24.869],
  "Bacau": [46.567, 26.916], "Oradea": [47.046, 21.918], "Bistrita": [47.133, 24.5],
  "Bistrita-Nasaud": [47.133, 24.5], "Botosani": [47.745, 26.665], "Braila": [45.269, 27.957],
  "Brasov": [45.657, 25.601], "Bucuresti": [44.432, 26.104], "București": [44.432, 26.104],
  "Buzau": [45.149, 26.821], "Calarasi": [44.203, 27.329], "Călărași": [44.203, 27.329],
  "Cluj-Napoca": [46.769, 23.589], "Cluj": [46.769, 23.589], "Constanta": [44.175, 28.650],
  "Constanța": [44.175, 28.650], "Sfantu Gheorghe": [45.866, 25.787],
  "Sfântu Gheorghe": [45.866, 25.787], "Targoviste": [44.926, 25.457],
  "Târgoviște": [44.926, 25.457], "Craiova": [44.319, 23.795], "Galati": [45.436, 28.054],
  "Galați": [45.436, 28.054], "Giurgiu": [43.902, 25.965], "Targu Jiu": [45.038, 23.275],
  "Târgu Jiu": [45.038, 23.275], "Miercurea Ciuc": [46.360, 25.802],
  "Deva": [45.880, 22.911], "Slobozia": [44.560, 27.362], "Iasi": [47.157, 27.589],
  "Iași": [47.157, 27.589], "Baia Mare": [47.657, 23.568], "Drobeta-Turnu Severin": [44.628, 22.655],
  "Targu Mures": [46.540, 24.557], "Târgu Mureș": [46.540, 24.557],
  "Piatra Neamt": [46.927, 26.371], "Piatra Neamț": [46.927, 26.371],
  "Slatina": [44.430, 24.366], "Ploiesti": [44.936, 26.020], "Ploiești": [44.936, 26.020],
  "Zalau": [47.192, 23.057], "Zalău": [47.192, 23.057], "Satu Mare": [47.791, 22.884],
  "Sibiu": [45.797, 24.152], "Suceava": [47.638, 26.250], "Alexandria": [43.977, 25.338],
  "Timisoara": [45.749, 21.207], "Timișoara": [45.749, 21.207],
  "Tulcea": [45.178, 28.800], "Ramnicu Valcea": [45.104, 24.369],
  "Râmnicu Vâlcea": [45.104, 24.369], "Vaslui": [46.640, 27.731],
  "Focsani": [45.696, 27.186], "Focșani": [45.696, 27.186],
  "Drobeta Turnu Severin": [44.628, 22.655], "Resita": [45.296, 21.888],
  "Reșița": [45.296, 21.888], "Dej": [47.134, 23.872], "Medias": [24.351, 46.165],
  "Mediaș": [46.158, 24.351], "Lugoj": [45.688, 21.903], "Turda": [46.567, 23.783],
  "Hunedoara": [45.754, 22.911], "Petrosani": [45.416, 23.371],
  "Petroșani": [45.416, 23.371], "Campina": [45.127, 25.727], "Câmpina": [45.127, 25.727],
  "Sinaia": [45.351, 25.545], "Curtea de Arges": [45.148, 24.680],
  "Curtea de Argeș": [45.148, 24.680], "Campulung": [45.264, 25.040],
  "Câmpulung": [45.264, 25.040], "Roman": [46.920, 26.920], "Pascani": [47.248, 26.727],
  "Pașcani": [47.248, 26.727], "Tecuci": [45.858, 27.427], "Targu Neamt": [47.201, 26.368],
  "Târgu Neamț": [47.201, 26.368], "Dorohoi": [47.958, 26.397],
  "Radauti": [47.847, 25.918], "Rădăuți": [47.847, 25.918],
  "Falticeni": [47.459, 26.299], "Fălticeni": [47.459, 26.299],
  "Gura Humorului": [47.555, 25.886], "Campulung Moldovenesc": [47.523, 25.558],
  "Câmpulung Moldovenesc": [47.523, 25.558], "Vatra Dornei": [47.352, 25.361],
  "Odorheiu Secuiesc": [46.304, 25.300], "Targu Secuiesc": [46.001, 26.138],
  "Târgu Secuiesc": [46.001, 26.138], "Reghin": [46.780, 24.713],
  "Sighisoara": [46.219, 24.791], "Sighișoara": [46.219, 24.791],
  "Sebes": [45.959, 23.567], "Sebeș": [45.959, 23.567],
  "Blaj": [46.177, 23.913], "Aiud": [46.289, 23.722], "Campeni": [46.363, 23.059],
  "Câmpeni": [46.363, 23.059], "Selimbar": [45.752, 24.195], "Șelimbăr": [45.752, 24.195],
  "Cisnadie": [45.712, 24.152], "Cisnădie": [45.712, 24.152],
  "Ocna Sibiului": [45.863, 24.037], "Avrig": [45.708, 24.368],
  "Agnita": [45.977, 24.619], "Dumbrăveni": [46.237, 24.572],
};

function coords(oras: string, judet: string): [number, number] | null {
  // Try exact city name first
  if (ORASE_RO[oras]) return ORASE_RO[oras];
  // Try normalized (lowercase comparison)
  const key = Object.keys(ORASE_RO).find(
    (k) => k.toLowerCase() === oras?.toLowerCase()
  );
  if (key) return ORASE_RO[key];
  // Fallback to county capital
  if (ORASE_RO[judet]) return ORASE_RO[judet];
  return null;
}

function AutoFit({ leads }: { leads: any[] }) {
  const map = useMap();
  useEffect(() => {
    const pts = leads
      .map((l) => coords(l.oras, l.judet))
      .filter(Boolean) as [number, number][];
    if (pts.length > 0) {
      map.fitBounds(L.latLngBounds(pts), { padding: [40, 40] });
    }
  }, [leads, map]);
  return null;
}

export default function LeafletMap({ leads }: { leads: any[] }) {
  const withCoords = leads
    .map((l) => ({ ...l, _coords: coords(l.oras, l.judet) }))
    .filter((l) => l._coords);

  return (
    <MapContainer
      center={[45.9432, 24.9668]}
      zoom={7}
      style={{ height: "100%", width: "100%" }}
      className="rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AutoFit leads={leads} />
      {withCoords.map((l) => (
        <Marker
          key={l.id}
          position={l._coords!}
          icon={makeIcon(PIN_COLORS[l.status] ?? "#94a3b8")}
        >
          <Popup>
            <div className="text-sm min-w-[180px]">
              <p className="font-bold text-slate-900 mb-0.5">{l.nume}</p>
              <p className="text-slate-500 text-xs mb-1">{l.nisa} · {l.oras}</p>
              <p className="text-xs">
                ★ {l.rating} &nbsp;·&nbsp;
                <span style={{ color: PIN_COLORS[l.status] }} className="font-semibold">
                  {l.status}
                </span>
              </p>
              {l.telefon && (
                <a href={`tel:${l.telefon}`} className="text-blue-600 text-xs block mt-1">
                  📞 {l.telefon}
                </a>
              )}
              <a
                href={`/leads/${l.id}`}
                className="text-blue-600 text-xs underline block mt-1"
              >
                Deschide fișă →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
