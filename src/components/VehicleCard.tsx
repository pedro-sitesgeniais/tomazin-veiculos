import { Calendar, Gauge, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Vehicle {
  id: number;
  name: string;
  brand: string;
  year: number;
  km: number;
  transmission: string;
  price: number;
  image: string;
  badge?: '0KM' | 'Seminovo';
}

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatKm = (km: number) => {
    return new Intl.NumberFormat('pt-BR').format(km);
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 shadow-card hover:shadow-hover hover:-translate-y-2">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badge */}
        {vehicle.badge && (
          <span
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
              vehicle.badge === '0KM'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground'
            }`}
          >
            {vehicle.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-primary text-sm font-semibold mb-1">{vehicle.brand}</p>
        <h3 className="text-lg font-bold text-foreground mb-3 font-heading line-clamp-1">
          {vehicle.name}
        </h3>

        {/* Specs */}
        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-4 w-4" />
            <span>{formatKm(vehicle.km)} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>{vehicle.transmission}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-gradient-gold font-heading">
            {formatPrice(vehicle.price)}
          </p>
        </div>

        {/* Button */}
        <Button variant="outline" className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Ver Detalhes
        </Button>
      </div>
    </div>
  );
}
