import { CheckCircle, Car, User, Camera, Clipboard } from 'lucide-react';
import { EvaluationFormData } from './types';

interface Step5Props {
  data: EvaluationFormData;
  protocolo: string;
}

export function Step5Confirmation({ data, protocolo }: Step5Props) {
  return (
    <div className="space-y-8">
      {/* Success message */}
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-3">
          Avaliação Enviada com Sucesso!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Recebemos sua solicitação e entraremos em contato em até 24 horas úteis.
        </p>
      </div>

      {/* Protocol */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-primary mb-2">
          <Clipboard className="h-5 w-5" />
          <span className="text-sm font-medium">Protocolo de Atendimento</span>
        </div>
        <p className="text-2xl font-bold text-foreground font-mono tracking-wider">
          {protocolo}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Guarde este número para acompanhamento
        </p>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Vehicle info */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Veículo</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Marca/Modelo:</span>
              <span className="text-foreground font-medium">
                {data.vehicle.marca} {data.vehicle.modelo}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ano:</span>
              <span className="text-foreground">{data.vehicle.anoModelo}</span>
            </div>
            {data.vehicle.versao && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Versão:</span>
                <span className="text-foreground">{data.vehicle.versao}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">KM:</span>
              <span className="text-foreground">
                {data.vehicle.quilometragem.toLocaleString('pt-BR')} km
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <span className="text-foreground">{data.condition.estadoGeral}</span>
            </div>
          </div>
        </div>

        {/* Owner info */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Contato</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nome:</span>
              <span className="text-foreground font-medium">{data.owner.nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Telefone:</span>
              <span className="text-foreground">{data.owner.telefone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="text-foreground truncate max-w-[180px]">{data.owner.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Localização:</span>
              <span className="text-foreground">{data.owner.cidade}/{data.owner.uf}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interesse:</span>
              <span className="text-primary font-medium">{data.owner.interesse}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Photos count */}
      {data.photos.files.length > 0 && (
        <div className="flex items-center justify-center gap-3 p-4 bg-secondary/30 rounded-xl">
          <Camera className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {data.photos.files.length} {data.photos.files.length === 1 ? 'foto enviada' : 'fotos enviadas'}
          </span>
        </div>
      )}

      {/* Next steps */}
      <div className="bg-secondary/30 border border-border rounded-xl p-6">
        <h4 className="font-semibold text-foreground mb-4">Próximos Passos</h4>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
            <span>Nossa equipe analisará as informações e fotos do seu veículo</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
            <span>Entraremos em contato pelo WhatsApp ou telefone informado</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
            <span>Apresentaremos uma proposta justa para seu veículo</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
