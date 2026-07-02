-- Bapita — RLS Policies
-- Run AFTER 001_initial_schema.sql

-- Helper: returns the business_id for the currently authenticated user.
-- Used in every per-tenant RLS predicate.
CREATE OR REPLACE FUNCTION my_business_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT id FROM businesses WHERE owner_id = auth.uid() LIMIT 1;
$$;

-- ─── businesses ───────────────────────────────────────────────────────────────
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "businesses: owner select"
  ON businesses FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "businesses: owner insert"
  ON businesses FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "businesses: owner update"
  ON businesses FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "businesses: owner delete"
  ON businesses FOR DELETE
  USING (owner_id = auth.uid());

-- ─── services ─────────────────────────────────────────────────────────────────
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "services: tenant select"
  ON services FOR SELECT
  USING (business_id = my_business_id());

CREATE POLICY "services: tenant insert"
  ON services FOR INSERT
  WITH CHECK (business_id = my_business_id());

CREATE POLICY "services: tenant update"
  ON services FOR UPDATE
  USING (business_id = my_business_id())
  WITH CHECK (business_id = my_business_id());

CREATE POLICY "services: tenant delete"
  ON services FOR DELETE
  USING (business_id = my_business_id());

-- ─── availability ─────────────────────────────────────────────────────────────
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "availability: tenant select"
  ON availability FOR SELECT
  USING (business_id = my_business_id());

CREATE POLICY "availability: tenant insert"
  ON availability FOR INSERT
  WITH CHECK (business_id = my_business_id());

CREATE POLICY "availability: tenant update"
  ON availability FOR UPDATE
  USING (business_id = my_business_id())
  WITH CHECK (business_id = my_business_id());

CREATE POLICY "availability: tenant delete"
  ON availability FOR DELETE
  USING (business_id = my_business_id());

-- ─── blocked_dates ────────────────────────────────────────────────────────────
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blocked_dates: tenant select"
  ON blocked_dates FOR SELECT
  USING (business_id = my_business_id());

CREATE POLICY "blocked_dates: tenant insert"
  ON blocked_dates FOR INSERT
  WITH CHECK (business_id = my_business_id());

CREATE POLICY "blocked_dates: tenant update"
  ON blocked_dates FOR UPDATE
  USING (business_id = my_business_id())
  WITH CHECK (business_id = my_business_id());

CREATE POLICY "blocked_dates: tenant delete"
  ON blocked_dates FOR DELETE
  USING (business_id = my_business_id());

-- ─── customers ────────────────────────────────────────────────────────────────
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers: tenant select"
  ON customers FOR SELECT
  USING (business_id = my_business_id());

CREATE POLICY "customers: tenant insert"
  ON customers FOR INSERT
  WITH CHECK (business_id = my_business_id());

CREATE POLICY "customers: tenant update"
  ON customers FOR UPDATE
  USING (business_id = my_business_id())
  WITH CHECK (business_id = my_business_id());

CREATE POLICY "customers: tenant delete"
  ON customers FOR DELETE
  USING (business_id = my_business_id());

-- ─── bookings ─────────────────────────────────────────────────────────────────
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Booking site (anon) can INSERT new bookings; no other anon access.
CREATE POLICY "bookings: anon insert"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "bookings: tenant select"
  ON bookings FOR SELECT
  USING (business_id = my_business_id());

CREATE POLICY "bookings: tenant update"
  ON bookings FOR UPDATE
  USING (business_id = my_business_id())
  WITH CHECK (business_id = my_business_id());

CREATE POLICY "bookings: tenant delete"
  ON bookings FOR DELETE
  USING (business_id = my_business_id());

-- ─── addons ───────────────────────────────────────────────────────────────────
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;

-- Owners can read their add-on status; only Bapita (service role) writes.
CREATE POLICY "addons: tenant select"
  ON addons FOR SELECT
  USING (business_id = my_business_id());

-- No INSERT/UPDATE/DELETE for owners — Bapita manages via service role.

-- ─── messages_log ─────────────────────────────────────────────────────────────
ALTER TABLE messages_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_log: tenant select"
  ON messages_log FOR SELECT
  USING (business_id = my_business_id());

CREATE POLICY "messages_log: tenant insert"
  ON messages_log FOR INSERT
  WITH CHECK (business_id = my_business_id());

CREATE POLICY "messages_log: tenant update"
  ON messages_log FOR UPDATE
  USING (business_id = my_business_id())
  WITH CHECK (business_id = my_business_id());

CREATE POLICY "messages_log: tenant delete"
  ON messages_log FOR DELETE
  USING (business_id = my_business_id());
