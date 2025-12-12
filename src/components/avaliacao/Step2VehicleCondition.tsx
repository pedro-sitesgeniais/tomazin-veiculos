import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { VehicleCondition } from './types';
import { cn } from '@/lib/utils';

interface Step2Props {
  data: VehicleCondition;
  onChange: (data: VehicleCondition) => void;
  errors: Partial<Record<keyof VehicleCondition, string>>;
}

const ESTADOS = [
  { value: 'Excelente', label: 'Excelente', description: 'Sem avarias, pintura original, mecânica perfeita' },
  { value: 'Bom', label: 'Bom', description: 'Pequenos desgastes normais de uso' },
  { value: 'Regular', label: 'Regular', description: 'Alguns arranhões ou pequenos reparos necessários' },
  { value: 'Precisa reparos', label: 'Precisa Reparos', description: 'Necessita de manutenção significativa' },
] as const;

export function Step2VehicleCondition({ data, onChange, errors }: Step2Props) {
  const handleChange = (field: keyof VehicleCondition, value: boolean | string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Estado do Veículo</h2>
        <p className="text-muted-foreground">Informe as condições gerais do seu veículo</p>
      </div>

      {/* Boolean questions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border">
          <div>
            <Label className="text-foreground font-medium">Único dono?</Label>
            <p className="text-xs text-muted-foreground">Você é o primeiro proprietário</p>
          </div>
          <Switch
            checked={data.unicoDono}
            onCheckedChange={(checked) => handleChange('unicoDono', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border">
          <div>
            <Label className="text-foreground font-medium">Manual e chave reserva?</Label>
            <p className="text-xs text-muted-foreground">Possui documentação completa</p>
          </div>
          <Switch
            checked={data.manualChaveReserva}
            onCheckedChange={(checked) => handleChange('manualChaveReserva', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border">
          <div>
            <Label className="text-foreground font-medium">IPVA pago?</Label>
            <p className="text-xs text-muted-foreground">IPVA do ano atual quitado</p>
          </div>
          <Switch
            checked={data.ipvaPago}
            onCheckedChange={(checked) => handleChange('ipvaPago', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border">
          <div>
            <Label className="text-foreground font-medium">Possui multas?</Label>
            <p className="text-xs text-muted-foreground">Multas pendentes no veículo</p>
          </div>
          <Switch
            checked={data.possuiMultas}
            onCheckedChange={(checked) => handleChange('possuiMultas', checked)}
          />
        </div>
      </div>

      {/* Estado geral */}
      <div className="space-y-4">
        <Label className="text-foreground text-lg font-semibold">Estado Geral do Veículo *</Label>
        <RadioGroup
          value={data.estadoGeral}
          onValueChange={(v) => handleChange('estadoGeral', v)}
          className="grid md:grid-cols-2 gap-4"
        >
          {ESTADOS.map((estado) => (
            <div key={estado.value} className="flex items-start">
              <RadioGroupItem
                value={estado.value}
                id={`estado-${estado.value}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`estado-${estado.value}`}
                className={cn(
                  'flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all',
                  'border-border bg-secondary/30 hover:bg-secondary/50',
                  'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10'
                )}
              >
                <span className="font-semibold text-foreground">{estado.label}</span>
                <p className="text-xs text-muted-foreground mt-1">{estado.description}</p>
              </Label>
            </div>
          ))}
        </RadioGroup>
        {errors.estadoGeral && <p className="text-xs text-destructive">{errors.estadoGeral}</p>}
      </div>

      {/* Observações */}
      <div className="space-y-2">
        <Label className="text-foreground">Observações</Label>
        <Textarea
          value={data.observacoes}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          className="bg-secondary border-border text-foreground min-h-[120px]"
          placeholder="Descreva detalhes adicionais sobre o estado do veículo, acessórios instalados, histórico de manutenção, etc."
        />
      </div>
    </div>
  );
}
