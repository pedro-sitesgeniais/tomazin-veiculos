import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLeadDetail, useProfiles } from '@/hooks/useLeads';
import {
  Phone,
  MessageCircle,
  Mail,
  User,
  MapPin,
  Car,
  CalendarIcon,
  Clock,
  FileText,
  MessageSquare,
  PhoneCall,
  Send,
  CalendarCheck,
  Eye,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  ArrowLeft,
  Loader2,
  DollarSign,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
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
  formulario_contato: 'Formulário de Contato',
  interesse_veiculo: 'Interesse em Veículo',
  simulacao_financiamento: 'Simulação de Financiamento',
  avaliacao_veiculo: 'Avaliação de Veículo',
  whatsapp: 'WhatsApp',
  telefone: 'Telefone',
  indicacao: 'Indicação',
  outros: 'Outros',
};

const interacaoIcons: Record<string, any> = {
  nota: FileText,
  ligacao: PhoneCall,
  whatsapp: MessageCircle,
  email: Mail,
  proposta: Send,
  agendamento: CalendarCheck,
  visita: Eye,
};

const interacaoLabels: Record<string, string> = {
  nota: 'Nota',
  ligacao: 'Ligação',
  whatsapp: 'WhatsApp',
  email: 'Email',
  proposta: 'Proposta',
  agendamento: 'Agendamento',
  visita: 'Visita',
};

