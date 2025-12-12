import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/hooks/useVehicles';
import { VehicleGridCard } from '@/components/estoque/VehicleGridCard';
import { VehicleSkeleton } from '@/components/estoque/VehicleSkeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface SimilarVehiclesProps {
  currentVehicle: Vehicle;
}

export function SimilarVehicles({ currentVehicle }: SimilarVehiclesProps) {
  const priceRange = {
    min: Number(currentVehicle.preco) * 0.7,
    max: Number(currentVehicle.preco) * 1.3,
  };

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['similar-vehicles', currentVehicle.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .neq('id', currentVehicle.id)
        .or(`carroceria.eq.${currentVehicle.carroceria},and(preco.gte.${priceRange.min},preco.lte.${priceRange.max})`)
        .limit(8);

      if (error) throw error;
      return data as Vehicle[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-12">
        <h2 className="text-2xl font-bold text-foreground font-heading mb-6">
          Veículos <span className="text-gradient-gold">Similares</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <VehicleSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (!vehicles || vehicles.length === 0) return null;

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-foreground font-heading mb-6">
        Veículos <span className="text-gradient-gold">Similares</span>
      </h2>
      
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {vehicles.map((vehicle) => (
            <CarouselItem key={vehicle.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <VehicleGridCard vehicle={vehicle} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4" />
        <CarouselNext className="hidden md:flex -right-4" />
      </Carousel>
    </section>
  );
}
