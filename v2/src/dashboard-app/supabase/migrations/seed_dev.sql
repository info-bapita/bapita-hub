-- Bapita — Dev Seed Data
-- Requires: 001 + 002 migrations already applied.
-- Run as service role (bypasses RLS).
--
-- Creates:
--   - 1 auth user  (test@bapita.dev / Test1234!)
--   - 1 business   (Cohen Barbershop, Herzliya)
--   - 3 services
--   - 7-day availability (Sun–Thu open, Fri half-day, Sat closed)
--   - 3 sample customers
--   - 4 bookings for today (2026-06-08)

-- ─── fixed UUIDs for easy re-runs ─────────────────────────────────────────────
DO $$
DECLARE
  v_owner_id    UUID := 'aaaaaaaa-0000-0000-0000-000000000001';
  v_biz_id      UUID := 'bbbbbbbb-0000-0000-0000-000000000001';
  v_svc_cut_id  UUID := 'cccccccc-0000-0000-0000-000000000001';
  v_svc_beard_id UUID := 'cccccccc-0000-0000-0000-000000000002';
  v_svc_kids_id  UUID := 'cccccccc-0000-0000-0000-000000000003';
  v_cust1_id    UUID := 'dddddddd-0000-0000-0000-000000000001';
  v_cust2_id    UUID := 'dddddddd-0000-0000-0000-000000000002';
  v_cust3_id    UUID := 'dddddddd-0000-0000-0000-000000000003';
BEGIN

-- ─── auth user ────────────────────────────────────────────────────────────────
-- Inserts directly into auth schema (requires service role / SQL editor as postgres)
INSERT INTO auth.users (
  id, instance_id, aud, role,
  email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, confirmation_token, recovery_token,
  email_change_token_new, email_change
)
VALUES (
  v_owner_id,
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'test@bapita.dev',
  -- bcrypt hash of 'Test1234!'
  '$2a$10$PH/3tBzJPiXyNNFSgYsL9OVrChGNLPDlVfxTqVpBh6g6c3AuTD0Oq',
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  FALSE, '', '', '', ''
)
ON CONFLICT (id) DO NOTHING;

-- ─── business ─────────────────────────────────────────────────────────────────
INSERT INTO businesses (
  id, owner_id, name, slug, type,
  address, phone, email,
  instagram_url, google_review_link,
  created_at
) VALUES (
  v_biz_id, v_owner_id,
  'מספרת כהן', 'cohen-barbershop', 'barbershop',
  'רחוב הרצל 14, הרצליה', '054-000-0001', 'cohen@example.com',
  'https://instagram.com/cohen.barbershop',
  'https://g.page/r/cohen-barbershop',
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ─── services ─────────────────────────────────────────────────────────────────
INSERT INTO services (id, business_id, name, duration_minutes, price_nis, description, active, display_order)
VALUES
  (v_svc_cut_id,   v_biz_id, 'תספורת גבר',     30, 80,  'תספורת גבר קלאסית',              TRUE, 1),
  (v_svc_beard_id, v_biz_id, 'תספורת + זקן',   45, 120, 'תספורת גבר כולל עיצוב זקן',      TRUE, 2),
  (v_svc_kids_id,  v_biz_id, 'תספורת ילדים',   20, 60,  'תספורת לילדים עד גיל 12',         TRUE, 3)
ON CONFLICT (id) DO NOTHING;

-- ─── availability (Sun=0 … Sat=6) ────────────────────────────────────────────
INSERT INTO availability (business_id, day_of_week, open_time, close_time, is_open)
VALUES
  (v_biz_id, 0, '09:00', '19:00', TRUE),  -- Sun
  (v_biz_id, 1, '09:00', '19:00', TRUE),  -- Mon
  (v_biz_id, 2, '09:00', '19:00', TRUE),  -- Tue
  (v_biz_id, 3, '09:00', '19:00', TRUE),  -- Wed
  (v_biz_id, 4, '09:00', '19:00', TRUE),  -- Thu
  (v_biz_id, 5, '09:00', '14:00', TRUE),  -- Fri (half-day)
  (v_biz_id, 6, '09:00', '13:00', FALSE)  -- Sat (closed)
ON CONFLICT DO NOTHING;

-- ─── customers ────────────────────────────────────────────────────────────────
INSERT INTO customers (id, business_id, name, phone, email, preferred_language, total_visits, last_visit_at, created_at)
VALUES
  (v_cust1_id, v_biz_id, 'יוסי לוי',    '052-111-1111', 'yossi@example.com', 'he', 8,  NOW() - INTERVAL '14 days', NOW() - INTERVAL '60 days'),
  (v_cust2_id, v_biz_id, 'דניאל כהן',   '053-222-2222', 'daniel@example.com','he', 3,  NOW() - INTERVAL '7 days',  NOW() - INTERVAL '30 days'),
  (v_cust3_id, v_biz_id, 'Amer Mansour', '050-333-3333', 'amer@example.com',  'ar', 1,  NULL,                        NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- ─── bookings for today (2026-06-08) ─────────────────────────────────────────
INSERT INTO bookings (
  business_id, service_id, customer_id,
  customer_name, customer_phone, customer_email,
  appointment_date, appointment_time,
  status, payment_status, notes, created_at
)
VALUES
  -- 09:00 confirmed
  (v_biz_id, v_svc_cut_id,   v_cust1_id,
   'יוסי לוי',    '052-111-1111', 'yossi@example.com',
   '2026-06-08', '09:00', 'confirmed', 'none',   NULL,              NOW() - INTERVAL '2 days'),

  -- 10:00 pending (new client)
  (v_biz_id, v_svc_beard_id, v_cust3_id,
   'Amer Mansour', '050-333-3333', 'amer@example.com',
   '2026-06-08', '10:00', 'pending',   'none',   'First time',      NOW() - INTERVAL '1 day'),

  -- 11:00 confirmed (kids)
  (v_biz_id, v_svc_kids_id,  v_cust2_id,
   'דניאל כהן',   '053-222-2222', 'daniel@example.com',
   '2026-06-08', '11:00', 'confirmed', 'none',   NULL,              NOW() - INTERVAL '3 days'),

  -- 14:00 walk-in (no customer record)
  (v_biz_id, v_svc_cut_id,   NULL,
   'Walk-in',     '050-000-0000', NULL,
   '2026-06-08', '14:00', 'confirmed', 'cash',   'Walk-in, paid cash', NOW())
ON CONFLICT DO NOTHING;

-- ─── addons (all inactive — Bapita activates via service role) ────────────────
INSERT INTO addons (business_id, addon_type, active, meta)
VALUES
  (v_biz_id, 'whatsapp',       FALSE, '{"reminders_sent":0,"review_requests_sent":0,"bot_conversations_month":0}'::jsonb),
  (v_biz_id, 'stripe',         FALSE, '{"payments_processed":0,"total_amount_month":0}'::jsonb),
  (v_biz_id, 'google_business',FALSE, NULL)
ON CONFLICT DO NOTHING;

END $$;
