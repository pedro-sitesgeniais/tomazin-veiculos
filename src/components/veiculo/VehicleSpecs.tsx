import { Calendar, Gauge, Fuel, Settings, Palette, DoorOpen, CreditCard, Car, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Vehicle } from '@/hooks/useVehicles';

interface VehicleSpecsProps {
  vehicle: Vehicle;
}

const specIcons: Record<string, React.ElementType> = {
  ano: Calendar,
  km: Gauge,
  combustivel: Fuel,
  cambio: Settings,
  cor: Palette,
  portas: DoorOpen,
  placa: CreditCard,
  carroceria: Car,
};

export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const formatKm = (km: number) => new Intl.NumberFormat('pt-BR').format(km);

  const specs = [
    { label: 'Ano', value: vehicle.ano_fabricacao ? `${vehicle.ano_fabricacao}/${vehicle.ano}` : vehicle.ano.toString(), icon: 'ano' },
    { label: 'Quilometragem', value: `${formatKm(vehicle.km)} km`, icon: 'km' },
    { label: 'Combustível', value: vehicle.combustivel, icon: 'combustivel' },
    { label: 'Câmbio', value: vehicle.cambio, icon: 'cambio' },
    { label: 'Cor', value: vehicle.cor || 'Não informada', icon: 'cor' },
    { label: 'Portas', value: vehicle.portas?.toString() || '4', icon: 'portas' },
    { label: 'Final da Placa', value: vehicle.final_placa?.toString() || 'Não informado', icon: 'placa' },
    { label: 'Carroceria', value: vehicle.carroceria, icon: 'carroceria' },
  ];

  return (
    <Tabs defaultValue="ficha" className="w-full">
      <TabsList className="w-full justify-start bg-secondary/50 p-1 h-auto flex-wrap">
        <TabsTrigger value="ficha" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Ficha Técnica
        </TabsTrigger>
        <TabsTrigger value="opcionais" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Opcionais
        </TabsTrigger>
        {vehicle.descricao && (
          <TabsTrigger value="observacoes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Observações
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="ficha" className="mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {specs.map((spec) => {
            const Icon = specIcons[spec.icon];
            return (
              <div
                key={spec.label}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{spec.label}</span>
                </div>
                <p className="font-semibold text-foreground">{spec.value}</p>
              </div>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="opcionais" className="mt-6">
        {vehicle.opcionais && vehicle.opcionais.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {vehicle.opcionais.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-card border border-border rounded-lg p-3"
              >
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Nenhum opcional cadastrado para este veículo.
          </p>
        )}
      </TabsContent>

      {vehicle.descricao && (
        <TabsContent value="observacoes" className="mt-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-foreground whitespace-pre-line">{vehicle.descricao}</p>
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
