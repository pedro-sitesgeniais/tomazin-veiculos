-- Add SEO global configs to configuracoes (without ON CONFLICT)
INSERT INTO public.configuracoes (grupo, chave, valor, tipo, ordem) VALUES
  ('seo', 'site_title', 'Tomazin Veículos', 'text', 1),
  ('seo', 'title_separator', '|', 'text', 2),
  ('seo', 'default_og_image', '', 'image', 3),
  ('seo', 'twitter_card', 'summary_large_image', 'text', 4),
  ('seo', 'robots_txt', 'User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://tomazinveiculos.com.br/sitemap.xml', 'textarea', 5),
  ('seo', 'vehicle_title_template', '{marca} {modelo} {versao} {ano} | Tomazin Veículos', 'text', 6),
  ('seo', 'vehicle_description_template', 'Compre {marca} {modelo} {ano} por {preco}. {km}km, {cambio}. Financiamento facilitado. Confira!', 'textarea', 7),
  ('seo', 'organization_name', 'Tomazin Veículos', 'text', 8),
  ('seo', 'organization_logo', '', 'image', 9),
  ('seo', 'local_business_type', 'AutoDealer', 'text', 10);