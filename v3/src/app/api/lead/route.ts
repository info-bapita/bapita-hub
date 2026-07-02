import { NextResponse } from "next/server";

// POST /api/lead  { name, business?, phone?, email }
// Inserts into the `leads` table on Supabase via PostgREST.
// Same trust model as /api/waitlist: anon key + insert-only RLS policy.
// See docs/migrations/0002_leads.sql for the table + policy.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { name?: string; business?: string; phone?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 120);
  const business = (body.business ?? "").trim().slice(0, 120);
  const phone = (body.phone ?? "").trim().slice(0, 40);
  const email = (body.email ?? "").trim().toLowerCase().slice(0, 200);

  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("[lead] Missing Supabase env vars");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const res = await fetch(`${url}/rest/v1/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name,
      business: business || null,
      phone: phone || null,
      email,
      source: "homepage",
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("[lead] Supabase insert failed", res.status, detail);
    return NextResponse.json({ error: "Could not save" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
