const partners = [
  { name: 'Santander', color: '#EC0000' },
  { name: 'Bradesco', color: '#CC092F' },
  { name: 'BV', color: '#00529C' },
  { name: 'Itaú', color: '#EC7000' },
  { name: 'Banco Pan', color: '#0066B3' },
  { name: 'Caixa', color: '#0070BA' },
];

export function FinancingPartners() {
  return (
    <section className="py-12 border-t border-b border-border">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Parceiros Financeiros
        </h3>
        <p className="text-sm text-muted-foreground">
          Trabalhamos com os melhores bancos para oferecer as melhores condições
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="flex items-center justify-center w-24 h-12 bg-secondary/50 rounded-lg px-4 hover:bg-secondary transition-colors"
          >
            <span
              className="text-sm font-bold tracking-wide"
              style={{ color: partner.color }}
            >
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
