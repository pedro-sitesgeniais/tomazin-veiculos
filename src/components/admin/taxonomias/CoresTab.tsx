import { useState } from 'react';
import { useCores, useCorMutations, Cor } from '@/hooks/useTaxonomias';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function CoresTab() {
  const { data: cores, isLoading } = useCores();
  const { create, update, remove } = useCorMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCor, setEditingCor] = useState<Cor | null>(null);
  const [form, setForm] = useState({ nome: '', hex_code: '#000000', ordem: 0 });

  const handleSubmit = () => {
    if (editingCor) {
      update.mutate({ id: editingCor.id, ...form }, {
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

  const handleEdit = (cor: Cor) => {
    setEditingCor(cor);
    setForm({
      nome: cor.nome,
      hex_code: cor.hex_code || '#000000',
      ordem: cor.ordem || 0
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string, count: number) => {
    if (count > 0) return;
    remove.mutate(id);
  };

  const resetForm = () => {
    setEditingCor(null);
    setForm({ nome: '', hex_code: '#000000', ordem: 0 });
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {cores?.length || 0} cores cadastradas
        </p>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Cor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCor ? 'Editar Cor' : 'Nova Cor'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Ex: Preto"
                />
              </div>
              <div>
                <Label>Código Hex</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={form.hex_code}
                    onChange={(e) => setForm({ ...form, hex_code: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={form.hex_code}
                    onChange={(e) => setForm({ ...form, hex_code: e.target.value })}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
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
                {editingCor ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cor</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Código Hex</TableHead>
                <TableHead>Veículos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cores?.map((cor) => (
                <TableRow key={cor.id}>
                  <TableCell>
                    <div 
                      className="h-8 w-8 rounded-full border"
                      style={{ backgroundColor: cor.hex_code || '#ccc' }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{cor.nome}</TableCell>
                  <TableCell className="font-mono text-sm">{cor.hex_code || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{cor.veiculos_count || 0}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(cor)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            disabled={(cor.veiculos_count || 0) > 0}
                            title={(cor.veiculos_count || 0) > 0 ? 'Não é possível excluir cor com veículos vinculados' : 'Excluir'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir cor?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. A cor "{cor.nome}" será removida permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(cor.id, cor.veiculos_count || 0)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!cores || cores.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma cor cadastrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
