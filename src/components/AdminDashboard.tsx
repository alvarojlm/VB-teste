import React, { useState } from 'react';
import { 
  Users, CheckCircle2, Clock, XCircle, Search, Download, ExternalLink, 
  MessageSquare, Trash2, ArrowLeft, RefreshCw, AlertTriangle, Shield, Filter, 
  FileSpreadsheet, Eye, Send, Check, Copy
} from 'lucide-react';
import { Registration, PaymentStatus, EVENT_INFO } from '../types';
import { updateRegistrationStatus, deleteRegistration, exportRegistrationsToCSV } from '../utils/storage';
import { buildAdminSendConfirmationUrl, buildParentConfirmationMessage } from '../utils/whatsapp';
import { exportToGoogleSheets } from '../utils/googleWorkspace';

interface AdminDashboardProps {
  registrations: Registration[];
  onRefresh: () => void;
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  registrations,
  onRefresh,
  onBackToSite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [isExportingSheet, setIsExportingSheet] = useState(false);
  const [sheetSuccessUrl, setSheetSuccessUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // WhatsApp modal preview state
  const [whatsAppModalReg, setWhatsAppModalReg] = useState<Registration | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Statistics
  const totalRegistrations = registrations.length;
  const totalChildren = registrations.reduce((sum, r) => sum + r.childrenCount, 0);
  const confirmedCount = registrations.filter(r => r.paymentStatus === 'confirmed').length;
  const pendingCount = registrations.filter(r => r.paymentStatus === 'pending').length;
  const totalConfirmedAmount = registrations
    .filter(r => r.paymentStatus === 'confirmed')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  // Filtered
  const filtered = registrations.filter(item => {
    const matchesFilter = filterStatus === 'all' || item.paymentStatus === filterStatus;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      item.parentName.toLowerCase().includes(term) ||
      item.parentPhone.includes(term) ||
      item.registrationNumber.toLowerCase().includes(term) ||
      item.children.some(c => c.fullName.toLowerCase().includes(term));
    return matchesFilter && matchesSearch;
  });

  const handleConfirmPaymentAndPromptWhatsApp = (reg: Registration) => {
    updateRegistrationStatus(reg.id, 'confirmed');
    onRefresh();
    const updatedReg: Registration = {
      ...reg,
      paymentStatus: 'confirmed',
      paymentConfirmedAt: new Date().toISOString()
    };
    if (selectedReg && selectedReg.id === reg.id) {
      setSelectedReg(updatedReg);
    }
    // Automatically open WhatsApp confirmation dialog
    setWhatsAppModalReg(updatedReg);
  };

  const handleStatusChange = (id: string, newStatus: PaymentStatus) => {
    updateRegistrationStatus(id, newStatus);
    onRefresh();
    if (selectedReg && selectedReg.id === id) {
      setSelectedReg(prev => prev ? { ...prev, paymentStatus: newStatus } : null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de inscrição?')) {
      deleteRegistration(id);
      onRefresh();
      if (selectedReg?.id === id) setSelectedReg(null);
    }
  };

  const handleExportCSV = () => {
    exportRegistrationsToCSV(registrations);
  };

  const handleGoogleSheetsSync = async () => {
    try {
      setIsExportingSheet(true);
      setErrorMessage(null);
      const res = await exportToGoogleSheets(registrations);
      setSheetSuccessUrl(res.spreadsheetUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Falha ao sincronizar com Google Sheets');
    } finally {
      setIsExportingSheet(false);
    }
  };

  const handleCopyMessageText = (reg: Registration) => {
    const text = buildParentConfirmationMessage(reg);
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-sky-50/30 to-slate-50 pb-16">
      {/* Admin Nav */}
      <header className="sticky top-0 z-30 border-b border-amber-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao Site</span>
            </button>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 font-bold text-white shadow-xs">
                VB
              </div>
              <div>
                <h1 className="font-heading text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5">
                  Painel de Inscrições & WhatsApp
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-300">
                    Ativo: (84) 98108-1186
                  </span>
                </h1>
                <p className="text-[11px] text-slate-500">Coordenação Espaço Educacional Vem Brincar • Pitimbu</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="Baixar lista completa em arquivo CSV para Excel"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span> CSV
            </button>

            <button
              onClick={handleGoogleSheetsSync}
              disabled={isExportingSheet}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              title="Sincronizar e criar planilha ao vivo no Google Sheets"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isExportingSheet ? 'Sincronizando...' : 'Google Sheets'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        {/* Alerts / Success notification */}
        {sheetSuccessUrl && (
          <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs text-emerald-900">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>
                Planilha do Google Sheets gerada com sucesso com todos os inscritos e histórico!
              </span>
            </div>
            <a
              href={sheetSuccessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-white border border-emerald-300 px-3 py-1.5 rounded-xl hover:bg-emerald-100 shrink-0"
            >
              Abrir Planilha
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 flex items-center gap-2 text-xs text-rose-800">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* WhatsApp Dispatch Banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-xs">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold">
                  Sistema de Confirmação Automática por WhatsApp
                </h3>
                <p className="text-xs text-emerald-100 mt-0.5 max-w-2xl">
                  Ao clicar em <strong>"Confirmar Pagamento & Enviar WhatsApp"</strong>, o sistema gera o comprovante oficial personalizado e abre a conversa com o responsável direto pelo número oficial <strong>(84) 98108-1186</strong> com todos os detalhes de data, local e oficina!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
            <p className="text-xs font-bold uppercase text-slate-400">Total de Crianças</p>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">{totalChildren}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{totalRegistrations} famílias inscritas</p>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-emerald-200 shadow-xs">
            <p className="text-xs font-bold uppercase text-emerald-600">Vagas Confirmadas</p>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">{confirmedCount}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5">Pagamento conferido</p>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-amber-200 shadow-xs">
            <p className="text-xs font-bold uppercase text-amber-600">Aguardando Confirmação</p>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
            <p className="text-[11px] text-amber-700 mt-0.5">Comprovante Pix pendente</p>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
            <p className="text-xs font-bold uppercase text-slate-400">Receita Confirmada</p>
            <p className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">
              R$ {totalConfirmedAmount.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">R$ 50/criança confirmada</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por responsável, criança, telefone ou código..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs focus:bg-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Todos os Status ({registrations.length})</option>
              <option value="confirmed">Apenas Confirmados ({confirmedCount})</option>
              <option value="pending">Apenas Pendentes ({pendingCount})</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Responsável</th>
                  <th className="py-3 px-4">WhatsApp Pais</th>
                  <th className="py-3 px-4">Crianças Inscritas</th>
                  <th className="py-3 px-4">Valor Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações da Coordenação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Nenhuma inscrição encontrada com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filtered.map(reg => {
                    const hasAllergyWarning = reg.children.some(c => c.hasAllergies);
                    const hasSpecialNeeds = reg.children.some(c => !!c.specialNeedsOrHealthRestrictions);
                    const isConfirmed = reg.paymentStatus === 'confirmed';

                    return (
                      <tr key={reg.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-700">
                          {reg.registrationNumber}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          <div>{reg.parentName}</div>
                          {reg.parentEmail && <div className="text-[10px] text-slate-400">{reg.parentEmail}</div>}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {reg.parentPhone}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">
                            {reg.childrenCount} {reg.childrenCount === 1 ? 'criança' : 'crianças'}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {reg.children.map(c => `${c.fullName} (${c.age}a)`).join(', ')}
                          </div>
                          {(hasAllergyWarning || hasSpecialNeeds) && (
                            <div className="flex gap-1 mt-1">
                              {hasAllergyWarning && (
                                <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-700">
                                  Alergia!
                                </span>
                              )}
                              {hasSpecialNeeds && (
                                <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[9px] font-bold text-sky-700">
                                  Atenção Saúde
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          R$ {reg.totalAmount.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3.5 px-4">
                          {reg.paymentStatus === 'confirmed' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              Confirmado
                            </span>
                          ) : reg.paymentStatus === 'pending' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                              <Clock className="h-3.5 w-3.5 text-amber-600" />
                              Aguardando Pix
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                              <XCircle className="h-3.5 w-3.5 text-slate-500" />
                              Cancelado
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View details */}
                            <button
                              type="button"
                              onClick={() => setSelectedReg(reg)}
                              title="Ver ficha completa com detalhes de alergia e saúde"
                              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* Disptach WhatsApp Confirmation Message button */}
                            <button
                              type="button"
                              onClick={() => setWhatsAppModalReg(reg)}
                              title="Enviar confirmação oficial por WhatsApp"
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-1 text-[11px] font-bold hover:bg-emerald-100 cursor-pointer"
                            >
                              <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="hidden md:inline">WhatsApp</span>
                            </button>

                            {/* Confirm payment button with 1-click WhatsApp modal prompt */}
                            {!isConfirmed ? (
                              <button
                                type="button"
                                onClick={() => handleConfirmPaymentAndPromptWhatsApp(reg)}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
                              >
                                <Check className="h-3.5 w-3.5" />
                                Confirmar Pagamento
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(reg.id, 'pending')}
                                className="inline-flex items-center gap-1 rounded-lg bg-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-300 cursor-pointer"
                              >
                                Reverter
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDelete(reg.id)}
                              title="Excluir inscrição"
                              className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* WhatsApp Dispatch Confirmation Modal */}
      {whatsAppModalReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-emerald-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-800">
                    Enviar Confirmação via WhatsApp
                  </h3>
                  <p className="text-xs text-slate-500">
                    Disparo oficial para: <strong>{whatsAppModalReg.parentName}</strong> ({whatsAppModalReg.parentPhone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWhatsAppModalReg(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-3.5 text-xs text-emerald-900">
                <p className="font-bold flex items-center gap-1.5 mb-1 text-emerald-800">
                  <CheckCircle2 className="h-4 w-4" />
                  Número emissor do Vem Brincar: (84) 98108-1186
                </p>
                A mensagem abaixo foi gerada automaticamente com os detalhes das crianças, endereço completo, horários e orientações da oficina de scrapbook.
              </div>

              {/* Message preview container formatted like a chat bubble */}
              <div className="rounded-2xl bg-slate-900 text-slate-100 p-4 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto border border-slate-700 shadow-inner">
                {buildParentConfirmationMessage(whatsAppModalReg)}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleCopyMessageText(whatsAppModalReg)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      Texto Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-slate-500" />
                      Copiar Texto
                    </>
                  )}
                </button>

                <a
                  href={buildAdminSendConfirmationUrl(whatsAppModalReg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    // Also ensure payment is confirmed
                    if (whatsAppModalReg.paymentStatus !== 'confirmed') {
                      handleStatusChange(whatsAppModalReg.id, 'confirmed');
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-bold shadow-md shadow-emerald-600/30 transition-transform active:scale-95 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Abrir WhatsApp e Enviar Agora
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-amber-700">{selectedReg.registrationNumber}</span>
                <h3 className="font-heading text-xl font-bold text-slate-800">
                  Ficha de Inscrição: {selectedReg.parentName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-3.5">
                <div>
                  <p className="font-bold text-slate-500">WhatsApp dos Pais:</p>
                  <p className="text-slate-800 font-semibold">{selectedReg.parentPhone}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-500">Status Atual:</p>
                  <p className={`font-bold ${selectedReg.paymentStatus === 'confirmed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {selectedReg.paymentStatus === 'confirmed' ? 'PAGO & CONFIRMADO' : 'PENDENTE DE CONFIRMAÇÃO'}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-500">Data de Submissão:</p>
                  <p className="text-slate-700">{new Date(selectedReg.createdAt).toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-500">Valor Total a Cobrar:</p>
                  <p className="font-bold text-emerald-700">R$ {selectedReg.totalAmount.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <h4 className="font-heading text-sm font-bold text-slate-800 mb-3">
                  Crianças Associadas ({selectedReg.childrenCount})
                </h4>

                <div className="space-y-3">
                  {selectedReg.children.map((child, i) => (
                    <div key={child.id} className="rounded-xl border border-amber-200/70 bg-amber-50/30 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-heading font-bold text-sm text-slate-800">
                          #{i + 1} {child.fullName}
                        </p>
                        <span className="rounded-full bg-amber-200 px-2.5 py-0.5 font-bold text-[10px] text-amber-900">
                          {child.age} anos
                        </span>
                      </div>

                      <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-white p-2.5 border border-slate-100">
                          <p className="font-bold text-rose-700 flex items-center gap-1">
                            Alergias Alimentares:
                          </p>
                          <p className="text-slate-700 mt-1">
                            {child.hasAllergies ? child.allergyDetails : 'Nenhuma alergia relatada.'}
                          </p>
                        </div>

                        <div className="rounded-lg bg-white p-2.5 border border-slate-100">
                          <p className="font-bold text-sky-800 flex items-center gap-1">
                            Saúde, Transtornos e Observações:
                          </p>
                          <p className="text-slate-700 mt-1">
                            {child.specialNeedsOrHealthRestrictions || 'Nenhuma observação informada.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Action in Modal */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setWhatsAppModalReg(selectedReg)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 font-bold cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  Abrir Confirmação WhatsApp
                </button>

                <div className="flex items-center gap-2">
                  {selectedReg.paymentStatus !== 'confirmed' ? (
                    <button
                      onClick={() => handleConfirmPaymentAndPromptWhatsApp(selectedReg)}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 font-bold cursor-pointer"
                    >
                      Confirmar Pix & Enviar Msg
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(selectedReg.id, 'pending')}
                      className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 font-bold cursor-pointer"
                    >
                      Marcar como Pendente
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
