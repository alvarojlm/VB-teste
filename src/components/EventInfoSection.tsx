import React, { useState } from 'react';
import { 
  Sparkles, Palette, Scissors, ShieldCheck, Heart, MapPin, 
  Phone, Instagram, Clock, Calendar, CheckCircle2, AlertCircle, HelpCircle, ChevronDown, ChevronUp,
  Smile, Award, Gift
} from 'lucide-react';
import { EVENT_INFO } from '../types';
import { buildDirectContactWhatsAppUrl } from '../utils/whatsapp';

export const EventInfoSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Como funciona a confirmação pelo WhatsApp e validação do pagamento?',
      a: 'Após preencher o formulário no site, a inscrição fica pré-reservada. Você envia o comprovante de pagamento Pix (R$ 50,00 por criança) para o WhatsApp oficial da escola (84) 98108-1186. Nossa coordenação confere o comprovante e envia automaticamente a mensagem oficial de confirmação com a vaga assegurada e todas as orientações do evento.'
    },
    {
      q: 'O que está incluso na oficina pedagógica de scrapbook?',
      a: 'Todo o material de papelaria educativa, papéis coloridos especiais, fitas decorativas, adesivos, colas atóxicas, tesouras ergonômicas sem ponta e orientação individual dos nossos educadores. A criança confecciona sua própria peça artesanal e leva de recordação para casa!'
    },
    {
      q: 'Como é o espaço e o acolhimento para crianças com alergias ou necessidades específicas?',
      a: 'O Espaço Vem Brincar conta com profissionais capacitados e ambiente acolhedor. No formulário mapeamos restrições alimentares e condições de neurodesenvolvimento (como TEA e TDAH) para garantir uma recepção com respeito aos estímulos sonoros e atenção individualizada.'
    },
    {
      q: 'Qual o endereço e ponto de referência no bairro Pitimbu?',
      a: 'Rua Visconde de Nitério, 85, no bairro Pitimbu em Natal/RN. É uma rua tranquila, de fácil acesso e estacionamento com total segurança para as famílias.'
    }
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      {/* 3 Playful Feature Pillars */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white p-6 text-center shadow-sm hover:-translate-y-1 transition-transform">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-amber-950 shadow-md shadow-amber-200 mb-4 text-3xl">
            ✂️
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-black text-amber-900 uppercase tracking-wider">
            Oficina Especial
          </span>
          <h3 className="font-heading text-xl font-black text-slate-800 mt-2">Scrapbook Criativo</h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Estímulo à motricidade fina, concentração e autonomia infantil através da arte manual de recordações.
          </p>
        </div>

        <div className="rounded-3xl border-2 border-orange-200 bg-gradient-to-b from-orange-50 to-white p-6 text-center shadow-sm hover:-translate-y-1 transition-transform">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-400 text-orange-950 shadow-md shadow-orange-200 mb-4 text-3xl">
            🎈
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-[11px] font-black text-orange-900 uppercase tracking-wider">
            Dia das Crianças
          </span>
          <h3 className="font-heading text-xl font-black text-slate-800 mt-2">Recreação & Jogos</h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Dinâmicas coletivas lúdicas, momentos de risadas e comemoração do 1º ano de atividades do Vem Brincar.
          </p>
        </div>

        <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-6 text-center shadow-sm hover:-translate-y-1 transition-transform">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400 text-emerald-950 shadow-md shadow-emerald-200 mb-4 text-3xl">
            💛
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-900 uppercase tracking-wider">
            Cuidado Integral
          </span>
          <h3 className="font-heading text-xl font-black text-slate-800 mt-2">Atenção Individualizada</h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Ambiente seguro, triagem de alergias e preparo para acolher com amor crianças com TEA, TDAH e restrições.
          </p>
        </div>
      </div>

      {/* Location and Venue Card */}
      <div className="rounded-3xl border-2 border-amber-200/80 bg-white p-6 sm:p-8 shadow-sm mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
              Sobre Nosso Espaço
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Espaço Educacional Vem Brincar
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Especialistas em contraturno escolar, apoio pedagógico e recreação acolhedora no bairro Pitimbu, Natal/RN. Proporcionamos um ambiente alegre e seguro onde as crianças se desenvolvem brincando!
            </p>

            <div className="mt-5 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                <span><strong>Endereço:</strong> {EVENT_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-amber-600 shrink-0" />
                <span><strong>Data do Evento:</strong> {EVENT_INFO.dateFormatted}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-sky-600 shrink-0" />
                <span><strong>Horário:</strong> {EVENT_INFO.time} (Início às 8h em ponto)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                <span><strong>WhatsApp Oficial:</strong> {EVENT_INFO.phoneWhatsapp}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Instagram className="h-4 w-4 text-pink-600 shrink-0" />
                <span><strong>Instagram:</strong> {EVENT_INFO.instagram}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={buildDirectContactWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
              >
                <Phone className="h-4 w-4" />
                Dúvidas no WhatsApp (84) 98108-1186
              </a>
              <a
                href={`https://instagram.com/${EVENT_INFO.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-3 text-xs font-bold transition-colors"
              >
                <Instagram className="h-4 w-4 text-pink-500" />
                Ver Fotos no Instagram
              </a>
            </div>
          </div>

          {/* Interactive Visual Map & Mascot Card */}
          <div className="rounded-3xl border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 flex flex-col justify-center items-center text-center">
            <div className="relative mb-3">
              <div className="h-20 w-20 rounded-3xl bg-amber-400 flex items-center justify-center text-4xl shadow-md shadow-amber-200">
                🎈
              </div>
              <span className="absolute -bottom-1 -right-1 text-2xl">⭐</span>
            </div>
            <h4 className="font-heading text-lg font-black text-amber-950">Vem Brincar no Pitimbu</h4>
            <p className="text-xs text-amber-900/80 mt-1 max-w-xs leading-relaxed">
              Rua Visconde de Nitério, 85 - Pitimbu, Natal - RN
            </p>
            <div className="mt-4 rounded-2xl bg-white p-3.5 border border-amber-200 text-[11px] text-slate-600 shadow-xs max-w-xs">
              🏡 Ambiente climatizado, espaçoso e com monitoria contínua de recreadores para que as famílias participem com total tranquilidade.
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-800">
            Dúvidas frequentes
          </span>
          <h2 className="font-heading text-2xl font-black text-slate-800 mt-2">
            Perguntas & Respostas
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-heading font-bold text-xs sm:text-sm text-slate-800 hover:text-amber-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="h-4 w-4 text-amber-500 shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
