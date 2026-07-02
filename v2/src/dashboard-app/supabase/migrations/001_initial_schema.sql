-- Bapita — Initial Schema
-- Run with: supabase db push  OR  paste into Supabase SQL editor (service role)

-- uuid-ossp not needed — using gen_random_uuid() (built-in Postgres 13+)

-- ─── businesses ───────────────────────────────────────────────────────────────
CREATE TABLE businesses (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name                 TEXT NOT NULL,
  slug                 TEXT NOT NULL UNIQUE,
  type                 TEXT,
  address              TEXT,
  phone                TEXT,
  email                TEXT,
  instagram_url        TEXT,
  logo_url             TEXT,
  cover_image_url      TEXT,
  google_review_link   TEXT,
  faq_context          JSONB,
  meta_phone_number_id TEXT,
  stripe_account_id    TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── services ─────────────────────────────────────────────────────────────────
CREATE TABLE services (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  duration_minutes INT  NOT NULL,
  price_nis        NUMERIC(10,2) NOT NULL,
  description      TEXT,
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  display_order    INT NOT NULL DEFAULT 0
);

-- ─── availability ─────────────────────────────────────────────────────────────
CREATE TABLE availability (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  day_of_week INT  NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
  open_time   TIME NOT NULL,
  close_time  TIME NOT NULL,
  is_open     BOOLEAN NOT NULL DEFAULT TRUE
);

-- ─── blocked_dates ────────────────────────────────────────────────────────────
CREATE TABLE blocked_dates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  reason      TEXT
);

-- ─── customers ────────────────────────────────────────────────────────────────
CREATE TABLE customers (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id        UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  phone              TEXT,
  email              TEXT,
  preferred_language TEXT CHECK (preferred_language IN ('he', 'ar', 'en')),
  total_visits       INT NOT NULL DEFAULT 0,
  last_visit_at      TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── bookings ─────────────────────────────────────────────────────────────────
CREATE TABLE bookings (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id          UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  service_id           UUID REFERENCES services(id) ON DELETE SET NULL,
  customer_id          UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name        TEXT NOT NULL,
  customer_phone       TEXT,
  customer_email       TEXT,
  appointment_date     DATE NOT NULL,
  appointment_time     TIME NOT NULL,
  status               TEXT NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','confirmed','completed','cancelled','no_show')),
  payment_status       TEXT NOT NULL DEFAULT 'none'
                         CHECK (payment_status IN ('none','cash','transfer','stripe')),
  notes                TEXT,
  checkout_at          TIMESTAMPTZ,
  google_cal_event_id  TEXT,
  reminder_24h_sent_at TIMESTAMPTZ,
  reminder_2h_sent_at  TIMESTAMPTZ,
  review_sent_at       TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── addons ───────────────────────────────────────────────────────────────────
CREATE TABLE addons (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  addon_type   TEXT NOT NULL CHECK (addon_type IN ('whatsapp','stripe','google_business')),
  active       BOOLEAN NOT NULL DEFAULT FALSE,
  activated_at TIMESTAMPTZ,
  meta         JSONB
);

-- ─── messages_log ─────────────────────────────────────────────────────────────
CREATE TABLE messages_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id     UUID REFERENCES customers(id) ON DELETE SET NULL,
  direction       TEXT NOT NULL CHECK (direction IN ('in','out')),
  content         TEXT,
  meta_message_id TEXT,
  status          TEXT NOT NULL DEFAULT 'sent'
                    CHECK (status IN ('sent','delivered','read','failed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_services_business_id      ON services(business_id);
CREATE INDEX idx_availability_business_id  ON availability(business_id);
CREATE INDEX idx_blocked_dates_business_id ON blocked_dates(business_id, date);
CREATE INDEX idx_customers_business_id     ON customers(business_id);
CREATE INDEX idx_bookings_business_id      ON bookings(business_id);
CREATE INDEX idx_bookings_date             ON bookings(business_id, appointment_date);
CREATE INDEX idx_addons_business_id        ON addons(business_id);
CREATE INDEX idx_messages_log_business_id  ON messages_log(business_id);

-- ─── real-time ────────────────────────────────────────────────────────────────
-- Enable real-time on bookings (dashboard live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
