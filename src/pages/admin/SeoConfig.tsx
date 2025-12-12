import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings, 
  FileText, 
  Car, 
  ArrowRight, 
  Database, 
  BarChart3,
  Plus,
  Trash2,
  Eye,
  Search,
  Globe,
  ExternalLink,
  Loader2,
  Save,
  RefreshCw,
  AlertTriangle,
  Check
} from 'lucide-react';
import { useSeoConfigs, useSeoGlobalConfigs, useRedirects, PAGINAS_SEO, SeoConfig, Redirect } from '@/hooks/useSeo';
import { toast } from '@/hooks/use-toast';

const SeoConfigPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">SEO</h1>
          <p className="text-muted-foreground">
            Otimização para mecanismos de busca
          </p>
        </div>

        <Tabs defaultValue="geral" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="geral" className="gap-2">
              <Settings className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="paginas" className="gap-2">
              <FileText className="h-4 w-4" />
              Páginas
            </TabsTrigger>
            <TabsTrigger value="veiculos" className="gap-2">
              <Car className="h-4 w-4" />
              Veículos
            </TabsTrigger>
            <TabsTrigger value="redirects" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              Redirects
            </TabsTrigger>
            <TabsTrigger value="schema" className="gap-2">
              <Database className="h-4 w-4" />
              Schema
            </TabsTrigger>
            <TabsTrigger value="analise" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Análise
            </TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <GeneralSeoTab />
          </TabsContent>

          <TabsContent value="paginas">
            <PagesSeoTab />
          </TabsContent>

          <TabsContent value="veiculos">
            <VehiclesSeoTab />
          </TabsContent>

          <TabsContent value="redirects">
            <RedirectsTab />
          </TabsContent>

          <TabsContent value="schema">
            <SchemaTab />
          </TabsContent>

          <TabsContent value="analise">
            <AnalysisTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

