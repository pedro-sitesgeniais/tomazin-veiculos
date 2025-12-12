import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VehicleData } from './types';

interface Step1Props {
  data: VehicleData;
  onChange: (data: VehicleData) => void;
  errors: Partial<Record<keyof VehicleData, string>>;
}

const MARCAS = [
  'Chevrolet', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Jeep', 'Nissan', 
  'Peugeot', 'Renault', 'Toyota', 'Volkswagen', 'Outras'
];

const MODELOS_POR_MARCA: Record<string, string[]> = {
  Chevrolet: ['Onix', 'Tracker', 'S10', 'Cruze', 'Spin', 'Montana', 'Equinox'],
  Fiat: ['Argo', 'Mobi', 'Strada', 'Toro', 'Pulse', 'Fastback', 'Cronos'],
  Ford: ['Ka', 'EcoSport', 'Ranger', 'Territory', 'Bronco', 'Maverick'],
  Honda: ['Civic', 'City', 'HR-V', 'CR-V', 'Fit', 'WR-V', 'Accord'],
  Hyundai: ['HB20', 'Creta', 'Tucson', 'Santa Fe', 'i30', 'Azera'],
  Jeep: ['Renegade', 'Compass', 'Commander', 'Wrangler', 'Grand Cherokee'],
  Nissan: ['Kicks', 'Versa', 'Sentra', 'Frontier', 'March', 'Leaf'],
  Peugeot: ['208', '2008', '3008', '5008', 'Partner', 'Boxer'],
  Renault: ['Kwid', 'Sandero', 'Duster', 'Captur', 'Oroch', 'Master'],
  Toyota: ['Corolla', 'Corolla Cross', 'Hilux', 'SW4', 'Yaris', 'RAV4'],
  Volkswagen: ['Polo', 'T-Cross', 'Nivus', 'Virtus', 'Taos', 'Amarok', 'Tiguan'],
  Outras: ['Outro modelo'],
};

const COMBUSTIVEIS = ['Flex', 'Gasolina', 'Diesel', 'Elétrico', 'Híbrido'];
const CAMBIOS = ['Manual', 'Automático', 'CVT', 'Automatizado'];
const CORES = ['Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul', 'Marrom', 'Bege', 'Verde', 'Outra'];

const currentYear = new Date().getFullYear();
const ANOS = Array.from({ length: 30 }, (_, i) => currentYear - i);

export function Step1VehicleData({ data, onChange, errors }: Step1Props) {
  const modelos = data.marca ? MODELOS_POR_MARCA[data.marca] || [] : [];

  const handleChange = (field: keyof VehicleData, value: string | number) => {
    if (field === 'marca') {
      onChange({ ...data, marca: value as string, modelo: '' });
    } else {
      onChange({ ...data, [field]: value } as VehicleData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Dados do Veículo</h2>
        <p className="text-muted-foreground">Informe os detalhes do seu veículo</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Marca */}
        <div className="space-y-2">
          <Label className="text-foreground">Marca *</Label>
          <Select value={data.marca} onValueChange={(v) => handleChange('marca', v)}>
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Selecione a marca" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {MARCAS.map((marca) => (
                <SelectItem key={marca} value={marca}>{marca}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.marca && <p className="text-xs text-destructive">{errors.marca}</p>}
        </div>

        {/* Modelo */}
        <div className="space-y-2">
          <Label className="text-foreground">Modelo *</Label>
          <Select 
            value={data.modelo} 
            onValueChange={(v) => handleChange('modelo', v)}
            disabled={!data.marca}
          >
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Selecione o modelo" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {modelos.map((modelo) => (
                <SelectItem key={modelo} value={modelo}>{modelo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.modelo && <p className="text-xs text-destructive">{errors.modelo}</p>}
        </div>

        {/* Ano/Modelo */}
        <div className="space-y-2">
          <Label className="text-foreground">Ano/Modelo *</Label>
          <Select 
            value={data.anoModelo.toString()} 
            onValueChange={(v) => handleChange('anoModelo', parseInt(v))}
          >
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border max-h-60">
              {ANOS.map((ano) => (
                <SelectItem key={ano} value={ano.toString()}>{ano}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.anoModelo && <p className="text-xs text-destructive">{errors.anoModelo}</p>}
        </div>

        {/* Versão */}
        <div className="space-y-2">
          <Label className="text-foreground">Versão</Label>
          <Input
            value={data.versao}
            onChange={(e) => handleChange('versao', e.target.value)}
            className="bg-secondary border-border text-foreground"
            placeholder="Ex: LTZ 1.4 Turbo"
          />
        </div>

        {/* Combustível */}
        <div className="space-y-2">
          <Label className="text-foreground">Combustível *</Label>
          <Select value={data.combustivel} onValueChange={(v) => handleChange('combustivel', v)}>
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Selecione o combustível" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {COMBUSTIVEIS.map((comb) => (
                <SelectItem key={comb} value={comb}>{comb}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.combustivel && <p className="text-xs text-destructive">{errors.combustivel}</p>}
        </div>

        {/* Câmbio */}
        <div className="space-y-2">
          <Label className="text-foreground">Câmbio *</Label>
          <Select value={data.cambio} onValueChange={(v) => handleChange('cambio', v)}>
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Selecione o câmbio" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {CAMBIOS.map((cambio) => (
                <SelectItem key={cambio} value={cambio}>{cambio}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.cambio && <p className="text-xs text-destructive">{errors.cambio}</p>}
        </div>

        {/* Cor */}
        <div className="space-y-2">
          <Label className="text-foreground">Cor *</Label>
          <Select value={data.cor} onValueChange={(v) => handleChange('cor', v)}>
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Selecione a cor" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {CORES.map((cor) => (
                <SelectItem key={cor} value={cor}>{cor}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.cor && <p className="text-xs text-destructive">{errors.cor}</p>}
        </div>

        {/* Quilometragem */}
        <div className="space-y-2">
          <Label className="text-foreground">Quilometragem *</Label>
          <Input
            type="number"
            value={data.quilometragem || ''}
            onChange={(e) => handleChange('quilometragem', parseInt(e.target.value) || 0)}
            className="bg-secondary border-border text-foreground"
            placeholder="Ex: 45000"
          />
          {errors.quilometragem && <p className="text-xs text-destructive">{errors.quilometragem}</p>}
        </div>
      </div>
    </div>
  );
}
