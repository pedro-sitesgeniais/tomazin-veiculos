import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type AvaliacaoStatus = 'pendente' | 'em_analise' | 'proposta_enviada' | 'negociacao' | 'aceito' | 'recusado' | 'concluido' | 'cancelado';

export interface Avaliacao {
  id: string;
  protocolo: string;
  marca: string;
  modelo: string;
  versao: string | null;
  ano_modelo: number;
  quilometragem: number;
  combustivel: string;
  cambio: string;
  cor: string;
  estado_geral: string;
  unico_dono: boolean;
  manual_chave_reserva: boolean;
  ipva_pago: boolean;
  possui_multas: boolean;
  observacoes: string | null;
  fotos: string[] | null;
  nome: string;
  telefone: string;
  email: string;
  cpf: string;
  cidade: string;
  uf: string;
  interesse: string;
  melhor_horario: string | null;
  status: AvaliacaoStatus;
  valor_fipe?: number | null;
  valor_avaliado?: number | null;
  justificativa_avaliacao?: string | null;
  observacoes_internas?: string | null;
  fotos_vistoria?: string[] | null;
  valor_proposto_compra?: number | null;
  valor_proposto_troca?: number | null;
  veiculo_troca_id?: string | null;
  validade_proposta?: string | null;
  avaliado_por?: string | null;
  avaliado_em?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AvaliacaoFilters {
  search: string;
  status: AvaliacaoStatus | '';
  dateFrom: string;
  dateTo: string;
}

export const STATUS_CONFIG: Record<AvaliacaoStatus, { label: string; color: string; bgColor: string }> = {
  pendente: { label: 'Pendente', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  em_analise: { label: 'Em Análise', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  proposta_enviada: { label: 'Proposta Enviada', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  negociacao: { label: 'Negociação', color: 'text-cyan-700', bgColor: 'bg-cyan-100' },
  aceito: { label: 'Aceito', color: 'text-green-700', bgColor: 'bg-green-100' },
  recusado: { label: 'Recusado', color: 'text-red-700', bgColor: 'bg-red-100' },
  concluido: { label: 'Concluído', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  cancelado: { label: 'Cancelado', color: 'text-gray-700', bgColor: 'bg-gray-100' },
};

export function useAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AvaliacaoFilters>({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });
  const { toast } = useToast();

  const fetchAvaliacoes = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('avaliacoes_veiculos')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status as any);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', `${filters.dateTo}T23:59:59`);
      }

      if (filters.search) {
        query = query.or(`protocolo.ilike.%${filters.search}%,nome.ilike.%${filters.search}%,marca.ilike.%${filters.search}%,modelo.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAvaliacoes((data || []) as Avaliacao[]);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar avaliações',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchAvaliacoes();
  }, [fetchAvaliacoes]);

  const updateFilter = (key: keyof AvaliacaoFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const updateAvaliacao = async (id: string, updates: Partial<Avaliacao>) => {
    try {
      const { error } = await supabase
        .from('avaliacoes_veiculos')
        .update(updates as any)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Avaliação atualizada',
        description: 'Os dados foram salvos com sucesso.',
      });

      fetchAvaliacoes();
      return true;
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const getStatusCounts = () => {
    const counts: Record<string, number> = {};
    Object.keys(STATUS_CONFIG).forEach(status => {
      counts[status] = avaliacoes.filter(a => a.status === status).length;
    });
    return counts;
  };

  return {
    avaliacoes,
    loading,
    filters,
    updateFilter,
    updateAvaliacao,
    refetch: fetchAvaliacoes,
    statusCounts: getStatusCounts(),
  };
}

export function useAvaliacao(id: string) {
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [veiculos, setVeiculos] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchAvaliacao = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('avaliacoes_veiculos')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setAvaliacao(data as Avaliacao | null);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar avaliação',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  const fetchVeiculos = useCallback(async () => {
    const { data } = await supabase
      .from('veiculos')
      .select('id, marca, modelo, versao, ano, preco')
      .eq('ativo', true)
      .order('marca');
    setVeiculos(data || []);
  }, []);

  useEffect(() => {
    fetchAvaliacao();
    fetchVeiculos();
  }, [fetchAvaliacao, fetchVeiculos]);

  const updateAvaliacao = async (updates: Partial<Avaliacao>) => {
    try {
      const { error } = await supabase
        .from('avaliacoes_veiculos')
        .update(updates as any)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Avaliação atualizada',
        description: 'Os dados foram salvos com sucesso.',
      });

      fetchAvaliacao();
      return true;
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    avaliacao,
    loading,
    veiculos,
    updateAvaliacao,
    refetch: fetchAvaliacao,
  };
}
