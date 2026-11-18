import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bot,
  X,
  Send,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Workflow,
  Clock,
  Cpu,
  User,
  Building2,
  Phone,
  MapPin,
  ChevronRight,
  Loader2
} from 'lucide-react';

type ConsultorStep = 'objetivo' | 'escopo' | 'contato' | 'resumo';

interface ConsultorFunnelData {
  objetivo?: string;
  escopo?: string;
  prazo?: string;
  nome?: string;
  empresa?: string;
  whatsapp?: string;
  cidade?: string;
}

interface QuickOption {
  label: string;
  value: string;
}

interface SuggestedAction {
  label: string;
  path?: string;
  url?: string;
}

interface StrategicSummary {
  objetivo: string;
  escopo: string;
  contato: string;
  whatsapp: string;
  cidade?: string;
  arquiteturaSugerida: string;
  prazoEstimado: string;
  proximosPassos: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  quickOptions?: QuickOption[];
  strategicSummary?: StrategicSummary | null;
  suggestedActions?: SuggestedAction[];
  engine?: 'n8n-vps' | 'local-funnel-fallback';
  timestamp: string;
}

const INITIAL_QUICK_OPTIONS: QuickOption[] = [
  { label: 'Preciso de um site', value: 'Preciso de um site institucional profissional' },
  { label: 'Quero um sistema', value: 'Quero um sistema web sob medida' },
  { label: 'Melhorar fluxo existente', value: 'Quero melhorar um fluxo existente' },
  { label: 'Explorar possibilidades', value: 'Quero explorar possibilidades' }
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome-consultor',
  role: 'assistant',
  content:
    'Olá! Sou o **Consultor Virtual da Oz Digital**.\n\nVamos estruturar o escopo do seu projeto em menos de 1 minuto para gerar um **Resumo Estratégico** personalizado.\n\n**O que você precisa resolver hoje?**',
  quickOptions: INITIAL_QUICK_OPTIONS,
  strategicSummary: null,
  suggestedActions: [],
  timestamp: new Date().toISOString()
};

const STEP_META: { id: ConsultorStep; label: string; number: number }[] = [
  { id: 'objetivo', label: 'Objetivo', number: 1 },
  { id: 'escopo', label: 'Escopo', number: 2 },
  { id: 'contato', label: 'Contato', number: 3 },
  { id: 'resumo', label: 'Resumo', number: 4 }
];

