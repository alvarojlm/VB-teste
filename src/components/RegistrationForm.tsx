import React, { useState } from 'react';
import { Plus, Trash2, Heart, AlertCircle, ShieldAlert, Sparkles, User, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { ChildParticipant, EVENT_INFO, Registration } from '../types';
import { addRegistration } from '../utils/storage';

interface RegistrationFormProps {
  onSuccess: (registration: Registration) => void;
}

const emptyChild: () => ChildParticipant = () => ({
  id: 'c_' + Math.random().toString(36).substring(2, 9),
  fullName: '',
  age: '',
  hasAllergies: false,
  allergyDetails: '',
  specialNeedsOrHealthRestrictions: '',
});

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  
  const [children, setChildren] = useState<ChildParticipant[]>([emptyChild()]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhoneNumber = (value: string) => {
    // Only numbers
    const clean = value.replace(/\D/g, '').slice(0, 11);
    if (clean.length <= 2) return clean ? `(${clean}` : '';
    if (clean.length <= 7) return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentPhone(formatPhoneNumber(e.target.value));
  };

  const handleAddChild = () => {
    if (children.length >= 6) {
      alert('Para inscrever mais de 6 crianças, favor entrar em contato diretamente pelo nosso WhatsApp!');
      return;
    }
    setChildren(prev => [...prev, emptyChild()]);
  };

  const handleRemoveChild = (index: number) => {
    if (children.length <= 1) return;
    setChildren(prev => prev.filter((_, i) => i !== index));
  };

  const handleChildChange = (index: number, field: keyof ChildParticipant, value: any) => {
    setChildren(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!parentName.trim() || parentName.trim().length < 3) {
      newErrors.parentName = 'Por favor, informe o nome completo do responsável.';
    }

    const cleanPhone = parentPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      newErrors.parentPhone = 'Informe um telefone com DDD válido para contato e confirmação.';
    }

    children.forEach((child, idx) => {
      if (!child.fullName.trim() || child.fullName.trim().length < 2) {
        newErrors[`child_${idx}_name`] = `Informe o nome da criança ${idx + 1}.`;
      }
      const numAge = Number(child.age);
      if (!child.age || isNaN(numAge) || numAge < 1 || numAge > 17) {
        newErrors[`child_${idx}_age`] = `Informe uma idade válida (1 a 16 anos).`;
      }
      if (child.hasAllergies && !child.allergyDetails.trim()) {
        newErrors[`child_${idx}_allergies`] = `Por favor, especifique a qual alimento ou substância a criança tem alergia.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // scroll to first error
      const firstErrorEl = document.querySelector('[data-error="true"]');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const newReg = addRegistration({
        parentName: parentName.trim(),
        parentPhone: parentPhone.trim(),
        parentEmail: parentEmail.trim() || undefined,
        childrenCount: children.length,
        children: children.map(c => ({
          ...c,
          age: Number(c.age),
          fullName: c.fullName.trim(),
          allergyDetails: c.hasAllergies ? c.allergyDetails.trim() : '',
          specialNeedsOrHealthRestrictions: c.specialNeedsOrHealthRestrictions.trim()
        }))
      });

      onSuccess(newReg);
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao salvar sua inscrição. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCalculated = children.length * EVENT_INFO.pricePerChild;

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-8">
      {/* Step 1: Parent Information */}
      <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 font-bold">
            1
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-800">Dados do Responsável Legal</h2>
            <p className="text-xs text-slate-500">Pai, mãe ou responsável que acompanhará e receberá a confirmação</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Nome Completo do Responsável <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={parentName}
                onChange={e => setParentName(e.target.value)}
                placeholder="Ex: Maria Luiza Medeiros"
                data-error={!!errors.parentName}
                className={`w-full rounded-2xl border bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-800 transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.parentName
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-amber-500 focus:ring-amber-200'
                }`}
              />
            </div>
            {errors.parentName && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.parentName}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              WhatsApp para Contato & Confirmação <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-600">
                <Phone className="h-4 w-4" />
              </div>
              <input
                type="tel"
                value={parentPhone}
                onChange={handlePhoneChange}
                placeholder="(84) 98888-0000"
                data-error={!!errors.parentPhone}
                className={`w-full rounded-2xl border bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-800 transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.parentPhone
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-200'
                }`}
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">É por este número que faremos a validação do Pix e avisos</p>
            {errors.parentPhone && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.parentPhone}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              E-mail de Contato <span className="text-xs font-normal text-slate-400">(opcional)</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={parentEmail}
                onChange={e => setParentEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-800 transition-colors focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">Para envio do comprovante formal da inscrição</p>
          </div>
        </div>
      </div>

      {/* Step 2: Children Information */}
      <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-800 font-bold">
              2
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-slate-800">Crianças Participantes</h2>
              <p className="text-xs text-slate-500">
                Quantas crianças irão participar? Preencha os dados e informações de saúde com atenção.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-1.5 border border-amber-200">
            <span className="text-xs font-bold text-amber-900">Total:</span>
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-extrabold text-white">
              {children.length} {children.length === 1 ? 'criança' : 'crianças'}
            </span>
          </div>
        </div>

        {/* Children Cards list */}
        <div className="mt-6 space-y-6">
          {children.map((child, index) => (
            <div
              key={child.id}
              className="relative rounded-2xl border-2 border-dashed border-amber-200 bg-gradient-to-b from-amber-50/30 to-white p-5 sm:p-6 transition-all hover:border-amber-300"
            >
              <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 font-bold text-xs text-white shadow-xs">
                    #{index + 1}
                  </span>
                  <span className="font-heading font-bold text-amber-950 text-base">
                    {child.fullName ? child.fullName : `Criança ${index + 1}`}
                  </span>
                </div>

                {children.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveChild(index)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Remover</span>
                  </button>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo da Criança <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={child.fullName}
                    onChange={e => handleChildChange(index, 'fullName', e.target.value)}
                    placeholder="Ex: Theo Medeiros"
                    data-error={!!errors[`child_${index}_name`]}
                    className={`w-full rounded-xl border bg-white py-2.5 px-3.5 text-sm text-slate-800 transition-colors focus:outline-none focus:ring-2 ${
                      errors[`child_${index}_name`]
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-amber-500 focus:ring-amber-200'
                    }`}
                  />
                  {errors[`child_${index}_name`] && (
                    <p className="mt-1 text-xs text-rose-500">{errors[`child_${index}_name`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Idade <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={child.age}
                    onChange={e => handleChildChange(index, 'age', e.target.value)}
                    placeholder="Ex: 5"
                    data-error={!!errors[`child_${index}_age`]}
                    className={`w-full rounded-xl border bg-white py-2.5 px-3.5 text-sm text-slate-800 transition-colors focus:outline-none focus:ring-2 ${
                      errors[`child_${index}_age`]
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-amber-500 focus:ring-amber-200'
                    }`}
                  />
                  {errors[`child_${index}_age`] && (
                    <p className="mt-1 text-xs text-rose-500">{errors[`child_${index}_age`]}</p>
                  )}
                </div>

                {/* Health & Dietary Safeguards */}
                <div className="sm:col-span-3 rounded-2xl bg-amber-50/70 p-4 border border-amber-200/60 space-y-4">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={child.hasAllergies}
                        onChange={e => handleChildChange(index, 'hasAllergies', e.target.checked)}
                        className="h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        Possui alergias alimentares ou medicamentosas?
                      </span>
                    </label>

                    {child.hasAllergies && (
                      <div className="mt-2.5">
                        <input
                          type="text"
                          value={child.allergyDetails}
                          onChange={e => handleChildChange(index, 'allergyDetails', e.target.value)}
                          placeholder="Informe detalhadamente: Ex: amendoim, glúten, leite, picada de abelha, corante..."
                          data-error={!!errors[`child_${index}_allergies`]}
                          className={`w-full rounded-xl border bg-white py-2.5 px-3.5 text-xs text-slate-800 transition-colors focus:outline-none focus:ring-2 ${
                            errors[`child_${index}_allergies`]
                              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                              : 'border-amber-300 focus:border-amber-500 focus:ring-amber-200'
                          }`}
                        />
                        {errors[`child_${index}_allergies`] && (
                          <p className="mt-1 text-xs text-rose-500">{errors[`child_${index}_allergies`]}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-sky-600" />
                      Restrições de saúde, transtornos ou observações essenciais:
                    </label>
                    <textarea
                      rows={2}
                      value={child.specialNeedsOrHealthRestrictions}
                      onChange={e => handleChildChange(index, 'specialNeedsOrHealthRestrictions', e.target.value)}
                      placeholder="Ex: Diagnóstico de TEA (sensibilidade a barulho), TDAH, asma, uso de medicação no horário, etc. Deixe em branco se não houver."
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    />
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Nossos educadores e recreadores usam essas informações para acolher e cuidar de cada participante com segurança.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add more children button */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleAddChild}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 px-5 py-3 font-heading text-sm font-bold text-amber-900 transition-all hover:bg-amber-100 hover:border-amber-400 cursor-pointer active:scale-95"
            >
              <Plus className="h-4 w-4 text-amber-600" />
              Inscrever Mais Uma Criança (Irmão/Amiguinho)
            </button>
          </div>
        </div>
      </div>

      {/* Step 3: Payment Breakdown & Rules */}
      <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold">
            3
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-800">Confirmação de Pagamento e Vaga</h2>
            <p className="text-xs text-slate-500">Entenda a regra de confirmação em duas etapas</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-amber-50/70 p-5 border border-amber-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-600">Investimento por Criança: <span className="font-bold text-slate-800">R$ 50,00</span></p>
              <p className="text-xs font-semibold text-slate-600 mt-1">Quantidade de Crianças: <span className="font-bold text-slate-800">{children.length}</span></p>
              <p className="font-heading text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Total a Pagar: <span className="text-emerald-600">R$ {totalCalculated.toFixed(2).replace('.', ',')}</span>
              </p>
            </div>

            <div className="sm:max-w-xs text-xs text-amber-900/90 bg-white/90 p-3.5 rounded-xl border border-amber-200/80 shadow-xs">
              <p className="font-bold mb-1 flex items-center gap-1 text-amber-800">
                <CheckCircle2 className="h-4 w-4 text-amber-600" />
                Segunda Confirmação Obrigatória:
              </p>
              Após submeter este formulário, você será direcionado para realizar o Pix e enviar o comprovante no WhatsApp do Vem Brincar. Nossa equipe validará o recebimento para garantir a vaga oficial!
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-4 px-6 font-heading text-lg font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01] hover:shadow-emerald-600/40 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Processando inscrição...</span>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Concluir Inscrição e Abrir Confirmação do Pix
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
