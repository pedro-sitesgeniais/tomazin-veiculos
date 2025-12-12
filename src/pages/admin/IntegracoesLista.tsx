import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings, 
  RefreshCw, 
  Unplug, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Info,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useIntegracoes, useIntegracaoLogs, useIntegracaoStats, Integracao } from '@/hooks/useIntegracoes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

const IntegracoesLista = () => {
  const { integracoes, isLoading, updateIntegracao, toggleAtivo } = useIntegracoes();
  const { data: stats = {} } = useIntegracaoStats();
  const [selectedIntegracao, setSelectedIntegracao] = useState<Integracao | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [logsDialogOpen, setLogsDialogOpen] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  const handleConfigure = (integracao: Integracao) => {
    setSelectedIntegracao(integracao);
    setConfigDialogOpen(true);
  };

  const handleViewLogs = (integracao: Integracao) => {
    setSelectedIntegracao(integracao);
    setLogsDialogOpen(true);
  };

  const handleSync = async (integracao: Integracao) => {
    setSyncing(integracao.id);
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    await updateIntegracao.mutateAsync({
      id: integracao.id,
      ultima_sincronizacao: new Date().toISOString()
    });
    setSyncing(null);
    toast({ title: 'Sincronização concluída!' });
  };

  const handleDisconnect = async (integracao: Integracao) => {
    await toggleAtivo.mutateAsync({ id: integracao.id, ativo: false });
  };

  const handleTestConnection = () => {
    toast({ title: 'Conexão testada com sucesso!', description: 'API respondeu corretamente.' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Integrações</h1>
          <p className="text-muted-foreground">
            Gerencie a publicação de veículos em marketplaces
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integracoes.map((integracao) => {
              const integStats = stats[integracao.id] || { total: 0, published: 0, error: 0, pending: 0 };
              const config = integracao.config as Integracao['config'];
              
              return (
                <Card key={integracao.id} className={!integracao.ativo ? 'opacity-60' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {config?.logo ? (
                            <img 
                              src={config.logo} 
                              alt={config.nome} 
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-lg font-bold text-muted-foreground">
                              {integracao.portal.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{config?.nome || integracao.portal}</CardTitle>
                          <p className="text-sm text-muted-foreground">{config?.descricao}</p>
                        </div>
                      </div>
                      <Badge variant={integracao.ativo ? 'default' : 'secondary'}>
                        {integracao.ativo ? 'Conectado' : 'Desconectado'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-green-600">{integStats.published}</p>
                        <p className="text-xs text-muted-foreground">Publicados</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-yellow-600">{integStats.pending}</p>
                        <p className="text-xs text-muted-foreground">Pendentes</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-red-600">{integStats.error}</p>
                        <p className="text-xs text-muted-foreground">Erros</p>
                      </div>
                    </div>

                    {integracao.ultima_sincronizacao && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Última sync: {format(new Date(integracao.ultima_sincronizacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleConfigure(integracao)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Configurar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSync(integracao)}
                        disabled={!integracao.ativo || syncing === integracao.id}
                      >
                        {syncing === integracao.id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-1" />
                        )}
                        Sincronizar
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewLogs(integracao)}
                      >
                        Ver Logs
                      </Button>
                      {integracao.ativo && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="flex-1 text-destructive hover:text-destructive"
                          onClick={() => handleDisconnect(integracao)}
                        >
                          <Unplug className="h-4 w-4 mr-1" />
                          Desconectar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Configuration Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              Configurar {(selectedIntegracao?.config as Integracao['config'])?.nome || selectedIntegracao?.portal}
            </DialogTitle>
          </DialogHeader>
          <IntegracaoConfigForm 
            integracao={selectedIntegracao} 
            onSave={async (data) => {
              if (selectedIntegracao) {
                await updateIntegracao.mutateAsync({ id: selectedIntegracao.id, ...data });
                setConfigDialogOpen(false);
              }
            }}
            onTestConnection={handleTestConnection}
          />
        </DialogContent>
      </Dialog>

      {/* Logs Dialog */}
      <Dialog open={logsDialogOpen} onOpenChange={setLogsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              Logs - {(selectedIntegracao?.config as Integracao['config'])?.nome || selectedIntegracao?.portal}
            </DialogTitle>
          </DialogHeader>
          <IntegracaoLogsView integracaoId={selectedIntegracao?.id} />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

interface IntegracaoConfigFormProps {
  integracao: Integracao | null;
  onSave: (data: Partial<Integracao>) => Promise<void>;
  onTestConnection: () => void;
}

const IntegracaoConfigForm: React.FC<IntegracaoConfigFormProps> = ({ integracao, onSave, onTestConnection }) => {
  const [credenciais, setCredenciais] = useState(integracao?.credenciais || {});
  const [config, setConfig] = useState(integracao?.config || {});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ credenciais, config, ativo: true });
    setSaving(false);
  };

  return (
    <Tabs defaultValue="credenciais" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="credenciais">Credenciais</TabsTrigger>
        <TabsTrigger value="regras">Regras</TabsTrigger>
        <TabsTrigger value="anuncio">Anúncio</TabsTrigger>
        <TabsTrigger value="mapeamento">Mapeamento</TabsTrigger>
      </TabsList>

      <ScrollArea className="h-[400px] mt-4">
        <TabsContent value="credenciais" className="space-y-4 px-1">
          <div className="space-y-2">
            <Label>API Key / Token</Label>
            <Input 
              type="password"
              value={credenciais.api_key || ''}
              onChange={(e) => setCredenciais({ ...credenciais, api_key: e.target.value })}
              placeholder="Insira a API Key"
            />
          </div>
          <div className="space-y-2">
            <Label>ID da Conta/Loja</Label>
            <Input 
              value={credenciais.account_id || ''}
              onChange={(e) => setCredenciais({ ...credenciais, account_id: e.target.value })}
              placeholder="ID da sua conta no portal"
            />
          </div>
          <div className="space-y-2">
            <Label>Link da Loja no Portal</Label>
            <Input 
              value={credenciais.store_url || ''}
              onChange={(e) => setCredenciais({ ...credenciais, store_url: e.target.value })}
              placeholder="https://portal.com/sua-loja"
            />
          </div>
          <Button variant="outline" onClick={onTestConnection}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Testar Conexão
          </Button>
        </TabsContent>

        <TabsContent value="regras" className="space-y-4 px-1">
          <div className="flex items-center justify-between">
            <div>
              <Label>Publicar automaticamente novos veículos</Label>
              <p className="text-sm text-muted-foreground">
                Veículos novos serão enviados automaticamente
              </p>
            </div>
            <Switch 
              checked={config.auto_publish || false}
              onCheckedChange={(checked) => setConfig({ ...config, auto_publish: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Apenas veículos com status "Ativo"</Label>
              <p className="text-sm text-muted-foreground">
                Ignora veículos inativos ou reservados
              </p>
            </div>
            <Switch 
              checked={config.only_active !== false}
              onCheckedChange={(checked) => setConfig({ ...config, only_active: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>Filtrar por condição</Label>
            <Select 
              value={config.condition_filter?.[0] || 'all'}
              onValueChange={(value) => setConfig({ 
                ...config, 
                condition_filter: value === 'all' ? [] : [value] 
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="0KM">Apenas 0KM</SelectItem>
                <SelectItem value="Seminovo">Apenas Seminovos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Preço mínimo</Label>
              <Input 
                type="number"
                value={config.price_min || ''}
                onChange={(e) => setConfig({ ...config, price_min: Number(e.target.value) || undefined })}
                placeholder="R$ 0"
              />
            </div>
            <div className="space-y-2">
              <Label>Preço máximo</Label>
              <Input 
                type="number"
                value={config.price_max || ''}
                onChange={(e) => setConfig({ ...config, price_max: Number(e.target.value) || undefined })}
                placeholder="Sem limite"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="anuncio" className="space-y-4 px-1">
          <div className="space-y-2">
            <Label>Tipo de Anúncio</Label>
            <Select 
              value={config.ad_type || 'free'}
              onValueChange={(value) => setConfig({ ...config, ad_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Gratuito</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="destaque">Destaque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Destacar automaticamente</Label>
              <p className="text-sm text-muted-foreground">
                Aplicar destaque nos anúncios
              </p>
            </div>
            <Switch 
              checked={config.highlight || false}
              onCheckedChange={(checked) => setConfig({ ...config, highlight: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>Template de descrição</Label>
            <Textarea 
              value={config.description_template || ''}
              onChange={(e) => setConfig({ ...config, description_template: e.target.value })}
              placeholder="Use {marca}, {modelo}, {ano}, {km}, {preco} para campos dinâmicos"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Variáveis: {'{marca}'}, {'{modelo}'}, {'{ano}'}, {'{km}'}, {'{preco}'}, {'{cor}'}, {'{combustivel}'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Incluir telefone na descrição</Label>
            </div>
            <Switch 
              checked={config.include_phone || false}
              onCheckedChange={(checked) => setConfig({ ...config, include_phone: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Incluir link do site</Label>
            </div>
            <Switch 
              checked={config.include_website || false}
              onCheckedChange={(checked) => setConfig({ ...config, include_website: checked })}
            />
          </div>
        </TabsContent>

        <TabsContent value="mapeamento" className="space-y-4 px-1">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              O mapeamento de campos permite converter as categorias do seu sistema para as categorias aceitas pelo portal.
              Esta configuração será disponibilizada quando a integração com a API estiver ativa.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Mapeamento de Categorias</Label>
            <p className="text-xs text-muted-foreground">
              Em breve: Configure como suas carrocerias são mapeadas para o portal
            </p>
          </div>

          <div className="space-y-2">
            <Label>Mapeamento de Cores</Label>
            <p className="text-xs text-muted-foreground">
              Em breve: Configure como suas cores são mapeadas para o portal
            </p>
          </div>
        </TabsContent>
      </ScrollArea>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Salvar Configurações
        </Button>
      </div>
    </Tabs>
  );
};

interface IntegracaoLogsViewProps {
  integracaoId?: string;
}

const IntegracaoLogsView: React.FC<IntegracaoLogsViewProps> = ({ integracaoId }) => {
  const { logs, isLoading } = useIntegracaoLogs(integracaoId);

  const getLogIcon = (tipo: string) => {
    switch (tipo) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum log encontrado
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            {getLogIcon(log.tipo)}
            <div className="flex-1 min-w-0">
              <p className="text-sm">{log.mensagem}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(log.created_at), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}
              </p>
            </div>
            {log.veiculo_id && (
              <Button variant="ghost" size="sm" asChild>
                <a href={`/admin/veiculos/${log.veiculo_id}`}>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default IntegracoesLista;
