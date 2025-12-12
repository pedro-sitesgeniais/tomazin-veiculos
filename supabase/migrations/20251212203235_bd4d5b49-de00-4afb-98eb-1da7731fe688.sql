-- Add ordem column to marcas
ALTER TABLE public.marcas ADD COLUMN IF NOT EXISTS ordem integer DEFAULT 0;

-- Add ordem column to cores
ALTER TABLE public.cores ADD COLUMN IF NOT EXISTS ordem integer DEFAULT 0;

-- Add ordem column to opcionais
ALTER TABLE public.opcionais ADD COLUMN IF NOT EXISTS ordem integer DEFAULT 0;

-- Create status_veiculo table for customizable vehicle statuses
CREATE TABLE IF NOT EXISTS public.status_veiculo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  cor text DEFAULT '#6b7280',
  ordem integer DEFAULT 0,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.status_veiculo ENABLE ROW LEVEL SECURITY;

-- RLS policies for status_veiculo
CREATE POLICY "Status are publicly readable"
ON public.status_veiculo FOR SELECT
USING (true);

CREATE POLICY "Admins can manage status"
ON public.status_veiculo FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Insert default statuses
INSERT INTO public.status_veiculo (nome, cor, ordem) VALUES
  ('Disponível', '#22c55e', 1),
  ('Reservado', '#f59e0b', 2),
  ('Vendido', '#ef4444', 3),
  ('Em preparação', '#3b82f6', 4),
  ('Indisponível', '#6b7280', 5)
ON CONFLICT (nome) DO NOTHING;