import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SeoConfig {
  id: string;
  pagina: string;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  no_index: boolean;
  created_at: string;
  updated_at: string;
}

export interface Redirect {
  id: string;
  de: string;
  para: string;
  tipo: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const PAGINAS_SEO = [
  { slug: 'home', nome: 'Página Inicial', url: '/' },
  { slug: 'estoque', nome: 'Estoque', url: '/estoque' },
  { slug: 'financiamento', nome: 'Financiamento', url: '/financiamento' },
  { slug: 'avalie-seu-veiculo', nome: 'Avalie seu Veículo', url: '/avalie-seu-veiculo' },
  { slug: 'quem-somos', nome: 'Quem Somos', url: '/quem-somos' },
  { slug: 'contato', nome: 'Contato', url: '/contato' },
  { slug: 'politica-privacidade', nome: 'Política de Privacidade', url: '/politica-privacidade' },
  { slug: 'termos-uso', nome: 'Termos de Uso', url: '/termos-uso' },
];

export function useSeoConfigs() {
  const queryClient = useQueryClient();

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['seo-configs'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('seo_config' as any)
        .select('*')
        .order('pagina') as any);
      
      if (error) throw error;
      return (data || []) as SeoConfig[];
    },
  });

  const updateConfig = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SeoConfig> & { id?: string; pagina?: string }) => {
      if (id) {
        const { error } = await (supabase
          .from('seo_config' as any)
          .update(updates)
          .eq('id', id) as any);
        if (error) throw error;
      } else if (updates.pagina) {
        const { error } = await (supabase
          .from('seo_config' as any)
          .upsert({ ...updates, pagina: updates.pagina }, { onConflict: 'pagina' }) as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-configs'] });
      toast({ title: 'SEO atualizado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar SEO', description: error.message, variant: 'destructive' });
    },
  });

  return { configs, isLoading, updateConfig };
}

export function useRedirects() {
  const queryClient = useQueryClient();

  const { data: redirects = [], isLoading } = useQuery({
    queryKey: ['redirects'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('redirects' as any)
        .select('*')
        .order('created_at', { ascending: false }) as any);
      
      if (error) throw error;
      return (data || []) as Redirect[];
    },
  });

  const createRedirect = useMutation({
    mutationFn: async (redirect: Omit<Redirect, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await (supabase
        .from('redirects' as any)
        .insert([redirect]) as any);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redirects'] });
      toast({ title: 'Redirect criado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao criar redirect', description: error.message, variant: 'destructive' });
    },
  });

  const updateRedirect = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Redirect> & { id: string }) => {
      const { error } = await (supabase
        .from('redirects' as any)
        .update(updates)
        .eq('id', id) as any);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redirects'] });
      toast({ title: 'Redirect atualizado!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar redirect', description: error.message, variant: 'destructive' });
    },
  });

  const deleteRedirect = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase
        .from('redirects' as any)
        .delete()
        .eq('id', id) as any);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redirects'] });
      toast({ title: 'Redirect excluído!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao excluir redirect', description: error.message, variant: 'destructive' });
    },
  });

  return { redirects, isLoading, createRedirect, updateRedirect, deleteRedirect };
}

export function useSeoGlobalConfigs() {
  const queryClient = useQueryClient();

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['seo-global-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('grupo', 'seo')
        .order('ordem');
      
      if (error) throw error;
      return data;
    },
  });

  const getConfig = (chave: string) => {
    return configs.find(c => c.chave === chave)?.valor || '';
  };

  const updateConfig = useMutation({
    mutationFn: async ({ chave, valor }: { chave: string; valor: string }) => {
      const { error } = await supabase
        .from('configuracoes')
        .update({ valor })
        .eq('grupo', 'seo')
        .eq('chave', chave);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-global-configs'] });
      toast({ title: 'Configuração atualizada!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
    },
  });

  const saveMultiple = useMutation({
    mutationFn: async (updates: { chave: string; valor: string }[]) => {
      for (const { chave, valor } of updates) {
        const { error } = await supabase
          .from('configuracoes')
          .update({ valor })
          .eq('grupo', 'seo')
          .eq('chave', chave);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-global-configs'] });
      toast({ title: 'Configurações salvas!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    },
  });

  return { configs, isLoading, getConfig, updateConfig, saveMultiple };
}
