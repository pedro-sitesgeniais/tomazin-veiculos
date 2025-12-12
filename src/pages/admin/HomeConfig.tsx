import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHomeConfig } from '@/hooks/useContentManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Home, Star, MapPin, Megaphone, Award } from 'lucide-react';
import { icons } from 'lucide-react';

type IconName = keyof typeof icons;

export default function HomeConfigPage() {
  const { configs, loading, updateConfig, getConfig } = useHomeConfig();
  const [saving, setSaving] = useState<string | null>(null);

  // Estado para cada seção
  const [heroConfig, setHeroConfig] = useState({ titulo: '', subtitulo: '' });
  const [porQueConfig, setPorQueConfig] = useState({
    titulo: '',
    cards: [] as { icone: string; titulo: string; texto: string }[],
  });
  const [depoimentosConfig, setDepoimentosConfig] = useState({ titulo: '' });
  const [localizacaoConfig, setLocalizacaoConfig] = useState({ titulo: '' });
  const [ctaConfig, setCtaConfig] = useState({ titulo: '', subtitulo: '', texto_botao: '' });

  useEffect(() => {
    if (configs.length > 0) {
      const hero = getConfig('hero');
      setHeroConfig({ titulo: hero.titulo || '', subtitulo: hero.subtitulo || '' });
      
      const porQue = getConfig('por_que_escolher');
      setPorQueConfig({
        titulo: porQue.titulo || '',
        cards: porQue.cards || [
          { icone: 'Shield', titulo: 'Procedência Garantida', texto: 'Todos os veículos passam por verificação completa' },
          { icone: 'Award', titulo: 'Qualidade Premium', texto: 'Selecionamos apenas os melhores seminovos' },
          { icone: 'Headphones', titulo: 'Atendimento Personalizado', texto: 'Equipe especializada pronta para ajudar' },
          { icone: 'CreditCard', titulo: 'Financiamento Facilitado', texto: 'Parcerias com os melhores bancos' },
        ],
      });
      
      const dep = getConfig('depoimentos');
      setDepoimentosConfig({ titulo: dep.titulo || '' });
      
      const loc = getConfig('localizacao');
      setLocalizacaoConfig({ titulo: loc.titulo || '' });
      
      const cta = getConfig('cta_avaliacao');
      setCtaConfig({ titulo: cta.titulo || '', subtitulo: cta.subtitulo || '', texto_botao: cta.texto_botao || '' });
    }
  }, [configs]);

  const handleSave = async (secao: string, config: Record<string, any>) => {
    setSaving(secao);
    await updateConfig(secao, config);
    setSaving(null);
  };

  const updateCard = (index: number, field: string, value: string) => {
    const newCards = [...porQueConfig.cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setPorQueConfig({ ...porQueConfig, cards: newCards });
  };

  const availableIcons = ['Shield', 'Award', 'Headphones', 'CreditCard', 'Car', 'CircleCheck', 'ThumbsUp', 'Heart', 'Star', 'Zap', 'Clock', 'Users'] as const;

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
          <h1 className="text-2xl font-bold tracking-tight">Configurações da Home</h1>
          <p className="text-muted-foreground">Configure os textos e seções da página inicial</p>
        </div>

        <Tabs defaultValue="hero">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="porque">Por que</TabsTrigger>
            <TabsTrigger value="depoimentos">Depoimentos</TabsTrigger>
            <TabsTrigger value="localizacao">Localização</TabsTrigger>
            <TabsTrigger value="cta">CTA</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Seção Hero
                </CardTitle>
                <CardDescription>Banner principal da home</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero_titulo">Título Principal</Label>
                  <Input
                    id="hero_titulo"
                    value={heroConfig.titulo}
                    onChange={(e) => setHeroConfig({ ...heroConfig, titulo: e.target.value })}
                    placeholder="Encontre o carro dos seus sonhos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_subtitulo">Subtítulo</Label>
                  <Textarea
                    id="hero_subtitulo"
                    value={heroConfig.subtitulo}
                    onChange={(e) => setHeroConfig({ ...heroConfig, subtitulo: e.target.value })}
                    placeholder="Os melhores seminovos com garantia e procedência"
                    rows={2}
                  />
                </div>
                <Button
                  onClick={() => handleSave('hero', heroConfig)}
                  disabled={saving === 'hero'}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving === 'hero' ? 'Salvando...' : 'Salvar'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Por que Escolher Section */}
          <TabsContent value="porque">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Por que escolher a Tomazin?
                </CardTitle>
                <CardDescription>Seção com os diferenciais da loja</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="porque_titulo">Título da Seção</Label>
                  <Input
                    id="porque_titulo"
                    value={porQueConfig.titulo}
                    onChange={(e) => setPorQueConfig({ ...porQueConfig, titulo: e.target.value })}
                    placeholder="Por que escolher a Tomazin?"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {porQueConfig.cards.map((card, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 space-y-3">
                        <Label className="text-sm font-medium">Card {index + 1}</Label>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Ícone</Label>
                          <div className="flex flex-wrap gap-2">
                            {availableIcons.map((iconName) => {
                              const IconComponent = icons[iconName];
                              return (
                                <Button
                                  key={iconName}
                                  type="button"
                                  size="sm"
                                  variant={card.icone === iconName ? 'default' : 'outline'}
                                  className="p-2"
                                  onClick={() => updateCard(index, 'icone', iconName)}
                                >
                                  <IconComponent className="h-4 w-4" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Título</Label>
                          <Input
                            value={card.titulo}
                            onChange={(e) => updateCard(index, 'titulo', e.target.value)}
                            placeholder="Título do card"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Texto</Label>
                          <Textarea
                            value={card.texto}
                            onChange={(e) => updateCard(index, 'texto', e.target.value)}
                            placeholder="Descrição do diferencial"
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button
                  onClick={() => handleSave('por_que_escolher', porQueConfig)}
                  disabled={saving === 'por_que_escolher'}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving === 'por_que_escolher' ? 'Salvando...' : 'Salvar'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Depoimentos Section */}
          <TabsContent value="depoimentos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Seção Depoimentos
                </CardTitle>
                <CardDescription>Título da seção de depoimentos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dep_titulo">Título da Seção</Label>
                  <Input
                    id="dep_titulo"
                    value={depoimentosConfig.titulo}
                    onChange={(e) => setDepoimentosConfig({ ...depoimentosConfig, titulo: e.target.value })}
                    placeholder="O que nossos clientes dizem"
                  />
                </div>
                <Button
                  onClick={() => handleSave('depoimentos', depoimentosConfig)}
                  disabled={saving === 'depoimentos'}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving === 'depoimentos' ? 'Salvando...' : 'Salvar'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Localização Section */}
          <TabsContent value="localizacao">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Seção Localização
                </CardTitle>
                <CardDescription>Título da seção de localização</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loc_titulo">Título da Seção</Label>
                  <Input
                    id="loc_titulo"
                    value={localizacaoConfig.titulo}
                    onChange={(e) => setLocalizacaoConfig({ ...localizacaoConfig, titulo: e.target.value })}
                    placeholder="Venha nos visitar"
                  />
                </div>
                <Button
                  onClick={() => handleSave('localizacao', localizacaoConfig)}
                  disabled={saving === 'localizacao'}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving === 'localizacao' ? 'Salvando...' : 'Salvar'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CTA Avaliação Section */}
          <TabsContent value="cta">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  CTA Avaliação
                </CardTitle>
                <CardDescription>Call-to-action para avaliação de veículos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cta_titulo">Título</Label>
                  <Input
                    id="cta_titulo"
                    value={ctaConfig.titulo}
                    onChange={(e) => setCtaConfig({ ...ctaConfig, titulo: e.target.value })}
                    placeholder="Quer vender ou trocar seu veículo?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta_subtitulo">Subtítulo</Label>
                  <Textarea
                    id="cta_subtitulo"
                    value={ctaConfig.subtitulo}
                    onChange={(e) => setCtaConfig({ ...ctaConfig, subtitulo: e.target.value })}
                    placeholder="Faça uma avaliação gratuita"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta_botao">Texto do Botão</Label>
                  <Input
                    id="cta_botao"
                    value={ctaConfig.texto_botao}
                    onChange={(e) => setCtaConfig({ ...ctaConfig, texto_botao: e.target.value })}
                    placeholder="Avaliar meu veículo"
                  />
                </div>
                <Button
                  onClick={() => handleSave('cta_avaliacao', ctaConfig)}
                  disabled={saving === 'cta_avaliacao'}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving === 'cta_avaliacao' ? 'Salvando...' : 'Salvar'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
