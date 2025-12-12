import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useUsers, ROLE_LABELS, ROLE_PERMISSIONS, AppRole } from '@/hooks/useUsers';
import { useAuthContext } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Shield, Search, Users, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function UsuariosLista() {
  const { isAdmin } = useAuthContext();
  const { users, isLoading, updateUser } = useUsers();
  const [editingUser, setEditingUser] = useState<typeof users[0] | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<AppRole[]>([]);

  // Only admins can access this page
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.roles.includes(filterRole as AppRole);
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.ativo) || 
      (filterStatus === 'inactive' && !user.ativo);
    const matchesSearch = !searchTerm || 
      user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const handleEditUser = (user: typeof users[0]) => {
    setEditingUser(user);
    setSelectedRoles(user.roles);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;

    updateUser.mutate({
      profileId: editingUser.id,
      userId: editingUser.user_id,
      data: {
        nome: editingUser.nome || undefined,
        ativo: editingUser.ativo
      },
      roles: selectedRoles
    }, {
      onSuccess: () => setEditingUser(null)
    });
  };

  const toggleRole = (role: AppRole) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'editor': return 'default';
      case 'vendedor': return 'secondary';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-8 w-8" />
              Usuários
            </h1>
            <p className="text-muted-foreground">Gerencie usuários e permissões do sistema</p>
          </div>
        </div>

        {/* Permissions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(ROLE_PERMISSIONS).map(([role, info]) => (
            <Card key={role} className="border-l-4" style={{ borderLeftColor: role === 'admin' ? 'hsl(var(--destructive))' : role === 'editor' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {info.label}
                </CardTitle>
                <CardDescription>{info.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {info.permissions.map((perm, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {perm}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Avatar</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>
                            {(user.nome || user.email).substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{user.nome || '-'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {user.roles.length > 0 ? (
                            user.roles.map(role => (
                              <Badge key={role} variant={getRoleBadgeVariant(role)}>
                                {ROLE_LABELS[role]}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline">Sem role</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.last_access 
                          ? format(new Date(user.last_access), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                          : 'Nunca'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.ativo ? 'default' : 'secondary'}>
                          {user.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditUser(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
            </DialogHeader>
            {editingUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={editingUser.avatar_url || undefined} />
                    <AvatarFallback className="text-xl">
                      {(editingUser.nome || editingUser.email).substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{editingUser.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Criado em {format(new Date(editingUser.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={editingUser.nome || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, nome: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Roles</Label>
                  <div className="space-y-2">
                    {(Object.keys(ROLE_PERMISSIONS) as AppRole[]).map(role => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role}`}
                          checked={selectedRoles.includes(role)}
                          onCheckedChange={() => toggleRole(role)}
                        />
                        <label htmlFor={`role-${role}`} className="flex-1 cursor-pointer">
                          <span className="font-medium">{ROLE_PERMISSIONS[role].label}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            - {ROLE_PERMISSIONS[role].description}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="active">Usuário Ativo</Label>
                  <Switch
                    id="active"
                    checked={editingUser.ativo}
                    onCheckedChange={(checked) => setEditingUser({ ...editingUser, ativo: checked })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingUser(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveUser} disabled={updateUser.isPending}>
                    {updateUser.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
