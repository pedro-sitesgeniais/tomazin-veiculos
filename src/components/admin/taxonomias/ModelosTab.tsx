import { useState } from 'react';
import { useMarcas } from '@/hooks/useTaxonomias';
import { useModelos, useModeloMutations, Modelo } from '@/hooks/useTaxonomias';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, ListPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ModelosTab() {
  const { data: marcas } = useMarcas();
  const [selectedMarca, setSelectedMarca] = useState<string>('');
  const { data: modelos, isLoading } = useModelos(selectedMarca || undefined);
  const { create, createMultiple, update, remove } = useModeloMutations();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [editingModelo, setEditingModelo] = useState<Modelo | null>(null);
  const [form, setForm] = useState({ marca_id: '', nome: '', ativo: true });
  const [bulkForm, setBulkForm] = useState({ marca_id: '', modelos: '' });

  const handleSubmit = () => {
    if (editingModelo) {
      update.mutate({ id: editingModelo.id, ...form }, {
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

  const handleBulkSubmit = () => {
    const names = bulkForm.modelos.split('\n').map(n => n.trim()).filter(Boolean);
    if (names.length === 0 || !bulkForm.marca_id) return;
    
    const items = names.map(nome => ({ marca_id: bulkForm.marca_id, nome }));
    createMultiple.mutate(items, {
      onSuccess: () => {
        setBulkDialogOpen(false);
        setBulkForm({ marca_id: '', modelos: '' });
      }
    });
  };

  const handleEdit = (modelo: Modelo) => {
    setEditingModelo(modelo);
    setForm({
      marca_id: modelo.marca_id,
      nome: modelo.nome,
      ativo: modelo.ativo
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string, count: number) => {
    if (count > 0) return;
    remove.mutate(id);
  };

  const resetForm = () => {
    setEditingModelo(null);
    setForm({ marca_id: '', nome: '', ativo: true });
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4 items-center">
          <Select value={selectedMarca} onValueChange={setSelectedMarca}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as marcas</SelectItem>
              {marcas?.map((marca) => (
                <SelectItem key={marca.id} value={marca.id}>
                  {marca.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {modelos?.length || 0} modelos
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ListPlus className="h-4 w-4 mr-2" />
                Adicionar Múltiplos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Múltiplos Modelos</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Marca</Label>
                  <Select value={bulkForm.marca_id} onValueChange={(v) => setBulkForm({ ...bulkForm, marca_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {marcas?.map((marca) => (
                        <SelectItem key={marca.id} value={marca.id}>
                          {marca.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Modelos (um por linha)</Label>
                  <Textarea
                    value={bulkForm.modelos}
                    onChange={(e) => setBulkForm({ ...bulkForm, modelos: e.target.value })}
                    placeholder="Corolla&#10;Hilux&#10;RAV4"
                    rows={8}
                  />
                </div>
                <Button onClick={handleBulkSubmit} className="w-full" disabled={!bulkForm.marca_id || !bulkForm.modelos || createMultiple.isPending}>
                  Adicionar Modelos
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Modelo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingModelo ? 'Editar Modelo' : 'Novo Modelo'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Marca</Label>
                  <Select value={form.marca_id} onValueChange={(v) => setForm({ ...form, marca_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {marcas?.map((marca) => (
                        <SelectItem key={marca.id} value={marca.id}>
                          {marca.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nome do Modelo</Label>
                  <Input
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Ex: Corolla"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.ativo}
                    onCheckedChange={(checked) => setForm({ ...form, ativo: checked })}
                  />
                  <Label>Ativo</Label>
                </div>
                <Button onClick={handleSubmit} className="w-full" disabled={!form.nome || !form.marca_id || create.isPending || update.isPending}>
                  {editingModelo ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Veículos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelos?.map((modelo) => (
                <TableRow key={modelo.id}>
                  <TableCell className="text-muted-foreground">
                    {modelo.marca?.nome || '-'}
                  </TableCell>
                  <TableCell className="font-medium">{modelo.nome}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{modelo.veiculos_count || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={modelo.ativo ? 'default' : 'secondary'}>
                      {modelo.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(modelo)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            disabled={(modelo.veiculos_count || 0) > 0}
                            title={(modelo.veiculos_count || 0) > 0 ? 'Não é possível excluir modelo com veículos vinculados' : 'Excluir'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir modelo?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. O modelo "{modelo.nome}" será removido permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(modelo.id, modelo.veiculos_count || 0)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!modelos || modelos.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum modelo cadastrado
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
