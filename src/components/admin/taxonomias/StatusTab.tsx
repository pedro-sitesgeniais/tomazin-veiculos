import { useState } from 'react';
import { useStatusVeiculo, useStatusVeiculoMutations, StatusVeiculo } from '@/hooks/useTaxonomias';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function StatusTab() {
  const { data: statuses, isLoading } = useStatusVeiculo();
  const { create, update, remove } = useStatusVeiculoMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<StatusVeiculo | null>(null);
  const [form, setForm] = useState({ nome: '', cor: '#6b7280', ordem: 0, ativo: true });

  const handleSubmit = () => {
    if (editingStatus) {
      update.mutate({ id: editingStatus.id, ...form }, {
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

  const handleEdit = (status: StatusVeiculo) => {
    setEditingStatus(status);
    setForm({
      nome: status.nome,
      cor: status.cor || '#6b7280',
      ordem: status.ordem || 0,
      ativo: status.ativo
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string, count: number) => {
    if (count > 0) return;
    remove.mutate(id);
  };

  const resetForm = () => {
    setEditingStatus(null);
    setForm({ nome: '', cor: '#6b7280', ordem: 0, ativo: true });
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {statuses?.length || 0} status cadastrados
        </p>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Status
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStatus ? 'Editar Status' : 'Novo Status'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Ex: Disponível"
                />
              </div>
              <div>
                <Label>Cor</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={form.cor}
                    onChange={(e) => setForm({ ...form, cor: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={form.cor}
                    onChange={(e) => setForm({ ...form, cor: e.target.value })}
                    placeholder="#6b7280"
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
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.ativo}
                  onCheckedChange={(checked) => setForm({ ...form, ativo: checked })}
                />
                <Label>Ativo</Label>
              </div>
              <Button onClick={handleSubmit} className="w-full" disabled={!form.nome || create.isPending || update.isPending}>
                {editingStatus ? 'Salvar' : 'Criar'}
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
                <TableHead>Veículos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statuses?.map((status) => (
                <TableRow key={status.id}>
                  <TableCell>
                    <div 
                      className="h-6 w-6 rounded"
                      style={{ backgroundColor: status.cor || '#6b7280' }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{status.nome}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{status.veiculos_count || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.ativo ? 'default' : 'secondary'}>
                      {status.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(status)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            disabled={(status.veiculos_count || 0) > 0}
                            title={(status.veiculos_count || 0) > 0 ? 'Não é possível excluir status com veículos vinculados' : 'Excluir'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir status?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(status.id, status.veiculos_count || 0)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!statuses || statuses.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum status cadastrado
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
