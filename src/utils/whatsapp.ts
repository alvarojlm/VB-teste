import { EVENT_INFO, Registration } from '../types';

/**
 * Builds the comprehensive WhatsApp confirmation message to be sent to parents
 * upon payment confirmation.
 */
export function buildParentConfirmationMessage(reg: Registration): string {
  const childrenList = reg.children
    .map((c, i) => {
      const allergyTxt = c.hasAllergies ? ` (⚠️ Alergia: ${c.allergyDetails})` : '';
      const notesTxt = c.specialNeedsOrHealthRestrictions ? ` (ℹ️ Obs: ${c.specialNeedsOrHealthRestrictions})` : '';
      return `   ${i + 1}. *${c.fullName}* - ${c.age} anos${allergyTxt}${notesTxt}`;
    })
    .join('\n');

  return (
`🎉 *INSCRIÇÃO CONFIRMADA COM SUCESSO!* 🎈
*Espaço Educacional Vem Brincar*

Olá, *${reg.parentName}*!
Temos a imensa alegria de confirmar o recebimento do pagamento e a vaga oficial para o nosso evento de Aniversário & Dia das Crianças! 💛

━━━━━━━━━━━━━━━━━━━━━
📋 *RESUMO DA INSCRIÇÃO*
• *Código:* ${reg.registrationNumber}
• *Responsável:* ${reg.parentName}
• *Telefone:* ${reg.parentPhone}
• *Total Pago:* R$ ${reg.totalAmount.toFixed(2).replace('.', ',')} (R$ 50,00 por criança)
• *Status:* ✅ PAGO & CONFIRMADO

🧒 *Criança(s) Inscrita(s) (${reg.childrenCount}):*
${childrenList}

━━━━━━━━━━━━━━━━━━━━━
📍 *DETALHES DO EVENTO*
📅 *Data:* 17 de Outubro (Sábado)
⏰ *Horário:* 08:00 às 11:30 da manhã (Início pontual às 8h)
🏠 *Local:* Espaço Educacional Vem Brincar
📌 *Endereço:* Rua Visconde de Nitério, 85 - Pitimbu, Natal/RN
🎨 *Atividades:* Recreação lúdica especial, brincadeiras pedagógicas e a nossa exclusiva *Oficina Pedagógica de Scrapbook*!
✂️ *Materiais:* Todos 100% inclusos e a criança leva sua lembrança para casa!

━━━━━━━━━━━━━━━━━━━━━
💬 *Dúvidas e Atendimento:*
Estamos à disposição pelo telefone/WhatsApp: *(84) 98108-1186*
Instagram: *${EVENT_INFO.instagram}*

Nos vemos no dia 17/10 para uma manhã de pura diversão e memórias inesquecíveis! 🎈✨`
  );
}

/**
 * Generates the WhatsApp URL to open WhatsApp with the parent's number and the message ready.
 */
export function buildAdminSendConfirmationUrl(reg: Registration): string {
  const cleanPhone = reg.parentPhone.replace(/\D/g, '');
  // Format international BR prefix 55 if not present
  const destinationPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  const message = buildParentConfirmationMessage(reg);
  return `https://wa.me/${destinationPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Message parents send when submitting the form to notify the venue:
 */
export function buildParentSubmitWhatsAppUrl(reg: Registration): string {
  const childrenNames = reg.children.map(c => `• *${c.fullName}* (${c.age} anos)`).join('\n');
  
  const text = 
`🎈 *Olá Vem Brincar! Fiz a pré-inscrição para a Festa de Aniversário!* 🎈

📄 *Código:* ${reg.registrationNumber}
👤 *Responsável:* ${reg.parentName}
📱 *Telefone:* ${reg.parentPhone}

🧒 *Criança(s) (${reg.childrenCount}):*
${childrenNames}

💰 *Valor:* R$ ${reg.totalAmount.toFixed(2).replace('.', ',')}
📍 *Local:* Rua Visconde de Nitério, 85 - Pitimbu, Natal/RN
🗓️ *Data:* 17/10 às 08h

Estou enviando o comprovante do pagamento Pix para a confirmação final da nossa vaga! 🎉`;

  return `https://wa.me/${EVENT_INFO.whatsappRaw}?text=${encodeURIComponent(text)}`;
}

/**
 * Direct inquiry link
 */
export function buildDirectContactWhatsAppUrl(customMessage?: string): string {
  const text = customMessage || `Olá Vem Brincar! Gostaria de tirar uma dúvida sobre o evento de aniversário do dia 17/10 no Pitimbu.`;
  return `https://wa.me/${EVENT_INFO.whatsappRaw}?text=${encodeURIComponent(text)}`;
}
