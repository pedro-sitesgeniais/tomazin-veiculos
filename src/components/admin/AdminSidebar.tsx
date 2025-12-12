import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Car,
  Users,
  ClipboardList,
  Image,
  FileText,
  Settings,
  Plug,
  Search,
  UserCog,
  LogOut,
} from 'lucide-react';
import logoTomazin from '@/assets/logo-tomazin.png';
import { cn } from '@/lib/utils';

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Veículos', url: '/admin/veiculos', icon: Car },
  { title: 'Leads/CRM', url: '/admin/leads', icon: Users },
  { title: 'Avaliações', url: '/admin/avaliacoes', icon: ClipboardList },
  { title: 'Banners', url: '/admin/banners', icon: Image },
  { title: 'Páginas', url: '/admin/paginas', icon: FileText },
  { title: 'Configurações', url: '/admin/configuracoes', icon: Settings },
  { title: 'Integrações', url: '/admin/integracoes', icon: Plug },
  { title: 'SEO', url: '/admin/seo', icon: Search },
  { title: 'Usuários', url: '/admin/usuarios', icon: UserCog },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut } = useAuthContext();
  const isCollapsed = state === 'collapsed';

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <Link to="/admin" className="flex items-center justify-center">
          <img 
            src={logoTomazin} 
            alt="Tomazin" 
            className={cn(
              "transition-all duration-300",
              isCollapsed ? "h-8" : "h-10"
            )}
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url || 
                  (item.url !== '/admin' && location.pathname.startsWith(item.url));
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link 
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-sidebar-accent"
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            isCollapsed && "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="ml-3">Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
