import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useDepoimentos, Depoimento } from '@/hooks/useContentManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, MessageSquare, User } from 'lucide-react';

const emptyDepoimento: Partial<Depoimento> = {
  nome: '',
  foto_url: '',
  depoimento: '',
  avaliacao: 5,
  data: new Date().toISOString().split('T')[0],
  ativo: true,
  ordem: 0,
};

export default function DepoimentosLista() {
  const { depoimentos, loading, createDepoimento, updateDepoimento, deleteDepoimento } = useDepoimentos();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDepoimento, setEditingDepoimento] = useState<Partial<Depoimento> | null>(null);
  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingDepoimento({ ...emptyDepoimento, ordem: depoimentos.length });
    setDialogOpen(true);
  };

  const handleEdit = (dep: Depoimento) => {
    setEditingDepoimento({ ...dep });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingDepoimento?.nome || !editingDepoimento?.depoimento) return;
    
    setSaving(true);
    let success;
    if (editingDepoimento.id) {
      success = await updateDepoimento(editingDepoimento.id, editingDepoimento);
    } else {
      success = await createDepoimento(editingDepoimento);
    }
    
    setSaving(false);
    if (success) {
      setDialogOpen(false);
      setEditingDepoimento(null);
    }
  };

  const handleToggleAtivo = async (dep: Depoimento) => {
    await updateDepoimento(dep.id, { ativo: !dep.ativo });
  };

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${
              interactive ? 'cursor-pointer hover:text-yellow-400' : ''
            }`}
            onClick={() => interactive && onChange?.(i + 1)}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Depoimentos</h1>
            <p className="text-muted-foreground">Gerencie os depoimentos de clientes</p>
          </div>
          <Button onClick={handleOpenNew}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Depoimento
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : depoimentos.length === 0 ? (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum depoimento cadastrado</h3>
              <p className="text-muted-foreground mb-4">Adicione depoimentos de clientes satisfeitos</p>
              <Button onClick={handleOpenNew}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Depoimento
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {depoimentos.map((dep) => (
              <Card
                key={dep.id}
                className={`relative ${!dep.ativo ? 'opacity-60' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={dep.foto_url || ''} alt={dep.nome} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{dep.nome}</h4>
                      {renderStars(dep.avaliacao)}
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(dep.data), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    "{dep.depoimento}"
                  </p>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(dep)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleAtivo(dep)}
                    >
                      {dep.ativo ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir depoimento?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteDepoimento(dep.id)}>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDepoimento?.id ? 'Editar Depoimento' : 'Novo Depoimento'}
              </DialogTitle>
            </DialogHeader>

            {editingDepoimento && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Cliente *</Label>
                  <Input
                    id="nome"
                    value={editingDepoimento.nome || ''}
                    onChange={(e) => setEditingDepoimento({ ...editingDepoimento, nome: e.target.value })}
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foto_url">URL da Foto</Label>
                  <Input
                    id="foto_url"
                    value={editingDepoimento.foto_url || ''}
                    onChange={(e) => setEditingDepoimento({ ...editingDepoimento, foto_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="depoimento">Depoimento *</Label>
                  <Textarea
                    id="depoimento"
                    value={editingDepoimento.depoimento || ''}
                    onChange={(e) => setEditingDepoimento({ ...editingDepoimento, depoimento: e.target.value })}
                    rows={4}
                    placeholder="O que o cliente disse sobre a experiência..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Avaliação</Label>
                  {renderStars(editingDepoimento.avaliacao || 5, true, (r) => 
                    setEditingDepoimento({ ...editingDepoimento, avaliacao: r })
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data</Label>
                    <Input
                      id="data"
                      type="date"
                      value={editingDepoimento.data || ''}
                      onChange={(e) => setEditingDepoimento({ ...editingDepoimento, data: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ordem">Ordem</Label>
                    <Input
                      id="ordem"
                      type="number"
                      value={editingDepoimento.ordem || 0}
                      onChange={(e) => setEditingDepoimento({ ...editingDepoimento, ordem: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={editingDepoimento.ativo}
                    onCheckedChange={(checked) => setEditingDepoimento({ ...editingDepoimento, ativo: checked })}
                  />
                  <Label htmlFor="ativo">Ativo</Label>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving || !editingDepoimento?.nome || !editingDepoimento?.depoimento}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
