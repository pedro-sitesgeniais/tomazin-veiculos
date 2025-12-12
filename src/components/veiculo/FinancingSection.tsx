import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface FinancingSectionProps {
  vehiclePrice: number;
  vehicleName: string;
}

const PARCELAS_OPTIONS = [24, 36, 48, 60];
const TAXA_MENSAL = 0.0189;

export function FinancingSection({ vehiclePrice, vehicleName }: FinancingSectionProps) {
  const [entrada, setEntrada] = useState(vehiclePrice * 0.2);
  const [parcelas, setParcelas] = useState(48);

  const valorFinanciado = vehiclePrice - entrada;
  const coeficiente = (TAXA_MENSAL * Math.pow(1 + TAXA_MENSAL, parcelas)) / (Math.pow(1 + TAXA_MENSAL, parcelas) - 1);
  const valorParcela = valorFinanciado * coeficiente;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <section className="py-12 bg-card rounded-2xl border border-border p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Calculator className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground font-heading">
            Simule seu <span className="text-gradient-gold">Financiamento</span>
          </h2>
          <p className="text-muted-foreground text-sm">Calcule as parcelas de forma rápida</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-end">
        {/* Entrada */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Valor de Entrada</Label>
            <span className="text-sm text-muted-foreground">
              {((entrada / vehiclePrice) * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[entrada]}
            min={0}
            max={vehiclePrice * 0.8}
            step={1000}
            onValueChange={([value]) => setEntrada(value)}
            className="[&_[role=slider]]:bg-primary"
          />
          <p className="text-lg font-semibold text-foreground">{formatPrice(entrada)}</p>
        </div>

        {/* Parcelas */}
        <div className="space-y-3">
          <Label>Parcelas</Label>
          <div className="flex gap-2">
            {PARCELAS_OPTIONS.map((p) => (
              <Button
                key={p}
                variant={parcelas === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setParcelas(p)}
                className="flex-1"
              >
                {p}x
              </Button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Parcela estimada</p>
          <p className="text-3xl font-bold text-gradient-gold">
            {parcelas}x {formatPrice(valorParcela)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            * Sujeito a análise de crédito
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button variant="whatsapp" size="lg" asChild>
          <a
            href={`https://wa.me/5519999999999?text=${encodeURIComponent(
              `Olá! Gostaria de financiar o ${vehicleName}.\n\nEntrada: ${formatPrice(entrada)}\nParcelas: ${parcelas}x ${formatPrice(valorParcela)}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar com Consultor
          </a>
        </Button>
      </div>
    </section>
  );
}
