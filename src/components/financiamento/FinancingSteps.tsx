import { FileSearch, Calculator, CheckCircle, Car } from 'lucide-react';

const steps = [
  {
    icon: Calculator,
    title: 'Simule Online',
    description: 'Use nosso simulador para calcular as parcelas ideais para seu orçamento.',
  },
  {
    icon: FileSearch,
    title: 'Análise de Crédito',
    description: 'Enviamos sua solicitação para nossos parceiros financeiros.',
  },
  {
    icon: CheckCircle,
    title: 'Aprovação Rápida',
    description: 'Receba a aprovação em até 24 horas úteis.',
  },
  {
    icon: Car,
    title: 'Retire seu Carro',
    description: 'Finalize a documentação e saia dirigindo seu novo veículo.',
  },
];

export function FinancingSteps() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
          Como Funciona o <span className="text-gradient-gold">Financiamento</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Processo simples e transparente para você realizar o sonho do carro próprio
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative bg-card border border-border rounded-xl p-6 text-center group hover:border-primary/50 transition-colors"
          >
            {/* Step number */}
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <step.icon className="h-8 w-8 text-primary" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
