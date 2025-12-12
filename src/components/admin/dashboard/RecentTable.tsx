import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface RecentTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export function RecentTable<T extends { id: string }>({ 
  title, 
  data, 
  columns,
  emptyMessage = 'Nenhum registro encontrado'
}: RecentTableProps<T>) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-heading">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">{emptyMessage}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key as string}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((col) => (
                    <TableCell key={`${item.id}-${col.key as string}`}>
                      {col.render 
                        ? col.render(item) 
                        : String(item[col.key as keyof T] ?? '-')
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// Status badge helper
export function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    pendente: { variant: 'secondary', label: 'Pendente' },
    em_analise: { variant: 'default', label: 'Em Análise' },
    proposta_enviada: { variant: 'outline', label: 'Proposta Enviada' },
    concluido: { variant: 'default', label: 'Concluído' },
    cancelado: { variant: 'destructive', label: 'Cancelado' },
  };

  const config = variants[status] || { variant: 'secondary' as const, label: status };

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}

// Date formatter helper
export function formatDate(date: string) {
  return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
}
