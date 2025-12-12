import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLeads, useLeadsByStatus, useProfiles, Lead } from '@/hooks/useLeads';
import {
  Search,
  MoreHorizontal,
  Eye,
  Phone,
  MessageCircle,
  Mail,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  Download,
  CalendarIcon,
  LayoutGrid,
  List,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  novo: { label: 'Novo', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  em_atendimento: { label: 'Em Atendimento', color: 'text-blue-700', bg: 'bg-blue-100' },
  aguardando_cliente: { label: 'Aguardando Cliente', color: 'text-orange-700', bg: 'bg-orange-100' },
  proposta_enviada: { label: 'Proposta Enviada', color: 'text-purple-700', bg: 'bg-purple-100' },
  negociacao: { label: 'Negociação', color: 'text-cyan-700', bg: 'bg-cyan-100' },
  convertido: { label: 'Convertido', color: 'text-green-700', bg: 'bg-green-100' },
  perdido: { label: 'Perdido', color: 'text-red-700', bg: 'bg-red-100' },
  descartado: { label: 'Descartado', color: 'text-gray-700', bg: 'bg-gray-100' },
};

const origemLabels: Record<string, string> = {
  formulario_contato: 'Formulário',
  interesse_veiculo: 'Interesse Veículo',
  simulacao_financiamento: 'Simulação',
  avaliacao_veiculo: 'Avaliação',
  whatsapp: 'WhatsApp',
  telefone: 'Telefone',
  indicacao: 'Indicação',
  outros: 'Outros',
};

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'novo', label: 'Novo' },
  { value: 'em_atendimento', label: 'Em Atendimento' },
  { value: 'aguardando_cliente', label: 'Aguardando Cliente' },
  { value: 'proposta_enviada', label: 'Proposta Enviada' },
  { value: 'negociacao', label: 'Negociação' },
  { value: 'convertido', label: 'Convertido' },
  { value: 'perdido', label: 'Perdido' },
  { value: 'descartado', label: 'Descartado' },
];

