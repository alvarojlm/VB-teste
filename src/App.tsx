import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, MessageCircle, Heart, Phone, ArrowUp } from 'lucide-react';
import { EventHeader } from './components/EventHeader';
import { RegistrationForm } from './components/RegistrationForm';
import { RegistrationSuccessModal } from './components/RegistrationSuccessModal';
import { AdminDashboard } from './components/AdminDashboard';
import { EventInfoSection } from './components/EventInfoSection';
import { EVENT_INFO, Registration } from './types';
import { getStoredRegistrations } from './utils/storage';
import { buildDirectContactWhatsAppUrl } from './utils/whatsapp';

export default function App() {
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [successfulRegistration, setSuccessfulRegistration] = useState<Registration | null>(null);

  const loadData = () => {
    setRegistrations(getStoredRegistrations());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegistrationSuccess = (reg: Registration) => {
    setSuccessfulRegistration(reg);
    loadData();
  };

  const scrollToForm = () => {
    const el = document.getElementById('formulario-inscricao');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (view === 'admin') {
    return (
      <AdminDashboard
        registrations={registrations}
        onRefresh={loadData}
        onBackToSite={() => setView('public')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-amber-200 selection:text-amber-900">
      {/* Top Notice Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 py-1.5 px-4 text-center text-xs font-bold text-white shadow-xs">
        <span className="inline-flex items-center gap-1.5">
          <span>✨ 17 de Outubro (08h) • Aniversário Vem Brincar & Dia das Crianças</span>
          <span className="hidden sm:inline">• Oficina de Scrapbook + Recreação</span>
        </span>
      </div>

      {/* Main Header / Hero */}
      <EventHeader onRegisterClick={scrollToForm} />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {/* Registration Section */}
        <section id="formulario-inscricao" className="pt-8 pb-12 px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center mb-8">
            <span className="rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-900 border border-amber-200/80">
              Formulário Oficial de Inscrição
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-800 mt-2">
              Garanta a vaga da sua criança
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
              Preencha os dados dos responsáveis e das crianças. Você pode inscrever mais de um participante na mesma ficha!
            </p>
          </div>

          <RegistrationForm onSuccess={handleRegistrationSuccess} />
        </section>

        {/* Detailed Event Information & Pedagogy */}
        <EventInfoSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/70 bg-amber-50/50 py-10 px-4 sm:px-6 text-center text-xs text-slate-600">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 font-bold text-white">
              VB
            </div>
            <span className="font-heading text-base font-bold text-slate-800">
              Espaço Educacional Vem Brincar
            </span>
          </div>

          <p className="text-slate-500 max-w-md mx-auto">
            {EVENT_INFO.address} • Contato:{' '}
            <a
              href={`tel:${EVENT_INFO.whatsappRaw}`}
              className="font-bold text-slate-700 hover:text-amber-600 underline"
            >
              {EVENT_INFO.phoneWhatsapp}
            </a>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold pt-2 text-slate-600">
            <a
              href={`https://instagram.com/${EVENT_INFO.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-600 transition-colors"
            >
              Instagram: {EVENT_INFO.instagram}
            </a>
            <span>•</span>
            <button
              onClick={() => setView('admin')}
              className="inline-flex items-center gap-1 font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
            >
              <Shield className="h-3.5 w-3.5" />
              Acesso à Coordenação / Painel Admin
            </button>
          </div>

          <p className="text-[11px] text-slate-400 pt-2">
            © {new Date().getFullYear()} Vem Brincar Espaço Educacional - Natal/RN. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <a
        href={buildDirectContactWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        title="Dúvidas? Fale conosco no WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {/* Success Modal */}
      {successfulRegistration && (
        <RegistrationSuccessModal
          registration={successfulRegistration}
          onClose={() => setSuccessfulRegistration(null)}
          onOpenAdmin={() => {
            setSuccessfulRegistration(null);
            setView('admin');
          }}
        />
      )}
    </div>
  );
}
