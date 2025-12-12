import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OwnerData } from './types';
import { cn } from '@/lib/utils';

interface Step4Props {
  data: OwnerData;
  onChange: (data: OwnerData) => void;
  errors: Partial<Record<keyof OwnerData, string>>;
}

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO'
];

const HORARIOS = [
  'Manhã (8h-12h)',
  'Tarde (12h-18h)',
  'Noite (18h-21h)',
  'Qualquer horário',
];

const INTERESSES = [
  { value: 'Vender', label: 'Vender', description: 'Quero vender meu veículo' },
  { value: 'Trocar por outro', label: 'Trocar', description: 'Quero trocar por outro veículo' },
  { value: 'Apenas avaliação', label: 'Avaliar', description: 'Apenas saber o valor' },
] as const;

export function Step4OwnerData({ data, onChange, errors }: Step4Props) {
  const handleChange = (field: keyof OwnerData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Seus Dados</h2>
        <p className="text-muted-foreground">
          Informe seus dados para entrarmos em contato
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Nome */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-foreground">Nome Completo *</Label>
          <Input
            value={data.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            className="bg-secondary border-border text-foreground"
            placeholder="Seu nome completo"
          />
          {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
        </div>

        {/* CPF */}
        <div className="space-y-2">
          <Label className="text-foreground">CPF *</Label>
          <Input
            value={data.cpf}
            onChange={(e) => handleChange('cpf', formatCPF(e.target.value))}
            className="bg-secondary border-border text-foreground"
            placeholder="000.000.000-00"
            maxLength={14}
          />
          {errors.cpf && <p className="text-xs text-destructive">{errors.cpf}</p>}
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <Label className="text-foreground">Telefone/WhatsApp *</Label>
          <Input
            value={data.telefone}
            onChange={(e) => handleChange('telefone', formatPhone(e.target.value))}
            className="bg-secondary border-border text-foreground"
            placeholder="(00) 00000-0000"
            maxLength={15}
          />
          {errors.telefone && <p className="text-xs text-destructive">{errors.telefone}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label className="text-foreground">Email *</Label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="bg-secondary border-border text-foreground"
            placeholder="seu@email.com"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        {/* Cidade */}
        <div className="space-y-2">
          <Label className="text-foreground">Cidade *</Label>
          <Input
            value={data.cidade}
            onChange={(e) => handleChange('cidade', e.target.value)}
            className="bg-secondary border-border text-foreground"
            placeholder="Sua cidade"
          />
          {errors.cidade && <p className="text-xs text-destructive">{errors.cidade}</p>}
        </div>

        {/* UF */}
        <div className="space-y-2">
          <Label className="text-foreground">Estado *</Label>
          <Select value={data.uf} onValueChange={(v) => handleChange('uf', v)}>
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border max-h-60">
              {UFS.map((uf) => (
                <SelectItem key={uf} value={uf}>{uf}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.uf && <p className="text-xs text-destructive">{errors.uf}</p>}
        </div>

        {/* Melhor horário */}
        <div className="space-y-2">
          <Label className="text-foreground">Melhor horário para contato</Label>
          <Select value={data.melhorHorario} onValueChange={(v) => handleChange('melhorHorario', v)}>
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Selecione o horário" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {HORARIOS.map((horario) => (
                <SelectItem key={horario} value={horario}>{horario}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Interesse */}
      <div className="space-y-4">
        <Label className="text-foreground text-lg font-semibold">O que deseja fazer? *</Label>
        <RadioGroup
          value={data.interesse}
          onValueChange={(v) => handleChange('interesse', v)}
          className="grid md:grid-cols-3 gap-4"
        >
          {INTERESSES.map((interesse) => (
            <div key={interesse.value} className="flex items-start">
              <RadioGroupItem
                value={interesse.value}
                id={`interesse-${interesse.value}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`interesse-${interesse.value}`}
                className={cn(
                  'flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all text-center',
                  'border-border bg-secondary/30 hover:bg-secondary/50',
                  'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10'
                )}
              >
                <span className="font-semibold text-foreground block">{interesse.label}</span>
                <p className="text-xs text-muted-foreground mt-1">{interesse.description}</p>
              </Label>
            </div>
          ))}
        </RadioGroup>
        {errors.interesse && <p className="text-xs text-destructive">{errors.interesse}</p>}
      </div>

      {/* LGPD */}
      <div className="flex items-start space-x-3 p-4 bg-secondary/30 rounded-xl border border-border">
        <Checkbox
          id="aceiteLgpd"
          checked={data.aceiteLgpd}
          onCheckedChange={(checked) => handleChange('aceiteLgpd', checked as boolean)}
        />
        <Label htmlFor="aceiteLgpd" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
          Concordo com a <span className="text-primary underline">Política de Privacidade</span> e 
          autorizo o tratamento dos meus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD) 
          para fins de avaliação do veículo e contato comercial. *
        </Label>
      </div>
      {errors.aceiteLgpd && <p className="text-xs text-destructive">{errors.aceiteLgpd}</p>}
    </div>
  );
}
