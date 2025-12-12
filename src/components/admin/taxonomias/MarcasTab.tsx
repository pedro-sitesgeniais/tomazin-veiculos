import { useState } from 'react';
import { useMarcas, useMarcaMutations, MARCAS_POPULARES, Marca } from '@/hooks/useTaxonomias';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Upload, Download, GripVertical, Car } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function MarcasTab() {
  const { data: marcas, isLoading } = useMarcas();
  const { create, update, remove, importPopular } = useMarcaMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMarca, setEditingMarca] = useState<Marca | null>(null);
  const [form, setForm] = useState({ nome: '', logo_url: '', ativo: true, ordem: 0 });

  const handleSubmit = () => {
    if (editingMarca) {
      update.mutate({ id: editingMarca.id, ...form }, {
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

  const handleEdit = (marca: Marca) => {
    setEditingMarca(marca);
    setForm({
      nome: marca.nome,
      logo_url: marca.logo_url || '',
      ativo: marca.ativo,
      ordem: marca.ordem || 0
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string, count: number) => {
    if (count > 0) return;
    remove.mutate(id);
  };

  const resetForm = () => {
    setEditingMarca(null);
    setForm({ nome: '', logo_url: '', ativo: true, ordem: 0 });
  };

  const handleImportPopular = () => {
    importPopular.mutate(MARCAS_POPULARES);
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {marcas?.length || 0} marcas cadastradas
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportPopular} disabled={importPopular.isPending}>
            <Download className="h-4 w-4 mr-2" />
            Importar Populares
          </Button>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Marca
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingMarca ? 'Editar Marca' : 'Nova Marca'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome</Label>
                  <Input
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Ex: Toyota"
                  />
                </div>
                <div>
                  <Label>URL do Logo</Label>
                  <Input
                    value={form.logo_url}
                    onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                    placeholder="https://..."
                  />
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
                  {editingMarca ? 'Salvar' : 'Criar'}
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
                <TableHead className="w-12"></TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Veículos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marcas?.map((marca) => (
                <TableRow key={marca.id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  </TableCell>
                  <TableCell>
                    {marca.logo_url ? (
                      <img src={marca.logo_url} alt={marca.nome} className="h-8 w-8 object-contain" />
                    ) : (
                      <div className="h-8 w-8 bg-muted rounded flex items-center justify-center">
                        <Car className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{marca.nome}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{marca.veiculos_count || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={marca.ativo ? 'default' : 'secondary'}>
                      {marca.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(marca)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            disabled={(marca.veiculos_count || 0) > 0}
                            title={(marca.veiculos_count || 0) > 0 ? 'Não é possível excluir marca com veículos vinculados' : 'Excluir'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir marca?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. A marca "{marca.nome}" será removida permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(marca.id, marca.veiculos_count || 0)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!marcas || marcas.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhuma marca cadastrada
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
