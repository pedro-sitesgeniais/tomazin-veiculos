import { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { VehicleFilters as Filters } from '@/hooks/useVehicles';

interface FilterOptions {
  marcas: string[];
  modelos: string[];
  modelosPorMarca: Record<string, string[]>;
  cores: string[];
  anoMin: number;
  anoMax: number;
  precoMin: number;
  precoMax: number;
  kmMin: number;
  kmMax: number;
}

interface VehicleFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  options: FilterOptions | undefined;
  isLoading: boolean;
  totalResults: number;
}

const COMBUSTIVEIS = ['Flex', 'Gasolina', 'Diesel', 'Elétrico', 'Híbrido'];
const CAMBIOS = ['Manual', 'Automático', 'CVT', 'Automatizado'];
const CARROCERIAS = ['Sedan', 'Hatch', 'SUV', 'Picape', 'Conversível', 'Van'];
const PORTAS = [2, 4];
const FINAL_PLACAS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatKm(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value) + ' km';
}

function FilterContent({
  filters,
  onFiltersChange,
  options,
  onClearFilters,
}: {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  options: FilterOptions | undefined;
  onClearFilters: () => void;
}) {
  const [searchMarca, setSearchMarca] = useState('');
  
  const availableModelos = filters.marcas && filters.marcas.length > 0 && options
    ? filters.marcas.flatMap(marca => options.modelosPorMarca[marca] || [])
    : options?.modelos || [];

  const handleCheckboxChange = (
    key: keyof Filters,
    value: string | number,
    checked: boolean
  ) => {
    const currentValues = (filters[key] as (string | number)[]) || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    onFiltersChange({ ...filters, [key]: newValues.length > 0 ? newValues : undefined });
  };

  const filteredMarcas = options?.marcas.filter(marca =>
    marca.toLowerCase().includes(searchMarca.toLowerCase())
  ) || [];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <Label className="text-foreground font-semibold mb-2 block">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Marca ou modelo..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value || undefined })}
            className="pl-10 bg-secondary border-border"
          />
        </div>
      </div>

      <Separator />

      {/* Condition */}
      <div>
        <Label className="text-foreground font-semibold mb-2 block">Condição</Label>
        <div className="flex gap-2">
          {[null, '0KM', 'Seminovo'].map((cond) => (
            <Button
              key={cond || 'todos'}
              variant={filters.condicao === cond ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltersChange({ ...filters, condicao: cond as '0KM' | 'Seminovo' | null })}
              className="flex-1"
            >
              {cond || 'Todos'}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <Accordion type="multiple" defaultValue={['marca', 'preco']} className="w-full">
        {/* Brand */}
        <AccordionItem value="marca">
          <AccordionTrigger className="text-foreground font-semibold">
            Marca
          </AccordionTrigger>
          <AccordionContent>
            <Input
              placeholder="Buscar marca..."
              value={searchMarca}
              onChange={(e) => setSearchMarca(e.target.value)}
              className="mb-2 bg-secondary border-border"
            />
            <ScrollArea className="h-40">
              <div className="space-y-2">
                {filteredMarcas.map((marca) => (
                  <div key={marca} className="flex items-center space-x-2">
                    <Checkbox
                      id={`marca-${marca}`}
                      checked={filters.marcas?.includes(marca) || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange('marcas', marca, checked as boolean)
                      }
                    />
                    <Label htmlFor={`marca-${marca}`} className="text-sm cursor-pointer">
                      {marca}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        {/* Model */}
        {availableModelos.length > 0 && (
          <AccordionItem value="modelo">
            <AccordionTrigger className="text-foreground font-semibold">
              Modelo
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-40">
                <div className="space-y-2">
                  {availableModelos.map((modelo) => (
                    <div key={modelo} className="flex items-center space-x-2">
                      <Checkbox
                        id={`modelo-${modelo}`}
                        checked={filters.modelos?.includes(modelo) || false}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange('modelos', modelo, checked as boolean)
                        }
                      />
                      <Label htmlFor={`modelo-${modelo}`} className="text-sm cursor-pointer">
                        {modelo}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Year */}
        <AccordionItem value="ano">
          <AccordionTrigger className="text-foreground font-semibold">
            Ano
          </AccordionTrigger>
          <AccordionContent>
            {options && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{filters.anoMin || options.anoMin}</span>
                  <span>{filters.anoMax || options.anoMax}</span>
                </div>
                <Slider
                  min={options.anoMin}
                  max={options.anoMax}
                  step={1}
                  value={[filters.anoMin || options.anoMin, filters.anoMax || options.anoMax]}
                  onValueChange={([min, max]) =>
                    onFiltersChange({ ...filters, anoMin: min, anoMax: max })
                  }
                  className="[&_[role=slider]]:bg-primary"
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="preco">
          <AccordionTrigger className="text-foreground font-semibold">
            Preço
          </AccordionTrigger>
          <AccordionContent>
            {options && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatPrice(filters.precoMin || options.precoMin)}</span>
                  <span>{formatPrice(filters.precoMax || options.precoMax)}</span>
                </div>
                <Slider
                  min={options.precoMin}
                  max={options.precoMax}
                  step={5000}
                  value={[filters.precoMin || options.precoMin, filters.precoMax || options.precoMax]}
                  onValueChange={([min, max]) =>
                    onFiltersChange({ ...filters, precoMin: min, precoMax: max })
                  }
                  className="[&_[role=slider]]:bg-primary"
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* KM */}
        <AccordionItem value="km">
          <AccordionTrigger className="text-foreground font-semibold">
            Quilometragem
          </AccordionTrigger>
          <AccordionContent>
            {options && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatKm(filters.kmMin || options.kmMin)}</span>
                  <span>{formatKm(filters.kmMax || options.kmMax)}</span>
                </div>
                <Slider
                  min={options.kmMin}
                  max={options.kmMax}
                  step={1000}
                  value={[filters.kmMin ?? options.kmMin, filters.kmMax || options.kmMax]}
                  onValueChange={([min, max]) =>
                    onFiltersChange({ ...filters, kmMin: min, kmMax: max })
                  }
                  className="[&_[role=slider]]:bg-primary"
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Fuel */}
        <AccordionItem value="combustivel">
          <AccordionTrigger className="text-foreground font-semibold">
            Combustível
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {COMBUSTIVEIS.map((comb) => (
                <div key={comb} className="flex items-center space-x-2">
                  <Checkbox
                    id={`comb-${comb}`}
                    checked={filters.combustiveis?.includes(comb) || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('combustiveis', comb, checked as boolean)
                    }
                  />
                  <Label htmlFor={`comb-${comb}`} className="text-sm cursor-pointer">
                    {comb}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Transmission */}
        <AccordionItem value="cambio">
          <AccordionTrigger className="text-foreground font-semibold">
            Câmbio
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {CAMBIOS.map((cambio) => (
                <div key={cambio} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cambio-${cambio}`}
                    checked={filters.cambios?.includes(cambio) || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('cambios', cambio, checked as boolean)
                    }
                  />
                  <Label htmlFor={`cambio-${cambio}`} className="text-sm cursor-pointer">
                    {cambio}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color */}
        {options && options.cores.length > 0 && (
          <AccordionItem value="cor">
            <AccordionTrigger className="text-foreground font-semibold">
              Cor
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {options.cores.map((cor) => (
                    <div key={cor} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cor-${cor}`}
                        checked={filters.cores?.includes(cor) || false}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange('cores', cor, checked as boolean)
                        }
                      />
                      <Label htmlFor={`cor-${cor}`} className="text-sm cursor-pointer">
                        {cor}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Body Type */}
        <AccordionItem value="carroceria">
          <AccordionTrigger className="text-foreground font-semibold">
            Carroceria
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {CARROCERIAS.map((carr) => (
                <div key={carr} className="flex items-center space-x-2">
                  <Checkbox
                    id={`carr-${carr}`}
                    checked={filters.carrocerias?.includes(carr) || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange('carrocerias', carr, checked as boolean)
                    }
                  />
                  <Label htmlFor={`carr-${carr}`} className="text-sm cursor-pointer">
                    {carr}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Doors */}
        <AccordionItem value="portas">
          <AccordionTrigger className="text-foreground font-semibold">
            Portas
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex gap-2">
              {PORTAS.map((p) => (
                <Button
                  key={p}
                  variant={filters.portas?.includes(p) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const current = filters.portas || [];
                    const newValue = current.includes(p)
                      ? current.filter(v => v !== p)
                      : [...current, p];
                    onFiltersChange({ ...filters, portas: newValue.length > 0 ? newValue : undefined });
                  }}
                  className="flex-1"
                >
                  {p} portas
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* License Plate */}
        <AccordionItem value="placa">
          <AccordionTrigger className="text-foreground font-semibold">
            Final da Placa
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-5 gap-2">
              {FINAL_PLACAS.map((num) => (
                <Button
                  key={num}
                  variant={filters.finalPlaca?.includes(num) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const current = filters.finalPlaca || [];
                    const newValue = current.includes(num)
                      ? current.filter(v => v !== num)
                      : [...current, num];
                    onFiltersChange({ ...filters, finalPlaca: newValue.length > 0 ? newValue : undefined });
                  }}
                >
                  {num}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* Clear Filters */}
      <Button variant="outline" className="w-full" onClick={onClearFilters}>
        <X className="h-4 w-4 mr-2" />
        Limpar Filtros
      </Button>
    </div>
  );
}

export function VehicleFiltersComponent({
  filters,
  onFiltersChange,
  options,
  isLoading,
  totalResults,
}: VehicleFiltersProps) {
  const clearFilters = () => {
    onFiltersChange({ ordenacao: filters.ordenacao });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-24 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground font-heading">Filtros</h2>
            <span className="text-sm text-muted-foreground">
              {totalResults} veículo{totalResults !== 1 ? 's' : ''}
            </span>
          </div>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <FilterContent
              filters={filters}
              onFiltersChange={onFiltersChange}
              options={options}
              onClearFilters={clearFilters}
            />
          </ScrollArea>
        </div>
      </aside>

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg">
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-md bg-card">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <span>Filtros</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {totalResults} veículo{totalResults !== 1 ? 's' : ''}
                </span>
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-6rem)] mt-4">
              <FilterContent
                filters={filters}
                onFiltersChange={onFiltersChange}
                options={options}
                onClearFilters={clearFilters}
              />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
