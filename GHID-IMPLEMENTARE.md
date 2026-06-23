# Ghid complet: CRM de prospectare cold calling

CRM care caută afaceri pe Google Maps după județ și nișă, detectează care **nu au site** sau au **site vechi/lent**, le calculează un scor de oportunitate și le organizează pentru cold calling.

---

## PARTEA 0 — Ce îți trebuie înainte să începi

1. Cont GitHub (gratuit) — github.com
2. Node.js instalat (versiunea 18+) — nodejs.org → descarcă LTS
3. VS Code instalat — code.visualstudio.com
4. Cont Google Cloud — console.cloud.google.com (ai 200$ credit gratuit/lună)
5. Cont Supabase (baza de date, gratuit) — supabase.com
6. Cont Vercel (hosting, gratuit) — vercel.com

Verifică Node în terminal:
```
node --version
```
Trebuie să vezi v18 sau mai mare.

---

## PARTEA 1 — Creezi proiectul în VS Code

Deschide VS Code → Terminal (meniul Terminal → New Terminal) și rulează:

```
npx create-next-app@latest crm-prospect
```

La întrebări răspunde:
- TypeScript? → Yes
- ESLint? → Yes
- Tailwind CSS? → Yes
- src/ directory? → No
- App Router? → Yes
- Turbopack? → No
- import alias? → No (Enter)

Apoi:
```
cd crm-prospect
npm install @supabase/supabase-js lucide-react
```

Deschide folderul în VS Code: File → Open Folder → crm-prospect.

Testează că merge:
```
npm run dev
```
Deschide browserul la http://localhost:3000 — trebuie să vezi pagina default Next.js.
Oprești serverul cu Ctrl+C în terminal.

---

## PARTEA 2 — Baza de date (Supabase)

1. Intră pe supabase.com → New Project. Alege o parolă pentru DB (notează-o).
2. Așteaptă ~2 minute să se creeze.
3. În meniul din stânga → SQL Editor → New Query.
4. Copiază tot conținutul din fișierul `sql/schema.sql` și apasă Run.
5. Mergi la Project Settings (rotița) → API. Copiază:
   - Project URL
   - anon public key
   - service_role key (secret — nu-l pune niciodată în cod public)

---

## PARTEA 3 — Google Maps API

1. Intră pe console.cloud.google.com → creează un proiect nou (sus, lângă logo).
2. Meniul stânga → APIs & Services → Library.
3. Caută și activează (Enable):
   - "Places API (New)"
   - "PageSpeed Insights API"
   - "Maps JavaScript API"  (pentru harta din browser)
4. Mergi la APIs & Services → Credentials → Create Credentials → API key.
5. Copiază cheia.
6. IMPORTANT: apasă pe cheie → Application restrictions → lasă None la început (ca să meargă din server). Sub "API restrictions" → Restrict key → bifează doar Places API (New) și PageSpeed Insights API. Salvează.
7. Activează facturarea (Billing) — e necesar chiar și pentru nivelul gratuit, dar nu te taxează sub 200$/lună.

---

## PARTEA 4 — Variabilele de mediu

În rădăcina proiectului (lângă package.json) creează un fișier numit `.env.local`
și pune în el (înlocuiește cu valorile tale):

```
GOOGLE_API_KEY=cheia_de_la_google
NEXT_PUBLIC_GOOGLE_MAPS_KEY=cheia_de_harta_pentru_browser
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...anon
SUPABASE_SERVICE_KEY=eyJ...service_role
CRM_PAROLA=alege_o_parola_complicata_aici
```

DESPRE CELE DOUA CHEI GOOGLE:
- GOOGLE_API_KEY = folosita din server (cautare + PageSpeed). O restrictionezi pe API-uri,
  fara restrictie de domeniu.
- NEXT_PUBLIC_GOOGLE_MAPS_KEY = folosita in browser pentru harta. ACEASTA trebuie
  restrictionata pe domeniul tau (Application restrictions -> Websites ->
  adaugi localhost si crm.agentiata.ro), pentru ca e vizibila in browser.
  In Google Cloud creezi o A DOUA cheie pentru asta si activezi "Maps JavaScript API".

