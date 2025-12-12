import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VehicleCard } from './VehicleCard';

const vehicles = [
  {
    id: 1,
    name: 'Onix Plus Premier',
    brand: 'Chevrolet',
    year: 2024,
    km: 0,
    transmission: 'Automático',
    price: 115900,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
    badge: '0KM' as const,
  },
  {
    id: 2,
    name: 'Civic Touring',
    brand: 'Honda',
    year: 2023,
    km: 15000,
    transmission: 'Automático',
    price: 189900,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80',
    badge: 'Seminovo' as const,
  },
  {
    id: 3,
    name: 'Corolla Cross XRX',
    brand: 'Toyota',
    year: 2024,
    km: 0,
    transmission: 'Automático',
    price: 215900,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
    badge: '0KM' as const,
  },
  {
    id: 4,
    name: 'HB20 Platinum Plus',
    brand: 'Hyundai',
    year: 2023,
    km: 22000,
    transmission: 'Automático',
    price: 98900,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
    badge: 'Seminovo' as const,
  },
  {
    id: 5,
    name: 'Polo TSI Comfortline',
    brand: 'Volkswagen',
    year: 2023,
    km: 18000,
    transmission: 'Automático',
    price: 105900,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
    badge: 'Seminovo' as const,
  },
  {
    id: 6,
    name: 'T-Cross Highline',
    brand: 'Volkswagen',
    year: 2024,
    km: 0,
    transmission: 'Automático',
    price: 159900,
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
    badge: '0KM' as const,
  },
  {
    id: 7,
    name: 'Pulse Impetus',
    brand: 'Fiat',
    year: 2023,
    km: 12000,
    transmission: 'Automático',
    price: 112900,
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    badge: 'Seminovo' as const,
  },
  {
    id: 8,
    name: 'Tracker Premier',
    brand: 'Chevrolet',
    year: 2024,
    km: 0,
    transmission: 'Automático',
    price: 175900,
    image: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&q=80',
    badge: '0KM' as const,
  },
];

export function FeaturedVehicles() {
  return (
    <section id="estoque" className="py-20 bg-gradient-dark">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Nosso Estoque
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 font-heading">
              Veículos em <span className="text-gradient-gold">Destaque</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              Confira nossa seleção de veículos seminovos e 0km com as melhores condições
            </p>
          </div>
          <Button variant="outline" className="mt-6 md:mt-0">
            Ver Todos
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}
