import { ArrowRight, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EvaluateVehicle() {
  return (
    <section id="avalie" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-card to-background" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Avaliação Gratuita
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-3 mb-6 font-heading">
              Quer vender ou trocar seu{' '}
              <span className="text-gradient-gold">veículo</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto lg:mx-0">
              Fazemos a avaliação do seu veículo de forma rápida e transparente. 
              Oferecemos as melhores condições para compra ou troca.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg">
                Avaliar Meu Veículo
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                Falar com Consultor
              </Button>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex-1 relative">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-gold rounded-3xl blur-2xl opacity-20 animate-pulse-gold" />
              <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border">
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-gold shadow-gold">
                  <Car className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-secondary rounded-full w-3/4 mx-auto" />
                  <div className="h-4 bg-secondary rounded-full w-1/2 mx-auto" />
                  <div className="h-4 bg-secondary rounded-full w-2/3 mx-auto" />
                </div>
                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-muted-foreground text-sm">Avaliação em</p>
                  <p className="text-3xl font-bold text-gradient-gold font-heading">
                    24 horas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
