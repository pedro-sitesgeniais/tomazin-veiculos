import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePaginas, Pagina } from '@/hooks/useContentManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Save, Eye, Bold, Italic, Heading1, Heading2, List, ListOrdered, Link as LinkIcon, Image } from 'lucide-react';

export default function PaginasLista() {
  const { paginas, loading, updatePagina } = usePaginas();
  const [selectedPagina, setSelectedPagina] = useState<Pagina | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    meta_title: '',
    meta_description: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (paginas.length > 0 && !selectedPagina) {
      setSelectedPagina(paginas[0]);
    }
  }, [paginas, selectedPagina]);

  useEffect(() => {
    if (selectedPagina) {
      setFormData({
        titulo: selectedPagina.titulo || '',
        conteudo: selectedPagina.conteudo || '',
        meta_title: selectedPagina.meta_title || '',
        meta_description: selectedPagina.meta_description || '',
      });
    }
  }, [selectedPagina]);

  const handleSave = async () => {
    if (!selectedPagina) return;
    setSaving(true);
    await updatePagina(selectedPagina.id, formData);
    setSaving(false);
  };

  const insertTag = (tag: string, closingTag?: string) => {
    const textarea = document.getElementById('conteudo') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.conteudo.substring(start, end);
    const before = formData.conteudo.substring(0, start);
    const after = formData.conteudo.substring(end);

    const newText = closingTag
      ? `${before}<${tag}>${selectedText}</${closingTag}>${after}`
      : `${before}<${tag}>${selectedText}</${tag}>${after}`;

    setFormData({ ...formData, conteudo: newText });
  };

  const pageNames: Record<string, string> = {
    'quem-somos': 'Quem Somos',
    'politica-privacidade': 'Política de Privacidade',
    'termos-uso': 'Termos de Uso',
  };

  return (
    <AdminLayout requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Páginas</h1>
          <p className="text-muted-foreground">Edite o conteúdo das páginas institucionais</p>
        </div>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-64 lg:col-span-3" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Lista de Páginas */}
            <div className="space-y-2">
              {paginas.map((pagina) => (
                <Card
                  key={pagina.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedPagina?.id === pagina.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedPagina(pagina)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <h4 className="font-medium truncate">
                          {pageNames[pagina.slug] || pagina.titulo}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          /{pagina.slug}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Atualizado: {format(new Date(pagina.updated_at), 'dd/MM/yy', { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Editor */}
            {selectedPagina && (
              <Card className="lg:col-span-3">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{pageNames[selectedPagina.slug] || selectedPagina.titulo}</CardTitle>
                      <CardDescription>/{selectedPagina.slug}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/${selectedPagina.slug}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </a>
                      </Button>
                      <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="conteudo">
                    <TabsList>
                      <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
                      <TabsTrigger value="seo">SEO</TabsTrigger>
                    </TabsList>

                    <TabsContent value="conteudo" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="titulo">Título da Página</Label>
                        <Input
                          id="titulo"
                          value={formData.titulo}
                          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="conteudo">Conteúdo (HTML)</Label>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => insertTag('h2')}
                          >
                            <Heading1 className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => insertTag('h3')}
                          >
                            <Heading2 className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => insertTag('strong')}
                          >
                            <Bold className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => insertTag('em')}
                          >
                            <Italic className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => insertTag('ul')}
                          >
                            <List className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => insertTag('ol')}
                          >
                            <ListOrdered className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => insertTag('a href=""')}
                          >
                            <LinkIcon className="h-3 w-3" />
                          </Button>
                        </div>
                        <Textarea
                          id="conteudo"
                          value={formData.conteudo}
                          onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                          rows={15}
                          className="font-mono text-sm"
                          placeholder="<h2>Título</h2>
<p>Seu conteúdo aqui...</p>"
                        />
                      </div>

                      {/* Preview */}
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div
                          className="p-4 border rounded-lg prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: formData.conteudo }}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="seo" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="meta_title">Meta Title</Label>
                        <Input
                          id="meta_title"
                          value={formData.meta_title}
                          onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                          placeholder="Título para SEO (até 60 caracteres)"
                          maxLength={60}
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.meta_title.length}/60 caracteres
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="meta_description">Meta Description</Label>
                        <Textarea
                          id="meta_description"
                          value={formData.meta_description}
                          onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                          placeholder="Descrição para SEO (até 160 caracteres)"
                          maxLength={160}
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.meta_description.length}/160 caracteres
                        </p>
                      </div>

                      {/* Preview SEO */}
                      <div className="space-y-2">
                        <Label>Preview no Google</Label>
                        <div className="p-4 border rounded-lg bg-white">
                          <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                            {formData.meta_title || formData.titulo || 'Título da página'}
                          </p>
                          <p className="text-green-700 text-sm">
                            www.tomazinveiculos.com.br/{selectedPagina.slug}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {formData.meta_description || 'Descrição da página aparecerá aqui...'}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
