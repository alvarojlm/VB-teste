import { Registration } from '../types';

const STORAGE_KEY = 'vem_brincar_registrations_v1';

export const initialMockRegistrations: Registration[] = [
  {
    id: 'reg_101',
    registrationNumber: 'VB-1001',
    parentName: 'Mariana Costa Silveira',
    parentPhone: '(84) 99881-2233',
    parentEmail: 'mariana.silveira@email.com',
    childrenCount: 2,
    totalAmount: 100.0,
    paymentStatus: 'confirmed',
    paymentConfirmedAt: '2026-09-22T10:15:00.000Z',
    createdAt: '2026-09-22T09:30:00.000Z',
    children: [
      {
        id: 'child_1',
        fullName: 'Enzo Gabriel Silveira',
        age: 6,
        hasAllergies: true,
        allergyDetails: 'Alergia severa a amendoim e nozes',
        specialNeedsOrHealthRestrictions: 'Nenhuma restrição motora ou transtorno reportado.',
      },
      {
        id: 'child_2',
        fullName: 'Clara Silveira',
        age: 4,
        hasAllergies: false,
        allergyDetails: '',
        specialNeedsOrHealthRestrictions: 'Intolerância leve a lactose',
      }
    ]
  },
  {
    id: 'reg_102',
    registrationNumber: 'VB-1002',
    parentName: 'Rodrigo Medeiros de Albuquerque',
    parentPhone: '(84) 98772-4411',
    parentEmail: 'rodrigo.albuquerque@email.com',
    childrenCount: 1,
    totalAmount: 50.0,
    paymentStatus: 'pending',
    createdAt: '2026-09-24T08:20:00.000Z',
    children: [
      {
        id: 'child_3',
        fullName: 'Lucas Medeiros de Albuquerque',
        age: 7,
        hasAllergies: false,
        allergyDetails: '',
        specialNeedsOrHealthRestrictions: 'Diagnóstico de TDAH; necessita de instruções curtas e acolhedoras para foco.',
      }
    ]
  },
  {
    id: 'reg_103',
    registrationNumber: 'VB-1003',
    parentName: 'Patrícia Gomes Ferreira',
    parentPhone: '(84) 99123-9988',
    parentEmail: 'patricia.ferreira@email.com',
    childrenCount: 1,
    totalAmount: 50.0,
    paymentStatus: 'confirmed',
    paymentConfirmedAt: '2026-09-24T11:45:00.000Z',
    createdAt: '2026-09-23T16:10:00.000Z',
    children: [
      {
        id: 'child_4',
        fullName: 'Beatriz Gomes Ferreira',
        age: 5,
        hasAllergies: true,
        allergyDetails: 'Alergia a corante vermelho e frutos do mar',
        specialNeedsOrHealthRestrictions: 'Espectro Autista (TEA nível 1 de suporte) - sensibilidade a sons muito altos e balões estourando.',
      }
    ]
  }
];

export function getStoredRegistrations(): Registration[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockRegistrations));
      return initialMockRegistrations;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading stored registrations:', err);
    return initialMockRegistrations;
  }
}

export function saveRegistrations(regs: Registration[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(regs));
  } catch (err) {
    console.error('Error saving registrations:', err);
  }
}

export function addRegistration(newReg: Omit<Registration, 'id' | 'registrationNumber' | 'createdAt' | 'paymentStatus' | 'totalAmount'>): Registration {
  const current = getStoredRegistrations();
  const nextNum = 1000 + current.length + 1;
  const registration: Registration = {
    ...newReg,
    id: 'reg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    registrationNumber: `VB-${nextNum}`,
    totalAmount: newReg.childrenCount * 50,
    paymentStatus: 'pending',
    createdAt: new Date().toISOString()
  };

  const updated = [registration, ...current];
  saveRegistrations(updated);
  return registration;
}

export function updateRegistrationStatus(id: string, status: Registration['paymentStatus'], notes?: string): Registration[] {
  const current = getStoredRegistrations();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        paymentStatus: status,
        paymentConfirmedAt: status === 'confirmed' ? (item.paymentConfirmedAt || new Date().toISOString()) : undefined,
        paymentNotes: notes !== undefined ? notes : item.paymentNotes
      };
    }
    return item;
  });
  saveRegistrations(updated);
  return updated;
}

export function deleteRegistration(id: string): Registration[] {
  const current = getStoredRegistrations();
  const updated = current.filter(item => item.id !== id);
  saveRegistrations(updated);
  return updated;
}

export function exportRegistrationsToCSV(registrations: Registration[]): void {
  // Flat CSV representation for every child associated with parent
  const headers = [
    'Código Inscrição',
    'Data Cadastro',
    'Status Pagamento',
    'Data Confirmação Pagamento',
    'Nome do Responsável',
    'Telefone WhatsApp',
    'E-mail',
    'Valor Total (R$)',
    'Nome da Criança',
    'Idade',
    'Possui Alergias?',
    'Detalhes das Alergias',
    'Restrições de Saúde / Transtornos / Observações'
  ];

  const rows: string[][] = [];

  registrations.forEach(reg => {
    const statusLabel = reg.paymentStatus === 'confirmed' ? 'CONFIRMADO' : reg.paymentStatus === 'pending' ? 'PENDENTE' : 'CANCELADO';
    const dateFormatted = new Date(reg.createdAt).toLocaleString('pt-BR');
    const paymentDateFormatted = reg.paymentConfirmedAt ? new Date(reg.paymentConfirmedAt).toLocaleString('pt-BR') : '-';

    reg.children.forEach(child => {
      rows.push([
        reg.registrationNumber,
        dateFormatted,
        statusLabel,
        paymentDateFormatted,
        `"${reg.parentName.replace(/"/g, '""')}"`,
        `"${reg.parentPhone.replace(/"/g, '""')}"`,
        `"${(reg.parentEmail || '').replace(/"/g, '""')}"`,
        reg.totalAmount.toFixed(2).replace('.', ','),
        `"${child.fullName.replace(/"/g, '""')}"`,
        String(child.age),
        child.hasAllergies ? 'SIM' : 'NÃO',
        `"${(child.allergyDetails || 'Nenhuma').replace(/"/g, '""')}"`,
        `"${(child.specialNeedsOrHealthRestrictions || 'Nenhuma').replace(/"/g, '""')}"`
      ]);
    });
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `inscricoes_vem_brincar_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
