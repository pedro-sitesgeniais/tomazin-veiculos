import { Calendar, Gauge, Settings, MessageCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/hooks/useVehicles';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface VehicleGridCardProps {
  vehicle: Vehicle;
}

export function VehicleGridCard({ vehicle }: VehicleGridCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

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

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no veículo ${vehicle.marca} ${vehicle.modelo} ${vehicle.versao || ''} - ${vehicle.ano}. Podemos conversar?`
  );
  const whatsappLink = `https://wa.me/5519999999999?text=${whatsappMessage}`;

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 shadow-card hover:shadow-hover hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-secondary animate-pulse" />
        )}
        <img
          src={vehicle.imagem_principal || '/placeholder.svg'}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {vehicle.condicao === '0KM' && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground">
              0KM
            </span>
          )}
          {vehicle.destaque && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/80 text-primary-foreground">
              Destaque
            </span>
          )}
          {vehicle.novo && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500 text-foreground">
              Novo
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-primary text-sm font-semibold mb-0.5">{vehicle.marca}</p>
        <h3 className="text-base font-bold text-foreground mb-1 font-heading line-clamp-1">
          {vehicle.modelo}
        </h3>
        {vehicle.versao && (
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{vehicle.versao}</p>
        )}

        {/* Specs */}
        <div className="flex items-center gap-3 text-muted-foreground text-xs mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{vehicle.ano}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" />
            <span>{formatKm(vehicle.km)} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="h-3.5 w-3.5" />
            <span>{vehicle.cambio}</span>
          </div>
        </div>

        {/* Price */}
        <p className="text-xl font-bold text-gradient-gold font-heading mb-3">
          {formatPrice(Number(vehicle.preco))}
        </p>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/veiculo/${vehicle.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              Detalhes
            </Link>
          </Button>
          <Button variant="whatsapp" size="sm" className="flex-1" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 mr-1" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
