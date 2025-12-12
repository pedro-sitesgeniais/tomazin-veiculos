import { Award, ShieldCheck, CreditCard, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: '+58 Anos de Tradição',
    description: 'Desde 1966 atendendo Sumaré e região com excelência e confiança',
  },
  {
    icon: ShieldCheck,
    title: 'Veículos Revisados',
    description: 'Todos os veículos passam por inspeção técnica rigorosa antes da venda',
  },
  {
    icon: CreditCard,
    title: 'Financiamento Facilitado',
    description: 'Parcelamos em até 60x com entrada facilitada e aprovação rápida',
  },
  {
    icon: HeadphonesIcon,
    title: 'Pós-Venda Diferenciado',
    description: 'Suporte completo após a compra para garantir sua satisfação',
  },
];

export function WhyChooseUs() {
  return (
    <section id="quem-somos" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Nossos Diferenciais
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 font-heading">
            Por que escolher a <span className="text-gradient-gold">Tomazin</span>?
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group text-center p-8 rounded-2xl bg-secondary/50 border border-border hover:border-primary/50 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
