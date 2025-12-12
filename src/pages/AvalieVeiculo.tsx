import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Home, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { StepIndicator } from '@/components/avaliacao/StepIndicator';
import { Step1VehicleData } from '@/components/avaliacao/Step1VehicleData';
import { Step2VehicleCondition } from '@/components/avaliacao/Step2VehicleCondition';
import { Step3Photos } from '@/components/avaliacao/Step3Photos';
import { Step4OwnerData } from '@/components/avaliacao/Step4OwnerData';
import { Step5Confirmation } from '@/components/avaliacao/Step5Confirmation';
import {
  EvaluationFormData,
  VehicleData,
  VehicleCondition,
  PhotoData,
  OwnerData,
  initialVehicleData,
  initialConditionData,
  initialPhotoData,
  initialOwnerData,
} from '@/components/avaliacao/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const STEP_LABELS = ['Veículo', 'Condição', 'Fotos', 'Dados', 'Confirmação'];

export default function AvalieVeiculo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [protocolo, setProtocolo] = useState('');
  const { toast } = useToast();

  const [vehicleData, setVehicleData] = useState<VehicleData>(initialVehicleData);
  const [conditionData, setConditionData] = useState<VehicleCondition>(initialConditionData);
  const [photoData, setPhotoData] = useState<PhotoData>(initialPhotoData);
  const [ownerData, setOwnerData] = useState<OwnerData>(initialOwnerData);

  const [vehicleErrors, setVehicleErrors] = useState<Partial<Record<keyof VehicleData, string>>>({});
  const [conditionErrors, setConditionErrors] = useState<Partial<Record<keyof VehicleCondition, string>>>({});
  const [ownerErrors, setOwnerErrors] = useState<Partial<Record<keyof OwnerData, string>>>({});

  const formData: EvaluationFormData = {
    vehicle: vehicleData,
    condition: conditionData,
    photos: photoData,
    owner: ownerData,
  };

  const validateStep1 = (): boolean => {
    const errors: Partial<Record<keyof VehicleData, string>> = {};
    if (!vehicleData.marca) errors.marca = 'Selecione a marca';
    if (!vehicleData.modelo) errors.modelo = 'Selecione o modelo';
    if (!vehicleData.combustivel) errors.combustivel = 'Selecione o combustível';
    if (!vehicleData.cambio) errors.cambio = 'Selecione o câmbio';
    if (!vehicleData.cor) errors.cor = 'Selecione a cor';
    if (!vehicleData.quilometragem) errors.quilometragem = 'Informe a quilometragem';
    setVehicleErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Partial<Record<keyof VehicleCondition, string>> = {};
    if (!conditionData.estadoGeral) errors.estadoGeral = 'Selecione o estado geral';
    setConditionErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const errors: Partial<Record<keyof OwnerData, string>> = {};
    if (!ownerData.nome || ownerData.nome.length < 3) errors.nome = 'Nome deve ter pelo menos 3 caracteres';
    if (!ownerData.cpf || ownerData.cpf.length < 14) errors.cpf = 'CPF inválido';
    if (!ownerData.telefone || ownerData.telefone.length < 14) errors.telefone = 'Telefone inválido';
    if (!ownerData.email || !ownerData.email.includes('@')) errors.email = 'Email inválido';
    if (!ownerData.cidade) errors.cidade = 'Informe a cidade';
    if (!ownerData.uf) errors.uf = 'Selecione o estado';
    if (!ownerData.interesse) errors.interesse = 'Selecione o interesse';
    if (!ownerData.aceiteLgpd) errors.aceiteLgpd = 'Você deve aceitar os termos';
    setOwnerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateProtocolo = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `AV${year}${month}${day}-${random}`;
  };

  const uploadPhotos = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < photoData.files.length; i++) {
      const file = photoData.files[i];
      const fileName = `${generateProtocolo()}-${i + 1}-${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from('avaliacoes-fotos')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading photo:', error);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('avaliacoes-fotos')
        .getPublicUrl(fileName);

      if (urlData) {
        uploadedUrls.push(urlData.publicUrl);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;

    setIsSubmitting(true);
    const newProtocolo = generateProtocolo();

    try {
      // Upload photos first
      const photoUrls = await uploadPhotos();

      // Insert evaluation data
      const { error } = await supabase.from('avaliacoes_veiculos').insert({
        protocolo: newProtocolo,
        marca: vehicleData.marca,
        modelo: vehicleData.modelo,
        ano_modelo: vehicleData.anoModelo,
        versao: vehicleData.versao || null,
        combustivel: vehicleData.combustivel,
        cambio: vehicleData.cambio,
        cor: vehicleData.cor,
        quilometragem: vehicleData.quilometragem,
        unico_dono: conditionData.unicoDono,
        manual_chave_reserva: conditionData.manualChaveReserva,
        ipva_pago: conditionData.ipvaPago,
        possui_multas: conditionData.possuiMultas,
        estado_geral: conditionData.estadoGeral,
        observacoes: conditionData.observacoes || null,
        fotos: photoUrls,
        nome: ownerData.nome,
        cpf: ownerData.cpf.replace(/\D/g, ''),
        telefone: ownerData.telefone.replace(/\D/g, ''),
        email: ownerData.email,
        cidade: ownerData.cidade,
        uf: ownerData.uf,
        melhor_horario: ownerData.melhorHorario || null,
        interesse: ownerData.interesse,
        aceite_lgpd: ownerData.aceiteLgpd,
        status: 'pendente',
      });

      if (error) throw error;

      setProtocolo(newProtocolo);
      setCurrentStep(5);
      toast({
        title: 'Avaliação enviada!',
        description: 'Entraremos em contato em breve.',
      });
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      toast({
        title: 'Erro ao enviar',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 4) {
      handleSubmit();
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <>
      <Helmet>
        <title>Avalie seu Veículo | Tomazin Multimarcas</title>
        <meta
          name="description"
          content="Avalie seu veículo para venda ou troca. Receba uma proposta justa em até 24 horas. Processo rápido e transparente."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 bg-gradient-dark overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(42_100%_50%/0.1),transparent_50%)]" />
          
          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Avalie seu Veículo</span>
            </nav>

            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-heading">
                Avalie seu <span className="text-gradient-gold">Veículo</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Receba uma proposta justa em até 24 horas. Processo rápido, transparente e sem compromisso.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {currentStep < 5 && (
              <StepIndicator
                currentStep={currentStep}
                totalSteps={4}
                stepLabels={STEP_LABELS}
              />
            )}

            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              {currentStep === 1 && (
                <Step1VehicleData
                  data={vehicleData}
                  onChange={setVehicleData}
                  errors={vehicleErrors}
                />
              )}
              {currentStep === 2 && (
                <Step2VehicleCondition
                  data={conditionData}
                  onChange={setConditionData}
                  errors={conditionErrors}
                />
              )}
              {currentStep === 3 && (
                <Step3Photos data={photoData} onChange={setPhotoData} />
              )}
              {currentStep === 4 && (
                <Step4OwnerData
                  data={ownerData}
                  onChange={setOwnerData}
                  errors={ownerErrors}
                />
              )}
              {currentStep === 5 && (
                <Step5Confirmation data={formData} protocolo={protocolo} />
              )}

              {/* Navigation buttons */}
              {currentStep < 5 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </Button>
                  <Button onClick={handleNext} disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : currentStep === 4 ? (
                      'Enviar Avaliação'
                    ) : (
                      <>
                        Próximo
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Back to home on confirmation */}
              {currentStep === 5 && (
                <div className="flex justify-center mt-8 pt-6 border-t border-border">
                  <Button asChild variant="outline">
                    <Link to="/">Voltar para Home</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
