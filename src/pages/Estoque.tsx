import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { VehicleFiltersComponent } from '@/components/estoque/VehicleFilters';
import { VehicleGridCard } from '@/components/estoque/VehicleGridCard';
import { VehicleSkeleton } from '@/components/estoque/VehicleSkeleton';
import { SortDropdown } from '@/components/estoque/SortDropdown';
import { useVehicles, useVehicleOptions, VehicleFilters } from '@/hooks/useVehicles';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Car } from 'lucide-react';

export default function Estoque() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  
  // Parse filters from URL
  const getFiltersFromParams = (): VehicleFilters => {
    const filters: VehicleFilters = {};
    
    const search = searchParams.get('busca');
    if (search) filters.search = search;
    
    const condicao = searchParams.get('condicao');
    if (condicao === '0KM' || condicao === 'Seminovo') filters.condicao = condicao;
    
    const marcas = searchParams.get('marcas');
    if (marcas) filters.marcas = marcas.split(',');
    
    const modelos = searchParams.get('modelos');
    if (modelos) filters.modelos = modelos.split(',');
    
    const anoMin = searchParams.get('anoMin');
    if (anoMin) filters.anoMin = parseInt(anoMin);
    
    const anoMax = searchParams.get('anoMax');
    if (anoMax) filters.anoMax = parseInt(anoMax);
    
    const precoMin = searchParams.get('precoMin');
    if (precoMin) filters.precoMin = parseInt(precoMin);
    
    const precoMax = searchParams.get('precoMax');
    if (precoMax) filters.precoMax = parseInt(precoMax);
    
    const kmMin = searchParams.get('kmMin');
    if (kmMin) filters.kmMin = parseInt(kmMin);
    
    const kmMax = searchParams.get('kmMax');
    if (kmMax) filters.kmMax = parseInt(kmMax);
    
    const combustiveis = searchParams.get('combustiveis');
    if (combustiveis) filters.combustiveis = combustiveis.split(',');
    
    const cambios = searchParams.get('cambios');
    if (cambios) filters.cambios = cambios.split(',');
    
    const cores = searchParams.get('cores');
    if (cores) filters.cores = cores.split(',');
    
    const carrocerias = searchParams.get('carrocerias');
    if (carrocerias) filters.carrocerias = carrocerias.split(',');
    
    const portas = searchParams.get('portas');
    if (portas) filters.portas = portas.split(',').map(Number);
    
    const finalPlaca = searchParams.get('finalPlaca');
    if (finalPlaca) filters.finalPlaca = finalPlaca.split(',').map(Number);
    
    const ordenacao = searchParams.get('ordenacao') as VehicleFilters['ordenacao'];
    if (ordenacao) filters.ordenacao = ordenacao;
    
    return filters;
  };
  
  const [filters, setFilters] = useState<VehicleFilters>(getFiltersFromParams);
  
  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('busca', filters.search);
    if (filters.condicao) params.set('condicao', filters.condicao);
    if (filters.marcas?.length) params.set('marcas', filters.marcas.join(','));
    if (filters.modelos?.length) params.set('modelos', filters.modelos.join(','));
    if (filters.anoMin) params.set('anoMin', filters.anoMin.toString());
    if (filters.anoMax) params.set('anoMax', filters.anoMax.toString());
    if (filters.precoMin) params.set('precoMin', filters.precoMin.toString());
    if (filters.precoMax) params.set('precoMax', filters.precoMax.toString());
    if (filters.kmMin !== undefined && filters.kmMin > 0) params.set('kmMin', filters.kmMin.toString());
    if (filters.kmMax) params.set('kmMax', filters.kmMax.toString());
    if (filters.combustiveis?.length) params.set('combustiveis', filters.combustiveis.join(','));
    if (filters.cambios?.length) params.set('cambios', filters.cambios.join(','));
    if (filters.cores?.length) params.set('cores', filters.cores.join(','));
    if (filters.carrocerias?.length) params.set('carrocerias', filters.carrocerias.join(','));
    if (filters.portas?.length) params.set('portas', filters.portas.join(','));
    if (filters.finalPlaca?.length) params.set('finalPlaca', filters.finalPlaca.join(','));
    if (filters.ordenacao && filters.ordenacao !== 'recentes') params.set('ordenacao', filters.ordenacao);
    
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const { data: vehicleData, isLoading, error } = useVehicles(filters, page);
  const { data: options, isLoading: optionsLoading } = useVehicleOptions();

  const handleFiltersChange = (newFilters: VehicleFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleOrdenacaoChange = (ordenacao: VehicleFilters['ordenacao']) => {
    setFilters({ ...filters, ordenacao });
    setPage(1);
  };

  return (
    <>

      <Header />
      
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground font-heading mb-2">
              Nosso <span className="text-gradient-gold">Estoque</span>
            </h1>
            <p className="text-muted-foreground">
              Encontre o veículo ideal para você
            </p>
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <VehicleFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              options={options}
              isLoading={optionsLoading}
              totalResults={vehicleData?.total || 0}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <p className="text-muted-foreground">
                  <span className="text-foreground font-semibold">{vehicleData?.total || 0}</span> veículo{(vehicleData?.total || 0) !== 1 ? 's' : ''} encontrado{(vehicleData?.total || 0) !== 1 ? 's' : ''}
                </p>
                <SortDropdown
                  ordenacao={filters.ordenacao}
                  onOrdenacaoChange={handleOrdenacaoChange}
                />
              </div>

              {/* Vehicle Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <VehicleSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="text-destructive">Erro ao carregar veículos. Tente novamente.</p>
                </div>
              ) : vehicleData?.vehicles.length === 0 ? (
                <div className="text-center py-16">
                  <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum veículo encontrado</h3>
                  <p className="text-muted-foreground mb-4">Tente ajustar os filtros para ver mais resultados</p>
                  <Button variant="outline" onClick={() => handleFiltersChange({ ordenacao: filters.ordenacao })}>
                    Limpar Filtros
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {vehicleData?.vehicles.map((vehicle) => (
                      <VehicleGridCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {vehicleData && vehicleData.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, vehicleData.totalPages) }, (_, i) => {
                          let pageNum: number;
                          if (vehicleData.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= vehicleData.totalPages - 2) {
                            pageNum = vehicleData.totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? 'default' : 'outline'}
                              size="icon"
                              onClick={() => setPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(p => Math.min(vehicleData.totalPages, p + 1))}
                        disabled={page === vehicleData.totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
