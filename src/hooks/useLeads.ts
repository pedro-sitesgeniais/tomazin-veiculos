import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

export type Lead = Tables<'leads'> & {
  veiculo?: { marca: string; modelo: string; id: string } | null;
  responsavel?: { nome: string | null; id: string } | null;
};

export type LeadInteracao = Tables<'lead_interacoes'> & {
  usuario?: { nome: string | null } | null;
};

export type LeadTarefa = Tables<'lead_tarefas'> & {
  usuario?: { nome: string | null } | null;
};

interface UseLeadsFilters {
  page?: number;
  search?: string;
  status?: string;
  origem?: string;
  responsavel?: string;
  periodoInicio?: string;
  periodoFim?: string;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}

const ITEMS_PER_PAGE = 20;

export function useLeads(filters: UseLeadsFilters = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const {
    page = 1,
    search = '',
    status = '',
    origem = '',
    responsavel = '',
    periodoInicio = '',
    periodoFim = '',
    orderBy = 'created_at',
    orderDir = 'desc'
  } = filters;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select(`
          *,
          veiculo:veiculos(id, marca, modelo),
          responsavel:profiles!leads_responsavel_id_fkey(id, nome)
        `, { count: 'exact' });

      // Apply filters
      if (search) {
        query = query.or(`nome.ilike.%${search}%,telefone.ilike.%${search}%,email.ilike.%${search}%`);
      }

      if (status && status !== 'all') {
        query = query.eq('status', status as any);
      }

      if (origem && origem !== 'all') {
        query = query.eq('origem', origem as any);
      }

      if (responsavel && responsavel !== 'all') {
        query = query.eq('responsavel_id', responsavel);
      }

      if (periodoInicio) {
        query = query.gte('created_at', periodoInicio);
      }

      if (periodoFim) {
        query = query.lte('created_at', periodoFim);
      }

      // Apply ordering
      query = query.order(orderBy, { ascending: orderDir === 'asc' });

      // Apply pagination
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setLeads(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Erro ao carregar leads',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [page, search, status, origem, responsavel, periodoInicio, periodoFim, orderBy, orderDir, toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateLead = async (id: string, data: Partial<Tables<'leads'>>) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Lead atualizado com sucesso!' });
      fetchLeads();
      return true;
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: 'Erro ao atualizar lead',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Lead excluído com sucesso!' });
      fetchLeads();
      return true;
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: 'Erro ao excluir lead',
        variant: 'destructive',
      });
      return false;
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return {
    leads,
    loading,
    totalCount,
    totalPages,
    refetch: fetchLeads,
    updateLead,
    deleteLead,
  };
}

