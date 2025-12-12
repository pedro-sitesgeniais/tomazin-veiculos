import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAdminVehicles, useMarcas } from '@/hooks/useAdminVehicles';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Star,
  StarOff,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Loader2,
  Car
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'ativo', label: 'Ativo' },
  { value: 'rascunho', label: 'Rascunho' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'reservado', label: 'Reservado' },
];

const condicaoOptions = [
  { value: '', label: 'Todas' },
  { value: '0KM', label: '0KM' },
  { value: 'Seminovo', label: 'Seminovo' },
];

export default function VeiculosLista() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  // Get filters from URL
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const condicao = searchParams.get('condicao') || '';
  const marca = searchParams.get('marca') || '';
  const orderBy = searchParams.get('orderBy') || 'created_at';
  const orderDir = (searchParams.get('orderDir') || 'desc') as 'asc' | 'desc';

  const { vehicles, loading, totalCount, totalPages, bulkUpdate, bulkDelete, deleteVehicle, updateVehicle } = 
    useAdminVehicles({ page, search, status, condicao, marca, orderBy, orderDir });

  const { marcas } = useMarcas();

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleSort = (column: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (orderBy === column) {
      newParams.set('orderDir', orderDir === 'asc' ? 'desc' : 'asc');
    } else {
      newParams.set('orderBy', column);
      newParams.set('orderDir', 'desc');
    }
    setSearchParams(newParams);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === vehicles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(vehicles.map(v => v.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action: 'ativar' | 'desativar' | 'excluir') => {
    if (action === 'ativar') {
      await bulkUpdate(selectedIds, { status: 'ativo', ativo: true });
    } else if (action === 'desativar') {
      await bulkUpdate(selectedIds, { status: 'rascunho', ativo: false });
    } else if (action === 'excluir') {
      setDeleteDialogOpen(true);
    }
    setSelectedIds([]);
  };

  const confirmDelete = async () => {
    if (vehicleToDelete) {
      await deleteVehicle(vehicleToDelete);
      setVehicleToDelete(null);
    } else if (selectedIds.length > 0) {
      await bulkDelete(selectedIds);
      setSelectedIds([]);
    }
    setDeleteDialogOpen(false);
  };

  const toggleDestaque = async (id: string, currentValue: boolean) => {
    await updateVehicle(id, { destaque: !currentValue });
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      ativo: { variant: 'default', label: 'Ativo' },
      rascunho: { variant: 'secondary', label: 'Rascunho' },
      vendido: { variant: 'outline', label: 'Vendido' },
      reservado: { variant: 'outline', label: 'Reservado' },
    };
    const config = variants[status] || { variant: 'secondary' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>Veículos | Admin Tomazin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-heading">Veículos</h1>
              <p className="text-muted-foreground">{totalCount} veículos cadastrados</p>
            </div>
            <Button asChild>
              <Link to="/admin/veiculos/novo">
                <Plus className="h-4 w-4 mr-2" />
                Novo Veículo
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar marca, modelo, versão..."
                value={search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={status} onValueChange={(v) => updateFilter('status', v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={condicao} onValueChange={(v) => updateFilter('condicao', v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Condição" />
              </SelectTrigger>
              <SelectContent>
                {condicaoOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={marca} onValueChange={(v) => updateFilter('marca', v)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {marcas.map(m => (
                  <SelectItem key={m.id} value={m.nome}>{m.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
              <span className="text-sm font-medium">{selectedIds.length} selecionado(s)</span>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('ativar')}>
                Ativar
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('desativar')}>
                Desativar
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction('excluir')}>
                Excluir
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
                Cancelar
              </Button>
            </div>
          )}

          {/* Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : vehicles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Car className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nenhum veículo encontrado</h3>
                <p className="text-muted-foreground">Tente ajustar os filtros ou adicione um novo veículo.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.length === vehicles.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-20">Foto</TableHead>
                    <TableHead>
                      <button 
                        onClick={() => handleSort('marca')}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        Marca/Modelo
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        onClick={() => handleSort('ano')}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        Ano
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        onClick={() => handleSort('preco')}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        Preço
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Destaque</TableHead>
                    <TableHead className="w-12">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(vehicle.id)}
                          onCheckedChange={() => toggleSelect(vehicle.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="w-16 h-12 rounded bg-secondary overflow-hidden">
                          {vehicle.imagem_principal ? (
                            <img 
                              src={vehicle.imagem_principal} 
                              alt={`${vehicle.marca} ${vehicle.modelo}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">{vehicle.marca} {vehicle.modelo}</span>
                          {vehicle.versao && (
                            <p className="text-sm text-muted-foreground">{vehicle.versao}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {vehicle.ano_fabricacao && vehicle.ano_fabricacao !== vehicle.ano 
                          ? `${vehicle.ano_fabricacao}/${vehicle.ano}`
                          : vehicle.ano
                        }
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">{formatPrice(vehicle.preco)}</span>
                          {vehicle.preco_promocional && (
                            <p className="text-sm text-primary">{formatPrice(vehicle.preco_promocional)}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => toggleDestaque(vehicle.id, vehicle.destaque)}
                          className={cn(
                            "p-1.5 rounded-full transition-colors",
                            vehicle.destaque 
                              ? "text-primary bg-primary/10 hover:bg-primary/20" 
                              : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                          )}
                        >
                          {vehicle.destaque ? (
                            <Star className="h-5 w-5 fill-current" />
                          ) : (
                            <StarOff className="h-5 w-5" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/veiculo/${vehicle.id}`} target="_blank">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver no site
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/veiculos/${vehicle.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/veiculos/novo?duplicar=${vehicle.id}`}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setVehicleToDelete(vehicle.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {((page - 1) * 20) + 1} a {Math.min(page * 20, totalCount)} de {totalCount} veículos
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 1}
                  onClick={() => updateFilter('page', String(page - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === totalPages}
                  onClick={() => updateFilter('page', String(page + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                {vehicleToDelete 
                  ? 'Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.'
                  : `Tem certeza que deseja excluir ${selectedIds.length} veículo(s)? Esta ação não pode ser desfeita.`
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    </>
  );
}
