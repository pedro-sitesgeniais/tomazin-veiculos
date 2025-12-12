import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

export type Vehicle = Tables<'veiculos'>;

interface UseAdminVehiclesOptions {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  condicao?: string;
  marca?: string;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}

export function useAdminVehicles(options: UseAdminVehiclesOptions = {}) {
  const {
    page = 1,
    perPage = 20,
    search = '',
    status = '',
    condicao = '',
    marca = '',
    orderBy = 'created_at',
    orderDir = 'desc',
  } = options;

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('veiculos')
        .select('*', { count: 'exact' });

      // Apply filters
      if (search) {
        query = query.or(`marca.ilike.%${search}%,modelo.ilike.%${search}%,versao.ilike.%${search}%`);
      }
      if (status) {
        query = query.eq('status', status);
      }
      if (condicao && (condicao === '0KM' || condicao === 'Seminovo')) {
        query = query.eq('condicao', condicao);
      }
      if (marca) {
        query = query.eq('marca', marca);
      }

      // Apply ordering
      query = query.order(orderBy, { ascending: orderDir === 'asc' });

      // Apply pagination
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setVehicles(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os veículos.',
      });
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, status, condicao, marca, orderBy, orderDir, toast]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const updateVehicle = async (id: string, data: Record<string, unknown>) => {
    try {
      const { error } = await supabase
        .from('veiculos')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      await fetchVehicles();
      return true;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar o veículo.',
      });
      return false;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('veiculos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchVehicles();
      toast({
        title: 'Veículo excluído',
        description: 'O veículo foi removido com sucesso.',
      });
      return true;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível excluir o veículo.',
      });
      return false;
    }
  };

  const bulkUpdate = async (ids: string[], data: Record<string, unknown>) => {
    try {
      const { error } = await supabase
        .from('veiculos')
        .update(data)
        .in('id', ids);

      if (error) throw error;
      
      await fetchVehicles();
      toast({
        title: 'Veículos atualizados',
        description: `${ids.length} veículos foram atualizados.`,
      });
      return true;
    } catch (error) {
      console.error('Error bulk updating vehicles:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar os veículos.',
      });
      return false;
    }
  };

  const bulkDelete = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('veiculos')
        .delete()
        .in('id', ids);

      if (error) throw error;
      
      await fetchVehicles();
      toast({
        title: 'Veículos excluídos',
        description: `${ids.length} veículos foram removidos.`,
      });
      return true;
    } catch (error) {
      console.error('Error bulk deleting vehicles:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível excluir os veículos.',
      });
      return false;
    }
  };

  return {
    vehicles,
    totalCount,
    loading,
    totalPages: Math.ceil(totalCount / perPage),
    refetch: fetchVehicles,
    updateVehicle,
    deleteVehicle,
    bulkUpdate,
    bulkDelete,
  };
}

export function useMarcas() {
  const [marcas, setMarcas] = useState<{ id: string; nome: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarcas() {
      const { data } = await supabase
        .from('marcas')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome');
      setMarcas(data || []);
      setLoading(false);
    }
    fetchMarcas();
  }, []);

  return { marcas, loading };
}

export function useModelos(marcaId?: string) {
  const [modelos, setModelos] = useState<{ id: string; nome: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchModelos() {
      if (!marcaId) {
        setModelos([]);
        return;
      }
      setLoading(true);
      const { data } = await supabase
        .from('modelos')
        .select('id, nome')
        .eq('marca_id', marcaId)
        .eq('ativo', true)
        .order('nome');
      setModelos(data || []);
      setLoading(false);
    }
    fetchModelos();
  }, [marcaId]);

  return { modelos, loading };
}

export function useCores() {
  const [cores, setCores] = useState<{ id: string; nome: string; hex_code: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCores() {
      const { data } = await supabase
        .from('cores')
        .select('id, nome, hex_code')
        .order('nome');
      setCores(data || []);
      setLoading(false);
    }
    fetchCores();
  }, []);

  return { cores, loading };
}

export function useOpcionais() {
  const [opcionais, setOpcionais] = useState<{ id: string; nome: string; categoria: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOpcionais() {
      const { data } = await supabase
        .from('opcionais')
        .select('id, nome, categoria')
        .order('categoria')
        .order('nome');
      setOpcionais(data || []);
      setLoading(false);
    }
    fetchOpcionais();
  }, []);

  const groupedOpcionais = opcionais.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = [];
    }
    acc[item.categoria].push(item);
    return acc;
  }, {} as Record<string, typeof opcionais>);

  return { opcionais, groupedOpcionais, loading };
}
