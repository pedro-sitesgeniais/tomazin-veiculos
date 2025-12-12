import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export type AppRole = 'admin' | 'editor' | 'vendedor';

export interface UserWithRole {
  id: string;
  user_id: string;
  email: string;
  nome: string | null;
  avatar_url: string | null;
  ativo: boolean;
  last_access: string | null;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    items_per_page: number;
    email_notifications: boolean;
  } | null;
  created_at: string;
  roles: AppRole[];
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  old_data: Json;
  new_data: Json;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: 'Administrador',
  editor: 'Editor',
  vendedor: 'Vendedor'
};

export const ROLE_PERMISSIONS = {
  admin: {
    label: 'Administrador',
    description: 'Acesso total ao sistema',
    permissions: ['Gerenciar usuários', 'Configurações', 'Integrações', 'Todos os módulos']
  },
  editor: {
    label: 'Editor',
    description: 'Gerencia conteúdo do site',
    permissions: ['Veículos (criar/editar)', 'Leads próprios', 'Banners e páginas']
  },
  vendedor: {
    label: 'Vendedor',
    description: 'Acesso limitado para vendas',
    permissions: ['Veículos (visualizar)', 'Leads próprios', 'Avaliações (visualizar)']
  }
};

export function useUsers() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users-with-roles'],
    queryFn: async () => {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get all roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Map roles to users
      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => ({
        id: profile.id,
        user_id: profile.user_id,
        email: profile.email,
        nome: profile.nome,
        avatar_url: profile.avatar_url,
        ativo: profile.ativo,
        last_access: profile.last_access,
        preferences: profile.preferences as UserWithRole['preferences'],
        created_at: profile.created_at,
        roles: (roles || [])
          .filter(r => r.user_id === profile.user_id)
          .map(r => r.role as AppRole)
      }));

      return usersWithRoles;
    }
  });

  const updateUser = useMutation({
    mutationFn: async ({ 
      profileId, 
      userId,
      data, 
      roles 
    }: { 
      profileId: string; 
      userId: string;
      data: Partial<{ nome: string; ativo: boolean; avatar_url: string }>;
      roles?: AppRole[];
    }) => {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', profileId);

      if (profileError) throw profileError;

      // Update roles if provided
      if (roles !== undefined) {
        // Delete existing roles
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);

        // Insert new roles
        if (roles.length > 0) {
          const { error: rolesError } = await supabase
            .from('user_roles')
            .insert(roles.map(role => ({ user_id: userId, role })));

          if (rolesError) throw rolesError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      toast({ title: 'Usuário atualizado com sucesso' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar usuário', description: error.message, variant: 'destructive' });
    }
  });

  const createUserRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
    }
  });

  const deleteUserRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
    }
  });

  return {
    users,
    isLoading,
    updateUser,
    createUserRole,
    deleteUserRole
  };
}

export function useActivityLogs(filters?: { userId?: string; action?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['activity-logs', filters],
    queryFn: async () => {
      let query = supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters?.action) {
        query = query.eq('action', filters.action);
      }
      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get user names for logs
      const userIds = [...new Set((data || []).map(log => log.user_id).filter(Boolean))];
      
      let profiles: any[] = [];
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, nome, email')
          .in('user_id', userIds);
        profiles = profilesData || [];
      }

      const logsWithUsers: ActivityLog[] = (data || []).map(log => {
        const profile = profiles.find(p => p.user_id === log.user_id);
        return {
          ...log,
          user_name: profile?.nome || 'Sistema',
          user_email: profile?.email || ''
        };
      });

      return logsWithUsers;
    }
  });
}

export function useLogActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (log: {
      action: string;
      entity_type?: string;
      entity_id?: string;
      old_data?: Record<string, unknown>;
      new_data?: Record<string, unknown>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('activity_logs')
        .insert([{
          user_id: user?.id || null,
          action: log.action,
          entity_type: log.entity_type || null,
          entity_id: log.entity_id || null,
          old_data: (log.old_data || {}) as Json,
          new_data: (log.new_data || {}) as Json
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    }
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      nome?: string;
      avatar_url?: string;
      preferences?: {
        theme: 'light' | 'dark' | 'system';
        items_per_page: number;
        email_notifications: boolean;
      };
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      toast({ title: 'Perfil atualizado com sucesso' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar perfil', description: error.message, variant: 'destructive' });
    }
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async ({ newPassword }: { newPassword: string }) => {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Senha alterada com sucesso' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao alterar senha', description: error.message, variant: 'destructive' });
    }
  });
}