export default function LeadDetalhe() {
  const { id } = useParams();
  const {
    lead,
    interacoes,
    tarefas,
    loading,
    updateLead,
    addInteracao,
    addTarefa,
    toggleTarefa,
    deleteTarefa,
  } = useLeadDetail(id);
  const { profiles } = useProfiles();

  const [newInteracao, setNewInteracao] = useState({ tipo: 'nota', descricao: '' });
  const [newTarefa, setNewTarefa] = useState({ descricao: '', dataLimite: undefined as Date | undefined });
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [showLostDialog, setShowLostDialog] = useState(false);
  const [valorVenda, setValorVenda] = useState('');
  const [motivoPerda, setMotivoPerda] = useState('');
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!lead) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-xl font-semibold">Lead não encontrado</h2>
          <Button asChild className="mt-4">
            <Link to="/admin/leads">Voltar para Leads</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const handleAddInteracao = async () => {
    if (!newInteracao.descricao.trim()) return;
    
    setSaving(true);
    await addInteracao(newInteracao.tipo, newInteracao.descricao);
    setNewInteracao({ tipo: 'nota', descricao: '' });
    setSaving(false);
  };

  const handleAddTarefa = async () => {
    if (!newTarefa.descricao.trim()) return;
    
    setSaving(true);
    await addTarefa(newTarefa.descricao, newTarefa.dataLimite);
    setNewTarefa({ descricao: '', dataLimite: undefined });
    setSaving(false);
  };

  const handleConvert = async () => {
    setSaving(true);
    await updateLead({
      status: 'convertido',
      convertido_em: new Date().toISOString(),
      valor_venda: valorVenda ? parseFloat(valorVenda.replace(/\D/g, '')) / 100 : undefined,
    });
    setShowConvertDialog(false);
    setSaving(false);
  };

  const handleMarkLost = async () => {
    setSaving(true);
    await updateLead({
      status: 'perdido',
      motivo_perda: motivoPerda,
    });
    setShowLostDialog(false);
    setSaving(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateLead({ status: newStatus as any });
  };

  const handleResponsavelChange = async (responsavelId: string) => {
    await updateLead({ responsavel_id: responsavelId === 'none' ? null : responsavelId });
  };

  return (
    <>
      <Helmet>
        <title>{lead.nome} | Leads | Admin Tomazin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/leads">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold font-heading">{lead.nome}</h1>
              <p className="text-muted-foreground">
                Lead criado {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: ptBR })}
              </p>
            </div>
            <span className={cn('px-3 py-1.5 rounded-full text-sm font-medium', statusConfig[lead.status]?.color, statusConfig[lead.status]?.bg)}>
              {statusConfig[lead.status]?.label}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Client Info */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Dados do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{lead.nome}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{formatPhone(lead.telefone)}</p>
                </div>

                {lead.whatsapp && (
                  <div>
                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                    <p className="font-medium">{formatPhone(lead.whatsapp)}</p>
                  </div>
                )}

                {lead.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium break-all">{lead.email}</p>
                  </div>
                )}

                {(lead.cidade || lead.uf) && (
                  <div>
                    <p className="text-sm text-muted-foreground">Localização</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {[lead.cidade, lead.uf].filter(Boolean).join(' - ')}
                    </p>
                  </div>
                )}

                {lead.cpf && (
                  <div>
                    <p className="text-sm text-muted-foreground">CPF</p>
                    <p className="font-medium">{lead.cpf}</p>
                  </div>
                )}

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Origem</p>
                  <Badge variant="outline" className="mt-1">
                    {origemLabels[lead.origem] || lead.origem}
                  </Badge>
                </div>

                {lead.veiculo && (
                  <div>
                    <p className="text-sm text-muted-foreground">Veículo de Interesse</p>
                    <Link
                      to={`/admin/veiculos/${lead.veiculo.id}`}
                      className="flex items-center gap-2 mt-1 text-primary hover:underline"
                    >
                      <Car className="h-4 w-4" />
                      {lead.veiculo.marca} {lead.veiculo.modelo}
                    </Link>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Data de Criação</p>
                  <p className="font-medium flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {format(new Date(lead.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>

                <Separator />

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${lead.telefone}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://wa.me/55${(lead.whatsapp || lead.telefone).replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </Button>
                  {lead.email && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${lead.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Main Content - Timeline */}
            <div className="lg:col-span-2 space-y-6">
              {/* Add Interaction */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Adicionar Interação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Select
                      value={newInteracao.tipo}
                      onValueChange={(v) => setNewInteracao({ ...newInteracao, tipo: v })}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(interacaoLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Descreva a interação..."
                        value={newInteracao.descricao}
                        onChange={(e) => setNewInteracao({ ...newInteracao, descricao: e.target.value })}
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleAddInteracao} disabled={saving || !newInteracao.descricao.trim()}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Histórico de Interações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {interacoes.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhuma interação registrada ainda.
                    </p>
                  ) : (
                    <div className="relative space-y-4">
                      {/* Timeline line */}
                      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

                      {interacoes.map((interacao) => {
                        const Icon = interacaoIcons[interacao.tipo] || MessageSquare;
                        
                        return (
                          <div key={interacao.id} className="relative flex gap-4 pl-2">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center z-10">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 bg-secondary/50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary">{interacaoLabels[interacao.tipo]}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(interacao.created_at), "dd/MM/yyyy 'às' HH:mm")}
                                </span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{interacao.descricao}</p>
                              {interacao.usuario && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Por {interacao.usuario.nome}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Status & Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Status</Label>
                    <Select value={lead.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([value, { label }]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Responsável</Label>
                    <Select
                      value={lead.responsavel_id || 'none'}
                      onValueChange={handleResponsavelChange}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Não atribuído</SelectItem>
                        {profiles.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nome || p.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Convert Dialog */}
                  <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="default">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Marcar como Convertido
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Converter Lead</DialogTitle>
                        <DialogDescription>
                          Marcar este lead como convertido (venda realizada).
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Valor da Venda (opcional)</Label>
                          <div className="relative mt-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="0,00"
                              value={valorVenda}
                              onChange={(e) => setValorVenda(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConvertDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleConvert} disabled={saving}>
                          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                          Confirmar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Lost Dialog */}
                  <Dialog open={showLostDialog} onOpenChange={setShowLostDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="outline">
                        <XCircle className="h-4 w-4 mr-2" />
                        Marcar como Perdido
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Marcar como Perdido</DialogTitle>
                        <DialogDescription>
                          Informe o motivo da perda deste lead.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Motivo da Perda</Label>
                          <Textarea
                            placeholder="Ex: Cliente optou por outro veículo..."
                            value={motivoPerda}
                            onChange={(e) => setMotivoPerda(e.target.value)}
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowLostDialog(false)}>
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleMarkLost} disabled={saving}>
                          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                          Confirmar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5" />
                    Tarefas / Follow-up
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Task */}
                  <div className="space-y-2">
                    <Input
                      placeholder="Nova tarefa..."
                      value={newTarefa.descricao}
                      onChange={(e) => setNewTarefa({ ...newTarefa, descricao: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {newTarefa.dataLimite
                              ? format(newTarefa.dataLimite, 'dd/MM/yyyy')
                              : 'Data limite'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={newTarefa.dataLimite}
                            onSelect={(date) => setNewTarefa({ ...newTarefa, dataLimite: date })}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <Button
                        size="sm"
                        onClick={handleAddTarefa}
                        disabled={saving || !newTarefa.descricao.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Task List */}
                  {tarefas.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhuma tarefa cadastrada.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {tarefas.map((tarefa) => (
                        <div
                          key={tarefa.id}
                          className={cn(
                            'flex items-start gap-2 p-2 rounded-lg',
                            tarefa.concluida ? 'bg-secondary/50' : 'bg-card border'
                          )}
                        >
                          <Checkbox
                            checked={tarefa.concluida}
                            onCheckedChange={(checked) =>
                              toggleTarefa(tarefa.id, checked as boolean)
                            }
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                'text-sm',
                                tarefa.concluida && 'line-through text-muted-foreground'
                              )}
                            >
                              {tarefa.descricao}
                            </p>
                            {tarefa.data_limite && (
                              <p
                                className={cn(
                                  'text-xs',
                                  new Date(tarefa.data_limite) < new Date() && !tarefa.concluida
                                    ? 'text-destructive'
                                    : 'text-muted-foreground'
                                )}
                              >
                                {format(new Date(tarefa.data_limite), 'dd/MM/yyyy')}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => deleteTarefa(tarefa.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Conversion Info */}
              {lead.status === 'convertido' && lead.valor_venda && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-700">Lead Convertido</p>
                      <p className="text-2xl font-bold text-green-800">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.valor_venda)}
                      </p>
                      {lead.convertido_em && (
                        <p className="text-xs text-green-600 mt-1">
                          em {format(new Date(lead.convertido_em), 'dd/MM/yyyy')}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Loss Info */}
              {lead.status === 'perdido' && lead.motivo_perda && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <p className="text-sm text-red-700">Lead Perdido</p>
                      <p className="text-sm text-red-800 mt-2">{lead.motivo_perda}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
