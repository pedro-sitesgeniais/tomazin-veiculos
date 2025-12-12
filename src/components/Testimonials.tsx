import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Roberto Silva',
    role: 'Cliente desde 2019',
    content:
      'Comprei meu primeiro carro na Tomazin e foi uma experiência incrível. Atendimento excelente, equipe muito atenciosa e preços justos. Recomendo para todos!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Maria Fernanda Costa',
    role: 'Cliente desde 2021',
    content:
      'Já é a terceira vez que faço negócio com a Tomazin. A confiança que tenho neles é total. Veículos sempre em perfeito estado e pós-venda de qualidade.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Carlos Eduardo Santos',
    role: 'Cliente desde 2023',
    content:
      'Financiamento aprovado rapidamente e condições excelentes. O vendedor foi super atencioso e me ajudou a encontrar o carro perfeito para minha família.',
    rating: 5,
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 bg-gradient-dark">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 font-heading">
            O que nossos <span className="text-gradient-gold">clientes</span> dizem
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-card rounded-3xl p-8 md:p-12 text-center border border-border shadow-card">
                    {/* Quote Icon */}
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold">
                      <Quote className="h-8 w-8 text-primary-foreground" />
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center gap-1 mb-6">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-8">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div>
                      <p className="font-bold text-foreground font-heading text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 bg-card border border-border rounded-full text-foreground hover:border-primary hover:text-primary transition-all duration-300"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 bg-card border border-border rounded-full text-foreground hover:border-primary hover:text-primary transition-all duration-300"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === current ? 'bg-primary w-8' : 'bg-muted hover:bg-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
