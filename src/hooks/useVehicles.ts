import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  versao: string | null;
  ano: number;
  ano_fabricacao: number | null;
  km: number;
  preco: number;
  combustivel: 'Flex' | 'Gasolina' | 'Diesel' | 'Elétrico' | 'Híbrido';
  cambio: 'Manual' | 'Automático' | 'CVT' | 'Automatizado';
  carroceria: 'Sedan' | 'Hatch' | 'SUV' | 'Picape' | 'Conversível' | 'Van';
  cor: string | null;
  portas: number | null;
  final_placa: number | null;
  condicao: '0KM' | 'Seminovo';
  imagem_principal: string | null;
  imagens: string[] | null;
  destaque: boolean;
  ativo: boolean;
  novo: boolean;
  descricao: string | null;
  opcionais: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleFilters {
  search?: string;
  condicao?: '0KM' | 'Seminovo' | null;
  marcas?: string[];
  modelos?: string[];
  anoMin?: number;
  anoMax?: number;
  precoMin?: number;
  precoMax?: number;
  kmMin?: number;
  kmMax?: number;
  combustiveis?: string[];
  cambios?: string[];
  cores?: string[];
  carrocerias?: string[];
  portas?: number[];
  finalPlaca?: number[];
  destaque?: boolean;
  ordenacao?: 'recentes' | 'preco_asc' | 'preco_desc' | 'km_asc';
}

export function useVehicles(filters: VehicleFilters, page: number = 1, perPage: number = 12) {
  return useQuery({
    queryKey: ['vehicles', filters, page, perPage],
    queryFn: async () => {
      let query = supabase
        .from('veiculos')
        .select('*', { count: 'exact' });

      // Search filter
      if (filters.search) {
        query = query.or(`marca.ilike.%${filters.search}%,modelo.ilike.%${filters.search}%,versao.ilike.%${filters.search}%`);
      }

      // Condition filter
      if (filters.condicao) {
        query = query.eq('condicao', filters.condicao);
      }

      // Brand filter
      if (filters.marcas && filters.marcas.length > 0) {
        query = query.in('marca', filters.marcas);
      }

      // Model filter
      if (filters.modelos && filters.modelos.length > 0) {
        query = query.in('modelo', filters.modelos);
      }

      // Year range
      if (filters.anoMin) {
        query = query.gte('ano', filters.anoMin);
      }
      if (filters.anoMax) {
        query = query.lte('ano', filters.anoMax);
      }

      // Price range
      if (filters.precoMin) {
        query = query.gte('preco', filters.precoMin);
      }
      if (filters.precoMax) {
        query = query.lte('preco', filters.precoMax);
      }

      // KM range
      if (filters.kmMin !== undefined) {
        query = query.gte('km', filters.kmMin);
      }
      if (filters.kmMax) {
        query = query.lte('km', filters.kmMax);
      }

      // Fuel filter
      if (filters.combustiveis && filters.combustiveis.length > 0) {
        query = query.in('combustivel', filters.combustiveis as ('Flex' | 'Gasolina' | 'Diesel' | 'Elétrico' | 'Híbrido')[]);
      }

      // Transmission filter
      if (filters.cambios && filters.cambios.length > 0) {
        query = query.in('cambio', filters.cambios as ('Manual' | 'Automático' | 'CVT' | 'Automatizado')[]);
      }

      // Color filter
      if (filters.cores && filters.cores.length > 0) {
        query = query.in('cor', filters.cores);
      }

      // Body type filter
      if (filters.carrocerias && filters.carrocerias.length > 0) {
        query = query.in('carroceria', filters.carrocerias as ('Sedan' | 'Hatch' | 'SUV' | 'Picape' | 'Conversível' | 'Van')[]);
      }

      // Doors filter
      if (filters.portas && filters.portas.length > 0) {
        query = query.in('portas', filters.portas);
      }

      // License plate final digit
      if (filters.finalPlaca && filters.finalPlaca.length > 0) {
        query = query.in('final_placa', filters.finalPlaca);
      }

      // Featured filter
      if (filters.destaque) {
        query = query.eq('destaque', true);
      }

      // Sorting
      switch (filters.ordenacao) {
        case 'preco_asc':
          query = query.order('preco', { ascending: true });
          break;
        case 'preco_desc':
          query = query.order('preco', { ascending: false });
          break;
        case 'km_asc':
          query = query.order('km', { ascending: true });
          break;
        case 'recentes':
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Pagination
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        vehicles: data as Vehicle[],
        total: count || 0,
        totalPages: Math.ceil((count || 0) / perPage),
      };
    },
  });
}

export function useVehicleOptions() {
  return useQuery({
    queryKey: ['vehicle-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veiculos')
        .select('marca, modelo, cor, ano, preco, km');

      if (error) throw error;

      const marcas = [...new Set(data.map(v => v.marca))].sort();
      const modelos = [...new Set(data.map(v => v.modelo))].sort();
      const cores = [...new Set(data.map(v => v.cor).filter(Boolean))].sort();
      const anos = data.map(v => v.ano);
      const precos = data.map(v => Number(v.preco));
      const kms = data.map(v => v.km);

      const modelosPorMarca: Record<string, string[]> = {};
      data.forEach(v => {
        if (!modelosPorMarca[v.marca]) {
          modelosPorMarca[v.marca] = [];
        }
        if (!modelosPorMarca[v.marca].includes(v.modelo)) {
          modelosPorMarca[v.marca].push(v.modelo);
        }
      });

      return {
        marcas,
        modelos,
        modelosPorMarca,
        cores,
        anoMin: Math.min(...anos),
        anoMax: Math.max(...anos),
        precoMin: Math.min(...precos),
        precoMax: Math.max(...precos),
        kmMin: Math.min(...kms),
        kmMax: Math.max(...kms),
      };
    },
  });
}
