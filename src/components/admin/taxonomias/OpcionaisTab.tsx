import { useState } from 'react';
import { useOpcionais, useOpcionalMutations, CATEGORIAS_OPCIONAIS, Opcional } from '@/hooks/useTaxonomias';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import * as LucideIcons from 'lucide-react';

const AVAILABLE_ICONS = [
  'AirVent', 'Bluetooth', 'Camera', 'Car', 'CircleDot', 'Disc', 'Eye',
  'Fan', 'Gauge', 'Key', 'Lightbulb', 'Lock', 'Map', 'Mic', 'Monitor',
  'Navigation', 'Phone', 'Power', 'Radio', 'Shield', 'Snowflake', 'Speaker',
  'Sun', 'Thermometer', 'Usb', 'Wifi', 'Wind', 'Zap'
];

export function OpcionaisTab() {
  const { data: opcionais, isLoading } = useOpcionais();
  const { create, update, remove } = useOpcionalMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOpcional, setEditingOpcional] = useState<Opcional | null>(null);
  const [form, setForm] = useState({ nome: '', categoria: 'Conforto', icone: 'Car', ordem: 0 });

  const handleSubmit = () => {
    if (editingOpcional) {
      update.mutate({ id: editingOpcional.id, ...form }, {
        onSuccess: () => {
          setDialogOpen(false);
          resetForm();
        }
      });
    } else {
      create.mutate(form, {
        onSuccess: () => {
          setDialogOpen(false);
          resetForm();
        }
      });
    }
  };

  const handleEdit = (opcional: Opcional) => {
    setEditingOpcional(opcional);
    setForm({
      nome: opcional.nome,
      categoria: opcional.categoria,
      icone: opcional.icone || 'Car',
      ordem: opcional.ordem || 0
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingOpcional(null);
    setForm({ nome: '', categoria: 'Conforto', icone: 'Car', ordem: 0 });
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  const opcionaisByCategory = CATEGORIAS_OPCIONAIS.reduce((acc, cat) => {
    acc[cat] = opcionais?.filter(o => o.categoria === cat) || [];
    return acc;
  }, {} as Record<string, Opcional[]>);

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {opcionais?.length || 0} opcionais cadastrados
        </p>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Opcional
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingOpcional ? 'Editar Opcional' : 'Novo Opcional'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Ex: Ar Condicionado"
                />
              </div>
              <div>
                <Label>Categoria</Label>
                <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS_OPCIONAIS.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ícone</Label>
                <Select value={form.icone} onValueChange={(v) => setForm({ ...form, icone: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_ICONS.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center gap-2">
                          {getIcon(icon)}
                          <span>{icon}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={form.ordem}
                  onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full" disabled={!form.nome || create.isPending || update.isPending}>
                {editingOpcional ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {CATEGORIAS_OPCIONAIS.map((categoria) => (
          <Card key={categoria}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                {categoria}
                <Badge variant="secondary">{opcionaisByCategory[categoria].length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {opcionaisByCategory[categoria].length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum opcional nesta categoria
                </p>
              ) : (
                <div className="space-y-2">
                  {opcionaisByCategory[categoria].map((opcional) => (
                    <div
                      key={opcional.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <div className="h-8 w-8 rounded bg-background flex items-center justify-center">
                          {getIcon(opcional.icone || 'Car')}
                        </div>
                        <span className="font-medium">{opcional.nome}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(opcional)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir opcional?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => remove.mutate(opcional.id)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
