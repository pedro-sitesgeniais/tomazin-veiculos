import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type TipoVeiculo = 'carros' | 'motos' | 'caminhoes';

export interface FipeMarca {
  codigo: string;
  nome: string;
}

export interface FipeModelo {
  codigo: number;
  nome: string;
}

export interface FipeAno {
  codigo: string;
  nome: string;
}

export interface FipeValor {
  valor: string;
  marca: string;
  modelo: string;
  anoModelo: number;
  combustivel: string;
  codigoFipe: string;
  mesReferencia: string;
  tipoVeiculo: number;
  siglaCombustivel: string;
}

export interface FipeCacheEntry {
  id: string;
  tipo: string;
  codigo_fipe: string;
  marca: string;
  modelo: string;
  ano_modelo: string;
  combustivel: string | null;
  valor: string;
  mes_referencia: string;
  dados: any;
  created_at: string;
  updated_at: string;
}

const invokeFipe = async (action: string, params: Record<string, string>) => {
  const { data, error } = await supabase.functions.invoke('fipe', {
    body: { action, ...params }
  });

  if (error) throw error;
  return data;
};

export function useFipeMarcas(tipo: TipoVeiculo, enabled = true) {
  return useQuery({
    queryKey: ['fipe', 'marcas', tipo],
    queryFn: () => invokeFipe('marcas', { tipo }),
    enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useFipeModelos(tipo: TipoVeiculo, marcaId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['fipe', 'modelos', tipo, marcaId],
    queryFn: () => invokeFipe('modelos', { tipo, marcaId: marcaId! }),
    enabled: enabled && !!marcaId,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useFipeAnos(tipo: TipoVeiculo, marcaId: string | null, modeloId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['fipe', 'anos', tipo, marcaId, modeloId],
    queryFn: () => invokeFipe('anos', { tipo, marcaId: marcaId!, modeloId: modeloId! }),
    enabled: enabled && !!marcaId && !!modeloId,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useFipeValor() {
  return useMutation({
    mutationFn: async ({ 
      tipo, 
      marcaId, 
      modeloId, 
      anoId 
    }: { 
      tipo: TipoVeiculo; 
      marcaId: string; 
      modeloId: string; 
      anoId: string 
    }) => {
      const data = await invokeFipe('valor', { tipo, marcaId, modeloId, anoId });
      return data as FipeValor;
    },
    onError: (error) => {
      toast({ 
        title: 'Erro ao consultar FIPE', 
        description: error.message, 
        variant: 'destructive' 
      });
    }
  });
}

export function useFipeCache() {
  const queryClient = useQueryClient();

  const { data: cache = [], isLoading } = useQuery({
    queryKey: ['fipe-cache'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fipe_cache')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as FipeCacheEntry[];
    }
  });

  const clearCache = useMutation({
    mutationFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { error } = await supabase
        .from('fipe_cache')
        .delete()
        .lt('updated_at', thirtyDaysAgo.toISOString());

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fipe-cache'] });
      toast({ title: 'Cache limpo com sucesso' });
    }
  });

  return { cache, isLoading, clearCache };
}

// Helper function to get FIPE value from cache or null
export async function getFipeValue(codigoFipe: string, anoModelo: string): Promise<FipeCacheEntry | null> {
  const { data } = await supabase
    .from('fipe_cache')
    .select('*')
    .eq('codigo_fipe', codigoFipe)
    .eq('ano_modelo', anoModelo)
    .maybeSingle();

  return data as FipeCacheEntry | null;
}

// Parse FIPE value string to number
export function parseFipeValue(valorFipe: string): number {
  return parseFloat(valorFipe.replace('R$ ', '').replace('.', '').replace(',', '.'));
}

// Format number to FIPE value string
export function formatFipeValue(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