CRM_PAROLA = parola cu care intri tu/echipa in CRM pe subdomeniu.

ATENȚIE: fișierul `.env.local` NU se urcă pe GitHub (e deja în .gitignore). Bine așa — sunt secrete.

---

## PARTEA 5 — Copiezi fișierele de cod

Copiază din acest pachet fișierele în proiectul tău, păstrând exact aceleași căi:

- `lib/supabase.ts`
- `lib/scoring.ts`
- `middleware.ts`  (in radacina, langa package.json)
- `components/HartaLeads.tsx`
- `app/api/cauta/route.ts`
- `app/api/analiza/route.ts`
- `app/api/login/route.ts`
- `app/login/page.tsx`
- `app/page.tsx`  (înlocuiește pe cel existent)
- `app/leads/page.tsx`
- `app/leads/[id]/page.tsx`
- `app/dashboard/page.tsx`

---

## PARTEA 6 — Rulezi local și testezi

```
npm run dev
```

Mergi pe http://localhost:3000:
- alegi județ + nișă → Caută
- vezi rezultatele cu scor
- apeși "Salvează în CRM"
- mergi pe http://localhost:3000/leads ca să vezi pipeline-ul

---

## PARTEA 7 — Urci pe GitHub

În terminal, în folderul proiectului:
```
git init
git add .
git commit -m "CRM initial"
```
Apoi pe github.com → New repository → crm-prospect → Create.
Urmează instrucțiunile "push an existing repository":
```
git remote add origin https://github.com/USERUL-TAU/crm-prospect.git
git branch -M main
git push -u origin main
```

---

## PARTEA 8 — Deploy pe Vercel + subdomeniul tău

1. Intră pe vercel.com → Add New → Project → importă repo-ul crm-prospect din GitHub.
2. La "Environment Variables" adaugă EXACT aceleași variabile din `.env.local`
   (GOOGLE_API_KEY, NEXT_PUBLIC_GOOGLE_MAPS_KEY, NEXT_PUBLIC_SUPABASE_URL,
   NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY, CRM_PAROLA).
3. Deploy. În ~1 minut ai o adresă tip crm-prospect.vercel.app.

Pentru subdomeniul tău (ex. crm.agentiata.ro):
4. În Vercel → proiect → Settings → Domains → adaugă crm.agentiata.ro.
5. Vercel îți arată un CNAME. Mergi la furnizorul unde ai domeniul (de unde ai cumpărat
   agentiata.ro) → zona DNS → adaugi un record CNAME:
   - Name/Host: crm
   - Value/Target: cname.vercel-dns.com  (exact ce zice Vercel)
6. Aștepți 5-30 min să se propage. Gata — CRM-ul e live pe subdomeniul tău,
   accesibil și de pe telefon la cold calling.

---

## PARTEA 9 — Cum folosești zilnic

1. Alegi un județ + o nișă (ex. Sibiu + Cabinete stomatologice).
2. Cauți → salvezi leadurile.
3. Pe /leads filtrezi după "fără site" și "scor mare".
4. Suni leadurile fierbinți. Pentru cele cu site vechi, ai deja argumentul
   (scor PageSpeed mic = "site-ul vostru e lent pe mobil").
5. Muți leadul prin status pe măsură ce avansează: Nou → Contactat → Interesat → Ofertă → Client.

---

## Avertismente importante

COSTURI GOOGLE: câmpurile telefon și website din Places API sunt în nivelul scump de
tarifare. Soluția din cod salvează tot în DB ca să nu re-cauți aceeași zonă. Nu rula
analiza PageSpeed pe sute de leaduri deodată — are limită zilnică gratuită.

LEGAL (GDPR + cold calling RO): prospectarea B2B e permisă, dar pentru apeluri nesolicitate
verifică Lista Robinson și păstrează evidența temeiului de prelucrare (interes legitim).
Nu sunt avocat — pentru scalare consultă un specialist GDPR.
