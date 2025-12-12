import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Integracao {
  id: string;
  portal: string;
  credenciais: {
    api_key?: string;
    account_id?: string;
    store_url?: string;
  };
  config: {
    nome?: string;
    logo?: string;
    descricao?: string;
    auto_publish?: boolean;
    only_active?: boolean;
    condition_filter?: string[];
    price_min?: number;
    price_max?: number;
    ad_type?: string;
    highlight?: boolean;
    description_template?: string;
    include_phone?: boolean;
    include_website?: boolean;
  };
  mapeamento: {
    categorias?: Record<string, string>;
    cores?: Record<string, string>;
    combustiveis?: Record<string, string>;
  };
  ativo: boolean;
  ultima_sincronizacao: string | null;
  created_at: string;
  updated_at: string;
}

export interface IntegracaoLog {
  id: string;
  integracao_id: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  mensagem: string;
  detalhes: Record<string, unknown>;
  veiculo_id: string | null;
  created_at: string;
}

export interface IntegracaoVeiculo {
  id: string;
  integracao_id: string;
  veiculo_id: string;
  external_id: string | null;
  status: 'pending' | 'published' | 'error' | 'removed';
  url: string | null;
  ultimo_envio: string | null;
  created_at: string;
  updated_at: string;
}

export function useIntegracoes() {
  const queryClient = useQueryClient();

  const { data: integracoes = [], isLoading, refetch } = useQuery({
    queryKey: ['integracoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integracoes')
        .select('*')
        .order('portal');
      
      if (error) throw error;
      return data as unknown as Integracao[];
    },
  });

  const updateIntegracao = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Integracao> & { id: string }) => {
      const { error } = await supabase
        .from('integracoes')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integracoes'] });
      toast({ title: 'Integração atualizada com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar integração', description: error.message, variant: 'destructive' });
    },
  });

  const toggleAtivo = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase
        .from('integracoes')
        .update({ ativo })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, { ativo }) => {
      queryClient.invalidateQueries({ queryKey: ['integracoes'] });
      toast({ title: ativo ? 'Integração ativada!' : 'Integração desativada!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar status', description: error.message, variant: 'destructive' });
    },
  });

  return {
    integracoes,
    isLoading,
    refetch,
    updateIntegracao,
    toggleAtivo,
  };
}

export function useIntegracaoLogs(integracaoId?: string) {
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['integracao-logs', integracaoId],
    queryFn: async () => {
      let query = supabase
        .from('integracao_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (integracaoId) {
        query = query.eq('integracao_id', integracaoId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as IntegracaoLog[];
    },
    enabled: true,
  });

  const addLog = useMutation({
    mutationFn: async (log: Omit<IntegracaoLog, 'id' | 'created_at'>) => {
      const { error } = await supabase
        .from('integracao_logs')
        .insert([{
          integracao_id: log.integracao_id,
          tipo: log.tipo,
          mensagem: log.mensagem,
          detalhes: log.detalhes as Record<string, string | number | boolean | null>,
          veiculo_id: log.veiculo_id
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integracao-logs'] });
    },
  });

  return { logs, isLoading, addLog };
}

export function useIntegracaoVeiculos(integracaoId?: string) {
  const queryClient = useQueryClient();

  const { data: veiculos = [], isLoading } = useQuery({
    queryKey: ['integracao-veiculos', integracaoId],
    queryFn: async () => {
      if (!integracaoId) return [];

      const { data, error } = await supabase
        .from('integracao_veiculos')
        .select('*')
        .eq('integracao_id', integracaoId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as IntegracaoVeiculo[];
    },
    enabled: !!integracaoId,
  });

  const syncVeiculo = useMutation({
    mutationFn: async ({ integracaoId, veiculoId }: { integracaoId: string; veiculoId: string }) => {
      // Simulated sync - would call actual API in production
      const { data: existing } = await supabase
        .from('integracao_veiculos')
        .select('*')
        .eq('integracao_id', integracaoId)
        .eq('veiculo_id', veiculoId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('integracao_veiculos')
          .update({ 
            status: 'published', 
            ultimo_envio: new Date().toISOString(),
            external_id: `EXT-${Date.now()}`
          })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('integracao_veiculos')
          .insert({
            integracao_id: integracaoId,
            veiculo_id: veiculoId,
            status: 'published',
            ultimo_envio: new Date().toISOString(),
            external_id: `EXT-${Date.now()}`
          });
        
        if (error) throw error;
      }

      // Add log
      await supabase.from('integracao_logs').insert([{
        integracao_id: integracaoId,
        tipo: 'success',
        mensagem: 'Veículo sincronizado com sucesso',
        veiculo_id: veiculoId,
        detalhes: {}
      }]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integracao-veiculos'] });
      queryClient.invalidateQueries({ queryKey: ['integracao-logs'] });
      toast({ title: 'Veículo sincronizado!' });
    },
    onError: (error) => {
      toast({ title: 'Erro na sincronização', description: error.message, variant: 'destructive' });
    },
  });

  return { veiculos, isLoading, syncVeiculo };
}

export function useIntegracaoStats() {
  return useQuery({
    queryKey: ['integracao-stats'],
    queryFn: async () => {
      const { data: veiculos, error } = await supabase
        .from('integracao_veiculos')
        .select('integracao_id, status');

      if (error) throw error;

      const stats: Record<string, { total: number; published: number; error: number; pending: number }> = {};
      
      veiculos?.forEach((v) => {
        if (!stats[v.integracao_id]) {
          stats[v.integracao_id] = { total: 0, published: 0, error: 0, pending: 0 };
        }
        stats[v.integracao_id].total++;
        if (v.status === 'published') stats[v.integracao_id].published++;
        if (v.status === 'error') stats[v.integracao_id].error++;
        if (v.status === 'pending') stats[v.integracao_id].pending++;
      });

      return stats;
    },
  });
}