const origemOptions = [
  { value: 'all', label: 'Todas' },
  { value: 'formulario_contato', label: 'Formulário' },
  { value: 'interesse_veiculo', label: 'Interesse Veículo' },
  { value: 'simulacao_financiamento', label: 'Simulação' },
  { value: 'avaliacao_veiculo', label: 'Avaliação' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telefone', label: 'Telefone' },
  { value: 'indicacao', label: 'Indicação' },
  { value: 'outros', label: 'Outros' },
];

export default function LeadsLista() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  // Get filters from URL
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const origem = searchParams.get('origem') || '';
  const responsavel = searchParams.get('responsavel') || '';

  const { leads, loading, totalCount, totalPages } = useLeads({
    page,
    search,
    status,
    origem,
    responsavel,
    periodoInicio: dateRange.from?.toISOString(),
    periodoFim: dateRange.to?.toISOString(),
  });

  const { leadsByStatus, loading: loadingKanban, moveLeadToStatus } = useLeadsByStatus();
  const { profiles } = useProfiles();

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const getStatusBadge = (statusKey: string) => {
    const config = statusConfig[statusKey] || { label: statusKey, color: 'text-gray-700', bg: 'bg-gray-100' };
    return (
      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', config.color, config.bg)}>
        {config.label}
      </span>
    );
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Telefone', 'Email', 'Origem', 'Status', 'Veículo', 'Data'];
    const rows = leads.map((lead) => [
      lead.nome,
      lead.telefone,
      lead.email || '',
      origemLabels[lead.origem] || lead.origem,
      statusConfig[lead.status]?.label || lead.status,
      lead.veiculo ? `${lead.veiculo.marca} ${lead.veiculo.modelo}` : '',
      format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm'),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const KanbanCard = ({ lead }: { lead: Lead }) => (
    <Link
      to={`/admin/leads/${lead.id}`}
      className="block p-3 bg-card border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{lead.nome}</p>
          <p className="text-sm text-muted-foreground truncate">{formatPhone(lead.telefone)}</p>
          {lead.veiculo && (
            <p className="text-xs text-primary mt-1 truncate">
              {lead.veiculo.marca} {lead.veiculo.modelo}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {format(new Date(lead.created_at), 'dd/MM', { locale: ptBR })}
          </p>
        </div>
      </div>
    </Link>
  );

  const KanbanColumn = ({ statusKey, leads: columnLeads }: { statusKey: string; leads: Lead[] }) => {
    const config = statusConfig[statusKey];
    
    return (
      <div className="flex-shrink-0 w-72 bg-secondary/50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={cn('w-3 h-3 rounded-full', config.bg)} />
            <span className="font-medium text-sm">{config.label}</span>
          </div>
          <Badge variant="secondary">{columnLeads.length}</Badge>
        </div>
        <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
          {columnLeads.map((lead) => (
            <KanbanCard key={lead.id} lead={lead} />
          ))}
          {columnLeads.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum lead
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Leads | Admin Tomazin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-heading">Leads / CRM</h1>
              <p className="text-muted-foreground">{totalCount} leads cadastrados</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* View Toggle & Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'table' | 'kanban')} className="w-auto">
              <TabsList>
                <TabsTrigger value="table">
                  <List className="h-4 w-4 mr-2" />
                  Lista
                </TabsTrigger>
                <TabsTrigger value="kanban">
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Kanban
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar nome, telefone, email..."
                value={search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={status || 'all'} onValueChange={(v) => updateFilter('status', v)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={origem || 'all'} onValueChange={(v) => updateFilter('origem', v)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Origem" />
              </SelectTrigger>
              <SelectContent>
                {origemOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={responsavel || 'all'} onValueChange={(v) => updateFilter('responsavel', v)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {profiles.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nome || p.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-auto">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'dd/MM')} - {format(dateRange.to, 'dd/MM')}
                      </>
                    ) : (
                      format(dateRange.from, 'dd/MM/yyyy')
                    )
                  ) : (
                    'Período'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : undefined}
                  onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Table View */}
          {viewMode === 'table' && (
            <>
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : leads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Nenhum lead encontrado</h3>
                    <p className="text-muted-foreground">Ajuste os filtros ou aguarde novos leads.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Origem</TableHead>
                        <TableHead>Veículo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="w-12">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <Link to={`/admin/leads/${lead.id}`} className="font-medium hover:text-primary">
                              {lead.nome}
                            </Link>
                            {lead.email && (
                              <p className="text-sm text-muted-foreground">{lead.email}</p>
                            )}
                          </TableCell>
                          <TableCell>{formatPhone(lead.telefone)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {origemLabels[lead.origem] || lead.origem}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {lead.veiculo ? (
                              <Link
                                to={`/admin/veiculos/${lead.veiculo.id}`}
                                className="text-primary hover:underline"
                              >
                                {lead.veiculo.marca} {lead.veiculo.modelo}
                              </Link>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(lead.status)}</TableCell>
                          <TableCell>
                            {lead.responsavel?.nome || (
                              <span className="text-muted-foreground">Não atribuído</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm')}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link to={`/admin/leads/${lead.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver detalhes
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <a href={`tel:${lead.telefone}`}>
                                    <Phone className="h-4 w-4 mr-2" />
                                    Ligar
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <a
                                    href={`https://wa.me/55${(lead.whatsapp || lead.telefone).replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    WhatsApp
                                  </a>
                                </DropdownMenuItem>
                                {lead.email && (
                                  <DropdownMenuItem asChild>
                                    <a href={`mailto:${lead.email}`}>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Email
                                    </a>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {(page - 1) * 20 + 1} a {Math.min(page * 20, totalCount)} de {totalCount} leads
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === 1}
                      onClick={() => updateFilter('page', String(page - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Página {page} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === totalPages}
                      onClick={() => updateFilter('page', String(page + 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Kanban View */}
          {viewMode === 'kanban' && (
            <div className="overflow-x-auto pb-4">
              {loadingKanban ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="flex gap-4 min-w-max">
                  {Object.entries(statusConfig)
                    .filter(([key]) => !['convertido', 'perdido', 'descartado'].includes(key))
                    .map(([statusKey]) => (
                      <KanbanColumn
                        key={statusKey}
                        statusKey={statusKey}
                        leads={leadsByStatus[statusKey] || []}
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
