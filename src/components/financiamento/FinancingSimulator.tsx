import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SimulationResult {
  valorFinanciado: number;
  valorParcela: number;
  totalPagar: number;
  custoFinanciamento: number;
}

interface FinancingSimulatorProps {
  onSimulationChange: (values: {
    valorVeiculo: number;
    valorEntrada: number;
    prazo: number;
    taxaJuros: number;
    result: SimulationResult;
  }) => void;
}

const PRAZO_OPTIONS = [12, 24, 36, 48, 60];

export function FinancingSimulator({ onSimulationChange }: FinancingSimulatorProps) {
  const [valorVeiculo, setValorVeiculo] = useState(100000);
  const [valorEntrada, setValorEntrada] = useState(20000);
  const [prazo, setPrazo] = useState(48);
  const [taxaJuros, setTaxaJuros] = useState(1.99);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const parseCurrencyInput = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return Number(numbers) / 100;
  };

  const calculateSimulation = (): SimulationResult => {
    const valorFinanciado = valorVeiculo - valorEntrada;
    const taxaMensal = taxaJuros / 100;
    
    // Price formula for fixed installments
    const coeficiente = (taxaMensal * Math.pow(1 + taxaMensal, prazo)) / 
                        (Math.pow(1 + taxaMensal, prazo) - 1);
    const valorParcela = valorFinanciado * coeficiente;
    const totalPagar = valorParcela * prazo + valorEntrada;
    const custoFinanciamento = totalPagar - valorVeiculo;

    return {
      valorFinanciado,
      valorParcela,
      totalPagar,
      custoFinanciamento,
    };
  };

  const result = calculateSimulation();

  useEffect(() => {
    onSimulationChange({
      valorVeiculo,
      valorEntrada,
      prazo,
      taxaJuros,
      result,
    });
  }, [valorVeiculo, valorEntrada, prazo, taxaJuros]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Calculator className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground font-heading">
            Simulador de Financiamento
          </h2>
          <p className="text-sm text-muted-foreground">
            Ajuste os valores e veja o resultado em tempo real
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Valor do Veículo */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-foreground">Valor do Veículo</Label>
              <span className="text-lg font-semibold text-primary">
                {formatCurrency(valorVeiculo)}
              </span>
            </div>
            <Slider
              value={[valorVeiculo]}
              min={30000}
              max={500000}
              step={1000}
              onValueChange={([value]) => {
                setValorVeiculo(value);
                if (valorEntrada > value * 0.8) {
                  setValorEntrada(value * 0.2);
                }
              }}
              className="[&_[role=slider]]:bg-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>R$ 30.000</span>
              <span>R$ 500.000</span>
            </div>
          </div>

          {/* Valor da Entrada */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-foreground">Valor da Entrada</Label>
              <span className="text-lg font-semibold text-primary">
                {formatCurrency(valorEntrada)} ({((valorEntrada / valorVeiculo) * 100).toFixed(0)}%)
              </span>
            </div>
            <Slider
              value={[valorEntrada]}
              min={0}
              max={valorVeiculo * 0.8}
              step={1000}
              onValueChange={([value]) => setValorEntrada(value)}
              className="[&_[role=slider]]:bg-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>R$ 0</span>
              <span>{formatCurrency(valorVeiculo * 0.8)}</span>
            </div>
          </div>

          {/* Taxa de Juros */}
          <div className="space-y-3">
            <Label className="text-foreground">Taxa de Juros (% a.m.)</Label>
            <Input
              type="number"
              step="0.01"
              min="0.5"
              max="5"
              value={taxaJuros}
              onChange={(e) => setTaxaJuros(parseFloat(e.target.value) || 1.99)}
              className="bg-secondary border-border text-foreground"
            />
          </div>

          {/* Prazo */}
          <div className="space-y-3">
            <Label className="text-foreground">Prazo (meses)</Label>
            <RadioGroup
              value={prazo.toString()}
              onValueChange={(value) => setPrazo(parseInt(value))}
              className="flex flex-wrap gap-2"
            >
              {PRAZO_OPTIONS.map((p) => (
                <div key={p} className="flex items-center">
                  <RadioGroupItem
                    value={p.toString()}
                    id={`prazo-${p}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`prazo-${p}`}
                    className="px-4 py-2 rounded-lg border border-border bg-secondary cursor-pointer transition-all peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary hover:bg-muted"
                  >
                    {p}x
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="bg-secondary/50 border border-border rounded-xl p-6 flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-foreground mb-6 text-center">
            Resultado da Simulação
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">Valor Financiado</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(result.valorFinanciado)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">Valor da Parcela</span>
              <span className="text-2xl font-bold text-gradient-gold">
                {prazo}x {formatCurrency(result.valorParcela)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">Total a Pagar</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(result.totalPagar)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-muted-foreground">Custo do Financiamento</span>
              <span className="font-semibold text-destructive">
                + {formatCurrency(result.custoFinanciamento)}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            * Valores sujeitos a análise de crédito. Esta é apenas uma simulação.
          </p>
        </div>
      </div>
    </div>
  );
}
