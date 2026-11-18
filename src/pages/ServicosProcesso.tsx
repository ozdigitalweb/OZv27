import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  GitBranch, 
  Search, 
  Layout, 
  Code2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Terminal, 
  Sparkles,
  Server,
  Zap,
  RotateCcw
} from 'lucide-react';

export default function ServicosProcesso() {
  const steps = [
    {
      number: "1",
      title: "Entender o negócio",
      subtitle: "Alinhamento de objetivos e dores reais da sua empresa",
      description: "Nenhum projeto começa com linhas de código. Nosso primeiro passo é sentar com você para entender os gargalos operacionais da empresa, quem são seus clientes, o que os concorrentes estão fazendo e quais métricas definirão o sucesso do projeto.",
      keyActivities: [
        "Mapeamento de requisitos comerciais e dores do dia a dia",
        "Auditoria do cenário atual (velocidade, sistema legado ou ausência de presença)",
        "Definição de escopo transparente e cronograma realista sem surpresas",
        "Identificação de integrações necessárias (WhatsApp, gateways, ERPs, cPanel)"
      ],
      deliverable: "Documento de Especificação & Briefing Estratégico",
      color: "blue"
    },
    {
      number: "2",
      title: "Organizar fluxos e UX",
      subtitle: "Arquitetura da informação e design focado em quem vai usar",
      description: "Desenhamos as telas e fluxos de navegação pensando na facilidade de uso diária da sua equipe ou no checkout descomplicado do seu cliente. Clareza sobre estética: o design deve resolver o problema antes de ser bonito.",
      keyActivities: [
        "Criação de wireframes e mapa de navegação das telas",
        "Arquitetura de informação mobile-first (mais de 80% do tráfego)",
        "Design de interfaces limpas e consistentes (Design System)",
        "Validação de protótipos interativos antes de iniciar a programação"
      ],
      deliverable: "Protótipo Interativo & Fluxo de Telas Aprovado",
      color: "orange"
    },
    {
      number: "3",
      title: "Desenvolver",
      subtitle: "Construção técnica robusta, código limpo e integrações",
      description: "Aqui a engenharia de software da Oz Digital entra em ação. Escrevemos código limpo, modular e desacoplado, garantindo facilidade de manutenção futura e extrema velocidade de resposta.",
      keyActivities: [
        "Frontend rápido e reativo com React e Tailwind CSS",
        "APIs seguras e documentadas em Node.js / Express",
        "Ambientes isolados e replicáveis com Docker",
        "Integração de banco de dados robusto (PostgreSQL / MySQL) e webhooks"
      ],
      deliverable: "Código-Fonte Versionado, APIs e Ambiente Homologado",
      color: "emerald"
    },
    {
      number: "4",
      title: "Testar e Publicar",
      subtitle: "Garantia de qualidade, segurança e lançamento assistido",
      description: "Antes de ir ao ar, submetemos a aplicação a testes rigorosos em múltiplos navegadores, validação de segurança e auditoria de performance no Google PageSpeed.",
      keyActivities: [
        "Auditoria de velocidade Core Web Vitals (Nota 90+ obrigatória)",
        "Testes de usabilidade e responsividade em celulares Android e iOS",
        "Blindagem de e-mails corporativos (SPF, DKIM, DMARC) e SSL ativo",
        "Deploy em infraestrutura Cloud NVMe com monitoramento contínuo"
      ],
      deliverable: "Site/Sistema no Ar com Certificado de Conclusão e Suporte",
      color: "purple"
    }
  ];

  const handleOpenConsultor = () => {
    const prompt = 'Quero aplicar o processo de desenvolvimento da Oz Digital na minha empresa.';
    if (typeof (window as any).openConsultorChat === 'function') {
      (window as any).openConsultorChat(prompt);
    } else {
      window.dispatchEvent(new CustomEvent('open-consultor-chat', {
        detail: { prompt }
      }));
    }
  };

  return (
    <div id="processo-page" className="space-y-16 pb-20 animate-fade-in font-sans">
      
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-25" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <GitBranch className="h-3.5 w-3.5 text-emerald-400" />
            <span>Transparência Técnica & Metodologia</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Nosso Processo: do entendimento à publicação.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Sem caixas pretas e sem termos técnicos indecifráveis. Mostramos o <strong>"como fazemos"</strong> com transparência total para que sua empresa tenha segurança em cada etapa do investimento digital.
          </p>

          {/* Technical focus pills */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1">
              [FOCO TÉCNICO]:
            </span>
            <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-blue-400 font-mono">
              React
            </span>
            <span className="text-slate-500">//</span>
            <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-emerald-400 font-mono">
              Express
            </span>
            <span className="text-slate-500">//</span>
            <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-orange-400 font-mono">
              Docker
            </span>
            <span className="text-slate-500">//</span>
            <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-purple-400 font-mono">
              cPanel Cloud NVMe
            </span>
          </div>
        </div>
      </section>

      {/* Step by step cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700">Fluxo Lógico & Seguro</span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            As 4 Etapas do Método Oz Digital
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Construído e refinado ao longo de mais de 20 anos desenvolvendo softwares e portais corporativos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-blue-100 flex-shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs font-semibold text-orange-600">
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Atividades Principais:
                  </span>
                  <ul className="space-y-2">
                    {step.keyActivities.map((act, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Deliverable box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Entregável desta fase:
                </span>
                <span className="font-bold text-blue-900 block mt-0.5">
                  {step.deliverable}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Standards Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Padrões de Engenharia
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Por que nossa stack técnica faz a sua empresa economizar?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Muitos fornecedores usam plugins piratas ou código desorganizado que quebra na primeira atualização. Nós adotamos padrões internacionais que protegem o seu investimento a longo prazo:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-white">Código Desacoplado</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Frontend e backend separados por APIs. Se você quiser mudar o visual amanhã, sua lógica de negócio e banco continuam intactos.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-white">Ambientes em Containers</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Com Docker, o que roda na máquina dos nossos programadores roda com exata fidelidade no seu servidor VPS em nuvem.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-white">PageSpeed 90+ Garantido</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Imagens em WebP, minificação CSS/JS, compressão Brotli e cache a nível de hardware no cPanel Cloud.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pronto para iniciar a Etapa 1 no seu negócio?
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
          Entre em contato para um diagnóstico sem compromisso. Conversamos sobre suas dores e apresentamos um plano de ação claro.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleOpenConsultor}
            className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Conte o que sua empresa precisa
          </button>
          <Link
            to="/servicos/projetos"
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-sm px-8 py-4 rounded-xl transition-all"
          >
            Ver Projetos Concluídos &rarr;
          </Link>
        </div>
      </section>

    </div>
  );
}
