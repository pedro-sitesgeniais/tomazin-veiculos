import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ProtectedRoute } from './ProtectedRoute';

interface AdminLayoutProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AdminLayout({ children, requireAdmin = false }: AdminLayoutProps) {
  return (
    <ProtectedRoute requireAdmin={requireAdmin}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
