import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAvaliacao, STATUS_CONFIG, AvaliacaoStatus } from '@/hooks/useAvaliacoes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeft,
  Car,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Check,
  X,
  Download,
  MessageCircle,
  ExternalLink,
  Save,
  Send,
  Plus,
} from 'lucide-react';

export default function AvaliacaoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { avaliacao, loading, veiculos, updateAvaliacao, refetch } = useAvaliacao(id || '');

  const [formData, setFormData] = useState({
    valor_fipe: '',
    valor_avaliado: '',
    justificativa_avaliacao: '',
    observacoes_internas: '',
    valor_proposto_compra: '',
    valor_proposto_troca: '',
    veiculo_troca_id: '',
    validade_proposta: '',
  });
  const [status, setStatus] = useState<AvaliacaoStatus | ''>('');
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Update form when avaliacao loads
  useState(() => {
    if (avaliacao) {
      setFormData({
        valor_fipe: avaliacao.valor_fipe?.toString() || '',
        valor_avaliado: avaliacao.valor_avaliado?.toString() || '',
        justificativa_avaliacao: avaliacao.justificativa_avaliacao || '',
        observacoes_internas: avaliacao.observacoes_internas || '',
        valor_proposto_compra: avaliacao.valor_proposto_compra?.toString() || '',
        valor_proposto_troca: avaliacao.valor_proposto_troca?.toString() || '',
        veiculo_troca_id: avaliacao.veiculo_troca_id || '',
        validade_proposta: avaliacao.validade_proposta?.split('T')[0] || '',
      });
      setStatus(avaliacao.status);
    }
  });

  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSaveEvaluation = async () => {
    setSaving(true);
    const updates: any = {
      valor_fipe: formData.valor_fipe ? parseFloat(formData.valor_fipe) : null,
      valor_avaliado: formData.valor_avaliado ? parseFloat(formData.valor_avaliado) : null,
      justificativa_avaliacao: formData.justificativa_avaliacao || null,
      observacoes_internas: formData.observacoes_internas || null,
      valor_proposto_compra: formData.valor_proposto_compra ? parseFloat(formData.valor_proposto_compra) : null,
      valor_proposto_troca: formData.valor_proposto_troca ? parseFloat(formData.valor_proposto_troca) : null,
      veiculo_troca_id: formData.veiculo_troca_id || null,
      validade_proposta: formData.validade_proposta ? new Date(formData.validade_proposta).toISOString() : null,
      avaliado_em: new Date().toISOString(),
    };

    if (status && status !== avaliacao?.status) {
      updates.status = status;
    }

    await updateAvaliacao(updates);
    setSaving(false);
  };

  const handleStatusChange = async (newStatus: AvaliacaoStatus) => {
    setStatus(newStatus);
    await updateAvaliacao({ status: newStatus });
  };

  const openWhatsApp = () => {
    if (!avaliacao) return;
    const phone = avaliacao.telefone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá ${avaliacao.nome}! Somos da Tomazin Veículos. Recebemos sua solicitação de avaliação do ${avaliacao.marca} ${avaliacao.modelo} ${avaliacao.ano_modelo}. Protocolo: ${avaliacao.protocolo}`
    );
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  };

  const sendProposalWhatsApp = () => {
    if (!avaliacao) return;
    const phone = avaliacao.telefone.replace(/\D/g, '');
    const valor = formData.valor_proposto_compra 
      ? formatCurrency(parseFloat(formData.valor_proposto_compra))
      : 'a definir';
    const message = encodeURIComponent(
      `Olá ${avaliacao.nome}! Finalizamos a análise do seu ${avaliacao.marca} ${avaliacao.modelo} ${avaliacao.ano_modelo}. Nossa proposta de compra é de ${valor}. Esta proposta é válida até ${formData.validade_proposta ? format(new Date(formData.validade_proposta), 'dd/MM/yyyy') : 'a definir'}. Podemos conversar?`
    );
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  };

  const handleCreateVehicle = () => {
    if (!avaliacao) return;
    navigate('/admin/veiculos/novo', {
      state: {
        prefill: {
          marca: avaliacao.marca,
          modelo: avaliacao.modelo,
          versao: avaliacao.versao,
          ano: avaliacao.ano_modelo,
          quilometragem: avaliacao.quilometragem,
          combustivel: avaliacao.combustivel,
          cambio: avaliacao.cambio,
          cor: avaliacao.cor,
        },
      },
    });
  };

  if (loading) {
    return (
      <AdminLayout requireAdmin>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-96 lg:col-span-2" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!avaliacao) {
    return (
      <AdminLayout requireAdmin>
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Avaliação não encontrada</h2>
          <Button onClick={() => navigate('/admin/avaliacoes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para lista
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const statusConfig = STATUS_CONFIG[avaliacao.status as AvaliacaoStatus] || STATUS_CONFIG.pendente;

  return (
    <AdminLayout requireAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/avaliacoes')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                  Avaliação #{avaliacao.protocolo}
                </h1>
                <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border-0`}>
                  {statusConfig.label}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Recebida em {formatDate(avaliacao.created_at)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openWhatsApp}>
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            {(avaliacao.status === 'aceito' || avaliacao.status === 'concluido') && (
              <Button onClick={handleCreateVehicle}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar no Estoque
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Veículo Avaliado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Marca/Modelo</Label>
                    <p className="font-medium text-lg">
                      {avaliacao.marca} {avaliacao.modelo}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Versão</Label>
                    <p className="font-medium">{avaliacao.versao || 'Não informada'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Ano</Label>
                    <p className="font-medium">{avaliacao.ano_modelo}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Quilometragem</Label>
                    <p className="font-medium">{avaliacao.quilometragem.toLocaleString()} km</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Combustível</Label>
                    <p className="font-medium">{avaliacao.combustivel}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Câmbio</Label>
                    <p className="font-medium">{avaliacao.cambio}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Cor</Label>
                    <p className="font-medium">{avaliacao.cor}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Estado Geral</Label>
                    <p className="font-medium">{avaliacao.estado_geral}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    {avaliacao.unico_dono ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">Único dono</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {avaliacao.manual_chave_reserva ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">Manual e chave reserva</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {avaliacao.ipva_pago ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">IPVA pago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {avaliacao.possui_multas ? (
                      <X className="h-4 w-4 text-red-600" />
                    ) : (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                    <span className="text-sm">{avaliacao.possui_multas ? 'Possui multas' : 'Sem multas'}</span>
                  </div>
                </div>

                {avaliacao.observacoes && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <Label className="text-muted-foreground">Observações do Cliente</Label>
                      <p className="mt-1">{avaliacao.observacoes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Photos Gallery */}
            {avaliacao.fotos && avaliacao.fotos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Fotos Enviadas ({avaliacao.fotos.length})</span>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar todas
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {avaliacao.fotos.map((foto, index) => (
                      <Dialog key={index}>
                        <DialogTrigger asChild>
                          <div
                            className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-muted"
                          >
                            <img
                              src={foto}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <img
                            src={foto}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-auto"
                          />
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Evaluation Form */}
            <Card>
              <CardHeader>
                <CardTitle>Avaliação</CardTitle>
                <CardDescription>
                  Preencha os dados da avaliação e proposta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="valor_fipe">Valor Tabela FIPE</Label>
                    <Input
                      id="valor_fipe"
                      type="number"
                      placeholder="Ex: 75000"
                      value={formData.valor_fipe}
                      onChange={(e) => setFormData({ ...formData, valor_fipe: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor_avaliado">Valor Avaliado</Label>
                    <Input
                      id="valor_avaliado"
                      type="number"
                      placeholder="Ex: 70000"
                      value={formData.valor_avaliado}
                      onChange={(e) => setFormData({ ...formData, valor_avaliado: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="justificativa">Justificativa da Avaliação</Label>
                  <Textarea
                    id="justificativa"
                    placeholder="Descreva os pontos considerados na avaliação..."
                    value={formData.justificativa_avaliacao}
                    onChange={(e) => setFormData({ ...formData, justificativa_avaliacao: e.target.value })}
                    rows={3}
                  />
                </div>

                <Separator />

                <h4 className="font-medium">Proposta</h4>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="valor_proposto_compra">Valor Proposto (Compra)</Label>
                    <Input
                      id="valor_proposto_compra"
                      type="number"
                      placeholder="Ex: 68000"
                      value={formData.valor_proposto_compra}
                      onChange={(e) => setFormData({ ...formData, valor_proposto_compra: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor_proposto_troca">Valor Proposto (Troca)</Label>
                    <Input
                      id="valor_proposto_troca"
                      type="number"
                      placeholder="Ex: 72000"
                      value={formData.valor_proposto_troca}
                      onChange={(e) => setFormData({ ...formData, valor_proposto_troca: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="veiculo_troca">Veículo para Troca</Label>
                    <Select
                      value={formData.veiculo_troca_id || 'none'}
                      onValueChange={(value) => setFormData({ ...formData, veiculo_troca_id: value === 'none' ? '' : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        {veiculos.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.marca} {v.modelo} {v.ano} - {formatCurrency(v.preco)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validade">Validade da Proposta</Label>
                    <Input
                      id="validade"
                      type="date"
                      value={formData.validade_proposta}
                      onChange={(e) => setFormData({ ...formData, validade_proposta: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="obs_internas">Observações Internas</Label>
                  <Textarea
                    id="obs_internas"
                    placeholder="Notas internas (não visíveis para o cliente)..."
                    value={formData.observacoes_internas}
                    onChange={(e) => setFormData({ ...formData, observacoes_internas: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSaveEvaluation} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Salvando...' : 'Salvar Avaliação'}
                  </Button>
                  {formData.valor_proposto_compra && (
                    <Button variant="outline" onClick={sendProposalWhatsApp}>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Proposta via WhatsApp
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Proprietário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Nome</Label>
                  <p className="font-medium">{avaliacao.nome}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{avaliacao.telefone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{avaliacao.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{avaliacao.cidade}/{avaliacao.uf}</span>
                </div>
                {avaliacao.cpf && (
                  <div>
                    <Label className="text-muted-foreground">CPF</Label>
                    <p className="font-mono">{avaliacao.cpf}</p>
                  </div>
                )}
                <Separator />
                <div>
                  <Label className="text-muted-foreground">Interesse</Label>
                  <Badge variant="secondary" className="mt-1">
                    {avaliacao.interesse}
                  </Badge>
                </div>
                {avaliacao.melhor_horario && (
                  <div>
                    <Label className="text-muted-foreground">Melhor horário</Label>
                    <p>{avaliacao.melhor_horario}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status & Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Alterar Status</Label>
                  <Select
                    value={status || avaliacao.status}
                    onValueChange={(value) => handleStatusChange(value as AvaliacaoStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <span className={config.color}>{config.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={openWhatsApp}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.location.href = `mailto:${avaliacao.email}`}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button
                    variant="default"
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusChange('aceito')}
                    disabled={avaliacao.status === 'aceito'}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Marcar como Aceito
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleStatusChange('recusado')}
                    disabled={avaliacao.status === 'recusado'}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Marcar como Recusado
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
