import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Types
export interface Marca extends Tables<'marcas'> {
  veiculos_count?: number;
}

export interface Modelo extends Tables<'modelos'> {
  marca?: Tables<'marcas'>;
  veiculos_count?: number;
}

export interface Cor extends Tables<'cores'> {
  veiculos_count?: number;
}

export interface Opcional extends Tables<'opcionais'> {
  veiculos_count?: number;
}

export interface StatusVeiculo {
  id: string;
  nome: string;
  cor: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  veiculos_count?: number;
}

// Marcas
export function useMarcas() {
  return useQuery({
    queryKey: ['marcas'],
    queryFn: async () => {
      const { data: marcas, error } = await supabase
        .from('marcas')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;

      const marcasWithCount = await Promise.all(
        (marcas || []).map(async (marca) => {
          const { count } = await supabase
            .from('veiculos')
            .select('*', { count: 'exact', head: true })
            .eq('marca', marca.nome);
          return { ...marca, veiculos_count: count || 0 };
        })
      );

      return marcasWithCount as Marca[];
    },
  });
}

export function useMarcaMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: TablesInsert<'marcas'>) => {
      const { error } = await supabase.from('marcas').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
      toast.success('Marca criada com sucesso');
    },
    onError: () => toast.error('Erro ao criar marca'),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...data }: TablesUpdate<'marcas'> & { id: string }) => {
      const { error } = await supabase.from('marcas').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
      toast.success('Marca atualizada');
    },
    onError: () => toast.error('Erro ao atualizar marca'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('marcas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
      toast.success('Marca removida');
    },
    onError: () => toast.error('Erro ao remover marca'),
  });

  const reorder = useMutation({
    mutationFn: async (items: { id: string; ordem: number }[]) => {
      for (const item of items) {
        await supabase.from('marcas').update({ ordem: item.ordem }).eq('id', item.id);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marcas'] }),
  });

  const importPopular = useMutation({
    mutationFn: async (names: string[]) => {
      const items = names.map((nome, idx) => ({ nome, ordem: idx }));
      const { error } = await supabase.from('marcas').upsert(items, { onConflict: 'nome' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
      toast.success('Marcas importadas com sucesso');
    },
    onError: () => toast.error('Erro ao importar marcas'),
  });

  return { create, update, remove, reorder, importPopular };
}

// Modelos
export function useModelos(marcaId?: string) {
  return useQuery({
    queryKey: ['modelos', marcaId],
    queryFn: async () => {
      let query = supabase.from('modelos').select('*, marca:marcas(*)').order('nome');
      
      if (marcaId) {
        query = query.eq('marca_id', marcaId);
      }

      const { data: modelos, error } = await query;
      if (error) throw error;

      const modelosWithCount = await Promise.all(
        (modelos || []).map(async (modelo) => {
          const { count } = await supabase
            .from('veiculos')
            .select('*', { count: 'exact', head: true })
            .eq('modelo', modelo.nome);
          return { ...modelo, veiculos_count: count || 0 };
        })
      );

      return modelosWithCount as Modelo[];
    },
  });
}

export function useModeloMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: TablesInsert<'modelos'>) => {
      const { error } = await supabase.from('modelos').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modelos'] });
      toast.success('Modelo criado com sucesso');
    },
    onError: () => toast.error('Erro ao criar modelo'),
  });

  const createMultiple = useMutation({
    mutationFn: async (items: TablesInsert<'modelos'>[]) => {
      const { error } = await supabase.from('modelos').insert(items);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modelos'] });
      toast.success('Modelos criados com sucesso');
    },
    onError: () => toast.error('Erro ao criar modelos'),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...data }: TablesUpdate<'modelos'> & { id: string }) => {
      const { error } = await supabase.from('modelos').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modelos'] });
      toast.success('Modelo atualizado');
    },
    onError: () => toast.error('Erro ao atualizar modelo'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('modelos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modelos'] });
      toast.success('Modelo removido');
    },
    onError: () => toast.error('Erro ao remover modelo'),
  });

  return { create, createMultiple, update, remove };
}

