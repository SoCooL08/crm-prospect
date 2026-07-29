-- ============================================================================
-- 002 — COADA DE APELARE + NEXT ACTION OBLIGATORIU + PIPELINE 9 STADII
-- Sistem de Scalare Nova Visio Tech, sectiunile 5.1 / 5.2 / 5.4 / 3.2
--
-- Ruleaza in Supabase: SQL Editor -> New Query -> Run.
-- Fisierul e idempotent: se poate rula de mai multe ori fara efecte secundare.
--
-- ATENTIE: pasul 3 (maparea stadiilor) modifica coloana `status` pe TOATE
-- lead-urile. Ruleaza intai VERIFICAREA de la finalul fisierului ca sa vezi
-- cate randuri sunt afectate. Rollback-ul e la final.
-- ============================================================================


-- ── 1. Campuri noi pe lead (sectiunea 5.1) ──────────────────────────────────

alter table leads
  -- Audit 90 sec (sectiunea 3.2)
  add column if not exists nota_personalizare text,
  add column if not exists scor_audit int default 0,
  add column if not exists audit_semnale jsonb default '{}'::jsonb,

  -- Decident
  add column if not exists nume_decident text,
  add column if not exists functie_decident text,
  add column if not exists telefon_secundar text,
  add column if not exists email text,

  -- Cadenta si next action (sectiunea 5.4 #2, 6.6)
  add column if not exists data_urmatoarei_actiuni timestamptz,
  add column if not exists data_ultimei_atingeri timestamptz,
  add column if not exists nr_atingeri int default 0,

  -- Conformitate (sectiunea 5.5 — RNO / GDPR)
  add column if not exists do_not_call boolean default false,

  -- Vanzare
  add column if not exists sursa text default 'Cold call',
  add column if not exists pachet_propus text,
  add column if not exists valoare_retainer numeric,

  -- Identificare firma
  add column if not exists cui text,
  add column if not exists caen text,
  add column if not exists ca_ron numeric,
  add column if not exists nr_angajati int;

comment on column leads.scor_audit is
  'Scor audit 0-38 din cele 10 semnale (sectiunea 3.2). Prag: 8+ suni, 12+ suni primul. NU se confunda cu leads.scor (0-100, calculat din semnale Google Places).';
comment on column leads.audit_semnale is
  'Cele 10 bife: {"fara_site":true,"nu_e_mobile":false,...}. Vezi SEMNALE_AUDIT din lib/stadii.ts.';
comment on column leads.data_urmatoarei_actiuni is
  'Sursa de adevar pentru next action. Un lead in stadiu activ fara valoare aici e un lead mort (5.2).';


-- ── 2. Rezultatul apelului pe activitate ────────────────────────────────────

alter table activitati
  add column if not exists rezultat text;

comment on column activitati.rezultat is
  'nu_raspunde | interesat | nu | callback — cele 4 butoane din coada de apelare.';


-- ── 3. Pipeline 6 -> 9 stadii (sectiunea 5.2) ───────────────────────────────
-- Valorile sunt identice cu lista de validare din sheet-ul PIPELINE
-- (NVT-Tracking-Aug-Dec-2026.xlsx), ca sa ramana cele doua sincronizate.

update leads set status = '1 LEAD BRUT'            where status = 'Nou';
update leads set status = '4 CONTACTAT'            where status = 'Contactat';
update leads set status = '6 DISCUTIE PROGRAMATA'  where status = 'Interesat';
update leads set status = '7 OFERTA TRIMISA'       where status = 'Oferta';
update leads set status = '9a CASTIGAT'            where status = 'Client';
update leads set status = '9b PIERDUT'             where status = 'Pierdut';

alter table leads alter column status set default '1 LEAD BRUT';

-- Plasa de siguranta: orice status neasteptat (import vechi, typo) devine lead
-- brut, ca sa nu blocheze constrangerea de mai jos si sa lase migrarea la jumatate.
update leads set status = '1 LEAD BRUT'
 where status is null or status not in (
   '1 LEAD BRUT','2 CALIFICAT','3 IN APELARE','4 CONTACTAT','5 AUDIT TRIMIS',
   '6 DISCUTIE PROGRAMATA','7 OFERTA TRIMISA','8 NEGOCIERE',
   '9a CASTIGAT','9b PIERDUT','9c NURTURE'
 );

-- Constrangere pe valorile permise (se recreeaza la fiecare rulare)
alter table leads drop constraint if exists leads_status_valid;
alter table leads add constraint leads_status_valid check (status in (
  '1 LEAD BRUT',
  '2 CALIFICAT',
  '3 IN APELARE',
  '4 CONTACTAT',
  '5 AUDIT TRIMIS',
  '6 DISCUTIE PROGRAMATA',
  '7 OFERTA TRIMISA',
  '8 NEGOCIERE',
  '9a CASTIGAT',
  '9b PIERDUT',
  '9c NURTURE'
));


-- ── 4. Backfill coerent ─────────────────────────────────────────────────────

-- Lead-urile deja contactate primesc o data de ultima atingere si o atingere,
-- ca sa nu apara ca "netinse" in coada.
update leads
   set data_ultimei_atingeri = coalesce(data_ultimei_atingeri, data_adaugare),
       nr_atingeri = greatest(coalesce(nr_atingeri, 0), 1)
 where status not in ('1 LEAD BRUT', '2 CALIFICAT');

-- Next action mostenit din ultimul follow-up existent din activitati.
update leads l
   set data_urmatoarei_actiuni = a.ultimul
  from (
    select lead_id, max(urmator_followup) as ultimul
      from activitati
     where urmator_followup is not null
     group by lead_id
  ) a
 where a.lead_id = l.id
   and l.data_urmatoarei_actiuni is null;

update leads set do_not_call = false where do_not_call is null;
update leads set nr_atingeri  = 0     where nr_atingeri  is null;
update leads set scor_audit   = 0     where scor_audit   is null;


-- ── 5. Indexuri pentru coada ────────────────────────────────────────────────

create index if not exists idx_leads_coada
  on leads (do_not_call, status, scor_audit desc, scor desc);

create index if not exists idx_leads_next_action
  on leads (data_urmatoarei_actiuni)
  where data_urmatoarei_actiuni is not null;

create index if not exists idx_activitati_lead_data
  on activitati (lead_id, data desc);


-- ============================================================================
-- VERIFICARE — ruleaza asta INAINTE de fisier, ca sa stii ce se schimba
-- ============================================================================
-- select status, count(*) from leads group by status order by status;

-- VERIFICARE dupa rulare — nu trebuie sa mai apara niciun status vechi:
-- select status, count(*) from leads group by status order by status;
-- select count(*) as fara_next_action from leads
--  where status in ('3 IN APELARE','4 CONTACTAT','5 AUDIT TRIMIS',
--                   '6 DISCUTIE PROGRAMATA','7 OFERTA TRIMISA','8 NEGOCIERE','9c NURTURE')
--    and data_urmatoarei_actiuni is null;

-- ============================================================================
-- ROLLBACK stadii (coloanele noi le poti lasa, nu deranjeaza nimic)
-- ============================================================================
-- alter table leads drop constraint if exists leads_status_valid;
-- update leads set status = 'Nou'       where status = '1 LEAD BRUT';
-- update leads set status = 'Nou'       where status = '2 CALIFICAT';
-- update leads set status = 'Contactat' where status in ('3 IN APELARE','4 CONTACTAT','5 AUDIT TRIMIS');
-- update leads set status = 'Interesat' where status in ('6 DISCUTIE PROGRAMATA','8 NEGOCIERE');
-- update leads set status = 'Oferta'    where status = '7 OFERTA TRIMISA';
-- update leads set status = 'Client'    where status = '9a CASTIGAT';
-- update leads set status = 'Pierdut'   where status in ('9b PIERDUT','9c NURTURE');
-- alter table leads alter column status set default 'Nou';