function createSessionId() {
  return `consultor-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function ConsultorVirtualWidget() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => createSessionId());
  const [currentStep, setCurrentStep] = useState<ConsultorStep>('objetivo');
  const [funnelData, setFunnelData] = useState<ConsultorFunnelData>({});
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeEngine, setActiveEngine] = useState<'n8n-vps' | 'local-funnel-fallback'>('local-funnel-fallback');

  // Inline contact capture form fields for step 3
  const [contactForm, setContactForm] = useState({
    nome: '',
    empresa: '',
    whatsapp: '',
    cidade: ''
  });
  const [contactError, setContactError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({
    sessionId,
    currentStep,
    funnelData,
    messages
  });

  useEffect(() => {
    stateRef.current = { sessionId, currentStep, funnelData, messages };
  }, [sessionId, currentStep, funnelData, messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading, currentStep]);

  const sendMessageToServer = async (
    text: string,
    overrideFunnel?: ConsultorFunnelData,
    overrideStep?: ConsultorStep
  ) => {
    const cleanText = text.trim();
    if (!cleanText || isLoading) return;

    const latestState = stateRef.current;
    const mergedFunnel = { ...latestState.funnelData, ...(overrideFunnel || {}) };
    const stepToSend = overrideStep || latestState.currentStep;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: cleanText,
      timestamp: new Date().toISOString()
    };

    const nextMessages = [...latestState.messages, userMsg];
    setMessages(nextMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/consultor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: latestState.sessionId,
          message: cleanText,
          step: stepToSend,
          funnelData: mergedFunnel,
          history: nextMessages.slice(-8).map((m) => ({
            role: m.role,
            content: m.content
          })),
          sourcePage: location.pathname
        })
      });

      const data = await response.json();

      const nextStep: ConsultorStep = data.nextStep || stepToSend;
      const updatedFunnel: ConsultorFunnelData = data.funnelData || mergedFunnel;
      const engineUsed: 'n8n-vps' | 'local-funnel-fallback' =
        data.engine === 'n8n-vps' ? 'n8n-vps' : 'local-funnel-fallback';

      setCurrentStep(nextStep);
      setFunnelData(updatedFunnel);
      setActiveEngine(engineUsed);

      if (updatedFunnel.nome || updatedFunnel.whatsapp || updatedFunnel.empresa || updatedFunnel.cidade) {
        setContactForm((prev) => ({
          nome: updatedFunnel.nome || prev.nome,
          empresa: updatedFunnel.empresa || prev.empresa,
          whatsapp: updatedFunnel.whatsapp || prev.whatsapp,
          cidade: updatedFunnel.cidade || prev.cidade
        }));
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content:
          data.reply ||
          'Recebemos sua solicitação. Você pode falar diretamente com nossa equipe pelo WhatsApp (48) 99198-4678.',
        quickOptions: Array.isArray(data.quickOptions) ? data.quickOptions : [],
        strategicSummary: data.strategicSummary || null,
        suggestedActions: Array.isArray(data.suggestedActions) ? data.suggestedActions : [],
        engine: engineUsed,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            'Não foi possível conectar ao servidor neste instante. Você pode acionar nossa equipe diretamente no WhatsApp **(48) 99198-4678**.',
          suggestedActions: [
            {
              label: 'Chamar no WhatsApp',
              url: 'https://wa.me/5548991984678?text=Ol%C3%A1%21+Vim+pelo+Consultor+Virtual+da+Oz+Digital.'
            }
          ],
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Global event listeners & window helpers (with backward-compatible alias)
  useEffect(() => {
    const handleOpenEvent = (event: CustomEvent<{ prompt?: string }>) => {
      setIsOpen(true);
      const rawPrompt = event?.detail?.prompt?.trim();
      const isGenericGreeting =
        !rawPrompt ||
        rawPrompt.toLowerCase().includes('gostaria de contar o que a minha empresa precisa') ||
        rawPrompt.toLowerCase().includes('gostaria de contar o que minha empresa precisa');

      if (rawPrompt && !isGenericGreeting) {
        setTimeout(() => {
          sendMessageToServer(rawPrompt);
        }, 120);
      }
    };

    window.addEventListener('open-consultor-chat' as any, handleOpenEvent as any);
    window.addEventListener('open-ozzy-chat' as any, handleOpenEvent as any);

    const openHelper = (prompt?: string) => {
      window.dispatchEvent(new CustomEvent('open-consultor-chat', { detail: { prompt } }));
    };

    (window as any).openConsultorChat = openHelper;
    (window as any).openOzzyChat = openHelper;

    return () => {
      window.removeEventListener('open-consultor-chat' as any, handleOpenEvent as any);
      window.removeEventListener('open-ozzy-chat' as any, handleOpenEvent as any);
    };
  }, [location.pathname]);

  const handleReset = () => {
    const freshId = createSessionId();
    setSessionId(freshId);
    setCurrentStep('objetivo');
    setFunnelData({});
    setMessages([{ ...INITIAL_MESSAGE, id: `welcome-${Date.now()}`, timestamp: new Date().toISOString() }]);
    setContactForm({ nome: '', empresa: '', whatsapp: '', cidade: '' });
    setContactError(null);
    setInputValue('');
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessageToServer(inputValue);
  };

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);

    const nome = contactForm.nome.trim();
    const whatsapp = contactForm.whatsapp.trim();
    const empresa = contactForm.empresa.trim();
    const cidade = contactForm.cidade.trim();

    if (!nome || nome.length < 2) {
      setContactError('Informe seu nome para gerar o resumo estratégico.');
      return;
    }

    const digits = whatsapp.replace(/\D/g, '');
    if (digits.length < 10) {
      setContactError('Informe um WhatsApp válido com DDD (ex: 48 99999-9999).');
      return;
    }

    const updatedFunnel: ConsultorFunnelData = {
      ...funnelData,
      nome,
      whatsapp,
      ...(empresa ? { empresa } : {}),
      ...(cidade ? { cidade } : {})
    };

    const summaryMsg = `Nome: ${nome} | WhatsApp: ${whatsapp}${empresa ? ` | Empresa: ${empresa}` : ''}${
      cidade ? ` | Cidade: ${cidade}` : ''
    }`;

    sendMessageToServer(summaryMsg, updatedFunnel, 'contato');
  };

  const handleActionClick = (action: SuggestedAction) => {
    if (action.url) {
      const anchor = document.createElement('a');
      anchor.href = action.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.click();
    } else if (action.path) {
      setIsOpen(false);
      navigate(action.path);
    }
  };

  const currentStepIndex = STEP_META.findIndex((s) => s.id === currentStep);

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
          <button
            id="consultor-floating-btn"
            type="button"
            onClick={() => setIsOpen(true)}
            className="group bg-slate-950 hover:bg-blue-950 text-white border border-blue-500/40 shadow-2xl shadow-slate-950/30 rounded-2xl px-4 py-3 flex items-center gap-3 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            aria-label="Abrir Consultor Virtual Oz Digital"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            </div>
            <div className="text-left hidden sm:block pr-1">
              <span className="block text-xs font-extrabold tracking-tight text-white leading-none">
                Consultor Virtual
              </span>
              <span className="block text-[10px] font-mono text-orange-400 font-semibold mt-1">
                Assistente Funil • n8n
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Drawer / Chat Panel */}
      {isOpen && (
        <div
          id="consultor-virtual-drawer"
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[430px] max-h-[86vh] h-[640px] bg-white border border-slate-200 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in"
          role="dialog"
          aria-label="Consultor Virtual Oz Digital"
        >
          {/* Header */}
          <div className="bg-slate-950 text-white px-4 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center text-white shadow-md shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-sm text-white truncate">
                    Consultor Virtual OZ
                  </h2>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 flex items-center gap-1 ${
                      activeEngine === 'n8n-vps'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}
                    title={
                      activeEngine === 'n8n-vps'
                        ? 'Respondido diretamente pelo fluxo n8n local/VPS'
                        : 'Operando com motor de funil estruturado integrado'
                    }
                  >
                    <Workflow className="w-2.5 h-2.5" />
                    {activeEngine === 'n8n-vps' ? 'n8n Local/VPS' : 'Funil Estruturado'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  Diagnóstico & Resumo Estratégico em 4 passos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                title="Reiniciar Diagnóstico"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Fechar Consultor"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4-Step Funnel Progress Bar */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 shrink-0">
            <div className="grid grid-cols-4 gap-1.5">
              {STEP_META.map((stepItem, idx) => {
                const isDone = idx < currentStepIndex || currentStep === 'resumo';
                const isActive = idx === currentStepIndex && currentStep !== 'resumo';
                return (
                  <div key={stepItem.id} className="space-y-1">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        isDone
                          ? 'bg-emerald-400'
                          : isActive
                          ? 'bg-orange-500'
                          : 'bg-slate-700'
                      }`}
                    />
                    <div className="flex items-center justify-center gap-1 text-[10px] font-mono">
                      <span
                        className={`font-bold ${
                          isDone
                            ? 'text-emerald-400'
                            : isActive
                            ? 'text-orange-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {stepItem.number}. {stepItem.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, mIdx) => {
              const isUser = msg.role === 'user';
              const isLatestAssistant = !isUser && mIdx === messages.length - 1;

              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}>
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-blue-700 text-white rounded-tr-none font-medium'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-xs max-w-none text-slate-700 prose-p:my-1 prose-strong:text-slate-900">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* Quick Options Pills */}
                  {isLatestAssistant && msg.quickOptions && msg.quickOptions.length > 0 && !isLoading && (
                    <div className="flex flex-wrap gap-1.5 w-full">
                      {msg.quickOptions.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => sendMessageToServer(opt.value)}
                          className="bg-white hover:bg-blue-50 text-blue-800 hover:text-blue-900 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
                        >
                          <span>{opt.label}</span>
                          <ChevronRight className="w-3 h-3 text-orange-500" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Strategic Summary Card (Step 4) */}
                  {msg.strategicSummary && (
                    <div className="w-full bg-slate-950 text-white border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-orange-400" />
                          <span className="font-display font-bold text-xs uppercase tracking-wider text-orange-400">
                            Resumo Estratégico do Projeto
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                          PRONTO
                        </span>
                      </div>

                      <div className="space-y-2 text-[11px]">
                        <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-800">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block">Objetivo</span>
                          <span className="font-bold text-white">{msg.strategicSummary.objetivo}</span>
                        </div>

                        <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-800">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block">Escopo / Desafio</span>
                          <span className="text-slate-200">{msg.strategicSummary.escopo}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-800">
                            <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                              <Cpu className="w-3 h-3 text-blue-400" /> Stack Sugerida
                            </span>
                            <span className="font-bold text-blue-300 block mt-0.5">
                              {msg.strategicSummary.arquiteturaSugerida}
                            </span>
                          </div>

                          <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-800">
                            <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                              <Clock className="w-3 h-3 text-orange-400" /> Prazo Estimado
                            </span>
                            <span className="font-bold text-orange-300 block mt-0.5">
                              {msg.strategicSummary.prazoEstimado}
                            </span>
                          </div>
                        </div>

                        <div className="bg-slate-900/70 rounded-xl p-2.5 border border-slate-800 space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block">Próximos Passos</span>
                          {msg.strategicSummary.proximosPassos.map((passo, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{passo}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Suggested Action Buttons (WhatsApp Handoff + Internal Routes) */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 w-full">
                      {msg.suggestedActions.map((act, aIdx) => {
                        const isWhatsApp = Boolean(act.url && act.url.includes('wa.me'));
                        return (
                          <button
                            key={aIdx}
                            type="button"
                            onClick={() => handleActionClick(act)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                              isWhatsApp
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white w-full justify-center shadow-emerald-500/20'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {isWhatsApp && <MessageCircle className="w-4 h-4" />}
                            <span>{act.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Step 3 Structured Inline Contact Form */}
            {currentStep === 'contato' && !isLoading && (
              <form
                onSubmit={handleContactFormSubmit}
                className="bg-white border-2 border-blue-200 rounded-2xl p-4 shadow-md space-y-3 animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">
                    Seus dados para o Resumo Estratégico
                  </span>
                  <span className="text-[10px] font-mono bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">
                    Passo 3 de 4
                  </span>
                </div>

                {contactError && (
                  <p className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1.5">
                    {contactError}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Seu Nome *"
                      value={contactForm.nome}
                      onChange={(e) => setContactForm((p) => ({ ...p, nome: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp com DDD * (ex: 48 99999-9999)"
                      value={contactForm.whatsapp}
                      onChange={(e) => setContactForm((p) => ({ ...p, whatsapp: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Empresa"
                        value={contactForm.empresa}
                        onChange={(e) => setContactForm((p) => ({ ...p, empresa: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Cidade/UF"
                        value={contactForm.cidade}
                        onChange={(e) => setContactForm((p) => ({ ...p, cidade: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-blue-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span>Gerar Resumo Estratégico</span>
                </button>
              </form>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 w-fit">
                <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span>Processando etapa no fluxo consultivo...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSubmitText}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              placeholder={
                currentStep === 'objetivo'
                  ? 'Ou descreva sua necessidade aqui...'
                  : currentStep === 'escopo'
                  ? 'Conte o desafio ou prazo desejado...'
                  : 'Envie uma mensagem ou dúvida...'
              }
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-sm"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
