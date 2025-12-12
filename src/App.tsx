import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Estoque from "./pages/Estoque";
import VeiculoDetalhe from "./pages/VeiculoDetalhe";
import Financiamento from "./pages/Financiamento";
import AvalieVeiculo from "./pages/AvalieVeiculo";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import VeiculosLista from "./pages/admin/VeiculosLista";
import VeiculoForm from "./pages/admin/VeiculoForm";
import LeadsLista from "./pages/admin/LeadsLista";
import LeadDetalhe from "./pages/admin/LeadDetalhe";
import AvaliacoesLista from "./pages/admin/AvaliacoesLista";
import AvaliacaoDetalhe from "./pages/admin/AvaliacaoDetalhe";
import BannersLista from "./pages/admin/BannersLista";
import PaginasLista from "./pages/admin/PaginasLista";
import DepoimentosLista from "./pages/admin/DepoimentosLista";
import HomeConfig from "./pages/admin/HomeConfig";
import Configuracoes from "./pages/admin/Configuracoes";
import TaxonomiasLista from "./pages/admin/TaxonomiasLista";
import IntegracoesLista from "./pages/admin/IntegracoesLista";
import SeoConfig from "./pages/admin/SeoConfig";
import UsuariosLista from "./pages/admin/UsuariosLista";
import LogsLista from "./pages/admin/LogsLista";
import Perfil from "./pages/admin/Perfil";
import FipeConsulta from "./pages/admin/FipeConsulta";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/estoque" element={<Estoque />} />
              <Route path="/veiculo/:id" element={<VeiculoDetalhe />} />
              <Route path="/financiamento" element={<Financiamento />} />
              <Route path="/avalie-seu-veiculo" element={<AvalieVeiculo />} />
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/veiculos" element={<VeiculosLista />} />
              <Route path="/admin/veiculos/novo" element={<VeiculoForm />} />
              <Route path="/admin/veiculos/:id" element={<VeiculoForm />} />
              <Route path="/admin/leads" element={<LeadsLista />} />
              <Route path="/admin/leads/:id" element={<LeadDetalhe />} />
              <Route path="/admin/avaliacoes" element={<AvaliacoesLista />} />
              <Route path="/admin/avaliacoes/:id" element={<AvaliacaoDetalhe />} />
              <Route path="/admin/banners" element={<BannersLista />} />
              <Route path="/admin/paginas" element={<PaginasLista />} />
              <Route path="/admin/depoimentos" element={<DepoimentosLista />} />
              <Route path="/admin/home" element={<HomeConfig />} />
              <Route path="/admin/configuracoes" element={<Configuracoes />} />
              <Route path="/admin/taxonomias" element={<TaxonomiasLista />} />
              <Route path="/admin/integracoes" element={<IntegracoesLista />} />
              <Route path="/admin/seo" element={<SeoConfig />} />
              <Route path="/admin/usuarios" element={<UsuariosLista />} />
              <Route path="/admin/logs" element={<LogsLista />} />
              <Route path="/admin/perfil" element={<Perfil />} />
              <Route path="/admin/fipe" element={<FipeConsulta />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