// Cores
export function useCores() {
  return useQuery({
    queryKey: ['cores'],
    queryFn: async () => {
      const { data: cores, error } = await supabase
        .from('cores')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;

      const coresWithCount = await Promise.all(
        (cores || []).map(async (cor) => {
          const { count } = await supabase
            .from('veiculos')
            .select('*', { count: 'exact', head: true })
            .eq('cor', cor.nome);
          return { ...cor, veiculos_count: count || 0 };
        })
      );

      return coresWithCount as Cor[];
    },
  });
}

export function useCorMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: TablesInsert<'cores'>) => {
      const { error } = await supabase.from('cores').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cores'] });
      toast.success('Cor criada com sucesso');
    },
    onError: () => toast.error('Erro ao criar cor'),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...data }: TablesUpdate<'cores'> & { id: string }) => {
      const { error } = await supabase.from('cores').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cores'] });
      toast.success('Cor atualizada');
    },
    onError: () => toast.error('Erro ao atualizar cor'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cores').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cores'] });
      toast.success('Cor removida');
    },
    onError: () => toast.error('Erro ao remover cor'),
  });

  return { create, update, remove };
}

// Opcionais
export function useOpcionais() {
  return useQuery({
    queryKey: ['opcionais'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opcionais')
        .select('*')
        .order('categoria')
        .order('ordem');

      if (error) throw error;
      return data as Opcional[];
    },
  });
}

export function useOpcionalMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: TablesInsert<'opcionais'>) => {
      const { error } = await supabase.from('opcionais').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opcionais'] });
      toast.success('Opcional criado com sucesso');
    },
    onError: () => toast.error('Erro ao criar opcional'),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...data }: TablesUpdate<'opcionais'> & { id: string }) => {
      const { error } = await supabase.from('opcionais').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opcionais'] });
      toast.success('Opcional atualizado');
    },
    onError: () => toast.error('Erro ao atualizar opcional'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('opcionais').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opcionais'] });
      toast.success('Opcional removido');
    },
    onError: () => toast.error('Erro ao remover opcional'),
  });

  const reorder = useMutation({
    mutationFn: async (items: { id: string; ordem: number }[]) => {
      for (const item of items) {
        await supabase.from('opcionais').update({ ordem: item.ordem }).eq('id', item.id);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['opcionais'] }),
  });

  return { create, update, remove, reorder };
}

// Status Veículo
export function useStatusVeiculo() {
  return useQuery({
    queryKey: ['status_veiculo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('status_veiculo')
        .select('*')
        .order('ordem');

      if (error) throw error;

      const statusWithCount = await Promise.all(
        (data || []).map(async (status: StatusVeiculo) => {
          const { count } = await supabase
            .from('veiculos')
            .select('*', { count: 'exact', head: true })
            .eq('status', status.nome);
          return { ...status, veiculos_count: count || 0 };
        })
      );

      return statusWithCount as StatusVeiculo[];
    },
  });
}

export function useStatusVeiculoMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: { nome: string; cor?: string; ordem?: number; ativo?: boolean }) => {
      const { error } = await supabase.from('status_veiculo').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status_veiculo'] });
      toast.success('Status criado com sucesso');
    },
    onError: () => toast.error('Erro ao criar status'),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; nome?: string; cor?: string; ordem?: number; ativo?: boolean }) => {
      const { error } = await supabase.from('status_veiculo').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status_veiculo'] });
      toast.success('Status atualizado');
    },
    onError: () => toast.error('Erro ao atualizar status'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('status_veiculo').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status_veiculo'] });
      toast.success('Status removido');
    },
    onError: () => toast.error('Erro ao remover status'),
  });

  return { create, update, remove };
}

// Popular brands for import
export const MARCAS_POPULARES = [
  'Chevrolet', 'Fiat', 'Volkswagen', 'Ford', 'Honda', 'Toyota', 'Hyundai',
  'Jeep', 'Nissan', 'Renault', 'Peugeot', 'Citroën', 'Kia', 'Mitsubishi',
  'BMW', 'Mercedes-Benz', 'Audi', 'Volvo', 'Land Rover', 'Porsche',
  'Suzuki', 'Chery', 'Caoa Chery', 'JAC', 'BYD', 'GWM', 'RAM'
];

// Categorias de opcionais
export const CATEGORIAS_OPCIONAIS = [
  'Conforto',
  'Segurança',
  'Tecnologia',
  'Exterior',
  'Interior',
  'Performance'
];
