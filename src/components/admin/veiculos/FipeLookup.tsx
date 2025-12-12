import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Car, 
  Bike, 
  Truck, 
  Search, 
  DollarSign,
  Loader2,
  Check
} from 'lucide-react';
import { 
  useFipeMarcas, 
  useFipeModelos, 
  useFipeAnos, 
  useFipeValor,
  TipoVeiculo,
  FipeMarca,
  FipeModelo,
  FipeAno,
  FipeValor,
  parseFipeValue
} from '@/hooks/useFipe';
import { toast } from '@/hooks/use-toast';

interface FipeLookupProps {
  onSelect?: (data: {
    marca: string;
    modelo: string;
    ano: number;
    valorFipe: number;
    codigoFipe: string;
    combustivel: string;
  }) => void;
  onValueSelect?: (valor: number, codigoFipe: string) => void;
}

export function FipeLookup({ onSelect, onValueSelect }: FipeLookupProps) {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<TipoVeiculo>('carros');
  const [marcaId, setMarcaId] = useState<string | null>(null);
  const [modeloId, setModeloId] = useState<string | null>(null);
  const [anoId, setAnoId] = useState<string | null>(null);
  const [resultado, setResultado] = useState<FipeValor | null>(null);

  const { data: marcas = [], isLoading: loadingMarcas } = useFipeMarcas(tipo, open);
  const { data: modelos = [], isLoading: loadingModelos } = useFipeModelos(tipo, marcaId, open);
  const { data: anos = [], isLoading: loadingAnos } = useFipeAnos(tipo, marcaId, modeloId, open);
  const fipeValor = useFipeValor();

  const resetForm = () => {
    setMarcaId(null);
    setModeloId(null);
    setAnoId(null);
    setResultado(null);
  };

  const handleTipoChange = (newTipo: TipoVeiculo) => {
    setTipo(newTipo);
    resetForm();
  };

  const handleConsultar = async () => {
    if (!marcaId || !modeloId || !anoId) return;

    const data = await fipeValor.mutateAsync({
      tipo,
      marcaId,
      modeloId,
      anoId
    });

    setResultado(data);
  };

  const handleUseData = () => {
    if (!resultado) return;

    const valorNumerico = parseFipeValue(resultado.valor);

    if (onSelect) {
      onSelect({
        marca: resultado.marca,
        modelo: resultado.modelo,
        ano: resultado.anoModelo,
        valorFipe: valorNumerico,
        codigoFipe: resultado.codigoFipe,
        combustivel: resultado.combustivel
      });
    }

    if (onValueSelect) {
      onValueSelect(valorNumerico, resultado.codigoFipe);
    }

    toast({ title: 'Dados FIPE aplicados com sucesso' });
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          <Search className="h-4 w-4 mr-2" />
          Buscar na FIPE
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Consulta Tabela FIPE
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tipo */}
          <Tabs value={tipo} onValueChange={(v) => handleTipoChange(v as TipoVeiculo)}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="carros" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Carros
              </TabsTrigger>
              <TabsTrigger value="motos" className="flex items-center gap-2">
                <Bike className="h-4 w-4" />
                Motos
              </TabsTrigger>
              <TabsTrigger value="caminhoes" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Caminhões
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Marca */}
          <div className="space-y-2">
            <Label>Marca</Label>
            <Select 
              value={marcaId || ''} 
              onValueChange={(v) => { setMarcaId(v); setModeloId(null); setAnoId(null); setResultado(null); }}
              disabled={loadingMarcas}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingMarcas ? 'Carregando...' : 'Selecione a marca'} />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  {(marcas as FipeMarca[]).map((marca) => (
                    <SelectItem key={marca.codigo} value={marca.codigo}>
                      {marca.nome}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* Modelo */}
          <div className="space-y-2">
            <Label>Modelo</Label>
            <Select 
              value={modeloId || ''} 
              onValueChange={(v) => { setModeloId(v); setAnoId(null); setResultado(null); }}
              disabled={!marcaId || loadingModelos}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingModelos ? 'Carregando...' : 'Selecione o modelo'} />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  {(modelos as FipeModelo[]).map((modelo) => (
                    <SelectItem key={modelo.codigo} value={String(modelo.codigo)}>
                      {modelo.nome}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* Ano */}
          <div className="space-y-2">
            <Label>Ano</Label>
            <Select 
              value={anoId || ''} 
              onValueChange={(v) => { setAnoId(v); setResultado(null); }}
              disabled={!modeloId || loadingAnos}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingAnos ? 'Carregando...' : 'Selecione o ano'} />
              </SelectTrigger>
              <SelectContent>
                {(anos as FipeAno[]).map((ano) => (
                  <SelectItem key={ano.codigo} value={ano.codigo}>
                    {ano.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Consultar Button */}
          {!resultado && (
            <Button 
              onClick={handleConsultar} 
              disabled={!anoId || fipeValor.isPending}
              className="w-full"
            >
              {fipeValor.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Consultando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Consultar
                </>
              )}
            </Button>
          )}

          {/* Resultado */}
          {resultado && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Valor FIPE</p>
                <p className="text-3xl font-bold text-primary">{resultado.valor}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {resultado.marca} {resultado.modelo} {resultado.anoModelo}
                </p>
                <p className="text-xs text-muted-foreground">
                  Código: {resultado.codigoFipe} | Ref: {resultado.mesReferencia}
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setResultado(null)}
                >
                  Nova Consulta
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleUseData}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Usar estes dados
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
