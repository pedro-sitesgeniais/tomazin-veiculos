-- Create marcas table
CREATE TABLE public.marcas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create modelos table
CREATE TABLE public.modelos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marca_id UUID NOT NULL REFERENCES public.marcas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(marca_id, nome)
);

-- Create cores table
CREATE TABLE public.cores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  hex_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create opcionais table
CREATE TABLE public.opcionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  categoria TEXT NOT NULL,
  icone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create veiculo_opcionais junction table
CREATE TABLE public.veiculo_opcionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  veiculo_id UUID NOT NULL REFERENCES public.veiculos(id) ON DELETE CASCADE,
  opcional_id UUID NOT NULL REFERENCES public.opcionais(id) ON DELETE CASCADE,
  UNIQUE(veiculo_id, opcional_id)
);

-- Create veiculo_imagens table for better image management
CREATE TABLE public.veiculo_imagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  veiculo_id UUID NOT NULL REFERENCES public.veiculos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  principal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add new columns to veiculos table
ALTER TABLE public.veiculos 
ADD COLUMN IF NOT EXISTS preco_promocional NUMERIC,
ADD COLUMN IF NOT EXISTS codigo_interno TEXT,
ADD COLUMN IF NOT EXISTS placa TEXT,
ADD COLUMN IF NOT EXISTS renavam TEXT,
ADD COLUMN IF NOT EXISTS chassi TEXT,
ADD COLUMN IF NOT EXISTS descricao_curta TEXT,
ADD COLUMN IF NOT EXISTS observacoes_internas TEXT,
ADD COLUMN IF NOT EXISTS video_youtube TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ativo';

-- Enable RLS
ALTER TABLE public.marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modelos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opcionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veiculo_opcionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veiculo_imagens ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Marcas are publicly readable" ON public.marcas FOR SELECT USING (true);
CREATE POLICY "Modelos are publicly readable" ON public.modelos FOR SELECT USING (true);
CREATE POLICY "Cores are publicly readable" ON public.cores FOR SELECT USING (true);
CREATE POLICY "Opcionais are publicly readable" ON public.opcionais FOR SELECT USING (true);
CREATE POLICY "Veiculo opcionais are publicly readable" ON public.veiculo_opcionais FOR SELECT USING (true);
CREATE POLICY "Veiculo imagens are publicly readable" ON public.veiculo_imagens FOR SELECT USING (true);

-- Admin management policies
CREATE POLICY "Admins can manage marcas" ON public.marcas FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage modelos" ON public.modelos FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage cores" ON public.cores FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage opcionais" ON public.opcionais FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage veiculo_opcionais" ON public.veiculo_opcionais FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage veiculo_imagens" ON public.veiculo_imagens FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Allow admins to manage all vehicles
CREATE POLICY "Admins can manage all vehicles" ON public.veiculos FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Create storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public) VALUES ('veiculos', 'veiculos', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Vehicle images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'veiculos');
CREATE POLICY "Admins can upload vehicle images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'veiculos' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can update vehicle images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'veiculos' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete vehicle images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'veiculos' AND public.is_admin(auth.uid()));

-- Insert initial data for marcas
INSERT INTO public.marcas (nome) VALUES 
('Chevrolet'), ('Fiat'), ('Ford'), ('Honda'), ('Hyundai'), 
('Jeep'), ('Nissan'), ('Renault'), ('Toyota'), ('Volkswagen'),
('BMW'), ('Mercedes-Benz'), ('Audi'), ('Mitsubishi'), ('Peugeot'),
('Citroën'), ('Kia'), ('Suzuki'), ('Chery'), ('Caoa Chery');

-- Insert initial data for cores
INSERT INTO public.cores (nome, hex_code) VALUES 
('Branco', '#FFFFFF'), ('Preto', '#000000'), ('Prata', '#C0C0C0'),
('Cinza', '#808080'), ('Vermelho', '#FF0000'), ('Azul', '#0000FF'),
('Verde', '#008000'), ('Amarelo', '#FFFF00'), ('Marrom', '#8B4513'),
('Bege', '#F5F5DC'), ('Dourado', '#FFD700'), ('Laranja', '#FFA500');

-- Insert initial opcionais
INSERT INTO public.opcionais (nome, categoria) VALUES 
-- Conforto
('Ar Condicionado', 'Conforto'), ('Direção Elétrica', 'Conforto'), ('Direção Hidráulica', 'Conforto'),
('Vidros Elétricos', 'Conforto'), ('Travas Elétricas', 'Conforto'), ('Bancos de Couro', 'Conforto'),
('Banco com Regulagem Elétrica', 'Conforto'), ('Banco com Aquecimento', 'Conforto'),
('Volante com Regulagem de Altura', 'Conforto'), ('Retrovisor Elétrico', 'Conforto'),
-- Segurança
('Airbag Frontal', 'Segurança'), ('Airbag Lateral', 'Segurança'), ('Airbag de Cortina', 'Segurança'),
('Freios ABS', 'Segurança'), ('Alarme', 'Segurança'), ('Sensor de Estacionamento', 'Segurança'),
('Câmera de Ré', 'Segurança'), ('Sensor de Chuva', 'Segurança'), ('Farol de Neblina', 'Segurança'),
('Controle de Tração', 'Segurança'), ('Controle de Estabilidade', 'Segurança'),
-- Tecnologia
('Central Multimídia', 'Tecnologia'), ('GPS Integrado', 'Tecnologia'), ('Bluetooth', 'Tecnologia'),
('Entrada USB', 'Tecnologia'), ('Carregador Wireless', 'Tecnologia'), ('Apple CarPlay', 'Tecnologia'),
('Android Auto', 'Tecnologia'), ('Computador de Bordo', 'Tecnologia'), ('Chave Presencial', 'Tecnologia'),
('Start/Stop', 'Tecnologia'), ('Piloto Automático', 'Tecnologia'),
-- Exterior
('Rodas de Liga Leve', 'Exterior'), ('Teto Solar', 'Exterior'), ('Teto Panorâmico', 'Exterior'),
('Rack de Teto', 'Exterior'), ('Engate', 'Exterior'), ('Farol de LED', 'Exterior'),
('Farol de Xenon', 'Exterior'), ('Retrovisores com Pisca', 'Exterior'), ('Para-choque na Cor', 'Exterior');