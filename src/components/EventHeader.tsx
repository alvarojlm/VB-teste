import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, Scissors, Users, HeartHandshake, Smile, Star, PartyPopper } from 'lucide-react';
import { EVENT_INFO } from '../types';

interface EventHeaderProps {
  onRegisterClick: () => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({ onRegisterClick }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-100/80 via-orange-50 to-sky-50/70 pb-16 pt-6">
      {/* Decorative playful floating shapes and balloons */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-amber-300/40 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />
        <div className="absolute bottom-4 left-1/3 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl" />
        
        {/* Whimsical floating emojis and stickers */}
        <span className="animate-float absolute left-6 top-16 select-none text-4xl drop-shadow-sm">🎈</span>
        <span className="animate-float-reverse absolute right-8 top-20 select-none text-4xl drop-shadow-sm">🎨</span>
        <span className="animate-float absolute right-1/4 bottom-10 select-none text-3xl drop-shadow-sm">✂️</span>
        <span className="animate-float-reverse absolute left-1/6 bottom-12 select-none text-3xl drop-shadow-sm">⭐</span>
        <span className="animate-float absolute left-2/3 top-10 select-none text-3xl drop-shadow-sm">🍭</span>
        <span className="animate-float-reverse absolute left-12 bottom-1/3 select-none text-3xl drop-shadow-sm">🎂</span>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        {/* Top bar with venue branding */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-amber-200/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-lg shadow-amber-200 ring-4 ring-white">
              <span className="font-heading text-2xl font-black text-amber-950">VB</span>
              <span className="absolute -top-1 -right-1 text-sm">✨</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading text-xl font-extrabold text-amber-950 tracking-tight">
                  Espaço Educacional Vem Brincar
                </span>
                <span className="rounded-full bg-amber-200/90 px-2.5 py-0.5 text-xs font-black text-amber-900 shadow-2xs">
                  Pitimbu • Natal/RN
                </span>
              </div>
              <p className="text-xs text-amber-800 font-semibold">
                Contraturno escolar, recreação infantil e desenvolvimento pedagógico
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 bg-white/90 px-3.5 py-2 rounded-2xl border border-emerald-300 shadow-sm backdrop-blur-xs">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span>Inscrições Abertas • Vagas Limitadas</span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 shadow-sm border-2 border-amber-300 text-xs sm:text-sm font-black text-amber-900 mb-4 animate-bounce">
            <PartyPopper className="h-4 w-4 text-orange-500" />
            <span>Grande Festa de 1º Aniversário & Dia das Crianças</span>
            <PartyPopper className="h-4 w-4 text-orange-500" />
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Venha celebrar conosco no <br />
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent underline decoration-wavy decoration-yellow-400">
              Vem Brincar!
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
            Uma manhã mágica de recreação, brincadeiras coletivas e nossa exclusiva 
            <strong className="text-amber-800 font-extrabold"> Oficina Pedagógica de Scrapbook</strong> para seu pequeno criar memórias e levar sua própria obra de arte para casa!
          </p>

          {/* Key Event Badges */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-left">
            <div className="flex items-start gap-3.5 rounded-3xl bg-white/95 p-4.5 border-2 border-amber-200/90 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-2xs">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Data do Evento</p>
                <p className="font-heading font-bold text-slate-800 text-sm">{EVENT_INFO.dateFormatted}</p>
                <p className="text-[11px] text-orange-700 font-semibold">Mês das Crianças</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-3xl bg-white/95 p-4.5 border-2 border-amber-200/90 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-2xs">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Horário</p>
                <p className="font-heading font-bold text-slate-800 text-sm">{EVENT_INFO.time}</p>
                <p className="text-[11px] text-amber-700 font-bold">Início pontual às 8h!</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-3xl bg-white/95 p-4.5 border-2 border-amber-200/90 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-2xs">
                <Scissors className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Oficina Pedagógica</p>
                <p className="font-heading font-bold text-slate-800 text-sm">Arte Scrapbook</p>
                <p className="text-[11px] text-rose-600 font-bold">Materiais 100% inclusos</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-3xl bg-white/95 p-4.5 border-2 border-emerald-200/90 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-2xs">
                <span className="font-heading font-black text-xl">R$</span>
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Valor por Criança</p>
                <p className="font-heading font-black text-emerald-700 text-base">R$ 50,00</p>
                <p className="text-[11px] text-slate-500 font-medium">Pix + Confirmação WhatsApp</p>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onRegisterClick}
              className="inline-flex items-center gap-2.5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-8 py-4 font-heading text-lg font-black text-white shadow-xl shadow-orange-500/30 transition-all hover:scale-105 hover:shadow-orange-500/40 active:scale-95 cursor-pointer ring-4 ring-white"
            >
              <Sparkles className="h-5 w-5" />
              Quero Inscrever Minha Criança!
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-600">
            <MapPin className="h-4 w-4 text-rose-500" />
            <span>{EVENT_INFO.address}</span>
            <span className="text-slate-300">•</span>
            <span>WhatsApp Oficial: {EVENT_INFO.phoneWhatsapp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
