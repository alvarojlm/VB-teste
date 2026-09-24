import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, Copy, Check, Clock, MapPin, Calendar, ArrowRight, UserCheck, HeartHandshake } from 'lucide-react';
import { EVENT_INFO, Registration } from '../types';
import { buildParentSubmitWhatsAppUrl } from '../utils/whatsapp';

interface RegistrationSuccessModalProps {
  registration: Registration;
  onClose: () => void;
  onOpenAdmin: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  registration,
  onClose,
  onOpenAdmin,
}) => {
  const [copiedPix, setCopiedPix] = useState(false);

  React.useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#f97316', '#a855f7'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(EVENT_INFO.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const whatsappUrl = buildParentSubmitWhatsAppUrl(registration);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-8 shadow-2xl border-2 border-amber-200">
        
        {/* Header Badge */}
        <div className="text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 shadow-md shadow-emerald-100 mb-3">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-800">
            Oba! Pré-Inscrição Realizada! 🎈
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Código do Registro: <span className="font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-lg border border-amber-300 font-mono">{registration.registrationNumber}</span>
          </p>
        </div>

        {/* 2-Step Clarification Banner */}
        <div className="mt-5 rounded-2xl bg-amber-50 border-2 border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-black text-xs mt-0.5">
              !
            </div>
            <div className="text-xs text-amber-950 leading-relaxed">
              <strong className="block text-sm font-heading font-bold text-amber-950 mb-0.5">
                Segunda Confirmação Obrigatória:
              </strong>
              Para assegurar a vaga oficial da(s) criança(s), realize o pagamento Pix no valor de <strong className="font-bold text-emerald-700">R$ {registration.totalAmount.toFixed(2).replace('.', ',')}</strong> e envie o comprovante diretamente para o WhatsApp oficial <strong>(84) 98108-1186</strong>. Nossa coordenação validará e enviará a confirmação formal!
            </div>
          </div>
        </div>

        {/* Summary of Registered Kids */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs">
          <p className="font-extrabold text-slate-700 mb-2 uppercase tracking-wide text-[11px]">Resumo da Inscrição:</p>
          <div className="space-y-1 text-slate-700">
            <p><strong>Responsável:</strong> {registration.parentName} ({registration.parentPhone})</p>
            <p className="mt-1"><strong>Criança(s) Inscrita(s) ({registration.childrenCount}):</strong></p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {registration.children.map(child => (
                <li key={child.id} className="text-slate-800">
                  <span className="font-bold">{child.fullName}</span> ({child.age} anos)
                  {child.hasAllergies && <span className="ml-1 text-rose-600 font-bold">• Alergia: {child.allergyDetails}</span>}
                  {child.specialNeedsOrHealthRestrictions && (
                    <span className="ml-1 text-sky-700 font-medium">• Obs: {child.specialNeedsOrHealthRestrictions}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pix Box */}
        <div className="mt-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-emerald-800">Chave Pix para Pagamento</p>
              <p className="font-mono text-lg font-black text-slate-900 mt-0.5 select-all">{EVENT_INFO.pixKey}</p>
              <p className="text-xs text-slate-600 font-medium">Tipo: {EVENT_INFO.pixKeyType} • Favorecido: {EVENT_INFO.pixReceiver}</p>
            </div>

            <button
              type="button"
              onClick={handleCopyPix}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-emerald-300 px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-xs hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              {copiedPix ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  Chave Copiada!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-emerald-600" />
                  Copiar Chave Pix
                </>
              )}
            </button>
          </div>
          <div className="mt-3 border-t border-emerald-200/60 pt-3 flex justify-between items-center text-xs">
            <span className="text-slate-700 font-medium">Valor Total ({registration.childrenCount}x R$ 50,00):</span>
            <span className="font-heading text-lg font-black text-emerald-700">R$ {registration.totalAmount.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        {/* WhatsApp Direct Confirmation Button */}
        <div className="mt-6 space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-heading font-black text-base py-4 px-6 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
          >
            <MessageCircle className="h-5 w-5" />
            Enviar Comprovante pelo WhatsApp Oficial (84) 98108-1186
          </a>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs">
            <button
              type="button"
              onClick={onClose}
              className="font-bold text-slate-500 hover:text-slate-800 p-2 cursor-pointer"
            >
              Concluir e Voltar à Página Principal
            </button>

            <button
              type="button"
              onClick={onOpenAdmin}
              className="font-bold text-amber-800 hover:text-amber-900 p-2 flex items-center gap-1 cursor-pointer underline"
            >
              <UserCheck className="h-4 w-4" />
              Sou da Coordenação (Painel de Gestão)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
