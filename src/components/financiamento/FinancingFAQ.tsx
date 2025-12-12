import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'Qual a taxa de juros do financiamento?',
    answer:
      'As taxas variam de acordo com o perfil do cliente, valor de entrada e prazo escolhido. Trabalhamos com taxas a partir de 1,49% ao mês, podendo variar conforme análise de crédito e condições do mercado.',
  },
  {
    question: 'Qual o prazo máximo para financiamento?',
    answer:
      'Oferecemos financiamentos em até 60 meses (5 anos), permitindo parcelas mais acessíveis. O prazo ideal depende do valor do veículo e da sua capacidade de pagamento.',
  },
  {
    question: 'Preciso dar entrada?',
    answer:
      'A entrada não é obrigatória, mas recomendamos um valor mínimo de 20% do veículo. Quanto maior a entrada, menores serão as parcelas e os juros pagos.',
  },
  {
    question: 'Como funciona a análise de crédito?',
    answer:
      'A análise é feita pelos nossos parceiros financeiros em até 24 horas úteis. Avaliamos renda, histórico de crédito e outros fatores para oferecer a melhor proposta.',
  },
  {
    question: 'Posso usar meu veículo como entrada?',
    answer:
      'Sim! Aceitamos seu veículo usado como parte do pagamento. Fazemos uma avaliação justa e transparente para definir o valor de troca.',
  },
  {
    question: 'Quais documentos são necessários?',
    answer:
      'Para análise de crédito, você precisará de: RG, CPF, comprovante de residência, comprovante de renda (holerite, declaração de IR ou extrato bancário) e CNH.',
  },
  {
    question: 'Consigo financiar com nome negativado?',
    answer:
      'Cada caso é analisado individualmente. Mesmo com restrições, podemos encontrar alternativas junto aos nossos parceiros. Entre em contato para uma análise personalizada.',
  },
  {
    question: 'Posso quitar o financiamento antecipadamente?',
    answer:
      'Sim, você pode quitar ou amortizar seu financiamento a qualquer momento, com desconto proporcional dos juros. É seu direito garantido por lei.',
  },
];

export function FinancingFAQ() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
          Dúvidas <span className="text-gradient-gold">Frequentes</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tire suas dúvidas sobre financiamento de veículos
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50"
            >
              <AccordionTrigger className="text-foreground hover:text-primary text-left py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
