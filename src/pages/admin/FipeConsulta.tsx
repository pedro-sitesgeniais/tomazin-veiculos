import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Car, 
  Bike, 
  Truck, 
  Search, 
  DollarSign, 
  Calendar, 
  Fuel, 
  Hash,
  Clock,
  Database,
  Trash2,
  Loader2
} from 'lucide-react';
import { 
  useFipeMarcas, 
  useFipeModelos, 
  useFipeAnos, 
  useFipeValor,
  useFipeCache,
  TipoVeiculo,
  FipeMarca,
  FipeModelo,
  FipeAno,
  FipeValor
} from '@/hooks/useFipe';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function FipeConsulta() {
  const [tipo, setTipo] = useState<TipoVeiculo>('carros');
  const [marcaId, setMarcaId] = useState<string | null>(null);
  const [modeloId, setModeloId] = useState<string | null>(null);
  const [anoId, setAnoId] = useState<string | null>(null);
  const [resultado, setResultado] = useState<FipeValor | null>(null);

  const { data: marcas = [], isLoading: loadingMarcas } = useFipeMarcas(tipo);
  const { data: modelos = [], isLoading: loadingModelos } = useFipeModelos(tipo, marcaId);
  const { data: anos = [], isLoading: loadingAnos } = useFipeAnos(tipo, marcaId, modeloId);
  const fipeValor = useFipeValor();
  const { cache, isLoading: loadingCache, clearCache } = useFipeCache();

  const handleTipoChange = (newTipo: TipoVeiculo) => {
    setTipo(newTipo);
    setMarcaId(null);
    setModeloId(null);
    setAnoId(null);
    setResultado(null);
  };

  const handleMarcaChange = (value: string) => {
    setMarcaId(value);
    setModeloId(null);
    setAnoId(null);
    setResultado(null);
  };

  const handleModeloChange = (value: string) => {
    setModeloId(value);
    setAnoId(null);
    setResultado(null);
  };

  const handleAnoChange = (value: string) => {
    setAnoId(value);
    setResultado(null);
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

  const getTipoIcon = (t: TipoVeiculo) => {
    switch (t) {
      case 'carros': return <Car className="h-4 w-4" />;
      case 'motos': return <Bike className="h-4 w-4" />;
      case 'caminhoes': return <Truck className="h-4 w-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Tabela FIPE
          </h1>
          <p className="text-muted-foreground">Consulte valores de referência da tabela FIPE</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Consulta Manual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Consulta Manual
              </CardTitle>
              <CardDescription>Busque o valor FIPE de qualquer veículo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tipo de Veículo */}
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
                <Select value={marcaId || ''} onValueChange={handleMarcaChange} disabled={loadingMarcas}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingMarcas ? 'Carregando...' : 'Selecione a marca'} />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[300px]">
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
                  onValueChange={handleModeloChange} 
                  disabled={!marcaId || loadingModelos}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingModelos ? 'Carregando...' : 'Selecione o modelo'} />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[300px]">
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
                  onValueChange={handleAnoChange} 
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
            </CardContent>
          </Card>

          {/* Resultado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Resultado
              </CardTitle>
              <CardDescription>Valor de referência da tabela FIPE</CardDescription>
            </CardHeader>
            <CardContent>
              {resultado ? (
                <div className="space-y-4">
                  <div className="text-center p-6 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Valor FIPE</p>
                    <p className="text-4xl font-bold text-primary">{resultado.valor}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Código FIPE</p>
                        <p className="font-medium">{resultado.codigoFipe}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Mês Referência</p>
                        <p className="font-medium">{resultado.mesReferencia}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Combustível</p>
                        <p className="font-medium">{resultado.combustivel}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Veículo</p>
                        <p className="font-medium">{resultado.marca} {resultado.modelo}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setResultado(null)}>
                      Nova Consulta
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mb-4 opacity-50" />
                  <p>Faça uma consulta para ver o resultado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cache */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Cache de Consultas
              </CardTitle>
              <CardDescription>Consultas recentes armazenadas em cache</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => clearCache.mutate()}
              disabled={clearCache.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Cache Antigo
            </Button>
          </CardHeader>
          <CardContent>
            {loadingCache ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : cache.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma consulta em cache
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead>Código FIPE</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Referência</TableHead>
                    <TableHead>Atualizado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cache.slice(0, 20).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          {getTipoIcon(item.tipo as TipoVeiculo)}
                          {item.tipo === 'carros' ? 'Carro' : item.tipo === 'motos' ? 'Moto' : 'Caminhão'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.marca} {item.modelo}
                      </TableCell>
                      <TableCell>{item.ano_modelo}</TableCell>
                      <TableCell className="font-mono text-sm">{item.codigo_fipe}</TableCell>
                      <TableCell className="font-medium text-primary">{item.valor}</TableCell>
                      <TableCell>{item.mes_referencia}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(item.updated_at), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