export function useLeadDetail(id: string | undefined) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [interacoes, setInteracoes] = useState<LeadInteracao[]>([]);
  const [tarefas, setTarefas] = useState<LeadTarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLead = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          veiculo:veiculos(id, marca, modelo),
          responsavel:profiles!leads_responsavel_id_fkey(id, nome)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setLead(data);
    } catch (error) {
      console.error('Error fetching lead:', error);
      toast({
        title: 'Erro ao carregar lead',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  const fetchInteracoes = useCallback(async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('lead_interacoes')
        .select(`
          *,
          usuario:profiles(nome)
        `)
        .eq('lead_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInteracoes(data || []);
    } catch (error) {
      console.error('Error fetching interacoes:', error);
    }
  }, [id]);

  const fetchTarefas = useCallback(async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('lead_tarefas')
        .select(`
          *,
          usuario:profiles(nome)
        `)
        .eq('lead_id', id)
        .order('data_limite', { ascending: true });

      if (error) throw error;
      setTarefas(data || []);
    } catch (error) {
      console.error('Error fetching tarefas:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchLead();
    fetchInteracoes();
    fetchTarefas();
  }, [fetchLead, fetchInteracoes, fetchTarefas]);

  const updateLead = async (data: Partial<Tables<'leads'>>) => {
    if (!id) return false;
    
    try {
      const { error } = await supabase
        .from('leads')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Lead atualizado com sucesso!' });
      fetchLead();
      return true;
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: 'Erro ao atualizar lead',
        variant: 'destructive',
      });
      return false;
    }
  };

  const addInteracao = async (tipo: string, descricao: string, arquivoUrl?: string) => {
    if (!id) return false;
    
    try {
      // Get current user's profile id
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuário não autenticado');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      const { error } = await supabase
        .from('lead_interacoes')
        .insert({
          lead_id: id,
          tipo: tipo as any,
          descricao,
          arquivo_url: arquivoUrl,
          usuario_id: profile?.id,
        });

      if (error) throw error;

      toast({ title: 'Interação registrada!' });
      fetchInteracoes();
      return true;
    } catch (error) {
      console.error('Error adding interacao:', error);
      toast({
        title: 'Erro ao registrar interação',
        variant: 'destructive',
      });
      return false;
    }
  };

  const addTarefa = async (descricao: string, dataLimite?: Date) => {
    if (!id) return false;
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuário não autenticado');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      const { error } = await supabase
        .from('lead_tarefas')
        .insert({
          lead_id: id,
          descricao,
          data_limite: dataLimite?.toISOString(),
          usuario_id: profile?.id,
        });

      if (error) throw error;

      toast({ title: 'Tarefa criada!' });
      fetchTarefas();
      return true;
    } catch (error) {
      console.error('Error adding tarefa:', error);
      toast({
        title: 'Erro ao criar tarefa',
        variant: 'destructive',
      });
      return false;
    }
  };

  const toggleTarefa = async (tarefaId: string, concluida: boolean) => {
    try {
      const { error } = await supabase
        .from('lead_tarefas')
        .update({ concluida })
        .eq('id', tarefaId);

      if (error) throw error;

      fetchTarefas();
      return true;
    } catch (error) {
      console.error('Error toggling tarefa:', error);
      return false;
    }
  };

  const deleteTarefa = async (tarefaId: string) => {
    try {
      const { error } = await supabase
        .from('lead_tarefas')
        .delete()
        .eq('id', tarefaId);

      if (error) throw error;

      toast({ title: 'Tarefa excluída!' });
      fetchTarefas();
      return true;
    } catch (error) {
      console.error('Error deleting tarefa:', error);
      return false;
    }
  };

  return {
    lead,
    interacoes,
    tarefas,
    loading,
    refetch: fetchLead,
    updateLead,
    addInteracao,
    addTarefa,
    toggleTarefa,
    deleteTarefa,
  };
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Tables<'profiles'>[]>([]);
  
  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('ativo', true)
        .order('nome');
      
      setProfiles(data || []);
    };
    
    fetchProfiles();
  }, []);
  
  return { profiles };
}

export function useLeadsByStatus() {
  const [leadsByStatus, setLeadsByStatus] = useState<Record<string, Lead[]>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          veiculo:veiculos(id, marca, modelo),
          responsavel:profiles!leads_responsavel_id_fkey(id, nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by status
      const grouped: Record<string, Lead[]> = {
        novo: [],
        em_atendimento: [],
        aguardando_cliente: [],
        proposta_enviada: [],
        negociacao: [],
        convertido: [],
        perdido: [],
        descartado: [],
      };

      (data || []).forEach((lead) => {
        if (grouped[lead.status]) {
          grouped[lead.status].push(lead);
        }
      });

      setLeadsByStatus(grouped);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Erro ao carregar leads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const moveLeadToStatus = async (leadId: string, newStatus: string) => {
    try {
      const updateData: Partial<Tables<'leads'>> = { status: newStatus as any };
      
      // If converting, set conversion date
      if (newStatus === 'convertido') {
        updateData.convertido_em = new Date().toISOString();
      }

      const { error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', leadId);

      if (error) throw error;

      fetchLeads();
      return true;
    } catch (error) {
      console.error('Error moving lead:', error);
      toast({
        title: 'Erro ao mover lead',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    leadsByStatus,
    loading,
    refetch: fetchLeads,
    moveLeadToStatus,
  };
}
