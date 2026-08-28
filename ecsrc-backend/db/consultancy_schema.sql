-- ================================================================
-- CONSULTANCY MODULE SCHEMA
-- Run once: psql -U postgres -d ecsrc -p 5433 -f consultancy_schema.sql
-- ================================================================

CREATE SEQUENCE IF NOT EXISTS consultancy_form_seq START 1000;

-- ---------------------------------------------------------------
-- Main acceptance form record. Principal + Firm details are stored
-- as flat columns (snapshot at submission time) rather than joined
-- from faculty_users, since firm-side data has no other home and
-- keeping principal/firm together avoids extra joins on every read.
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS consultancy_forms (
  id                    SERIAL PRIMARY KEY,
  form_code             VARCHAR(30) UNIQUE NOT NULL,
  campus                VARCHAR(20) NOT NULL CHECK (campus IN ('department','center')),
  faculty_id            INTEGER REFERENCES faculty_users(id),

  status                VARCHAR(20) NOT NULL DEFAULT 'submitted'
                          CHECK (status IN ('submitted','accepted','rejected')),
  remarks               TEXT,
  installment_type      VARCHAR(10) NOT NULL DEFAULT 'without'
                          CHECK (installment_type IN ('with','without')),

  -- Principal Consultant Details
  principal_name             TEXT,
  principal_designation      TEXT,
  principal_department       TEXT,
  principal_campus           TEXT,
  principal_contact_no       TEXT,
  principal_email            TEXT,

  -- Firm Details
  firm_consultant_type       TEXT,
  firm_name                  TEXT,
  firm_sector                TEXT,
  firm_type                  TEXT DEFAULT 'National',
  firm_district               TEXT,
  firm_state                  TEXT,
  firm_pin_code                TEXT,
  firm_address                 TEXT,
  firm_letter_ref               TEXT,
  firm_gst                       TEXT,
  firm_email                      TEXT,
  firm_tan                         TEXT,
  firm_contact_name                 TEXT,
  firm_contact_designation           TEXT,
  firm_contact_mobile                 TEXT,
  firm_pan                             TEXT,
  firm_letter_path                      TEXT,  -- uploaded PDF, set via /firm-letter endpoint

  -- Consultancy Work Details
  work_title              TEXT,
  work_abstract            TEXT,
  start_date                 DATE,
  end_date                    DATE,
  total_hours                  NUMERIC(10,2),
  has_equipment                  VARCHAR(5) DEFAULT 'no',
  equipment_name                   TEXT,
  work_type                          VARCHAR(15) CHECK (work_type IN ('proforma','permission')),

  -- Approximate Consultancy Charges (used mainly for proforma work_type)
  approx_total_charges     NUMERIC(14,2) DEFAULT 0,
  approx_tax_percent       NUMERIC(5,2) DEFAULT 18,

  created_at   TIMESTAMP DEFAULT now(),
  submitted_on DATE DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS idx_consultancy_forms_campus ON consultancy_forms(campus);
CREATE INDEX IF NOT EXISTS idx_consultancy_forms_status ON consultancy_forms(status);
CREATE INDEX IF NOT EXISTS idx_consultancy_forms_faculty ON consultancy_forms(faculty_id);

-- Co-Consultants (0..n per form)
CREATE TABLE IF NOT EXISTS consultancy_co_consultants (
  id           SERIAL PRIMARY KEY,
  form_id      INTEGER NOT NULL REFERENCES consultancy_forms(id) ON DELETE CASCADE,
  name         TEXT,
  designation  TEXT,
  campus       TEXT,
  department   TEXT,
  mobile       TEXT
);

-- Estimated Expenditure (1-1 with form)
CREATE TABLE IF NOT EXISTS consultancy_expenditure (
  id                        SERIAL PRIMARY KEY,
  form_id                   INTEGER UNIQUE NOT NULL REFERENCES consultancy_forms(id) ON DELETE CASCADE,
  manpower                  NUMERIC(14,2) DEFAULT 0,
  travel                    NUMERIC(14,2) DEFAULT 0,
  equipment                 NUMERIC(14,2) DEFAULT 0,
  contingency               NUMERIC(14,2) DEFAULT 0,
  consumables               NUMERIC(14,2) DEFAULT 0,
  consultant_remuneration   NUMERIC(14,2) DEFAULT 0,
  dept_staff_remuneration   NUMERIC(14,2) DEFAULT 0,
  external_consultant       NUMERIC(14,2) DEFAULT 0,
  subcontracting            NUMERIC(14,2) DEFAULT 0,
  hiring_services           NUMERIC(14,2) DEFAULT 0,
  other_cost_details        TEXT,
  other_cost                NUMERIC(14,2) DEFAULT 0
);

-- Installment particulars (0..n per form — each "Add Installment" submission is a new row)
CREATE TABLE IF NOT EXISTS consultancy_installments (
  id                SERIAL PRIMARY KEY,
  form_id           INTEGER NOT NULL REFERENCES consultancy_forms(id) ON DELETE CASCADE,
  frequency         VARCHAR(10) DEFAULT 'Monthly',
  month             VARCHAR(10),
  installment_no    INTEGER,
  proceedings_no    TEXT,
  proceedings_date  DATE,
  total_amount      NUMERIC(14,2) DEFAULT 0,
  released_amount   NUMERIC(14,2) DEFAULT 0,
  permission_type   VARCHAR(15) CHECK (permission_type IN ('proforma','permission') OR permission_type IS NULL),
  created_at        TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consultancy_installments_form ON consultancy_installments(form_id);

-- Consultancy charges (TDS / amount received -> GST/overhead/remuneration split).
-- source = 'wizard' when captured at acceptance-form time (permission work type),
-- source = 'installment' when captured via the Add Installment screen.
CREATE TABLE IF NOT EXISTS consultancy_charges (
  id                          SERIAL PRIMARY KEY,
  form_id                     INTEGER NOT NULL REFERENCES consultancy_forms(id) ON DELETE CASCADE,
  installment_id              INTEGER REFERENCES consultancy_installments(id) ON DELETE CASCADE,
  source                      VARCHAR(15) NOT NULL DEFAULT 'wizard' CHECK (source IN ('wizard','installment')),
  tds                         NUMERIC(14,2) DEFAULT 0,
  amount_received             NUMERIC(14,2) DEFAULT 0,
  tax_percent                 NUMERIC(5,2) DEFAULT 18,
  total_consultancy_charges   NUMERIC(14,2) DEFAULT 0,
  gst_amount                  NUMERIC(14,2) DEFAULT 0,
  overhead_amount             NUMERIC(14,2) DEFAULT 0,
  csrc_remun_enabled          BOOLEAN DEFAULT true,
  consultant_remun_amount     NUMERIC(14,2) DEFAULT 0,
  csrc_remun_amount           NUMERIC(14,2) DEFAULT 0,
  created_at                  TIMESTAMP DEFAULT now()
);

-- Invoices — one per proforma-type form
CREATE TABLE IF NOT EXISTS consultancy_invoices (
  id         SERIAL PRIMARY KEY,
  form_id    INTEGER UNIQUE NOT NULL REFERENCES consultancy_forms(id) ON DELETE CASCADE,
  status     VARCHAR(15) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','completed')),
  invoice_no TEXT,
  raised_on  DATE DEFAULT CURRENT_DATE
);

-- Payments — one per form, created once the invoice is completed
CREATE TABLE IF NOT EXISTS consultancy_payments (
  id                          SERIAL PRIMARY KEY,
  form_id                     INTEGER UNIQUE NOT NULL REFERENCES consultancy_forms(id) ON DELETE CASCADE,
  status                      VARCHAR(15) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','completed')),
  tds                         NUMERIC(14,2) DEFAULT 0,
  amount_received             NUMERIC(14,2) DEFAULT 0,
  tax_percent                 NUMERIC(5,2) DEFAULT 18,
  total_consultancy_charges   NUMERIC(14,2) DEFAULT 0,
  gst_amount                  NUMERIC(14,2) DEFAULT 0,
  overhead_amount             NUMERIC(14,2) DEFAULT 0,
  csrc_remun_enabled          BOOLEAN DEFAULT true,
  consultant_remun_amount     NUMERIC(14,2) DEFAULT 0,
  csrc_remun_amount           NUMERIC(14,2) DEFAULT 0,
  approved_on                 DATE
);

-- DD / Cheque / E-transfer split rows, shared by charges and payments
CREATE TABLE IF NOT EXISTS consultancy_split_rows (
  id           SERIAL PRIMARY KEY,
  charges_id   INTEGER REFERENCES consultancy_charges(id) ON DELETE CASCADE,
  payment_id   INTEGER REFERENCES consultancy_payments(id) ON DELETE CASCADE,
  bank_name    TEXT,
  ref_no       TEXT,
  payment_type TEXT,
  ref_date     DATE,
  amount       NUMERIC(14,2) DEFAULT 0,
  CHECK (
    (charges_id IS NOT NULL AND payment_id IS NULL) OR
    (charges_id IS NULL AND payment_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_split_rows_charges ON consultancy_split_rows(charges_id);
CREATE INDEX IF NOT EXISTS idx_split_rows_payment ON consultancy_split_rows(payment_id);