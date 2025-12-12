-- Create banners table
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo_interno text NOT NULL,
  imagem_desktop text NOT NULL,
  imagem_mobile text,
  titulo_overlay text,
  subtitulo_overlay text,
  texto_botao text,
  link_botao text,
  posicao_texto text DEFAULT 'centro' CHECK (posicao_texto IN ('esquerda', 'centro', 'direita')),
  ordem integer DEFAULT 0,
  ativo boolean DEFAULT true,
  data_inicio timestamp with time zone,
  data_fim timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create paginas table
CREATE TABLE public.paginas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  titulo text NOT NULL,
  conteudo text,
  meta_title text,
  meta_description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create depoimentos table
CREATE TABLE public.depoimentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  foto_url text,
  depoimento text NOT NULL,
  avaliacao integer DEFAULT 5 CHECK (avaliacao >= 1 AND avaliacao <= 5),
  data date DEFAULT CURRENT_DATE,
  ativo boolean DEFAULT true,
  ordem integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create home_config table
CREATE TABLE public.home_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  secao text UNIQUE NOT NULL,
  config jsonb DEFAULT '{}',
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paginas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.depoimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_config ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Banners are publicly readable" ON public.banners FOR SELECT USING (ativo = true AND (data_inicio IS NULL OR data_inicio <= now()) AND (data_fim IS NULL OR data_fim >= now()));
CREATE POLICY "Paginas are publicly readable" ON public.paginas FOR SELECT USING (true);
CREATE POLICY "Depoimentos are publicly readable" ON public.depoimentos FOR SELECT USING (ativo = true);
CREATE POLICY "Home config is publicly readable" ON public.home_config FOR SELECT USING (true);

-- Admin policies
CREATE POLICY "Admins can manage banners" ON public.banners FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can manage paginas" ON public.paginas FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can manage depoimentos" ON public.depoimentos FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can manage home_config" ON public.home_config FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_paginas_updated_at BEFORE UPDATE ON public.paginas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_depoimentos_updated_at BEFORE UPDATE ON public.depoimentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_home_config_updated_at BEFORE UPDATE ON public.home_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default pages
INSERT INTO public.paginas (slug, titulo, conteudo) VALUES
  ('quem-somos', 'Quem Somos', '<h2>Sobre a Tomazin Veículos</h2><p>Conte sua história aqui...</p>'),
  ('politica-privacidade', 'Política de Privacidade', '<h2>Política de Privacidade</h2><p>Seus termos aqui...</p>'),
  ('termos-uso', 'Termos de Uso', '<h2>Termos de Uso</h2><p>Seus termos aqui...</p>');

-- Insert default home config
INSERT INTO public.home_config (secao, config) VALUES
  ('hero', '{"titulo": "Encontre o carro dos seus sonhos", "subtitulo": "Os melhores seminovos com garantia e procedência"}'),
  ('por_que_escolher', '{"titulo": "Por que escolher a Tomazin?", "cards": []}'),
  ('depoimentos', '{"titulo": "O que nossos clientes dizem"}'),
  ('localizacao', '{"titulo": "Venha nos visitar"}'),
  ('cta_avaliacao', '{"titulo": "Quer vender ou trocar seu veículo?", "subtitulo": "Faça uma avaliação gratuita", "texto_botao": "Avaliar meu veículo"}');