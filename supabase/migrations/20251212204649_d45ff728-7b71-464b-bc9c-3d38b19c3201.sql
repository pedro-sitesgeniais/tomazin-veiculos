-- Create integracoes table
CREATE TABLE public.integracoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portal TEXT NOT NULL,
  credenciais JSONB DEFAULT '{}'::jsonb,
  config JSONB DEFAULT '{}'::jsonb,
  mapeamento JSONB DEFAULT '{}'::jsonb,
  ativo BOOLEAN DEFAULT false,
  ultima_sincronizacao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create integracao_logs table
CREATE TABLE public.integracao_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integracao_id UUID NOT NULL REFERENCES public.integracoes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL, -- 'success', 'error', 'warning', 'info'
  mensagem TEXT NOT NULL,
  detalhes JSONB DEFAULT '{}'::jsonb,
  veiculo_id UUID REFERENCES public.veiculos(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create integracao_veiculos table
CREATE TABLE public.integracao_veiculos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integracao_id UUID NOT NULL REFERENCES public.integracoes(id) ON DELETE CASCADE,
  veiculo_id UUID NOT NULL REFERENCES public.veiculos(id) ON DELETE CASCADE,
  external_id TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'published', 'error', 'removed'
  url TEXT,
  ultimo_envio TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(integracao_id, veiculo_id)
);

-- Enable RLS
ALTER TABLE public.integracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integracao_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integracao_veiculos ENABLE ROW LEVEL SECURITY;

-- RLS policies for integracoes
CREATE POLICY "Admins can manage integracoes" ON public.integracoes
  FOR ALL USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- RLS policies for integracao_logs
CREATE POLICY "Admins can manage integracao_logs" ON public.integracao_logs
  FOR ALL USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- RLS policies for integracao_veiculos
CREATE POLICY "Admins can manage integracao_veiculos" ON public.integracao_veiculos
  FOR ALL USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_integracoes_updated_at
  BEFORE UPDATE ON public.integracoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_integracao_veiculos_updated_at
  BEFORE UPDATE ON public.integracao_veiculos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default portals
INSERT INTO public.integracoes (portal, config) VALUES
  ('olx', '{"nome": "OLX", "logo": "https://logos-world.net/wp-content/uploads/2020/11/OLX-Logo.png", "descricao": "Maior classificado do Brasil"}'),
  ('webmotors', '{"nome": "WebMotors", "logo": "https://www.webmotors.com.br/assets/img/logo-webmotors.svg", "descricao": "Portal especializado em veículos"}'),
  ('mercadolivre', '{"nome": "Mercado Livre", "logo": "https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/5.21.22/mercadolibre/logo__large_plus.png", "descricao": "Marketplace líder da América Latina"}'),
  ('icarros', '{"nome": "iCarros", "logo": "https://www.icarros.com.br/img/logo-icarros.svg", "descricao": "Portal de anúncios de veículos"}'),
  ('autoline', '{"nome": "Autoline", "logo": "https://www.autoline.com.br/images/logo.png", "descricao": "Classificados de veículos"}'),
  ('napista', '{"nome": "Na Pista", "logo": "https://napista.com.br/assets/logo.png", "descricao": "Anúncios de veículos"}'),
  ('socarrao', '{"nome": "Só Carrão", "logo": "https://www.socarrao.com.br/img/logo.png", "descricao": "Portal de carros de luxo"}');