import { Registration } from '../types';

declare global {
  interface Window {
    gapi?: any;
    google?: any;
  }
}

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/forms.responses.readonly'
].join(' ');

let tokenClient: any = null;
let accessToken: string | null = null;

export async function requestGoogleAccessToken(): Promise<string> {
  if (accessToken) {
    return accessToken;
  }

  return new Promise((resolve, reject) => {
    // Wait for google.accounts.oauth2 to be available or load it dynamically
    const checkGoogleAccounts = () => {
      if (window.google?.accounts?.oauth2) {
        try {
          tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: '303449001696-client.apps.googleusercontent.com', // Provisioned client
            scope: SCOPES,
            callback: (response: any) => {
              if (response.error) {
                reject(new Error(response.error_description || response.error));
                return;
              }
              accessToken = response.access_token;
              resolve(response.access_token);
            },
          });
          tokenClient.requestAccessToken({ prompt: 'consent' });
        } catch (e) {
          reject(e);
        }
      } else {
        // Dynamically inject Google Identity Services script if not present
        if (!document.getElementById('google-gsi-client')) {
          const script = document.createElement('script');
          script.id = 'google-gsi-client';
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          script.onload = () => {
            setTimeout(checkGoogleAccounts, 300);
          };
          script.onerror = () => reject(new Error('Falha ao carregar biblioteca Google'));
          document.body.appendChild(script);
        } else {
          setTimeout(checkGoogleAccounts, 200);
        }
      }
    };

    checkGoogleAccounts();
  });
}

/**
 * Creates a brand new Google Spreadsheet with all current registrations
 */
export async function exportToGoogleSheets(registrations: Registration[]): Promise<{ spreadsheetUrl: string; title: string }> {
  const token = await requestGoogleAccessToken();

  const title = `Inscrições Vem Brincar - Aniversário (${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')})`;
  
  // 1. Create spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
    }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Falha ao criar planilha no Google Sheets');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // 2. Prepare tabular data
  const headers = [
    'Código Inscrição',
    'Data de Inscrição',
    'Status de Pagamento',
    'Data Pagamento Confirmado',
    'Nome do Responsável',
    'WhatsApp Responsável',
    'E-mail',
    'Qtd Crianças',
    'Valor Total (R$)',
    'Nome da Criança',
    'Idade',
    'Tem Alergia?',
    'Alergias Detalhadas',
    'Restrições de Saúde / Transtornos / Observações Especiais'
  ];

  const values: any[][] = [headers];

  registrations.forEach(reg => {
    const statusLabel = reg.paymentStatus === 'confirmed' ? 'CONFIRMADO (PAGO)' : reg.paymentStatus === 'pending' ? 'PENDENTE' : 'CANCELADO';
    const createdAtFormatted = new Date(reg.createdAt).toLocaleString('pt-BR');
    const paymentConfirmedAt = reg.paymentConfirmedAt ? new Date(reg.paymentConfirmedAt).toLocaleString('pt-BR') : '-';

    reg.children.forEach(child => {
      values.push([
        reg.registrationNumber,
        createdAtFormatted,
        statusLabel,
        paymentConfirmedAt,
        reg.parentName,
        reg.parentPhone,
        reg.parentEmail || '-',
        reg.childrenCount,
        reg.totalAmount,
        child.fullName,
        child.age,
        child.hasAllergies ? 'SIM' : 'NÃO',
        child.allergyDetails || 'Nenhuma',
        child.specialNeedsOrHealthRestrictions || 'Nenhuma restrição registrada'
      ]);
    });
  });

  // 3. Write rows to Google Sheet
  const appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values,
    }),
  });

  if (!appendRes.ok) {
    const appendError = await appendRes.json().catch(() => ({}));
    throw new Error(appendError.error?.message || 'Falha ao preencher dados na planilha do Google Sheets');
  }

  return {
    spreadsheetUrl,
    title,
  };
}
