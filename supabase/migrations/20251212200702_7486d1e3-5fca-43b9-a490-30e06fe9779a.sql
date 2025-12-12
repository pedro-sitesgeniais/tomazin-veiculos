-- Create enum for lead status
CREATE TYPE public.lead_status AS ENUM (
  'novo',
  'em_atendimento',
  'aguardando_cliente',
  'proposta_enviada',
  'negociacao',
  'convertido',
  'perdido',
  'descartado'
);

-- Create enum for lead origin
CREATE TYPE public.lead_origem AS ENUM (
  'formulario_contato',
  'interesse_veiculo',
  'simulacao_financiamento',
  'avaliacao_veiculo',
  'whatsapp',
  'telefone',
  'indicacao',
  'outros'
);

-- Create enum for interaction type
CREATE TYPE public.interacao_tipo AS ENUM (
  'nota',
  'ligacao',
  'whatsapp',
  'email',
  'proposta',
  'agendamento',
  'visita'
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT NOT NULL,
  whatsapp TEXT,
  cidade TEXT,
  uf TEXT,
  cpf TEXT,
  origem lead_origem NOT NULL DEFAULT 'formulario_contato',
  veiculo_id UUID REFERENCES public.veiculos(id) ON DELETE SET NULL,
  status lead_status NOT NULL DEFAULT 'novo',
  responsavel_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  convertido_em TIMESTAMP WITH TIME ZONE,
  valor_venda NUMERIC,
  motivo_perda TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead_interacoes table
CREATE TABLE public.lead_interacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  tipo interacao_tipo NOT NULL,
  descricao TEXT NOT NULL,
  arquivo_url TEXT,
  usuario_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead_tarefas table
CREATE TABLE public.lead_tarefas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  data_limite TIMESTAMP WITH TIME ZONE,
  concluida BOOLEAN NOT NULL DEFAULT false,
  usuario_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_interacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_tarefas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads
CREATE POLICY "Admins can manage all leads" ON public.leads
  FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Editors can view leads" ON public.leads
  FOR SELECT USING (has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can update assigned leads" ON public.leads
  FOR UPDATE USING (has_role(auth.uid(), 'editor') AND responsavel_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for lead_interacoes
CREATE POLICY "Admins can manage all interactions" ON public.lead_interacoes
  FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Editors can view interactions" ON public.lead_interacoes
  FOR SELECT USING (has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can create interactions" ON public.lead_interacoes
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'editor'));

-- RLS Policies for lead_tarefas
CREATE POLICY "Admins can manage all tasks" ON public.lead_tarefas
  FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Editors can view tasks" ON public.lead_tarefas
  FOR SELECT USING (has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can manage own tasks" ON public.lead_tarefas
  FOR ALL USING (has_role(auth.uid(), 'editor') AND usuario_id = (SELECT id FROM profiles WHERE user_id = auth.uid()))
  WITH CHECK (has_role(auth.uid(), 'editor'));

-- Create triggers for updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_origem ON public.leads(origem);
CREATE INDEX idx_leads_responsavel ON public.leads(responsavel_id);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_lead_interacoes_lead ON public.lead_interacoes(lead_id);
CREATE INDEX idx_lead_tarefas_lead ON public.lead_tarefas(lead_id);