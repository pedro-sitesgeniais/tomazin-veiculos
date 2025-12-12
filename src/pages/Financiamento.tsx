import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MessageCircle, FileText, ChevronRight, Home } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { FinancingSimulator } from '@/components/financiamento/FinancingSimulator';
import { CreditAnalysisModal } from '@/components/financiamento/CreditAnalysisModal';
import { FinancingSteps } from '@/components/financiamento/FinancingSteps';
import { FinancingPartners } from '@/components/financiamento/FinancingPartners';
import { FinancingFAQ } from '@/components/financiamento/FinancingFAQ';
import { supabase } from '@/integrations/supabase/client';

interface SimulationData {
  valorVeiculo: number;
  valorEntrada: number;
  prazo: number;
  taxaJuros: number;
  result: {
    valorFinanciado: number;
    valorParcela: number;
    totalPagar: number;
    custoFinanciamento: number;
  };
}

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  versao: string | null;
}

export default function Financiamento() {
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [simulacaoId, setSimulacaoId] = useState<string | undefined>();
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data } = await supabase
        .from('veiculos')
        .select('id, marca, modelo, versao')
        .eq('ativo', true)
        .order('marca');
      
      if (data) setVehicles(data);
    };

    fetchVehicles();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const saveSimulation = async () => {
    if (!simulationData) return null;

    try {
      const { data, error } = await supabase
        .from('simulacoes_financiamento')
        .insert({
          valor_veiculo: simulationData.valorVeiculo,
          valor_entrada: simulationData.valorEntrada,
          prazo: simulationData.prazo,
          taxa_juros: simulationData.taxaJuros,
          valor_financiado: simulationData.result.valorFinanciado,
          valor_parcela: simulationData.result.valorParcela,
          total_pagar: simulationData.result.totalPagar,
          custo_financiamento: simulationData.result.custoFinanciamento,
        })
        .select('id')
        .single();

      if (error) throw error;
      return data?.id;
    } catch (error) {
      console.error('Error saving simulation:', error);
      return null;
    }
  };

  const handleWhatsAppClick = async () => {
    const id = await saveSimulation();
    if (id) setSimulacaoId(id);

    if (!simulationData) return;

    const message = `Olá! Fiz uma simulação de financiamento no site:

📊 *Simulação de Financiamento*
💰 Valor do Veículo: ${formatCurrency(simulationData.valorVeiculo)}
💵 Entrada: ${formatCurrency(simulationData.valorEntrada)}
📅 Prazo: ${simulationData.prazo} meses
📈 Taxa: ${simulationData.taxaJuros}% a.m.

📋 *Resultado:*
• Valor Financiado: ${formatCurrency(simulationData.result.valorFinanciado)}
• Parcela: ${formatCurrency(simulationData.result.valorParcela)}
• Total: ${formatCurrency(simulationData.result.totalPagar)}

Gostaria de mais informações!`;

    window.open(
      `https://wa.me/5519999999999?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const handleCreditAnalysisClick = async () => {
    const id = await saveSimulation();
    if (id) setSimulacaoId(id);
    setIsCreditModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Financiamento de Veículos | Tomazin Multimarcas</title>
        <meta
          name="description"
          content="Simule seu financiamento de veículo online. Taxas a partir de 1,49% a.m. com aprovação rápida. Financie seu carro com as melhores condições."
        />
        <meta property="og:title" content="Financiamento de Veículos | Tomazin Multimarcas" />
        <meta
          property="og:description"
          content="Simule seu financiamento de veículo online. Taxas a partir de 1,49% a.m."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-dark overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(42_100%_50%/0.1),transparent_50%)]" />
          
          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-primary flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Financiamento</span>
            </nav>

            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-heading">
                Financiamento <span className="text-gradient-gold">Facilitado</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Simule agora e realize o sonho do carro novo. Taxas especiais e aprovação rápida.
              </p>
            </div>
          </div>
        </section>

        {/* Simulator Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <FinancingSimulator onSimulationChange={setSimulationData} />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                variant="whatsapp"
                size="lg"
                className="gap-2"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="h-5 w-5" />
                Falar com Consultor
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={handleCreditAnalysisClick}
              >
                <FileText className="h-5 w-5" />
                Solicitar Análise de Crédito
              </Button>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="bg-secondary/30">
          <div className="container mx-auto px-4">
            <FinancingSteps />
          </div>
        </section>

        {/* Partners Section */}
        <div className="container mx-auto px-4">
          <FinancingPartners />
        </div>

        {/* FAQ Section */}
        <div className="container mx-auto px-4">
          <FinancingFAQ />
        </div>
      </main>

      <Footer />
      <WhatsAppButton />

      <CreditAnalysisModal
        open={isCreditModalOpen}
        onOpenChange={setIsCreditModalOpen}
        vehicles={vehicles}
        simulacaoId={simulacaoId}
      />
    </>
  );
}
