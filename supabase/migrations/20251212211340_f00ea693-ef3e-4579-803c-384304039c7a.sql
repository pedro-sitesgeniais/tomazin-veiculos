-- Create FIPE cache table
CREATE TABLE IF NOT EXISTS public.fipe_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL, -- 'carros', 'motos', 'caminhoes'
  codigo_fipe text NOT NULL,
  marca text NOT NULL,
  modelo text NOT NULL,
  ano_modelo text NOT NULL,
  combustivel text,
  valor text NOT NULL,
  mes_referencia text NOT NULL,
  dados jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(codigo_fipe, ano_modelo)
);

-- Enable RLS
ALTER TABLE public.fipe_cache ENABLE ROW LEVEL SECURITY;

-- Cache is publicly readable
CREATE POLICY "FIPE cache is publicly readable"
  ON public.fipe_cache
  FOR SELECT
  USING (true);

-- Admins can manage cache
CREATE POLICY "Admins can manage FIPE cache"
  ON public.fipe_cache
  FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_fipe_cache_updated_at
  BEFORE UPDATE ON public.fipe_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_fipe_cache_codigo ON public.fipe_cache(codigo_fipe);
CREATE INDEX IF NOT EXISTS idx_fipe_cache_updated ON public.fipe_cache(updated_at DESC);

-- Add valor_fipe column to veiculos table
ALTER TABLE public.veiculos ADD COLUMN IF NOT EXISTS valor_fipe numeric;
ALTER TABLE public.veiculos ADD COLUMN IF NOT EXISTS codigo_fipe text;