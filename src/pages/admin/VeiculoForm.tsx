import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useMarcas, useCores, useOpcionais } from '@/hooks/useAdminVehicles';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Eye, Copy, Trash2, ArrowLeft, Search } from 'lucide-react';
import { VehicleImageUpload } from '@/components/admin/veiculos/VehicleImageUpload';

const combustivelOptions = ['Flex', 'Gasolina', 'Diesel', 'Elétrico', 'Híbrido'];
const cambioOptions = ['Manual', 'Automático', 'CVT', 'Automatizado'];
const carroceriaOptions = ['Sedan', 'Hatch', 'SUV', 'Picape', 'Conversível', 'Van'];
const portasOptions = [2, 4];
const anoOptions = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() + 1 - i);

interface VehicleFormData {
  condicao: string;
  marca: string;
  modelo: string;
  versao: string;
  ano_fabricacao: number;
  ano: number;
  cor: string;
  combustivel: string;
  cambio: string;
  carroceria: string;
  portas: number;
  final_placa: number | null;
  km: number;
  preco: number;
  preco_promocional: number | null;
  codigo_interno: string;
  placa: string;
  renavam: string;
  chassi: string;
  descricao_curta: string;
  descricao: string;
  observacoes_internas: string;
  video_youtube: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  status: string;
  destaque: boolean;
  opcionais: string[];
}

const initialFormData: VehicleFormData = {
  condicao: 'Seminovo',
  marca: '',
  modelo: '',
  versao: '',
  ano_fabricacao: new Date().getFullYear(),
  ano: new Date().getFullYear(),
  cor: '',
  combustivel: 'Flex',
  cambio: 'Automático',
  carroceria: 'Sedan',
  portas: 4,
  final_placa: null,
  km: 0,
  preco: 0,
  preco_promocional: null,
  codigo_interno: '',
  placa: '',
  renavam: '',
  chassi: '',
  descricao_curta: '',
  descricao: '',
  observacoes_internas: '',
  video_youtube: '',
  slug: '',
  meta_title: '',
  meta_description: '',
  status: 'rascunho',
  destaque: false,
  opcionais: [],
};

