import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useConfiguracoesAdmin } from '@/hooks/useConfiguracoes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Save,
  Building2,
  Share2,
  Palette,
  Plug2,
  Search,
  Mail,
  Settings,
  Clock,
} from 'lucide-react';

const DIAS_SEMANA = [
  { key: 'seg', label: 'Segunda' },
  { key: 'ter', label: 'Terça' },
  { key: 'qua', label: 'Quarta' },
  { key: 'qui', label: 'Quinta' },
  { key: 'sex', label: 'Sexta' },
  { key: 'sab', label: 'Sábado' },
  { key: 'dom', label: 'Domingo' },
];

export default function ConfiguracoesPage() {
  const { configuracoes, loading, saveMultiple, getValue } = useConfiguracoesAdmin();
  const [saving, setSaving] = useState<string | null>(null);

  // Form states for each group
  const [empresaForm, setEmpresaForm] = useState<Record<string, string>>({});
  const [socialForm, setSocialForm] = useState<Record<string, string>>({});
  const [visualForm, setVisualForm] = useState<Record<string, string>>({});
  const [integracaoForm, setIntegracaoForm] = useState<Record<string, string>>({});
  const [seoForm, setSeoForm] = useState<Record<string, string>>({});
  const [emailForm, setEmailForm] = useState<Record<string, string>>({});
  const [sistemaForm, setSistemaForm] = useState<Record<string, string>>({});
  const [horarioForm, setHorarioForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (configuracoes.length > 0) {
      // Empresa
      setEmpresaForm({
        empresa_nome: getValue('empresa_nome'),
        empresa_cnpj: getValue('empresa_cnpj'),
        empresa_razao_social: getValue('empresa_razao_social'),
        empresa_endereco: getValue('empresa_endereco'),
        empresa_cep: getValue('empresa_cep'),
        empresa_cidade: getValue('empresa_cidade'),
        empresa_uf: getValue('empresa_uf'),
        empresa_telefone: getValue('empresa_telefone'),
        empresa_whatsapp: getValue('empresa_whatsapp'),
        empresa_email: getValue('empresa_email'),
        empresa_email_notificacoes: getValue('empresa_email_notificacoes'),
        empresa_maps_embed: getValue('empresa_maps_embed'),
        empresa_lat: getValue('empresa_lat'),
        empresa_lng: getValue('empresa_lng'),
      });

      // Horário
      try {
        const horario = JSON.parse(getValue('empresa_horario') || '{}');
        setHorarioForm(horario);
      } catch {
        setHorarioForm({});
      }

      // Social
      setSocialForm({
        social_instagram: getValue('social_instagram'),
        social_facebook: getValue('social_facebook'),
        social_youtube: getValue('social_youtube'),
        social_tiktok: getValue('social_tiktok'),
        social_linkedin: getValue('social_linkedin'),
      });

      // Visual
      setVisualForm({
        visual_logo_principal: getValue('visual_logo_principal'),
        visual_logo_branca: getValue('visual_logo_branca'),
        visual_logo_icone: getValue('visual_logo_icone'),
        visual_favicon: getValue('visual_favicon'),
        visual_cor_primaria: getValue('visual_cor_primaria'),
        visual_cor_secundaria: getValue('visual_cor_secundaria'),
      });

      // Integração
      setIntegracaoForm({
        integracao_ga_id: getValue('integracao_ga_id'),
        integracao_gtm_id: getValue('integracao_gtm_id'),
        integracao_fb_pixel: getValue('integracao_fb_pixel'),
        integracao_whatsapp_msg_padrao: getValue('integracao_whatsapp_msg_padrao'),
        integracao_whatsapp_msg_veiculo: getValue('integracao_whatsapp_msg_veiculo'),
      });

      // SEO
      setSeoForm({
        seo_meta_title: getValue('seo_meta_title'),
        seo_meta_description: getValue('seo_meta_description'),
        seo_keywords: getValue('seo_keywords'),
        seo_og_image: getValue('seo_og_image'),
        seo_scripts_head: getValue('seo_scripts_head'),
        seo_scripts_body: getValue('seo_scripts_body'),
      });

      // Email
      setEmailForm({
        email_notificacao_leads: getValue('email_notificacao_leads'),
        email_notificacao_avaliacoes: getValue('email_notificacao_avaliacoes'),
        email_resposta_automatica: getValue('email_resposta_automatica'),
      });

      // Sistema
      setSistemaForm({
        sistema_manutencao: getValue('sistema_manutencao'),
        sistema_msg_manutencao: getValue('sistema_msg_manutencao'),
      });
    }
  }, [configuracoes]);

  const handleSave = async (grupo: string, form: Record<string, string>) => {
    setSaving(grupo);
    
    let updates = { ...form };
    
    // Special handling for horario
    if (grupo === 'empresa') {
      updates = {
        ...form,
        empresa_horario: JSON.stringify(horarioForm),
      };
    }
    
    await saveMultiple(updates);
    setSaving(null);
  };

  if (loading) {
    return (
      <AdminLayout requireAdmin>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
        </div>

        <Tabs defaultValue="empresa" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-2">
            <TabsTrigger value="empresa" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Redes
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="integracao" className="flex items-center gap-2">
              <Plug2 className="h-4 w-4" />
              Integrações
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Emails
            </TabsTrigger>
            <TabsTrigger value="sistema" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Sistema
            </TabsTrigger>
          </TabsList>

          {/* EMPRESA */}
          <TabsContent value="empresa">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
                <CardDescription>Informações básicas e contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome da Empresa</Label>
                    <Input
                      value={empresaForm.empresa_nome || ''}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, empresa_nome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CNPJ</Label>
                    <Input
                      value={empresaForm.empresa_cnpj || ''}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, empresa_cnpj: e.target.value })}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Razão Social</Label>
                    <Input
                      value={empresaForm.empresa_razao_social || ''}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, empresa_razao_social: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Endereço</Label>
                    <Input
                      value={empresaForm.empresa_endereco || ''}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, empresa_endereco: e.target.value })}
                      placeholder="Rua, número, bairro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CEP</Label>
                    <Input
                      value={empresaForm.empresa_cep || ''}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, empresa_cep: e.target.value })}
                      placeholder="00000-000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    <Input
                      value={empresaForm.empresa_cidade || ''}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, empresa_cidade: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>UF</Label>
                    <Input
                      value={empresaForm.empresa_uf || ''}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, empresa_uf: e.target.value })}
                      maxLength={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      value={empresaForm.empresa_telefone || ''}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, empresa_telefone: e.target.value })}
                      placeholder="(00) 0000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input
                      value={empresaForm.empresa_whatsapp || ''}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, empresa_whatsapp: e.target.value })}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Principal</Label>
                    <Input
                      type="email"
                      value={empresaForm.empresa_email || ''}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, empresa_email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Email para Notificações</Label>
                    <Input
                      type="email"
                      value={empresaForm.empresa_email_notificacoes || ''}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, empresa_email_notificacoes: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <Label className="text-base font-medium">Horário de Funcionamento</Label>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {DIAS_SEMANA.map((dia) => (
                      <div key={dia.key} className="space-y-1">
                        <Label className="text-sm">{dia.label}</Label>
                        <Input
                          value={horarioForm[dia.key] || ''}
                          onChange={(e) => setHorarioForm({ ...horarioForm, [dia.key]: e.target.value })}
                          placeholder="08:00-18:00"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-medium">Localização</Label>
                  <div className="space-y-2">
                    <Label>Google Maps Embed URL</Label>
                    <Textarea
                      value={empresaForm.empresa_maps_embed || ''}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, empresa_maps_embed: e.target.value })}
                      placeholder="<iframe src='...'></iframe>"
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Latitude</Label>
                      <Input
                        value={empresaForm.empresa_lat || ''}
                        onChange={(e) => setEmpresaForm({ ...empresaForm, empresa_lat: e.target.value })}
                        placeholder="-23.5505"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Longitude</Label>
                      <Input
                        value={empresaForm.empresa_lng || ''}
                        onChange={(e) => setEmpresaForm({ ...empresaForm, empresa_lng: e.target.value })}
                        placeholder="-46.6333"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('empresa', empresaForm)} disabled={saving === 'empresa'}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving === 'empresa' ? 'Salvando...' : 'Salvar'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SOCIAL */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais</CardTitle>
                <CardDescription>Links das redes sociais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input
                      value={socialForm.social_instagram || ''}
                      onChange={(e) => setSocialForm({ ...socialForm, social_instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Facebook</Label>
                    <Input
                      value={socialForm.social_facebook || ''}
                      onChange={(e) => setSocialForm({ ...socialForm, social_facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>YouTube</Label>
                    <Input
                      value={socialForm.social_youtube || ''}
                      onChange={(e) => setSocialForm({ ...socialForm, social_youtube: e.target.value })}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>TikTok</Label>
                    <Input
                      value={socialForm.social_tiktok || ''}
                      onChange={(e) => setSocialForm({ ...socialForm, social_tiktok: e.target.value })}
                      placeholder="https://tiktok.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input
                      value={socialForm.social_linkedin || ''}
                      onChange={(e) => setSocialForm({ ...socialForm, social_linkedin: e.target.value })}
                      placeholder="https://linkedin.com/..."
                    />
                  </div>
                </div>
                <Button onClick={() => handleSave('social', socialForm)} disabled={saving === 'social'}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving === 'social' ? 'Salvando...' : 'Salvar'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VISUAL */}
          <TabsContent value="visual">
            <Card>
              <CardHeader>
                <CardTitle>Identidade Visual</CardTitle>
                <CardDescription>Logos e cores do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Logo Principal (URL)</Label>
                    <Input
                      value={visualForm.visual_logo_principal || ''}
                      onChange={(e) => setVisualForm({ ...visualForm, visual_logo_principal: e.target.value })}
                      placeholder="https://..."
                    />
                    {visualForm.visual_logo_principal && (
                      <img src={visualForm.visual_logo_principal} alt="Logo" className="h-16 object-contain mt-2" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Logo Branca (URL)</Label>
                    <Input
                      value={visualForm.visual_logo_branca || ''}
                      onChange={(e) => setVisualForm({ ...visualForm, visual_logo_branca: e.target.value })}
                      placeholder="https://..."
                    />
                    {visualForm.visual_logo_branca && (
                      <div className="bg-gray-800 p-2 rounded mt-2 inline-block">
                        <img src={visualForm.visual_logo_branca} alt="Logo Branca" className="h-12 object-contain" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Logo Ícone (URL)</Label>
                    <Input
                      value={visualForm.visual_logo_icone || ''}
                      onChange={(e) => setVisualForm({ ...visualForm, visual_logo_icone: e.target.value })}
                      placeholder="https://..."
                    />
                    {visualForm.visual_logo_icone && (
                      <img src={visualForm.visual_logo_icone} alt="Ícone" className="h-12 object-contain mt-2" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Favicon (URL)</Label>
                    <Input
                      value={visualForm.visual_favicon || ''}
                      onChange={(e) => setVisualForm({ ...visualForm, visual_favicon: e.target.value })}
                      placeholder="https://..."
                    />
                    {visualForm.visual_favicon && (
                      <img src={visualForm.visual_favicon} alt="Favicon" className="h-8 object-contain mt-2" />
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Cor Primária</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={visualForm.visual_cor_primaria || '#1a365d'}
                        onChange={(e) => setVisualForm({ ...visualForm, visual_cor_primaria: e.target.value })}
                        className="h-10 w-16 cursor-pointer rounded border"
                      />
                      <Input
                        value={visualForm.visual_cor_primaria || ''}
                        onChange={(e) => setVisualForm({ ...visualForm, visual_cor_primaria: e.target.value })}
                        placeholder="#1a365d"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Cor Secundária</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={visualForm.visual_cor_secundaria || '#c53030'}
                        onChange={(e) => setVisualForm({ ...visualForm, visual_cor_secundaria: e.target.value })}
                        className="h-10 w-16 cursor-pointer rounded border"
                      />
                      <Input
                        value={visualForm.visual_cor_secundaria || ''}
                        onChange={(e) => setVisualForm({ ...visualForm, visual_cor_secundaria: e.target.value })}
                        placeholder="#c53030"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('visual', visualForm)} disabled={saving === 'visual'}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving === 'visual' ? 'Salvando...' : 'Salvar'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* INTEGRAÇÕES */}
          <TabsContent value="integracao">
            <Card>
              <CardHeader>
                <CardTitle>Integrações</CardTitle>
                <CardDescription>Analytics, pixels e mensagens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Google Analytics ID</Label>
                    <Input
                      value={integracaoForm.integracao_ga_id || ''}
                      onChange={(e) => setIntegracaoForm({ ...integracaoForm, integracao_ga_id: e.target.value })}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Google Tag Manager ID</Label>
                    <Input
                      value={integracaoForm.integracao_gtm_id || ''}
                      onChange={(e) => setIntegracaoForm({ ...integracaoForm, integracao_gtm_id: e.target.value })}
                      placeholder="GTM-XXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Facebook Pixel ID</Label>
                    <Input
                      value={integracaoForm.integracao_fb_pixel || ''}
                      onChange={(e) => setIntegracaoForm({ ...integracaoForm, integracao_fb_pixel: e.target.value })}
                      placeholder="1234567890"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-medium">Mensagens WhatsApp</Label>
                  <div className="space-y-2">
                    <Label>Mensagem Padrão</Label>
                    <Textarea
                      value={integracaoForm.integracao_whatsapp_msg_padrao || ''}
                      onChange={(e) => setIntegracaoForm({ ...integracaoForm, integracao_whatsapp_msg_padrao: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mensagem para Veículo</Label>
                    <Textarea
                      value={integracaoForm.integracao_whatsapp_msg_veiculo || ''}
                      onChange={(e) => setIntegracaoForm({ ...integracaoForm, integracao_whatsapp_msg_veiculo: e.target.value })}
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">
                      Placeholders disponíveis: {'{marca}'}, {'{modelo}'}, {'{ano}'}, {'{preco}'}
                    </p>
                  </div>
                </div>

                <Button onClick={() => handleSave('integracao', integracaoForm)} disabled={saving === 'integracao'}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving === 'integracao' ? 'Salvando...' : 'Salvar'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Global</CardTitle>
                <CardDescription>Configurações padrão de SEO</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Title Padrão</Label>
                  <Input
                    value={seoForm.seo_meta_title || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, seo_meta_title: e.target.value })}
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">{(seoForm.seo_meta_title || '').length}/60</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Description Padrão</Label>
                  <Textarea
                    value={seoForm.seo_meta_description || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, seo_meta_description: e.target.value })}
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">{(seoForm.seo_meta_description || '').length}/160</p>
                </div>
                <div className="space-y-2">
                  <Label>Palavras-chave</Label>
                  <Input
                    value={seoForm.seo_keywords || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, seo_keywords: e.target.value })}
                    placeholder="palavra1, palavra2, palavra3"
                  />
                </div>
                <div className="space-y-2">
                  <Label>OG Image Padrão (URL)</Label>
                  <Input
                    value={seoForm.seo_og_image || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, seo_og_image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Scripts Adicionais (Head)</Label>
                  <Textarea
                    value={seoForm.seo_scripts_head || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, seo_scripts_head: e.target.value })}
                    rows={4}
                    className="font-mono text-sm"
                    placeholder="<!-- Scripts para o <head> -->"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Scripts Adicionais (Body)</Label>
                  <Textarea
                    value={seoForm.seo_scripts_body || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, seo_scripts_body: e.target.value })}
                    rows={4}
                    className="font-mono text-sm"
                    placeholder="<!-- Scripts para o final do <body> -->"
                  />
                </div>

                <Button onClick={() => handleSave('seo', seoForm)} disabled={saving === 'seo'}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving === 'seo' ? 'Salvando...' : 'Salvar'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EMAIL */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Email</CardTitle>
                <CardDescription>Notificações e templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Email para Leads</Label>
                    <Input
                      type="email"
                      value={emailForm.email_notificacao_leads || ''}
                      onChange={(e) => setEmailForm({ ...emailForm, email_notificacao_leads: e.target.value })}
                      placeholder="leads@empresa.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email para Avaliações</Label>
                    <Input
                      type="email"
                      value={emailForm.email_notificacao_avaliacoes || ''}
                      onChange={(e) => setEmailForm({ ...emailForm, email_notificacao_avaliacoes: e.target.value })}
                      placeholder="avaliacoes@empresa.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Template de Resposta Automática (HTML)</Label>
                  <Textarea
                    value={emailForm.email_resposta_automatica || ''}
                    onChange={(e) => setEmailForm({ ...emailForm, email_resposta_automatica: e.target.value })}
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>

                <Button onClick={() => handleSave('email', emailForm)} disabled={saving === 'email'}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving === 'email' ? 'Salvando...' : 'Salvar'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SISTEMA */}
          <TabsContent value="sistema">
            <Card>
              <CardHeader>
                <CardTitle>Sistema</CardTitle>
                <CardDescription>Configurações gerais do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-base">Modo Manutenção</Label>
                    <p className="text-sm text-muted-foreground">
                      Exibe uma página de manutenção para os visitantes
                    </p>
                  </div>
                  <Switch
                    checked={sistemaForm.sistema_manutencao === 'true'}
                    onCheckedChange={(checked) => 
                      setSistemaForm({ ...sistemaForm, sistema_manutencao: checked ? 'true' : 'false' })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mensagem de Manutenção</Label>
                  <Textarea
                    value={sistemaForm.sistema_msg_manutencao || ''}
                    onChange={(e) => setSistemaForm({ ...sistemaForm, sistema_msg_manutencao: e.target.value })}
                    rows={3}
                    placeholder="Estamos em manutenção. Voltamos em breve!"
                  />
                </div>

                <Button onClick={() => handleSave('sistema', sistemaForm)} disabled={saving === 'sistema'}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving === 'sistema' ? 'Salvando...' : 'Salvar'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
