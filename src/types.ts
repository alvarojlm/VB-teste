export interface ChildParticipant {
  id: string;
  fullName: string;
  age: number | string;
  birthDate?: string;
  hasAllergies: boolean;
  allergyDetails: string;
  specialNeedsOrHealthRestrictions: string; // Transtornos (TEA, TDAH etc), restrições motoras/saúde
  emergencyNotes?: string;
}

export type PaymentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Registration {
  id: string;
  registrationNumber: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  parentCpf?: string;
  children: ChildParticipant[];
  childrenCount: number;
  totalAmount: number; // R$ 50,00 * childrenCount
  paymentStatus: PaymentStatus;
  paymentConfirmedAt?: string;
  paymentNotes?: string;
  createdAt: string;
  syncedToGoogleSheet?: boolean;
}

export interface EventDetails {
  title: string;
  subtitle: string;
  date: string;
  dateFormatted: string;
  time: string;
  venueName: string;
  address: string;
  city: string;
  neighborhood: string;
  pricePerChild: number;
  phoneWhatsapp: string;
  whatsappRaw: string;
  instagram: string;
  pixKey: string;
  pixKeyType: string;
  pixReceiver: string;
}

export const EVENT_INFO: EventDetails = {
  title: "Aniversário Vem Brincar & Dia das Crianças",
  subtitle: "Uma manhã mágica de recreação, brincadeiras e oficina pedagógica de scrapbook!",
  date: "2026-10-17",
  dateFormatted: "17 de Outubro de 2026 (Sábado)",
  time: "08:00 às 11:30",
  venueName: "Espaço Educacional Vem Brincar",
  neighborhood: "Pitimbu",
  address: "Rua Visconde de Nitério, 85 - Pitimbu, Natal - RN",
  city: "Natal - RN",
  pricePerChild: 50.00,
  phoneWhatsapp: "(84) 98108-1186",
  whatsappRaw: "5584981081186",
  instagram: "@vembrincar.contraturno",
  pixKey: "84981081186",
  pixKeyType: "Celular / WhatsApp",
  pixReceiver: "Vem Brincar Espaço Educacional"
};
