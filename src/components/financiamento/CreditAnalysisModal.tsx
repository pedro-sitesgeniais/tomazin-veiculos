import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const creditSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpf: z.string().min(11, 'CPF inválido').max(14, 'CPF inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  rendaMensal: z.number().min(1000, 'Renda mínima de R$ 1.000'),
  veiculoInteresse: z.string().optional(),
  possuiVeiculoTroca: z.boolean(),
  aceiteLgpd: z.boolean().refine((val) => val === true, 'Você deve aceitar os termos'),
});

type CreditFormData = z.infer<typeof creditSchema>;

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  versao: string | null;
}

interface CreditAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicles: Vehicle[];
  simulacaoId?: string;
}

export function CreditAnalysisModal({
  open,
  onOpenChange,
  vehicles,
  simulacaoId,
}: CreditAnalysisModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreditFormData>({
    resolver: zodResolver(creditSchema),
    defaultValues: {
      possuiVeiculoTroca: false,
      aceiteLgpd: false,
    },
  });

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const onSubmit = async (data: CreditFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('solicitacoes_credito').insert({
        nome: data.nome,
        cpf: data.cpf.replace(/\D/g, ''),
        telefone: data.telefone.replace(/\D/g, ''),
        email: data.email,
        renda_mensal: data.rendaMensal,
        veiculo_interesse_id: data.veiculoInteresse || null,
        possui_veiculo_troca: data.possuiVeiculoTroca,
        aceite_lgpd: data.aceiteLgpd,
        simulacao_id: simulacaoId || null,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: 'Solicitação enviada!',
        description: 'Em breve um consultor entrará em contato.',
      });

      setTimeout(() => {
        reset();
        setIsSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting credit request:', error);
      toast({
        title: 'Erro ao enviar',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border">
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Solicitação Enviada!
            </h3>
            <p className="text-muted-foreground text-center">
              Recebemos sua solicitação. Um consultor entrará em contato em breve.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Solicitar Análise de Crédito</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha seus dados para uma análise personalizada.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-foreground">Nome Completo</Label>
            <Input
              id="nome"
              {...register('nome')}
              className="bg-secondary border-border text-foreground"
              placeholder="Seu nome completo"
            />
            {errors.nome && (
              <p className="text-xs text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-foreground">CPF</Label>
              <Input
                id="cpf"
                {...register('cpf')}
                onChange={(e) => setValue('cpf', formatCPF(e.target.value))}
                className="bg-secondary border-border text-foreground"
                placeholder="000.000.000-00"
                maxLength={14}
              />
              {errors.cpf && (
                <p className="text-xs text-destructive">{errors.cpf.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-foreground">Telefone/WhatsApp</Label>
              <Input
                id="telefone"
                {...register('telefone')}
                onChange={(e) => setValue('telefone', formatPhone(e.target.value))}
                className="bg-secondary border-border text-foreground"
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
              {errors.telefone && (
                <p className="text-xs text-destructive">{errors.telefone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="bg-secondary border-border text-foreground"
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rendaMensal" className="text-foreground">Renda Mensal</Label>
            <Input
              id="rendaMensal"
              type="number"
              {...register('rendaMensal', { valueAsNumber: true })}
              className="bg-secondary border-border text-foreground"
              placeholder="5000"
            />
            {errors.rendaMensal && (
              <p className="text-xs text-destructive">{errors.rendaMensal.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="veiculo" className="text-foreground">Veículo de Interesse</Label>
            <Select onValueChange={(value) => setValue('veiculoInteresse', value)}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue placeholder="Selecione um veículo (opcional)" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.marca} {vehicle.modelo} {vehicle.versao || ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="possuiVeiculoTroca"
              checked={watch('possuiVeiculoTroca')}
              onCheckedChange={(checked) =>
                setValue('possuiVeiculoTroca', checked as boolean)
              }
            />
            <Label htmlFor="possuiVeiculoTroca" className="text-foreground cursor-pointer">
              Possuo veículo para troca
            </Label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="aceiteLgpd"
              checked={watch('aceiteLgpd')}
              onCheckedChange={(checked) =>
                setValue('aceiteLgpd', checked as boolean)
              }
            />
            <Label htmlFor="aceiteLgpd" className="text-sm text-muted-foreground cursor-pointer">
              Concordo com a Política de Privacidade e autorizo o tratamento dos meus dados
              conforme a LGPD para fins de análise de crédito.
            </Label>
          </div>
          {errors.aceiteLgpd && (
            <p className="text-xs text-destructive">{errors.aceiteLgpd.message}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Solicitar Análise'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
