import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    id: 1,
    title: 'Seu próximo carro está aqui',
    subtitle: '+58 anos de tradição em Sumaré',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1920&q=80',
  },
  {
    id: 2,
    title: 'Veículos 0KM e Seminovos',
    subtitle: 'As melhores condições do mercado',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80',
  },
  {
    id: 3,
    title: 'Financiamento Facilitado',
    subtitle: 'Entrada a partir de R$ 1.000',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&q=80',
  },
];

const brands = ['Todas', 'Chevrolet', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Toyota', 'Volkswagen'];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section id="inicio" className="relative h-screen min-h-[700px]">
      {/* Carousel */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-heading">
              <span className="text-gradient-gold">{slides[currentSlide].title}</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8">
              {slides[currentSlide].subtitle}
            </p>
            <div className="flex gap-4">
              <Button variant="hero" size="lg">
                Ver Estoque
              </Button>
              <Button variant="outline" size="lg">
                Fale Conosco
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-background/50 backdrop-blur-sm rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-background/50 backdrop-blur-sm rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-primary w-8' : 'bg-foreground/30 hover:bg-foreground/50'
            }`}
          />
        ))}
      </div>

      {/* Search Bar */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-card/95 backdrop-blur-md rounded-2xl p-6 shadow-card border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <select className="bg-secondary text-foreground rounded-lg px-4 py-3 border border-border focus:border-primary focus:outline-none transition-colors">
                <option value="">Marca</option>
                {brands.slice(1).map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              <select className="bg-secondary text-foreground rounded-lg px-4 py-3 border border-border focus:border-primary focus:outline-none transition-colors">
                <option value="">Modelo</option>
              </select>
              <select className="bg-secondary text-foreground rounded-lg px-4 py-3 border border-border focus:border-primary focus:outline-none transition-colors">
                <option value="">Ano (de)</option>
                {Array.from({ length: 10 }, (_, i) => 2024 - i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select className="bg-secondary text-foreground rounded-lg px-4 py-3 border border-border focus:border-primary focus:outline-none transition-colors">
                <option value="">Ano (até)</option>
                {Array.from({ length: 10 }, (_, i) => 2024 - i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select className="bg-secondary text-foreground rounded-lg px-4 py-3 border border-border focus:border-primary focus:outline-none transition-colors">
                <option value="">Preço (até)</option>
                <option value="50000">Até R$ 50.000</option>
                <option value="100000">Até R$ 100.000</option>
                <option value="150000">Até R$ 150.000</option>
                <option value="200000">Até R$ 200.000</option>
                <option value="300000">Até R$ 300.000</option>
              </select>
              <Button variant="hero" className="h-full">
                <Search className="h-5 w-5" />
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
