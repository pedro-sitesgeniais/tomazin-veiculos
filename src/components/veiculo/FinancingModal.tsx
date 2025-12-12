import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FinancingModalProps {
  vehiclePrice: number;
  vehicleName: string;
}

const PARCELAS_OPTIONS = [12, 24, 36, 48, 60, 72];
const TAXA_MENSAL = 0.0189; // 1.89% ao mês (exemplo)

export function FinancingModal({ vehiclePrice, vehicleName }: FinancingModalProps) {
  const [entrada, setEntrada] = useState(vehiclePrice * 0.2);
  const [parcelas, setParcelas] = useState(48);
  const [open, setOpen] = useState(false);

  const valorFinanciado = vehiclePrice - entrada;
  const coeficiente = (TAXA_MENSAL * Math.pow(1 + TAXA_MENSAL, parcelas)) / (Math.pow(1 + TAXA_MENSAL, parcelas) - 1);
  const valorParcela = valorFinanciado * coeficiente;
  const valorTotal = entrada + (valorParcela * parcelas);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleEntradaChange = (value: string) => {
    const numValue = parseFloat(value.replace(/\D/g, '')) / 100;
    if (!isNaN(numValue) && numValue >= 0 && numValue <= vehiclePrice) {
      setEntrada(numValue);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Calculator className="h-4 w-4" />
          Simular Financiamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading">Simulação de Financiamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Veículo</p>
            <p className="font-semibold text-foreground">{vehicleName}</p>
            <p className="text-xl font-bold text-gradient-gold mt-1">{formatPrice(vehiclePrice)}</p>
          </div>

          {/* Entrada */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Valor de Entrada</Label>
              <span className="text-sm text-muted-foreground">
                {((entrada / vehiclePrice) * 100).toFixed(0)}% do valor
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
            <Input
              value={formatPrice(entrada)}
              onChange={(e) => handleEntradaChange(e.target.value)}
              className="bg-secondary border-border text-right"
            />
          </div>

          {/* Parcelas */}
          <div className="space-y-3">
            <Label>Número de Parcelas</Label>
            <div className="grid grid-cols-3 gap-2">
              {PARCELAS_OPTIONS.map((p) => (
                <Button
                  key={p}
                  variant={parcelas === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setParcelas(p)}
                >
                  {p}x
                </Button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor financiado</span>
              <span className="font-semibold">{formatPrice(valorFinanciado)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxa mensal</span>
              <span className="font-semibold">{(TAXA_MENSAL * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-primary/20">
              <span className="text-foreground font-semibold">Parcela estimada</span>
              <span className="text-2xl font-bold text-gradient-gold">
                {parcelas}x {formatPrice(valorParcela)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Valor total: {formatPrice(valorTotal)} • Simulação sujeita a análise de crédito
            </p>
          </div>

          <Button className="w-full" variant="whatsapp" asChild>
            <a
              href={`https://wa.me/5519999999999?text=${encodeURIComponent(
                `Olá! Gostaria de simular o financiamento do ${vehicleName}.\n\nEntrada: ${formatPrice(entrada)}\nParcelas: ${parcelas}x ${formatPrice(valorParcela)}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar com Consultor
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
