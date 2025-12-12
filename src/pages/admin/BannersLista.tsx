import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useBanners, Banner } from '@/hooks/useContentManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, GripVertical, Pencil, Trash2, Eye, EyeOff, Monitor, Smartphone, Image as ImageIcon } from 'lucide-react';

const emptyBanner: Partial<Banner> = {
  titulo_interno: '',
  imagem_desktop: '',
  imagem_mobile: '',
  titulo_overlay: '',
  subtitulo_overlay: '',
  texto_botao: '',
  link_botao: '',
  posicao_texto: 'centro',
  ordem: 0,
  ativo: true,
  data_inicio: null,
  data_fim: null,
};

export default function BannersLista() {
  const { banners, loading, createBanner, updateBanner, deleteBanner, reorderBanners } = useBanners();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleOpenNew = () => {
    setEditingBanner({ ...emptyBanner, ordem: banners.length });
    setDialogOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner({
      ...banner,
      data_inicio: banner.data_inicio?.split('T')[0] || null,
      data_fim: banner.data_fim?.split('T')[0] || null,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingBanner?.titulo_interno || !editingBanner?.imagem_desktop) return;
    
    setSaving(true);
    const data = {
      ...editingBanner,
      data_inicio: editingBanner.data_inicio ? new Date(editingBanner.data_inicio).toISOString() : null,
      data_fim: editingBanner.data_fim ? new Date(editingBanner.data_fim).toISOString() : null,
    };

    let success;
    if (editingBanner.id) {
      success = await updateBanner(editingBanner.id, data);
    } else {
      success = await createBanner(data);
    }
    
    setSaving(false);
    if (success) {
      setDialogOpen(false);
      setEditingBanner(null);
    }
  };

  const handleToggleAtivo = async (banner: Banner) => {
    await updateBanner(banner.id, { ativo: !banner.ativo });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newBanners = [...banners];
    const draggedBanner = newBanners[draggedIndex];
    newBanners.splice(draggedIndex, 1);
    newBanners.splice(index, 0, draggedBanner);
    setDraggedIndex(index);
    reorderBanners(newBanners);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <AdminLayout requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Banners</h1>
            <p className="text-muted-foreground">Gerencie os banners do carrossel da home</p>
          </div>
          <Button onClick={handleOpenNew}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Banner
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : banners.length === 0 ? (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum banner cadastrado</h3>
              <p className="text-muted-foreground mb-4">Comece criando o primeiro banner</p>
              <Button onClick={handleOpenNew}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Banner
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {banners.map((banner, index) => (
              <Card
                key={banner.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative overflow-hidden transition-all ${
                  !banner.ativo ? 'opacity-60' : ''
                } ${draggedIndex === index ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing p-1 bg-background/80 rounded">
                  <GripVertical className="h-4 w-4" />
                </div>
                <div className="aspect-video bg-muted relative">
                  {banner.imagem_desktop ? (
                    <img
                      src={banner.imagem_desktop}
                      alt={banner.titulo_interno}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {banner.titulo_overlay && (
                    <div
                      className={`absolute inset-0 flex flex-col justify-center p-4 bg-black/40 text-white ${
                        banner.posicao_texto === 'esquerda' ? 'items-start text-left' :
                        banner.posicao_texto === 'direita' ? 'items-end text-right' : 'items-center text-center'
                      }`}
                    >
                      <h3 className="text-lg font-bold">{banner.titulo_overlay}</h3>
                      {banner.subtitulo_overlay && (
                        <p className="text-sm opacity-90">{banner.subtitulo_overlay}</p>
                      )}
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium truncate">{banner.titulo_interno}</h4>
                    <span className="text-xs text-muted-foreground">#{banner.ordem + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(banner)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleAtivo(banner)}
                    >
                      {banner.ativo ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir banner?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteBanner(banner.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog de Edição */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBanner?.id ? 'Editar Banner' : 'Novo Banner'}
              </DialogTitle>
            </DialogHeader>

            {editingBanner && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo_interno">Título Interno *</Label>
                    <Input
                      id="titulo_interno"
                      value={editingBanner.titulo_interno || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, titulo_interno: e.target.value })}
                      placeholder="Ex: Promoção de Verão"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imagem_desktop">URL Imagem Desktop (1920x600) *</Label>
                    <Input
                      id="imagem_desktop"
                      value={editingBanner.imagem_desktop || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, imagem_desktop: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imagem_mobile">URL Imagem Mobile (768x500)</Label>
                    <Input
                      id="imagem_mobile"
                      value={editingBanner.imagem_mobile || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, imagem_mobile: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="titulo_overlay">Título (Overlay)</Label>
                    <Input
                      id="titulo_overlay"
                      value={editingBanner.titulo_overlay || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, titulo_overlay: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitulo_overlay">Subtítulo (Overlay)</Label>
                    <Textarea
                      id="subtitulo_overlay"
                      value={editingBanner.subtitulo_overlay || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, subtitulo_overlay: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="texto_botao">Texto do Botão</Label>
                      <Input
                        id="texto_botao"
                        value={editingBanner.texto_botao || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, texto_botao: e.target.value })}
                        placeholder="Ver mais"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="link_botao">Link do Botão</Label>
                      <Input
                        id="link_botao"
                        value={editingBanner.link_botao || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, link_botao: e.target.value })}
                        placeholder="/estoque"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Posição do Texto</Label>
                    <Select
                      value={editingBanner.posicao_texto || 'centro'}
                      onValueChange={(value) => setEditingBanner({ ...editingBanner, posicao_texto: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="esquerda">Esquerda</SelectItem>
                        <SelectItem value="centro">Centro</SelectItem>
                        <SelectItem value="direita">Direita</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="data_inicio">Data Início</Label>
                      <Input
                        id="data_inicio"
                        type="date"
                        value={editingBanner.data_inicio || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, data_inicio: e.target.value || null })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="data_fim">Data Fim</Label>
                      <Input
                        id="data_fim"
                        type="date"
                        value={editingBanner.data_fim || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, data_fim: e.target.value || null })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ativo"
                      checked={editingBanner.ativo}
                      onCheckedChange={(checked) => setEditingBanner({ ...editingBanner, ativo: checked })}
                    />
                    <Label htmlFor="ativo">Banner Ativo</Label>
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Label>Preview:</Label>
                    <Button
                      size="sm"
                      variant={previewMode === 'desktop' ? 'default' : 'outline'}
                      onClick={() => setPreviewMode('desktop')}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={previewMode === 'mobile' ? 'default' : 'outline'}
                      onClick={() => setPreviewMode('mobile')}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div
                    className={`relative bg-muted rounded-lg overflow-hidden ${
                      previewMode === 'desktop' ? 'aspect-[1920/600]' : 'aspect-[768/500]'
                    }`}
                  >
                    {(previewMode === 'desktop' ? editingBanner.imagem_desktop : editingBanner.imagem_mobile || editingBanner.imagem_desktop) ? (
                      <img
                        src={previewMode === 'desktop' ? editingBanner.imagem_desktop : (editingBanner.imagem_mobile || editingBanner.imagem_desktop || '')}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {editingBanner.titulo_overlay && (
                      <div
                        className={`absolute inset-0 flex flex-col justify-center p-6 bg-black/40 text-white ${
                          editingBanner.posicao_texto === 'esquerda' ? 'items-start text-left' :
                          editingBanner.posicao_texto === 'direita' ? 'items-end text-right' : 'items-center text-center'
                        }`}
                      >
                        <h3 className="text-xl md:text-2xl font-bold mb-2">{editingBanner.titulo_overlay}</h3>
                        {editingBanner.subtitulo_overlay && (
                          <p className="text-sm md:text-base opacity-90 mb-4">{editingBanner.subtitulo_overlay}</p>
                        )}
                        {editingBanner.texto_botao && (
                          <Button size="sm" variant="secondary">
                            {editingBanner.texto_botao}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving || !editingBanner?.titulo_interno || !editingBanner?.imagem_desktop}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
