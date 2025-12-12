import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAvaliacoes, STATUS_CONFIG, AvaliacaoStatus } from '@/hooks/useAvaliacoes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Eye, Car, Calendar, FileText } from 'lucide-react';

export default function AvaliacoesLista() {
  const navigate = useNavigate();
  const { avaliacoes, loading, filters, updateFilter, statusCounts } = useAvaliacoes();

  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <AdminLayout requireAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Avaliações de Veículos</h1>
            <p className="text-muted-foreground">
              Gerencie as solicitações de avaliação recebidas
            </p>
          </div>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => (
            <Card
              key={status}
              className={`cursor-pointer transition-all hover:shadow-md ${
                filters.status === status ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => updateFilter('status', filters.status === status ? '' : status)}
            >
              <CardContent className="p-3 text-center">
                <div className={`text-2xl font-bold ${config.color}`}>
                  {statusCounts[status] || 0}
                </div>
                <div className="text-xs text-muted-foreground truncate">{config.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por protocolo, nome, marca ou modelo..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="De"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter('dateFrom', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="Até"
                  value={filters.dateTo}
                  onChange={(e) => updateFilter('dateTo', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Protocolo</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Interesse</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : avaliacoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Nenhuma avaliação encontrada</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  avaliacoes.map((avaliacao) => {
                    const statusConfig = STATUS_CONFIG[avaliacao.status as AvaliacaoStatus] || STATUS_CONFIG.pendente;
                    return (
                      <TableRow
                        key={avaliacao.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/admin/avaliacoes/${avaliacao.id}`)}
                      >
                        <TableCell>
                          <span className="font-mono text-sm font-medium">
                            {avaliacao.protocolo}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">
                                {avaliacao.marca} {avaliacao.modelo}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {avaliacao.ano_modelo} • {avaliacao.quilometragem.toLocaleString()} km
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{avaliacao.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {avaliacao.telefone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{avaliacao.interesse}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(avaliacao.created_at)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border-0`}>
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/avaliacoes/${avaliacao.id}`);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