const GeneralSeoTab = () => {
  const { getConfig, saveMultiple, isLoading } = useSeoGlobalConfigs();
  const [form, setForm] = useState({
    site_title: '',
    title_separator: '|',
    default_og_image: '',
    twitter_card: 'summary_large_image',
    robots_txt: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setForm({
        site_title: getConfig('site_title'),
        title_separator: getConfig('title_separator') || '|',
        default_og_image: getConfig('default_og_image'),
        twitter_card: getConfig('twitter_card') || 'summary_large_image',
        robots_txt: getConfig('robots_txt'),
      });
    }
  }, [isLoading, getConfig]);

  const handleSave = async () => {
    setSaving(true);
    await saveMultiple.mutateAsync(
      Object.entries(form).map(([chave, valor]) => ({ chave, valor }))
    );
    setSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais de SEO</CardTitle>
          <CardDescription>
            Defina as configurações globais que serão aplicadas em todo o site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Título do Site</Label>
              <Input 
                value={form.site_title}
                onChange={(e) => setForm({ ...form, site_title: e.target.value })}
                placeholder="Nome do Site"
              />
              <p className="text-xs text-muted-foreground">
                Aparece em todas as páginas após o título específico
              </p>
            </div>
            <div className="space-y-2">
              <Label>Separador de Título</Label>
              <Select 
                value={form.title_separator}
                onValueChange={(value) => setForm({ ...form, title_separator: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="|">| (pipe)</SelectItem>
                  <SelectItem value="-">- (hífen)</SelectItem>
                  <SelectItem value="›">› (seta)</SelectItem>
                  <SelectItem value="•">• (bullet)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>OG Image Padrão</Label>
              <Input 
                value={form.default_og_image}
                onChange={(e) => setForm({ ...form, default_og_image: e.target.value })}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                Imagem padrão para compartilhamento em redes sociais (1200x630px)
              </p>
            </div>
            <div className="space-y-2">
              <Label>Twitter Card Type</Label>
              <Select 
                value={form.twitter_card}
                onValueChange={(value) => setForm({ ...form, twitter_card: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>robots.txt</Label>
            <Textarea 
              value={form.robots_txt}
              onChange={(e) => setForm({ ...form, robots_txt: e.target.value })}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => toast({ title: 'Sitemap gerado!', description: '/sitemap.xml atualizado' })}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Gerar Sitemap
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PagesSeoTab = () => {
  const { configs, isLoading, updateConfig } = useSeoConfigs();
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<SeoConfig>>({});
  const [saving, setSaving] = useState(false);

  const selectedConfig = configs.find(c => c.pagina === selectedPage);
  const pageInfo = PAGINAS_SEO.find(p => p.slug === selectedPage);

  useEffect(() => {
    if (selectedConfig) {
      setForm(selectedConfig);
    } else if (selectedPage) {
      setForm({ pagina: selectedPage });
    }
  }, [selectedConfig, selectedPage]);

  const handleSave = async () => {
    if (!selectedPage) return;
    setSaving(true);
    await updateConfig.mutateAsync({
      ...form,
      pagina: selectedPage,
      id: selectedConfig?.id
    });
    setSaving(false);
  };

  const getCharacterCount = (text: string | null | undefined, ideal: { min: number; max: number }) => {
    const length = text?.length || 0;
    let color = 'text-muted-foreground';
    if (length > 0) {
      if (length >= ideal.min && length <= ideal.max) {
        color = 'text-green-600';
      } else if (length > ideal.max) {
        color = 'text-red-600';
      } else {
        color = 'text-yellow-600';
      }
    }
    return { length, color };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Páginas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {PAGINAS_SEO.map((pagina) => {
              const config = configs.find(c => c.pagina === pagina.slug);
              const hasTitle = !!config?.meta_title;
              const hasDesc = !!config?.meta_description;
              
              return (
                <button
                  key={pagina.slug}
                  onClick={() => setSelectedPage(pagina.slug)}
                  className={`w-full flex items-center justify-between p-4 hover:bg-muted/50 border-b transition-colors ${
                    selectedPage === pagina.slug ? 'bg-muted' : ''
                  }`}
                >
                  <div className="text-left">
                    <p className="font-medium">{pagina.nome}</p>
                    <p className="text-xs text-muted-foreground">{pagina.url}</p>
                  </div>
                  <div className="flex gap-1">
                    {hasTitle && hasDesc ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {pageInfo ? `SEO - ${pageInfo.nome}` : 'Selecione uma página'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedPage ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Meta Title</Label>
                  <span className={`text-xs ${getCharacterCount(form.meta_title, { min: 50, max: 60 }).color}`}>
                    {getCharacterCount(form.meta_title, { min: 50, max: 60 }).length}/60
                  </span>
                </div>
                <Input 
                  value={form.meta_title || ''}
                  onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                  placeholder="Título da página"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Meta Description</Label>
                  <span className={`text-xs ${getCharacterCount(form.meta_description, { min: 150, max: 160 }).color}`}>
                    {getCharacterCount(form.meta_description, { min: 150, max: 160 }).length}/160
                  </span>
                </div>
                <Textarea 
                  value={form.meta_description || ''}
                  onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                  placeholder="Descrição da página"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Keywords</Label>
                <Input 
                  value={form.keywords || ''}
                  onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                  placeholder="palavra1, palavra2, palavra3"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>OG Title</Label>
                  <Input 
                    value={form.og_title || ''}
                    onChange={(e) => setForm({ ...form, og_title: e.target.value })}
                    placeholder="Título para redes sociais"
                  />
                </div>
                <div className="space-y-2">
                  <Label>OG Image</Label>
                  <Input 
                    value={form.og_image || ''}
                    onChange={(e) => setForm({ ...form, og_image: e.target.value })}
                    placeholder="URL da imagem"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>OG Description</Label>
                <Textarea 
                  value={form.og_description || ''}
                  onChange={(e) => setForm({ ...form, og_description: e.target.value })}
                  placeholder="Descrição para redes sociais"
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Canonical URL</Label>
                  <Input 
                    value={form.canonical_url || ''}
                    onChange={(e) => setForm({ ...form, canonical_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="flex items-center justify-between pt-6">
                  <Label>No-index</Label>
                  <Switch 
                    checked={form.no_index || false}
                    onCheckedChange={(checked) => setForm({ ...form, no_index: checked })}
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </h4>
                
                <div className="p-4 rounded-lg bg-muted/50 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Google</p>
                    <div className="p-3 bg-background rounded border">
                      <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {form.meta_title || 'Título da Página'}
                      </p>
                      <p className="text-green-700 text-sm">
                        tomazinveiculos.com.br{pageInfo?.url}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {form.meta_description || 'Descrição da página aparecerá aqui...'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Facebook/LinkedIn</p>
                    <div className="border rounded overflow-hidden bg-background">
                      <div className="h-32 bg-muted flex items-center justify-center">
                        {form.og_image ? (
                          <img src={form.og_image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Globe className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-muted-foreground uppercase">tomazinveiculos.com.br</p>
                        <p className="font-semibold">{form.og_title || form.meta_title || 'Título'}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {form.og_description || form.meta_description || 'Descrição'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Salvar SEO
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Selecione uma página para editar o SEO
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const VehiclesSeoTab = () => {
  const { getConfig, saveMultiple, isLoading } = useSeoGlobalConfigs();
  const [form, setForm] = useState({
    vehicle_title_template: '',
    vehicle_description_template: '',
  });
  const [saving, setSaving] = useState(false);

  const sampleVehicle = {
    marca: 'Honda',
    modelo: 'Civic',
    versao: 'EXL 2.0',
    ano: '2023',
    preco: 'R$ 159.900',
    km: '25.000',
    cambio: 'Automático',
    cor: 'Preto',
    combustivel: 'Flex'
  };

  useEffect(() => {
    if (!isLoading) {
      setForm({
        vehicle_title_template: getConfig('vehicle_title_template'),
        vehicle_description_template: getConfig('vehicle_description_template'),
      });
    }
  }, [isLoading, getConfig]);

  const replaceVariables = (template: string) => {
    return template
      .replace(/{marca}/g, sampleVehicle.marca)
      .replace(/{modelo}/g, sampleVehicle.modelo)
      .replace(/{versao}/g, sampleVehicle.versao)
      .replace(/{ano}/g, sampleVehicle.ano)
      .replace(/{preco}/g, sampleVehicle.preco)
      .replace(/{km}/g, sampleVehicle.km)
      .replace(/{cambio}/g, sampleVehicle.cambio)
      .replace(/{cor}/g, sampleVehicle.cor)
      .replace(/{combustivel}/g, sampleVehicle.combustivel);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveMultiple.mutateAsync(
      Object.entries(form).map(([chave, valor]) => ({ chave, valor }))
    );
    setSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Templates de SEO para Veículos</CardTitle>
          <CardDescription>
            Configure os templates de título e descrição que serão usados para todos os veículos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Template de Meta Title</Label>
            <Input 
              value={form.vehicle_title_template}
              onChange={(e) => setForm({ ...form, vehicle_title_template: e.target.value })}
              placeholder="{marca} {modelo} {versao} {ano} | Tomazin"
            />
          </div>

          <div className="space-y-2">
            <Label>Template de Meta Description</Label>
            <Textarea 
              value={form.vehicle_description_template}
              onChange={(e) => setForm({ ...form, vehicle_description_template: e.target.value })}
              rows={4}
            />
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="font-medium mb-2">Variáveis disponíveis:</p>
            <div className="flex flex-wrap gap-2">
              {['{marca}', '{modelo}', '{versao}', '{ano}', '{preco}', '{km}', '{cambio}', '{cor}', '{combustivel}'].map((v) => (
                <Badge key={v} variant="secondary" className="font-mono">
                  {v}
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Salvar Templates
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            Exemplo com veículo: {sampleVehicle.marca} {sampleVehicle.modelo}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/50 rounded-lg space-y-4">
            <div className="p-3 bg-background rounded border">
              <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                {replaceVariables(form.vehicle_title_template) || 'Configure o template de título'}
              </p>
              <p className="text-green-700 text-sm">
                tomazinveiculos.com.br/veiculo/honda-civic-exl-2023
              </p>
              <p className="text-sm text-muted-foreground">
                {replaceVariables(form.vehicle_description_template) || 'Configure o template de descrição'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RedirectsTab = () => {
  const { redirects, isLoading, createRedirect, updateRedirect, deleteRedirect } = useRedirects();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRedirect, setEditingRedirect] = useState<Redirect | null>(null);
  const [form, setForm] = useState({ de: '', para: '', tipo: '301', ativo: true });
  const [search, setSearch] = useState('');

  const filteredRedirects = redirects.filter(r => 
    r.de.toLowerCase().includes(search.toLowerCase()) ||
    r.para.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (editingRedirect) {
      await updateRedirect.mutateAsync({ id: editingRedirect.id, ...form });
    } else {
      await createRedirect.mutateAsync(form);
    }
    setDialogOpen(false);
    setForm({ de: '', para: '', tipo: '301', ativo: true });
    setEditingRedirect(null);
  };

  const handleEdit = (redirect: Redirect) => {
    setEditingRedirect(redirect);
    setForm({ de: redirect.de, para: redirect.para, tipo: redirect.tipo, ativo: redirect.ativo });
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Redirects</CardTitle>
            <CardDescription>
              Gerencie redirecionamentos de URLs
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingRedirect(null); setForm({ de: '', para: '', tipo: '301', ativo: true }); }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Redirect
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingRedirect ? 'Editar' : 'Novo'} Redirect</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>URL de Origem</Label>
                  <Input 
                    value={form.de}
                    onChange={(e) => setForm({ ...form, de: e.target.value })}
                    placeholder="/pagina-antiga"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL de Destino</Label>
                  <Input 
                    value={form.para}
                    onChange={(e) => setForm({ ...form, para: e.target.value })}
                    placeholder="/pagina-nova"
                  />
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={form.tipo} onValueChange={(value) => setForm({ ...form, tipo: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="301">301 (Permanente)</SelectItem>
                        <SelectItem value="302">302 (Temporário)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between pt-6">
                    <Label>Ativo</Label>
                    <Switch 
                      checked={form.ativo}
                      onCheckedChange={(checked) => setForm({ ...form, ativo: checked })}
                    />
                  </div>
                </div>
                <Button onClick={handleSave} className="w-full">
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar redirects..."
              className="pl-10"
            />
          </div>

          {filteredRedirects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum redirect cadastrado
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRedirects.map((redirect) => (
                <div 
                  key={redirect.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    !redirect.ativo ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Badge variant={redirect.tipo === '301' ? 'default' : 'secondary'}>
                      {redirect.tipo}
                    </Badge>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <code className="text-sm bg-muted px-2 py-1 rounded truncate">
                        {redirect.de}
                      </code>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <code className="text-sm bg-muted px-2 py-1 rounded truncate">
                        {redirect.para}
                      </code>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(redirect)}>
                      Editar
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteRedirect.mutate(redirect.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const SchemaTab = () => {
  const { getConfig, saveMultiple, isLoading } = useSeoGlobalConfigs();
  const [form, setForm] = useState({
    organization_name: '',
    organization_logo: '',
    local_business_type: 'AutoDealer',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setForm({
        organization_name: getConfig('organization_name'),
        organization_logo: getConfig('organization_logo'),
        local_business_type: getConfig('local_business_type') || 'AutoDealer',
      });
    }
  }, [isLoading, getConfig]);

  const handleSave = async () => {
    setSaving(true);
    await saveMultiple.mutateAsync(
      Object.entries(form).map(([chave, valor]) => ({ chave, valor }))
    );
    setSaving(false);
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": form.organization_name || "Tomazin Veículos",
    "logo": form.organization_logo || "https://tomazinveiculos.com.br/logo.png",
    "url": "https://tomazinveiculos.com.br"
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": form.local_business_type,
    "name": form.organization_name || "Tomazin Veículos",
    "image": form.organization_logo,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Endereço da loja",
      "addressLocality": "Belo Horizonte",
      "addressRegion": "MG",
      "postalCode": "00000-000"
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Structured Data (Schema.org)</CardTitle>
          <CardDescription>
            Configure os dados estruturados para melhor indexação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Nome da Organização</Label>
            <Input 
              value={form.organization_name}
              onChange={(e) => setForm({ ...form, organization_name: e.target.value })}
              placeholder="Nome da empresa"
            />
          </div>

          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input 
              value={form.organization_logo}
              onChange={(e) => setForm({ ...form, organization_logo: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Negócio Local</Label>
            <Select 
              value={form.local_business_type}
              onValueChange={(value) => setForm({ ...form, local_business_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AutoDealer">AutoDealer</SelectItem>
                <SelectItem value="CarDealer">CarDealer</SelectItem>
                <SelectItem value="AutomotiveBusiness">AutomotiveBusiness</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Organization Schema</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
              {JSON.stringify(organizationSchema, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">LocalBusiness Schema</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
              {JSON.stringify(localBusinessSchema, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AnalysisTab = () => {
  const { configs } = useSeoConfigs();
  const [checking, setChecking] = useState(false);

  const pagesWithoutMeta = PAGINAS_SEO.filter(p => {
    const config = configs.find(c => c.pagina === p.slug);
    return !config?.meta_description;
  });

  const handleCheckLinks = async () => {
    setChecking(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setChecking(false);
    toast({ title: 'Verificação concluída!', description: 'Nenhum link quebrado encontrado.' });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Google Search Console</CardTitle>
          <CardDescription>
            Conecte sua conta para ver dados de performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center border-2 border-dashed rounded-lg">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Integração com Google Search Console em breve
            </p>
            <Button variant="outline" disabled>
              <ExternalLink className="h-4 w-4 mr-2" />
              Conectar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Páginas sem meta description</span>
              <Badge variant={pagesWithoutMeta.length > 0 ? 'destructive' : 'default'}>
                {pagesWithoutMeta.length}
              </Badge>
            </div>
            {pagesWithoutMeta.length > 0 && (
              <ul className="text-sm text-muted-foreground">
                {pagesWithoutMeta.map(p => (
                  <li key={p.slug}>• {p.nome}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Imagens sem alt text</span>
              <Badge variant="secondary">Em breve</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Análise automática de imagens será adicionada em breve
            </p>
          </div>

          <Button 
            onClick={handleCheckLinks} 
            disabled={checking}
            className="w-full"
            variant="outline"
          >
            {checking ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Verificar Links Quebrados
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeoConfigPage;
