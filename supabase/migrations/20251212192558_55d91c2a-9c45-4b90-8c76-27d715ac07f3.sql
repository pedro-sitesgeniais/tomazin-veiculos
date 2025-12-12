-- Create table for financing simulations
CREATE TABLE public.simulacoes_financiamento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  valor_veiculo NUMERIC NOT NULL,
  valor_entrada NUMERIC NOT NULL,
  prazo INTEGER NOT NULL,
  taxa_juros NUMERIC NOT NULL,
  valor_financiado NUMERIC NOT NULL,
  valor_parcela NUMERIC NOT NULL,
  total_pagar NUMERIC NOT NULL,
  custo_financiamento NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for credit analysis requests
CREATE TABLE public.solicitacoes_credito (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  renda_mensal NUMERIC NOT NULL,
  veiculo_interesse_id UUID REFERENCES public.veiculos(id),
  possui_veiculo_troca BOOLEAN NOT NULL DEFAULT false,
  aceite_lgpd BOOLEAN NOT NULL DEFAULT true,
  simulacao_id UUID REFERENCES public.simulacoes_financiamento(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.simulacoes_financiamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes_credito ENABLE ROW LEVEL SECURITY;

-- Public insert policy for simulations (anyone can simulate)
CREATE POLICY "Anyone can create simulations"
ON public.simulacoes_financiamento
FOR INSERT
WITH CHECK (true);

-- Public insert policy for credit requests (anyone can request)
CREATE POLICY "Anyone can request credit analysis"
ON public.solicitacoes_credito
FOR INSERT
WITH CHECK (true);

-- Allow reading own simulations (by id)
CREATE POLICY "Simulations are publicly readable"
ON public.simulacoes_financiamento
FOR SELECT
USING (true);