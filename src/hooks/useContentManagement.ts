import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Banner {
  id: string;
  titulo_interno: string;
  imagem_desktop: string;
  imagem_mobile: string | null;
  titulo_overlay: string | null;
  subtitulo_overlay: string | null;
  texto_botao: string | null;
  link_botao: string | null;
  posicao_texto: 'esquerda' | 'centro' | 'direita';
  ordem: number;
  ativo: boolean;
  data_inicio: string | null;
  data_fim: string | null;
  created_at: string;
  updated_at: string;
}

export interface Pagina {
  id: string;
  slug: string;
  titulo: string;
  conteudo: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Depoimento {
  id: string;
  nome: string;
  foto_url: string | null;
  depoimento: string;
  avaliacao: number;
  data: string;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface HomeConfig {
  id: string;
  secao: string;
  config: Record<string, any>;
  updated_at: string;
}

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('ordem');

      if (error) throw error;
      setBanners((data || []) as Banner[]);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar banners',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const createBanner = async (banner: Partial<Banner>) => {
    try {
      const { error } = await supabase.from('banners').insert(banner as any);
      if (error) throw error;
      toast({ title: 'Banner criado com sucesso!' });
      fetchBanners();
      return true;
    } catch (error: any) {
      toast({ title: 'Erro ao criar banner', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  const updateBanner = async (id: string, updates: Partial<Banner>) => {
    try {
      const { error } = await supabase.from('banners').update(updates as any).eq('id', id);
      if (error) throw error;
      toast({ title: 'Banner atualizado!' });
      fetchBanners();
      return true;
    } catch (error: any) {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Banner excluído!' });
      fetchBanners();
      return true;
    } catch (error: any) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  const reorderBanners = async (reorderedBanners: Banner[]) => {
    try {
      const updates = reorderedBanners.map((b, index) => ({
        id: b.id,
        ordem: index,
      }));
      
      for (const update of updates) {
        await supabase.from('banners').update({ ordem: update.ordem }).eq('id', update.id);
      }
      
      setBanners(reorderedBanners.map((b, i) => ({ ...b, ordem: i })));
      toast({ title: 'Ordem atualizada!' });
    } catch (error: any) {
      toast({ title: 'Erro ao reordenar', description: error.message, variant: 'destructive' });
    }
  };

  return { banners, loading, createBanner, updateBanner, deleteBanner, reorderBanners, refetch: fetchBanners };
}

export function usePaginas() {
  const [paginas, setPaginas] = useState<Pagina[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPaginas = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('paginas').select('*').order('titulo');
      if (error) throw error;
      setPaginas((data || []) as Pagina[]);
    } catch (error: any) {
      toast({ title: 'Erro ao carregar páginas', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPaginas();
  }, [fetchPaginas]);

  const updatePagina = async (id: string, updates: Partial<Pagina>) => {
    try {
      const { error } = await supabase.from('paginas').update(updates as any).eq('id', id);
      if (error) throw error;
      toast({ title: 'Página atualizada!' });
      fetchPaginas();
      return true;
    } catch (error: any) {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  return { paginas, loading, updatePagina, refetch: fetchPaginas };
}

export function useDepoimentos() {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDepoimentos = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('depoimentos').select('*').order('ordem');
      if (error) throw error;
      setDepoimentos((data || []) as Depoimento[]);
    } catch (error: any) {
      toast({ title: 'Erro ao carregar depoimentos', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDepoimentos();
  }, [fetchDepoimentos]);

  const createDepoimento = async (depoimento: Partial<Depoimento>) => {
    try {
      const { error } = await supabase.from('depoimentos').insert(depoimento as any);
      if (error) throw error;
      toast({ title: 'Depoimento criado!' });
      fetchDepoimentos();
      return true;
    } catch (error: any) {
      toast({ title: 'Erro ao criar', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  const updateDepoimento = async (id: string, updates: Partial<Depoimento>) => {
    try {
      const { error } = await supabase.from('depoimentos').update(updates as any).eq('id', id);
      if (error) throw error;
      toast({ title: 'Depoimento atualizado!' });
      fetchDepoimentos();
      return true;
    } catch (error: any) {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  const deleteDepoimento = async (id: string) => {
    try {
      const { error } = await supabase.from('depoimentos').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Depoimento excluído!' });
      fetchDepoimentos();
      return true;
    } catch (error: any) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  return { depoimentos, loading, createDepoimento, updateDepoimento, deleteDepoimento, refetch: fetchDepoimentos };
}

export function useHomeConfig() {
  const [configs, setConfigs] = useState<HomeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('home_config').select('*');
      if (error) throw error;
      setConfigs((data || []) as HomeConfig[]);
    } catch (error: any) {
      toast({ title: 'Erro ao carregar configurações', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const updateConfig = async (secao: string, config: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from('home_config')
        .update({ config } as any)
        .eq('secao', secao);
      if (error) throw error;
      toast({ title: 'Configuração salva!' });
      fetchConfigs();
      return true;
    } catch (error: any) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
      return false;
    }
  };

  const getConfig = (secao: string) => {
    return configs.find(c => c.secao === secao)?.config || {};
  };

  return { configs, loading, updateConfig, getConfig, refetch: fetchConfigs };
}