export default function VeiculoForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const duplicarId = searchParams.get('duplicar');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);
  const [images, setImages] = useState<{ id?: string; url: string; ordem: number; principal: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { marcas } = useMarcas();
  const { cores } = useCores();
  const { groupedOpcionais } = useOpcionais();

  const isEditing = !!id;

  useEffect(() => {
    if (id || duplicarId) {
      fetchVehicle(id || duplicarId!);
    }
  }, [id, duplicarId]);

  const fetchVehicle = async (vehicleId: string) => {
    setLoading(true);
    try {
      const { data: vehicle, error } = await supabase
        .from('veiculos')
        .select('*')
        .eq('id', vehicleId)
        .single();

      if (error) throw error;

      if (vehicle) {
        setFormData({
          condicao: vehicle.condicao,
          marca: vehicle.marca,
          modelo: vehicle.modelo,
          versao: vehicle.versao || '',
          ano_fabricacao: vehicle.ano_fabricacao || vehicle.ano,
          ano: vehicle.ano,
          cor: vehicle.cor || '',
          combustivel: vehicle.combustivel,
          cambio: vehicle.cambio,
          carroceria: vehicle.carroceria,
          portas: vehicle.portas || 4,
          final_placa: vehicle.final_placa,
          km: vehicle.km,
          preco: vehicle.preco,
          preco_promocional: vehicle.preco_promocional,
          codigo_interno: vehicle.codigo_interno || '',
          placa: vehicle.placa || '',
          renavam: vehicle.renavam || '',
          chassi: vehicle.chassi || '',
          descricao_curta: vehicle.descricao_curta || '',
          descricao: vehicle.descricao || '',
          observacoes_internas: vehicle.observacoes_internas || '',
          video_youtube: vehicle.video_youtube || '',
          slug: duplicarId ? '' : (vehicle.slug || ''),
          meta_title: vehicle.meta_title || '',
          meta_description: vehicle.meta_description || '',
          status: duplicarId ? 'rascunho' : (vehicle.status || 'ativo'),
          destaque: duplicarId ? false : vehicle.destaque,
          opcionais: vehicle.opcionais || [],
        });

        // Fetch images
        const { data: vehicleImages } = await supabase
          .from('veiculo_imagens')
          .select('*')
          .eq('veiculo_id', vehicleId)
          .order('ordem');

        if (vehicleImages && vehicleImages.length > 0) {
          setImages(vehicleImages);
        } else if (vehicle.imagens && vehicle.imagens.length > 0) {
          // Fallback to old imagens array
          setImages(vehicle.imagens.map((url: string, index: number) => ({
            url,
            ordem: index,
            principal: url === vehicle.imagem_principal,
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar o veículo.',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateField = <K extends keyof VehicleFormData>(key: K, value: VehicleFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const generateSlug = () => {
    const slug = `${formData.marca}-${formData.modelo}-${formData.versao}-${formData.ano}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    updateField('slug', slug);
  };

  const generateMeta = () => {
    const title = `${formData.marca} ${formData.modelo} ${formData.versao} ${formData.ano} | Tomazin Veículos`;
    const description = `Compre seu ${formData.marca} ${formData.modelo} ${formData.ano} na Tomazin Veículos. ${formData.condicao}, ${formData.km.toLocaleString('pt-BR')} km, ${formData.cambio}. Financiamento facilitado!`;
    updateField('meta_title', title.slice(0, 60));
    updateField('meta_description', description.slice(0, 160));
  };

  const toggleOpcional = (opcionalId: string) => {
    setFormData(prev => ({
      ...prev,
      opcionais: prev.opcionais.includes(opcionalId)
        ? prev.opcionais.filter(o => o !== opcionalId)
        : [...prev.opcionais, opcionalId],
    }));
  };

  const handleSave = async (publish = false) => {
    if (!formData.marca || !formData.modelo || !formData.preco) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Preencha marca, modelo e preço.',
      });
      return;
    }

    setSaving(true);
    try {
      const principalImage = images.find(img => img.principal)?.url || images[0]?.url || null;
      
      const vehicleData = {
        condicao: formData.condicao as 'Seminovo' | '0KM',
        marca: formData.marca,
        modelo: formData.modelo,
        versao: formData.versao || null,
        ano_fabricacao: formData.ano_fabricacao,
        ano: formData.ano,
        cor: formData.cor || null,
        combustivel: formData.combustivel as 'Flex' | 'Gasolina' | 'Diesel' | 'Elétrico' | 'Híbrido',
        cambio: formData.cambio as 'Manual' | 'Automático' | 'CVT' | 'Automatizado',
        carroceria: formData.carroceria as 'Sedan' | 'Hatch' | 'SUV' | 'Picape' | 'Conversível' | 'Van',
        portas: formData.portas,
        final_placa: formData.final_placa,
        km: formData.km,
        preco: formData.preco,
        preco_promocional: formData.preco_promocional,
        codigo_interno: formData.codigo_interno || null,
        placa: formData.placa || null,
        renavam: formData.renavam || null,
        chassi: formData.chassi || null,
        descricao_curta: formData.descricao_curta || null,
        descricao: formData.descricao || null,
        observacoes_internas: formData.observacoes_internas || null,
        video_youtube: formData.video_youtube || null,
        slug: formData.slug || null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        status: publish ? 'ativo' : formData.status,
        destaque: formData.destaque,
        ativo: publish || formData.status === 'ativo',
        opcionais: formData.opcionais,
        imagem_principal: principalImage,
        imagens: images.map(img => img.url),
      };

      let vehicleId = id;

      if (isEditing && id) {
        const { error } = await supabase
          .from('veiculos')
          .update(vehicleData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('veiculos')
          .insert(vehicleData)
          .select('id')
          .single();

        if (error) throw error;
        vehicleId = data.id;
      }

      // Save images to veiculo_imagens table
      if (vehicleId) {
        // Delete existing images
        await supabase
          .from('veiculo_imagens')
          .delete()
          .eq('veiculo_id', vehicleId);

        // Insert new images
        if (images.length > 0) {
          await supabase
            .from('veiculo_imagens')
            .insert(images.map((img, index) => ({
              veiculo_id: vehicleId,
              url: img.url,
              ordem: index,
              principal: img.principal,
            })));
        }
      }

      toast({
        title: publish ? 'Veículo publicado' : 'Veículo salvo',
        description: publish ? 'O veículo foi publicado com sucesso.' : 'As alterações foram salvas.',
      });

      if (!isEditing) {
        navigate(`/admin/veiculos/${vehicleId}`);
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível salvar o veículo.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('veiculos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Veículo excluído',
        description: 'O veículo foi removido com sucesso.',
      });

      navigate('/admin/veiculos');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível excluir o veículo.',
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Editar Veículo' : 'Novo Veículo'} | Admin Tomazin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/veiculos')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold font-heading">
                  {isEditing ? 'Editar Veículo' : 'Novo Veículo'}
                </h1>
                {isEditing && (
                  <p className="text-muted-foreground">
                    {formData.marca} {formData.modelo} {formData.versao}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing && (
                <>
                  <Button variant="outline" asChild>
                    <a href={`/veiculo/${id}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver no site
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/admin/veiculos/novo?duplicar=${id}`)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                Salvar Rascunho
              </Button>
              <Button onClick={() => handleSave(true)} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Publicar
              </Button>
            </div>
          </div>

          {/* Form Tabs */}
          <Tabs defaultValue="basico" className="space-y-6">
            <TabsList className="bg-secondary">
              <TabsTrigger value="basico">Informações Básicas</TabsTrigger>
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              <TabsTrigger value="descricao">Descrição</TabsTrigger>
              <TabsTrigger value="opcionais">Opcionais</TabsTrigger>
              <TabsTrigger value="galeria">Galeria</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="publicacao">Publicação</TabsTrigger>
            </TabsList>

            {/* Tab: Informações Básicas */}
            <TabsContent value="basico">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Condição */}
                  <div className="space-y-2">
                    <Label>Condição</Label>
                    <RadioGroup
                      value={formData.condicao}
                      onValueChange={(v) => updateField('condicao', v)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0KM" id="0km" />
                        <Label htmlFor="0km">0KM</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Seminovo" id="seminovo" />
                        <Label htmlFor="seminovo">Seminovo</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Marca */}
                    <div className="space-y-2">
                      <Label>Marca *</Label>
                      <Select value={formData.marca} onValueChange={(v) => updateField('marca', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {marcas.map(m => (
                            <SelectItem key={m.id} value={m.nome}>{m.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Modelo */}
                    <div className="space-y-2">
                      <Label>Modelo *</Label>
                      <Input
                        value={formData.modelo}
                        onChange={(e) => updateField('modelo', e.target.value)}
                        placeholder="Ex: Civic"
                      />
                    </div>

                    {/* Versão */}
                    <div className="space-y-2">
                      <Label>Versão</Label>
                      <Input
                        value={formData.versao}
                        onChange={(e) => updateField('versao', e.target.value)}
                        placeholder="Ex: EXL 2.0"
                      />
                    </div>

                    {/* Ano Fabricação */}
                    <div className="space-y-2">
                      <Label>Ano Fabricação</Label>
                      <Select 
                        value={String(formData.ano_fabricacao)} 
                        onValueChange={(v) => updateField('ano_fabricacao', parseInt(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {anoOptions.map(ano => (
                            <SelectItem key={ano} value={String(ano)}>{ano}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Ano Modelo */}
                    <div className="space-y-2">
                      <Label>Ano Modelo</Label>
                      <Select 
                        value={String(formData.ano)} 
                        onValueChange={(v) => updateField('ano', parseInt(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {anoOptions.map(ano => (
                            <SelectItem key={ano} value={String(ano)}>{ano}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Cor */}
                    <div className="space-y-2">
                      <Label>Cor</Label>
                      <Select value={formData.cor} onValueChange={(v) => updateField('cor', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {cores.map(c => (
                            <SelectItem key={c.id} value={c.nome}>
                              <div className="flex items-center gap-2">
                                {c.hex_code && (
                                  <div 
                                    className="w-4 h-4 rounded-full border border-border" 
                                    style={{ backgroundColor: c.hex_code }}
                                  />
                                )}
                                {c.nome}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Combustível */}
                    <div className="space-y-2">
                      <Label>Combustível</Label>
                      <Select value={formData.combustivel} onValueChange={(v) => updateField('combustivel', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {combustivelOptions.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Câmbio */}
                    <div className="space-y-2">
                      <Label>Câmbio</Label>
                      <Select value={formData.cambio} onValueChange={(v) => updateField('cambio', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cambioOptions.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Carroceria */}
                    <div className="space-y-2">
                      <Label>Carroceria</Label>
                      <Select value={formData.carroceria} onValueChange={(v) => updateField('carroceria', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {carroceriaOptions.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Portas */}
                    <div className="space-y-2">
                      <Label>Portas</Label>
                      <Select 
                        value={String(formData.portas)} 
                        onValueChange={(v) => updateField('portas', parseInt(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {portasOptions.map(p => (
                            <SelectItem key={p} value={String(p)}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Final Placa */}
                    <div className="space-y-2">
                      <Label>Final da Placa</Label>
                      <Select 
                        value={formData.final_placa !== null ? String(formData.final_placa) : ''} 
                        onValueChange={(v) => updateField('final_placa', v ? parseInt(v) : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem key={i} value={String(i)}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Detalhes */}
            <TabsContent value="detalhes">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Detalhes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Quilometragem */}
                    <div className="space-y-2">
                      <Label>Quilometragem</Label>
                      <Input
                        type="number"
                        value={formData.km}
                        onChange={(e) => updateField('km', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>

                    {/* Preço */}
                    <div className="space-y-2">
                      <Label>Preço *</Label>
                      <Input
                        type="number"
                        value={formData.preco}
                        onChange={(e) => updateField('preco', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>

                    {/* Preço Promocional */}
                    <div className="space-y-2">
                      <Label>Preço Promocional</Label>
                      <Input
                        type="number"
                        value={formData.preco_promocional || ''}
                        onChange={(e) => updateField('preco_promocional', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="Opcional"
                      />
                    </div>

                    {/* Código Interno */}
                    <div className="space-y-2">
                      <Label>Código Interno</Label>
                      <Input
                        value={formData.codigo_interno}
                        onChange={(e) => updateField('codigo_interno', e.target.value)}
                        placeholder="Ex: VEI-001"
                      />
                    </div>

                    {/* Placa */}
                    <div className="space-y-2">
                      <Label>Placa</Label>
                      <Input
                        value={formData.placa}
                        onChange={(e) => updateField('placa', e.target.value.toUpperCase())}
                        placeholder="ABC-1234"
                        maxLength={8}
                      />
                    </div>

                    {/* Renavam */}
                    <div className="space-y-2">
                      <Label>Renavam</Label>
                      <Input
                        value={formData.renavam}
                        onChange={(e) => updateField('renavam', e.target.value)}
                        placeholder="Opcional"
                      />
                    </div>

                    {/* Chassi */}
                    <div className="space-y-2">
                      <Label>Chassi</Label>
                      <Input
                        value={formData.chassi}
                        onChange={(e) => updateField('chassi', e.target.value.toUpperCase())}
                        placeholder="Opcional"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Descrição */}
            <TabsContent value="descricao">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Descrição</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Descrição Curta (para cards)</Label>
                    <Textarea
                      value={formData.descricao_curta}
                      onChange={(e) => updateField('descricao_curta', e.target.value.slice(0, 200))}
                      placeholder="Breve descrição do veículo (máx. 200 caracteres)"
                      rows={2}
                    />
                    <p className="text-sm text-muted-foreground">{formData.descricao_curta.length}/200</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição Completa</Label>
                    <Textarea
                      value={formData.descricao}
                      onChange={(e) => updateField('descricao', e.target.value)}
                      placeholder="Descrição detalhada do veículo..."
                      rows={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Observações Internas (não aparece no site)</Label>
                    <Textarea
                      value={formData.observacoes_internas}
                      onChange={(e) => updateField('observacoes_internas', e.target.value)}
                      placeholder="Notas internas sobre o veículo..."
                      rows={4}
                      className="border-dashed"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Opcionais */}
            <TabsContent value="opcionais">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Opcionais e Itens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(groupedOpcionais).map(([categoria, items]) => (
                      <div key={categoria} className="space-y-3">
                        <h4 className="font-semibold text-lg border-b border-border pb-2">{categoria}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {items.map((item) => (
                            <label
                              key={item.id}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <Checkbox
                                checked={formData.opcionais.includes(item.id)}
                                onCheckedChange={() => toggleOpcional(item.id)}
                              />
                              <span className="text-sm">{item.nome}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Galeria */}
            <TabsContent value="galeria">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Galeria de Imagens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <VehicleImageUpload
                    images={images}
                    onChange={setImages}
                    vehicleId={id}
                  />

                  <div className="space-y-2">
                    <Label>URL do Vídeo (YouTube)</Label>
                    <Input
                      value={formData.video_youtube}
                      onChange={(e) => updateField('video_youtube', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: SEO */}
            <TabsContent value="seo">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>SEO</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={generateSlug}>
                        Gerar Slug
                      </Button>
                      <Button variant="outline" size="sm" onClick={generateMeta}>
                        Gerar Meta Tags
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Slug (URL)</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => updateField('slug', e.target.value)}
                      placeholder="chevrolet-onix-lt-2024"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Meta Title</Label>
                    <Input
                      value={formData.meta_title}
                      onChange={(e) => updateField('meta_title', e.target.value.slice(0, 60))}
                      placeholder="Título para buscadores (máx. 60 caracteres)"
                    />
                    <p className="text-sm text-muted-foreground">{formData.meta_title.length}/60</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea
                      value={formData.meta_description}
                      onChange={(e) => updateField('meta_description', e.target.value.slice(0, 160))}
                      placeholder="Descrição para buscadores (máx. 160 caracteres)"
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">{formData.meta_description.length}/160</p>
                  </div>

                  {/* Google Preview */}
                  <div className="p-4 bg-secondary rounded-lg space-y-1">
                    <p className="text-sm text-muted-foreground">Preview do Google</p>
                    <p className="text-blue-400 text-lg hover:underline cursor-pointer">
                      {formData.meta_title || `${formData.marca} ${formData.modelo} | Tomazin Veículos`}
                    </p>
                    <p className="text-green-500 text-sm">
                      tomazinveiculos.com.br/veiculo/{formData.slug || 'seu-veiculo'}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {formData.meta_description || 'Descrição do veículo...'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Publicação */}
            <TabsContent value="publicacao">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Publicação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(v) => updateField('status', v)}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rascunho">Rascunho</SelectItem>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="vendido">Vendido</SelectItem>
                        <SelectItem value="reservado">Reservado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={formData.destaque}
                      onCheckedChange={(v) => updateField('destaque', v)}
                    />
                    <Label>Destacar na página inicial</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </>
  );
}
