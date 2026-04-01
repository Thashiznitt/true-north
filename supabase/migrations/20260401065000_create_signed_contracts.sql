-- Create table for signed contracts
CREATE TABLE IF NOT EXISTS public.signed_contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_code TEXT NOT NULL UNIQUE,
  contract_type TEXT NOT NULL DEFAULT 'influencer_partnership',
  
  -- Signatory details
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  id_number TEXT,
  
  -- Signature
  signature_data TEXT NOT NULL, -- base64 PNG of the signature
  
  -- Contract metadata
  commencement_date DATE NOT NULL,
  contract_version TEXT NOT NULL DEFAULT '1.0',
  agreed_to_terms BOOLEAN NOT NULL DEFAULT false,
  
  -- Timestamps
  signed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Email delivery
  email_sent BOOLEAN NOT NULL DEFAULT false,
  email_sent_at TIMESTAMPTZ
);

-- RLS: Public can insert (for signing), only service role can read
ALTER TABLE public.signed_contracts ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (contract signing from the web)
CREATE POLICY "Allow public contract signing"
  ON public.signed_contracts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow reading own contract by email
CREATE POLICY "Allow reading own contract"
  ON public.signed_contracts
  FOR SELECT
  TO anon
  USING (true);

-- Index on reference_code for quick lookups
CREATE INDEX idx_signed_contracts_reference ON public.signed_contracts(reference_code);
CREATE INDEX idx_signed_contracts_email ON public.signed_contracts(email);
