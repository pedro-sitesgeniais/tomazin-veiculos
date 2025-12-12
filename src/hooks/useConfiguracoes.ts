import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Configuracao {
  id: string;
  chave: string;
  valor: string | null;
  tipo: 'text' | 'textarea' | 'color' | 'image' | 'boolean' | 'json' | 'number';
  grupo: string;
  ordem: number;
}

interface ConfiguracoesContextType {
  configs: Record<string, string | null>;
  loading: boolean;
  getConfig: (chave: string, defaultValue?: string) => string;
  refetch: () => Promise<void>;
}

const ConfiguracoesContext = createContext<ConfiguracoesContextType | null>(null);

export function ConfiguracoesProvider({ children }: { children: ReactNode }) {
  const [configs, setConfigs] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);

  const fetchConfigs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('chave, valor');

      if (error) throw error;

      const configMap: Record<string, string | null> = {};
      (data || []).forEach((item: any) => {
        configMap[item.chave] = item.valor;
      });
      setConfigs(configMap);
    } catch (error) {
      console.error('Error fetching configs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const getConfig = (chave: string, defaultValue = '') => {
    return configs[chave] || defaultValue;
  };

  const value = { configs, loading, getConfig, refetch: fetchConfigs };

  return React.createElement(
    ConfiguracoesContext.Provider,
    { value },
    children
  );
}

export function useConfiguracoes() {
  const context = useContext(ConfiguracoesContext);
  if (!context) {
    throw new Error('useConfiguracoes must be used within a ConfiguracoesProvider');
  }
  return context;
}

export function useConfiguracoesAdmin() {
  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConfiguracoes = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .order('grupo')
        .order('ordem');

      if (error) throw error;
      setConfiguracoes((data || []) as Configuracao[]);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar configuracoes',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchConfiguracoes();
  }, [fetchConfiguracoes]);

  const updateConfig = async (chave: string, valor: string | null) => {
    try {
      const { error } = await supabase
        .from('configuracoes')
        .update({ valor } as any)
        .eq('chave', chave);

      if (error) throw error;
      
      setConfiguracoes(prev => 
        prev.map(c => c.chave === chave ? { ...c, valor } : c)
      );
      
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

  const saveMultiple = async (updates: Record<string, string | null>) => {
    try {
      for (const [chave, valor] of Object.entries(updates)) {
        await supabase
          .from('configuracoes')
          .update({ valor } as any)
          .eq('chave', chave);
      }
      
      toast({ title: 'Configuracoes salvas!' });
      fetchConfiguracoes();
      return true;
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const getByGroup = (grupo: string) => {
    return configuracoes.filter(c => c.grupo === grupo);
  };

  const getValue = (chave: string) => {
    return configuracoes.find(c => c.chave === chave)?.valor || '';
  };

  return {
    configuracoes,
    loading,
    updateConfig,
    saveMultiple,
    getByGroup,
    getValue,
    refetch: fetchConfiguracoes,
  };
}
