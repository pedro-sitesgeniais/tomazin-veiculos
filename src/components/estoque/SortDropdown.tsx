import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { VehicleFilters } from '@/hooks/useVehicles';

interface SortDropdownProps {
  ordenacao: VehicleFilters['ordenacao'];
  onOrdenacaoChange: (ordenacao: VehicleFilters['ordenacao']) => void;
}

const SORT_OPTIONS = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'preco_asc', label: 'Menor preço' },
  { value: 'preco_desc', label: 'Maior preço' },
  { value: 'km_asc', label: 'Menor km' },
] as const;

export function SortDropdown({ ordenacao, onOrdenacaoChange }: SortDropdownProps) {
  const currentLabel = SORT_OPTIONS.find(opt => opt.value === ordenacao)?.label || 'Mais recentes';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          {currentLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border z-50">
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onOrdenacaoChange(option.value)}
            className={ordenacao === option.value ? 'bg-primary/10 text-primary' : ''}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
