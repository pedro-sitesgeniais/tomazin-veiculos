import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useActivityLogs, useUsers } from '@/hooks/useUsers';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Eye, Search, Calendar, User, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ACTION_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  login: { label: 'Login', variant: 'default' },
  logout: { label: 'Logout', variant: 'secondary' },
  create: { label: 'Criar', variant: 'default' },
  update: { label: 'Editar', variant: 'outline' },
  delete: { label: 'Excluir', variant: 'destructive' },
  export: { label: 'Exportar', variant: 'secondary' }
};

const ENTITY_LABELS: Record<string, string> = {
  veiculo: 'Veículo',
  lead: 'Lead',
  avaliacao: 'Avaliação',
  banner: 'Banner',
  pagina: 'Página',
  usuario: 'Usuário',
  configuracao: 'Configuração'
};

export default function LogsLista() {
  const { isAdmin } = useAuthContext();
  const { users } = useUsers();
  const [filterUserId, setFilterUserId] = useState<string>('all');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [viewingLog, setViewingLog] = useState<any | null>(null);

  const { data: logs = [], isLoading } = useActivityLogs({
    userId: filterUserId !== 'all' ? filterUserId : undefined,
    action: filterAction !== 'all' ? filterAction : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined
  });

  // Only admins can access this page
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Activity className="h-8 w-8" />
            Logs do Sistema
          </h1>
          <p className="text-muted-foreground">Histórico de todas as ações realizadas no sistema</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Select value={filterUserId} onValueChange={setFilterUserId}>
                <SelectTrigger className="w-[200px]">
                  <User className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os usuários</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.user_id} value={user.user_id}>
                      {user.nome || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as ações</SelectItem>
                  {Object.entries(ACTION_LABELS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-[150px]"
                />
                <span className="text-muted-foreground">até</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-[150px]"
                />
              </div>

              {(filterUserId !== 'all' || filterAction !== 'all' || startDate || endDate) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFilterUserId('all');
                    setFilterAction('all');
                    setStartDate('');
                    setEndDate('');
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="w-[100px]">Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      Nenhum log encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.user_name}</p>
                          <p className="text-xs text-muted-foreground">{log.user_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={ACTION_LABELS[log.action]?.variant || 'outline'}>
                          {ACTION_LABELS[log.action]?.label || log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.entity_type ? (ENTITY_LABELS[log.entity_type] || log.entity_type) : '-'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.entity_id?.substring(0, 8) || '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewingLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Log Details Dialog */}
        <Dialog open={!!viewingLog} onOpenChange={() => setViewingLog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Log</DialogTitle>
            </DialogHeader>
            {viewingLog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Data/Hora:</span>
                    <p className="font-medium">
                      {format(new Date(viewingLog.created_at), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Usuário:</span>
                    <p className="font-medium">{viewingLog.user_name}</p>
                    <p className="text-xs text-muted-foreground">{viewingLog.user_email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ação:</span>
                    <p>
                      <Badge variant={ACTION_LABELS[viewingLog.action]?.variant || 'outline'}>
                        {ACTION_LABELS[viewingLog.action]?.label || viewingLog.action}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Entidade:</span>
                    <p className="font-medium">
                      {viewingLog.entity_type ? (ENTITY_LABELS[viewingLog.entity_type] || viewingLog.entity_type) : '-'}
                    </p>
                  </div>
                  {viewingLog.entity_id && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">ID da Entidade:</span>
                      <p className="font-mono text-sm">{viewingLog.entity_id}</p>
                    </div>
                  )}
                  {viewingLog.ip_address && (
                    <div>
                      <span className="text-muted-foreground">IP:</span>
                      <p className="font-mono text-sm">{viewingLog.ip_address}</p>
                    </div>
                  )}
                </div>

                {(viewingLog.old_data && Object.keys(viewingLog.old_data).length > 0) && (
                  <div>
                    <span className="text-muted-foreground text-sm">Dados Anteriores:</span>
                    <ScrollArea className="h-[150px] mt-1">
                      <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                        {JSON.stringify(viewingLog.old_data, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                )}

                {(viewingLog.new_data && Object.keys(viewingLog.new_data).length > 0) && (
                  <div>
                    <span className="text-muted-foreground text-sm">Novos Dados:</span>
                    <ScrollArea className="h-[150px] mt-1">
                      <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                        {JSON.stringify(viewingLog.new_data, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
