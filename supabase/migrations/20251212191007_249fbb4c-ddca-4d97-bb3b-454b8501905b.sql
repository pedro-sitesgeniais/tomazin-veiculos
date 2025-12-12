-- Create enum types for vehicle attributes
CREATE TYPE combustivel_type AS ENUM ('Flex', 'Gasolina', 'Diesel', 'Elétrico', 'Híbrido');
CREATE TYPE cambio_type AS ENUM ('Manual', 'Automático', 'CVT', 'Automatizado');
CREATE TYPE carroceria_type AS ENUM ('Sedan', 'Hatch', 'SUV', 'Picape', 'Conversível', 'Van');
CREATE TYPE condicao_type AS ENUM ('0KM', 'Seminovo');

-- Create veiculos table
CREATE TABLE public.veiculos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  versao TEXT,
  ano INTEGER NOT NULL,
  ano_fabricacao INTEGER,
  km INTEGER NOT NULL DEFAULT 0,
  preco DECIMAL(12,2) NOT NULL,
  combustivel combustivel_type NOT NULL DEFAULT 'Flex',
  cambio cambio_type NOT NULL DEFAULT 'Automático',
  carroceria carroceria_type NOT NULL DEFAULT 'Sedan',
  cor TEXT,
  portas INTEGER DEFAULT 4,
  final_placa INTEGER CHECK (final_placa >= 0 AND final_placa <= 9),
  condicao condicao_type NOT NULL DEFAULT 'Seminovo',
  imagem_principal TEXT,
  imagens TEXT[] DEFAULT '{}',
  destaque BOOLEAN NOT NULL DEFAULT false,
  ativo BOOLEAN NOT NULL DEFAULT true,
  novo BOOLEAN NOT NULL DEFAULT false,
  descricao TEXT,
  opcionais TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.veiculos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (vehicles are publicly viewable)
CREATE POLICY "Vehicles are publicly viewable" 
ON public.veiculos 
FOR SELECT 
USING (ativo = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_veiculos_updated_at
BEFORE UPDATE ON public.veiculos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_veiculos_marca ON public.veiculos(marca);
CREATE INDEX idx_veiculos_modelo ON public.veiculos(modelo);
CREATE INDEX idx_veiculos_preco ON public.veiculos(preco);
CREATE INDEX idx_veiculos_ano ON public.veiculos(ano);
CREATE INDEX idx_veiculos_km ON public.veiculos(km);
CREATE INDEX idx_veiculos_destaque ON public.veiculos(destaque);
CREATE INDEX idx_veiculos_ativo ON public.veiculos(ativo);
CREATE INDEX idx_veiculos_condicao ON public.veiculos(condicao);

-- Insert sample vehicles for testing
INSERT INTO public.veiculos (marca, modelo, versao, ano, ano_fabricacao, km, preco, combustivel, cambio, carroceria, cor, portas, final_placa, condicao, imagem_principal, destaque, novo) VALUES
('Toyota', 'Corolla', 'XEi 2.0 Flex', 2024, 2024, 0, 159900.00, 'Flex', 'Automático', 'Sedan', 'Prata', 4, 5, '0KM', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', true, true),
('Honda', 'Civic', 'Touring 1.5 Turbo', 2023, 2023, 12500, 175000.00, 'Flex', 'CVT', 'Sedan', 'Preto', 4, 3, 'Seminovo', 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800', true, false),
('Volkswagen', 'Polo', 'Highline 1.0 TSI', 2023, 2022, 28000, 98500.00, 'Flex', 'Automático', 'Hatch', 'Branco', 4, 7, 'Seminovo', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800', false, false),
('Jeep', 'Compass', 'Limited 2.0 TD', 2024, 2024, 0, 219900.00, 'Diesel', 'Automático', 'SUV', 'Vermelho', 4, 1, '0KM', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800', true, true),
('Chevrolet', 'Onix', 'LTZ 1.0 Turbo', 2022, 2022, 45000, 79900.00, 'Flex', 'Manual', 'Hatch', 'Cinza', 4, 9, 'Seminovo', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', false, false),
('Fiat', 'Pulse', 'Impetus 1.0 Turbo', 2023, 2023, 18000, 112000.00, 'Flex', 'CVT', 'SUV', 'Azul', 4, 2, 'Seminovo', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', true, false),
('Hyundai', 'HB20', 'Platinum 1.0 Turbo', 2024, 2024, 0, 105900.00, 'Flex', 'Automático', 'Hatch', 'Branco', 4, 4, '0KM', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800', false, true),
('Ford', 'Ranger', 'Limited 3.0 V6', 2024, 2024, 5000, 349900.00, 'Diesel', 'Automático', 'Picape', 'Prata', 4, 6, 'Seminovo', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', true, false),
('Nissan', 'Kicks', 'Exclusive 1.6', 2023, 2023, 22000, 125000.00, 'Flex', 'CVT', 'SUV', 'Preto', 4, 8, 'Seminovo', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800', false, false),
('BMW', '320i', 'Sport GP 2.0', 2022, 2022, 35000, 285000.00, 'Gasolina', 'Automático', 'Sedan', 'Branco', 4, 0, 'Seminovo', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', true, false),
('Mercedes-Benz', 'A200', 'Style 1.3 Turbo', 2023, 2023, 15000, 245000.00, 'Gasolina', 'Automatizado', 'Hatch', 'Preto', 4, 1, 'Seminovo', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', false, false),
('Audi', 'Q3', 'Prestige Plus 1.4', 2024, 2024, 0, 289900.00, 'Flex', 'Automático', 'SUV', 'Cinza', 4, 3, '0KM', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', true, true);