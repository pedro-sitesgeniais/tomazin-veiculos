-- Create enum for evaluation status
CREATE TYPE public.avaliacao_status AS ENUM ('pendente', 'em_analise', 'proposta_enviada', 'concluido', 'cancelado');

-- Create enum for vehicle condition
CREATE TYPE public.estado_veiculo AS ENUM ('Excelente', 'Bom', 'Regular', 'Precisa reparos');

-- Create enum for evaluation interest
CREATE TYPE public.interesse_avaliacao AS ENUM ('Vender', 'Trocar por outro', 'Apenas avaliação');

-- Create table for vehicle evaluations
CREATE TABLE public.avaliacoes_veiculos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  protocolo TEXT NOT NULL UNIQUE,
  
  -- Vehicle data (Step 1)
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  ano_modelo INTEGER NOT NULL,
  versao TEXT,
  combustivel TEXT NOT NULL,
  cambio TEXT NOT NULL,
  cor TEXT NOT NULL,
  quilometragem INTEGER NOT NULL,
  
  -- Vehicle condition (Step 2)
  unico_dono BOOLEAN NOT NULL DEFAULT false,
  manual_chave_reserva BOOLEAN NOT NULL DEFAULT false,
  ipva_pago BOOLEAN NOT NULL DEFAULT false,
  possui_multas BOOLEAN NOT NULL DEFAULT false,
  estado_geral public.estado_veiculo NOT NULL,
  observacoes TEXT,
  
  -- Photos (Step 3)
  fotos TEXT[] DEFAULT '{}'::TEXT[],
  
  -- Owner data (Step 4)
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  cidade TEXT NOT NULL,
  uf TEXT NOT NULL,
  melhor_horario TEXT,
  interesse public.interesse_avaliacao NOT NULL,
  aceite_lgpd BOOLEAN NOT NULL DEFAULT true,
  
  -- Status and timestamps
  status public.avaliacao_status NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.avaliacoes_veiculos ENABLE ROW LEVEL SECURITY;

-- Public insert policy (anyone can submit evaluation)
CREATE POLICY "Anyone can create evaluations"
ON public.avaliacoes_veiculos
FOR INSERT
WITH CHECK (true);

-- Allow reading own evaluation by protocolo
CREATE POLICY "Anyone can read evaluations by protocolo"
ON public.avaliacoes_veiculos
FOR SELECT
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_avaliacoes_updated_at
BEFORE UPDATE ON public.avaliacoes_veiculos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for evaluation photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avaliacoes-fotos',
  'avaliacoes-fotos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Storage policies for photos
CREATE POLICY "Anyone can upload evaluation photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'avaliacoes-fotos');

CREATE POLICY "Anyone can view evaluation photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avaliacoes-fotos');