-- 0002_leads.sql
-- Lead capture from the homepage "Send your details" form.
-- Same trust model as 0001_waitlist: anon key may INSERT, never SELECT.
-- Run in the Supabase SQL editor (project: bapita).

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  business text,
  phone text,
  email text not null,
  source text not null default 'homepage'
);

alter table public.leads enable row level security;

-- Insert-only for anon: visitors can submit, nobody can read via the anon key.
create policy "anon can insert leads"
  on public.leads for insert
  to anon
  with check (true);

-- Light abuse guard: cap row size via constraint (PostgREST rejects oversized anyway,
-- this keeps garbage out).
alter table public.leads
  add constraint leads_name_len check (char_length(name) <= 120),
  add constraint leads_business_len check (char_length(business) <= 120),
  add constraint leads_phone_len check (char_length(phone) <= 40),
  add constraint leads_email_len check (char_length(email) <= 200);
