-- Ruleaza tot acest fisier in Supabase: SQL Editor -> New Query -> Run

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  nume text not null,
  telefon text,
  website text,
  are_website boolean default false,
  adresa text,
  judet text,
  oras text,
  nisa text,
  rating numeric,
  nr_reviews int,
  google_place_id text unique,
  lat numeric,
  lng numeric,
  scor int default 0,
  scor_viteza int,            -- scor PageSpeed 0-100 (null pana e analizat)
  site_vechi boolean default false,
  status text default 'Nou',
  data_adaugare timestamptz default now()
);

create table if not exists activitati (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  tip text,                  -- apel / email / intalnire / nota
  nota text,
  urmator_followup timestamptz,
  data timestamptz default now()
);

create index if not exists idx_leads_judet on leads(judet);
create index if not exists idx_leads_nisa on leads(nisa);
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_scor on leads(scor desc);
