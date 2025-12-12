import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, MessageCircle, Home, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/hooks/useVehicles';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { VehicleGallery } from '@/components/veiculo/VehicleGallery';
import { VehicleSpecs } from '@/components/veiculo/VehicleSpecs';
import { FinancingModal } from '@/components/veiculo/FinancingModal';
import { InterestForm } from '@/components/veiculo/InterestForm';
import { SimilarVehicles } from '@/components/veiculo/SimilarVehicles';
import { FinancingSection } from '@/components/veiculo/FinancingSection';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function VeiculoDetalhe() {
  const { id } = useParams<{ id: string }>();

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Veículo não encontrado');
      return data as Vehicle;
    },
    enabled: !!id,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const vehicleName = vehicle ? `${vehicle.marca} ${vehicle.modelo} ${vehicle.versao || ''}`.trim() : '';
  const vehicleImages = vehicle?.imagem_principal 
    ? [vehicle.imagem_principal, ...(vehicle.imagens || [])] 
    : ['/placeholder.svg'];

  const whatsappMessage = vehicle
    ? encodeURIComponent(`Olá! Tenho interesse no veículo ${vehicleName} - ${vehicle.ano}. Podemos conversar?`)
    : '';
  const whatsappLink = `https://wa.me/5519999999999?text=${whatsappMessage}`;

  // Schema.org structured data
  const structuredData = vehicle ? {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: vehicleName,
    brand: { '@type': 'Brand', name: vehicle.marca },
    model: vehicle.modelo,
    vehicleModelDate: vehicle.ano.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: vehicle.km,
      unitCode: 'KMT',
    },
    vehicleTransmission: vehicle.cambio,
    fuelType: vehicle.combustivel,
    color: vehicle.cor,
    image: vehicle.imagem_principal,
    offers: {
      '@type': 'Offer',
      price: vehicle.preco,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
    },
  } : null;

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-6 w-64 mb-8" />
            <div className="grid lg:grid-cols-2 gap-8">
              <Skeleton className="aspect-[4/3] rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !vehicle) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Veículo não encontrado</h1>
            <p className="text-muted-foreground mb-6">O veículo que você procura não existe ou foi removido.</p>
            <Button asChild>
              <Link to="/estoque">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Estoque
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <Header />

      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/estoque" className="hover:text-primary transition-colors">
              Estoque
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to={`/estoque?marcas=${vehicle.marca}`} className="hover:text-primary transition-colors">
              {vehicle.marca}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{vehicle.modelo}</span>
          </nav>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Gallery */}
            <VehicleGallery
              images={vehicleImages}
              alt={vehicleName}
            />

            {/* Info */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    vehicle.condicao === '0KM'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  {vehicle.condicao}
                </span>
                {vehicle.destaque && (
                  <span className="px-3 py-1 rounded-full text-sm font-bold bg-primary/80 text-primary-foreground">
                    Destaque
                  </span>
                )}
              </div>

              {/* Title */}
              <div>
                <p className="text-primary font-semibold">{vehicle.marca}</p>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground font-heading">
                  {vehicle.modelo}
                </h1>
                {vehicle.versao && (
                  <p className="text-lg text-muted-foreground mt-1">{vehicle.versao}</p>
                )}
              </div>

              {/* Price */}
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-4xl font-bold text-gradient-gold font-heading">
                  {formatPrice(Number(vehicle.preco))}
                </p>
                <p className="text-muted-foreground mt-1">
                  ou 48x de {formatPrice(Number(vehicle.preco) / 48 * 1.3)} *
                </p>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <Button variant="whatsapp" size="lg" className="w-full" asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Conversar no WhatsApp
                  </a>
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <FinancingModal
                    vehiclePrice={Number(vehicle.preco)}
                    vehicleName={vehicleName}
                  />
                  <InterestForm
                    vehicleName={vehicleName}
                    vehicleId={vehicle.id}
                  />
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-secondary rounded-lg p-3">
                  <span className="text-muted-foreground">Ano</span>
                  <p className="font-semibold">{vehicle.ano}</p>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <span className="text-muted-foreground">KM</span>
                  <p className="font-semibold">{new Intl.NumberFormat('pt-BR').format(vehicle.km)}</p>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <span className="text-muted-foreground">Câmbio</span>
                  <p className="font-semibold">{vehicle.cambio}</p>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <span className="text-muted-foreground">Combustível</span>
                  <p className="font-semibold">{vehicle.combustivel}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Specs Tabs */}
          <VehicleSpecs vehicle={vehicle} />

          {/* Financing Section */}
          <div className="mt-12">
            <FinancingSection
              vehiclePrice={Number(vehicle.preco)}
              vehicleName={vehicleName}
            />
          </div>

          {/* Similar Vehicles */}
          <SimilarVehicles currentVehicle={vehicle} />
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
