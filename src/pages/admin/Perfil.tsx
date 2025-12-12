import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUpdateProfile, useChangePassword } from '@/hooks/useUsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Lock, Settings, Sun, Moon, Monitor, Mail, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Perfil() {
  const { profile } = useAuthContext();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [nome, setNome] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [preferences, setPreferences] = useState({
    theme: 'system' as 'light' | 'dark' | 'system',
    items_per_page: 20,
    email_notifications: true
  });

  useEffect(() => {
    if (profile) {
      setNome(profile.nome || '');
      setAvatarUrl(profile.avatar_url);
      // Parse preferences if available
      const prefs = (profile as any).preferences;
      if (prefs) {
        setPreferences({
          theme: prefs.theme || 'system',
          items_per_page: prefs.items_per_page || 20,
          email_notifications: prefs.email_notifications ?? true
        });
      }
    }
  }, [profile]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${profile?.user_id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('veiculos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('veiculos')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast({ title: 'Avatar enviado com sucesso' });
    } catch (error: any) {
      toast({ title: 'Erro ao enviar avatar', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = () => {
    updateProfile.mutate({
      nome,
      avatar_url: avatarUrl || undefined
    });
  };

  const handleSavePreferences = () => {
    updateProfile.mutate({
      preferences
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'As senhas não coincidem', variant: 'destructive' });
      return;
    }

    if (newPassword.length < 6) {
      toast({ title: 'A senha deve ter pelo menos 6 caracteres', variant: 'destructive' });
      return;
    }

    changePassword.mutate({ newPassword }, {
      onSuccess: () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    });
  };

  const getThemeIcon = () => {
    switch (preferences.theme) {
      case 'light': return <Sun className="h-4 w-4" />;
      case 'dark': return <Moon className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <User className="h-8 w-8" />
            Meu Perfil
          </h1>
          <p className="text-muted-foreground">Gerencie suas informações e preferências</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Senha
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferências
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>Atualize suas informações pessoais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="text-2xl">
                      {(nome || profile?.email || '').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Upload className="h-4 w-4" />
                        {uploading ? 'Enviando...' : 'Alterar avatar'}
                      </div>
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG ou GIF. Máximo 2MB.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profile?.email || ''} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">
                    O email não pode ser alterado
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                  />
                </div>

                <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? 'Salvando...' : 'Salvar Perfil'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>Atualize sua senha de acesso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <Button 
                  onClick={handleChangePassword} 
                  disabled={changePassword.isPending || !newPassword || !confirmPassword}
                >
                  {changePassword.isPending ? 'Alterando...' : 'Alterar Senha'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>Personalize sua experiência no sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      {getThemeIcon()}
                      <Label>Tema</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Escolha como o sistema aparece para você
                    </p>
                  </div>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value: 'light' | 'dark' | 'system') => 
                      setPreferences({ ...preferences, theme: value })
                    }
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <span className="flex items-center gap-2">
                          <Sun className="h-4 w-4" /> Claro
                        </span>
                      </SelectItem>
                      <SelectItem value="dark">
                        <span className="flex items-center gap-2">
                          <Moon className="h-4 w-4" /> Escuro
                        </span>
                      </SelectItem>
                      <SelectItem value="system">
                        <span className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" /> Sistema
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Itens por página</Label>
                    <p className="text-sm text-muted-foreground">
                      Quantidade de itens nas listagens
                    </p>
                  </div>
                  <Select
                    value={String(preferences.items_per_page)}
                    onValueChange={(value) => 
                      setPreferences({ ...preferences, items_per_page: parseInt(value) })
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <Label>Notificações por email</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas de novos leads e avaliações
                    </p>
                  </div>
                  <Switch
                    checked={preferences.email_notifications}
                    onCheckedChange={(checked) => 
                      setPreferences({ ...preferences, email_notifications: checked })
                    }
                  />
                </div>

                <Button onClick={handleSavePreferences} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? 'Salvando...' : 'Salvar Preferências'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
