export interface VehicleData {
  marca: string;
  modelo: string;
  anoModelo: number;
  versao: string;
  combustivel: string;
  cambio: string;
  cor: string;
  quilometragem: number;
}

export interface VehicleCondition {
  unicoDono: boolean;
  manualChaveReserva: boolean;
  ipvaPago: boolean;
  possuiMultas: boolean;
  estadoGeral: 'Excelente' | 'Bom' | 'Regular' | 'Precisa reparos';
  observacoes: string;
}

export interface PhotoData {
  files: File[];
  previews: string[];
}

export interface OwnerData {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cidade: string;
  uf: string;
  melhorHorario: string;
  interesse: 'Vender' | 'Trocar por outro' | 'Apenas avaliação';
  aceiteLgpd: boolean;
}

export interface EvaluationFormData {
  vehicle: VehicleData;
  condition: VehicleCondition;
  photos: PhotoData;
  owner: OwnerData;
}

export const initialVehicleData: VehicleData = {
  marca: '',
  modelo: '',
  anoModelo: new Date().getFullYear(),
  versao: '',
  combustivel: '',
  cambio: '',
  cor: '',
  quilometragem: 0,
};

export const initialConditionData: VehicleCondition = {
  unicoDono: false,
  manualChaveReserva: false,
  ipvaPago: false,
  possuiMultas: false,
  estadoGeral: 'Bom',
  observacoes: '',
};

export const initialPhotoData: PhotoData = {
  files: [],
  previews: [],
};

export const initialOwnerData: OwnerData = {
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  cidade: '',
  uf: '',
  melhorHorario: '',
  interesse: 'Vender',
  aceiteLgpd: false,
};
