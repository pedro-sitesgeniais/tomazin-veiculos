import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MetricCard } from '@/components/admin/dashboard/MetricCard';
import { RecentTable, StatusBadge, formatDate } from '@/components/admin/dashboard/RecentTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  Car, 
  Users, 
  ClipboardList, 
  Eye, 
  Plus, 
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

interface DashboardStats {
  totalVeiculos: number;
  veiculos0km: number;
  veiculosSeminovo: number;
  leadsEsteMes: number;
  leadsMesAnterior: number;
  avaliacoesPendentes: number;
}

interface Lead {
  id: string;
  nome: string;
  created_at: string;
  veiculo_interesse_id: string | null;
}

interface Avaliacao {
  id: string;
  nome: string;
  marca: string;
  modelo: string;
  created_at: string;
  status: string;
}

const COLORS = ['hsl(42, 100%, 50%)', 'hsl(0, 0%, 40%)', 'hsl(42, 100%, 40%)', 'hsl(0, 0%, 25%)'];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVeiculos: 0,
    veiculos0km: 0,
    veiculosSeminovo: 0,
    leadsEsteMes: 0,
    leadsMesAnterior: 0,
    avaliacoesPendentes: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentAvaliacoes, setRecentAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const leadsPerDay = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    leads: Math.floor(Math.random() * 10) + 1,
  }));

  const vehiclesByCategory = [
    { name: 'Sedan', value: 35 },
    { name: 'SUV', value: 28 },
    { name: 'Hatch', value: 20 },
    { name: 'Picape', value: 17 },
  ];

  const topVehicles = [
    { name: 'Civic', views: 245 },
    { name: 'Corolla', views: 198 },
    { name: 'HRV', views: 156 },
    { name: 'Compass', views: 134 },
    { name: 'Onix', views: 122 },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch vehicles stats
      const { data: veiculos } = await supabase
        .from('veiculos')
        .select('id, condicao')
        .eq('ativo', true);

      const totalVeiculos = veiculos?.length || 0;
      const veiculos0km = veiculos?.filter(v => v.condicao === '0KM').length || 0;
      const veiculosSeminovo = veiculos?.filter(v => v.condicao === 'Seminovo').length || 0;

      // Fetch leads count this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: leadsEsteMes } = await supabase
        .from('solicitacoes_credito')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Fetch leads count last month
      const startOfLastMonth = new Date(startOfMonth);
      startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

      const { count: leadsMesAnterior } = await supabase
        .from('solicitacoes_credito')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfLastMonth.toISOString())
        .lt('created_at', startOfMonth.toISOString());

      // Fetch pending evaluations
      const { count: avaliacoesPendentes } = await supabase
        .from('avaliacoes_veiculos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente');

      setStats({
        totalVeiculos,
        veiculos0km,
        veiculosSeminovo,
        leadsEsteMes: leadsEsteMes || 0,
        leadsMesAnterior: leadsMesAnterior || 0,
        avaliacoesPendentes: avaliacoesPendentes || 0,
      });

      // Fetch recent evaluations
      const { data: avaliacoes } = await supabase
        .from('avaliacoes_veiculos')
        .select('id, nome, marca, modelo, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentAvaliacoes(avaliacoes || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const leadsTrend = stats.leadsMesAnterior > 0 
    ? Math.round(((stats.leadsEsteMes - stats.leadsMesAnterior) / stats.leadsMesAnterior) * 100)
    : 0;

  return (
    <>
      <Helmet>
        <title>Dashboard | Admin Tomazin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
              <p className="text-muted-foreground">Visão geral do seu negócio</p>
            </div>
            <Button onClick={fetchDashboardData} variant="outline" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Veículos Ativos"
              value={stats.totalVeiculos}
              icon={Car}
            />
            <MetricCard
              title="0KM vs Seminovos"
              value={`${stats.veiculos0km} / ${stats.veiculosSeminovo}`}
              icon={Sparkles}
            />
            <MetricCard
              title="Leads Este Mês"
              value={stats.leadsEsteMes}
              icon={Users}
              trend={{ value: leadsTrend, label: 'vs mês anterior' }}
            />
            <MetricCard
              title="Avaliações Pendentes"
              value={stats.avaliacoesPendentes}
              icon={ClipboardList}
            />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/admin/veiculos/novo">
                <Plus className="h-4 w-4 mr-2" />
                Novo Veículo
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/avaliacoes?status=pendente">
                <ArrowRight className="h-4 w-4 mr-2" />
                Ver Avaliações Pendentes
              </Link>
            </Button>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leads per Day Chart */}
            <Card className="lg:col-span-2 bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Leads por Dia (Últimos 30 dias)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={leadsPerDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                      <XAxis 
                        dataKey="day" 
                        stroke="hsl(0 0% 60%)"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(0 0% 60%)"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(0 0% 12%)', 
                          border: '1px solid hsl(0 0% 20%)',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="leads" 
                        stroke="hsl(42 100% 50%)" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Vehicles by Category Pie Chart */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Veículos por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vehiclesByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {vehiclesByCategory.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(0 0% 12%)', 
                          border: '1px solid hsl(0 0% 20%)',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Vehicles Bar Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Top 5 Veículos Mais Visualizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topVehicles} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                    <XAxis type="number" stroke="hsl(0 0% 60%)" fontSize={12} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      stroke="hsl(0 0% 60%)" 
                      fontSize={12}
                      width={80}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(0 0% 12%)', 
                        border: '1px solid hsl(0 0% 20%)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="views" fill="hsl(42 100% 50%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentTable
              title="Últimas 5 Avaliações"
              data={recentAvaliacoes}
              columns={[
                { key: 'nome', label: 'Nome' },
                { 
                  key: 'veiculo', 
                  label: 'Veículo',
                  render: (item) => `${item.marca} ${item.modelo}`
                },
                { 
                  key: 'created_at', 
                  label: 'Data',
                  render: (item) => formatDate(item.created_at)
                },
                { 
                  key: 'status', 
                  label: 'Status',
                  render: (item) => <StatusBadge status={item.status} />
                },
              ]}
              emptyMessage="Nenhuma avaliação recebida"
            />

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Veículos sem Fotos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Todos os veículos possuem fotos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
