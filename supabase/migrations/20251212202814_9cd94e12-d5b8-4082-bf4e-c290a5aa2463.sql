-- Create configuracoes table
CREATE TABLE public.configuracoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text UNIQUE NOT NULL,
  valor text,
  tipo text DEFAULT 'text' CHECK (tipo IN ('text', 'textarea', 'color', 'image', 'boolean', 'json', 'number')),
  grupo text NOT NULL,
  ordem integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Configuracoes are publicly readable" ON public.configuracoes FOR SELECT USING (true);

-- Admin management policy
CREATE POLICY "Admins can manage configuracoes" ON public.configuracoes FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON public.configuracoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default configurations
INSERT INTO public.configuracoes (chave, valor, tipo, grupo, ordem) VALUES
-- Dados da Empresa
('empresa_nome', 'Tomazin Veículos', 'text', 'empresa', 1),
('empresa_cnpj', '', 'text', 'empresa', 2),
('empresa_razao_social', '', 'text', 'empresa', 3),
('empresa_endereco', '', 'text', 'empresa', 4),
('empresa_cep', '', 'text', 'empresa', 5),
('empresa_cidade', '', 'text', 'empresa', 6),
('empresa_uf', '', 'text', 'empresa', 7),
('empresa_telefone', '', 'text', 'empresa', 8),
('empresa_whatsapp', '', 'text', 'empresa', 9),
('empresa_email', '', 'text', 'empresa', 10),
('empresa_email_notificacoes', '', 'text', 'empresa', 11),
('empresa_horario', '{"seg": "08:00-18:00", "ter": "08:00-18:00", "qua": "08:00-18:00", "qui": "08:00-18:00", "sex": "08:00-18:00", "sab": "08:00-12:00", "dom": "Fechado"}', 'json', 'empresa', 12),
('empresa_maps_embed', '', 'textarea', 'empresa', 13),
('empresa_lat', '', 'text', 'empresa', 14),
('empresa_lng', '', 'text', 'empresa', 15),

-- Redes Sociais
('social_instagram', '', 'text', 'social', 1),
('social_facebook', '', 'text', 'social', 2),
('social_youtube', '', 'text', 'social', 3),
('social_tiktok', '', 'text', 'social', 4),
('social_linkedin', '', 'text', 'social', 5),

-- Identidade Visual
('visual_logo_principal', '', 'image', 'visual', 1),
('visual_logo_branca', '', 'image', 'visual', 2),
('visual_logo_icone', '', 'image', 'visual', 3),
('visual_favicon', '', 'image', 'visual', 4),
('visual_cor_primaria', '#1a365d', 'color', 'visual', 5),
('visual_cor_secundaria', '#c53030', 'color', 'visual', 6),

-- Integrações
('integracao_ga_id', '', 'text', 'integracao', 1),
('integracao_gtm_id', '', 'text', 'integracao', 2),
('integracao_fb_pixel', '', 'text', 'integracao', 3),
('integracao_whatsapp_msg_padrao', 'Olá! Gostaria de mais informações.', 'textarea', 'integracao', 4),
('integracao_whatsapp_msg_veiculo', 'Olá! Tenho interesse no {marca} {modelo} {ano} por {preco}. Podemos conversar?', 'textarea', 'integracao', 5),

-- SEO Global
('seo_meta_title', 'Tomazin Veículos - Seminovos de Qualidade', 'text', 'seo', 1),
('seo_meta_description', 'Os melhores veículos seminovos com garantia e procedência. Financiamento facilitado e avaliação grátis.', 'textarea', 'seo', 2),
('seo_keywords', 'carros seminovos, veículos usados, financiamento de carros', 'text', 'seo', 3),
('seo_og_image', '', 'image', 'seo', 4),
('seo_scripts_head', '', 'textarea', 'seo', 5),
('seo_scripts_body', '', 'textarea', 'seo', 6),

-- Emails
('email_notificacao_leads', '', 'text', 'email', 1),
('email_notificacao_avaliacoes', '', 'text', 'email', 2),
('email_resposta_automatica', '<p>Obrigado por entrar em contato! Em breve retornaremos.</p>', 'textarea', 'email', 3),

-- Sistema
('sistema_manutencao', 'false', 'boolean', 'sistema', 1),
('sistema_msg_manutencao', 'Estamos em manutenção. Voltamos em breve!', 'textarea', 'sistema', 2);