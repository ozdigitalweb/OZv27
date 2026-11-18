import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Code2, 
  Server, 
  Layers, 
  Zap, 
  ExternalLink, 
  TrendingUp, 
  Activity, 
  Terminal, 
  Monitor, 
  Globe, 
  Smartphone, 
  ShoppingBag, 
  FileCode2,
  Calendar,
  Check
} from 'lucide-react';
import { mockPosts } from '../data/mockPosts';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'sistema' | 'sitewp' | 'ecommerce'>('sistema');

  // Trigger global Consultor Virtual assistant with contextual prompt
  const handleOpenConsultor = (customPrompt?: string) => {
    const promptToSend = customPrompt || '';
    if (typeof (window as any).openConsultorChat === 'function') {
      (window as any).openConsultorChat(promptToSend);
    } else {
      window.dispatchEvent(new CustomEvent('open-consultor-chat', {
        detail: { prompt: promptToSend }
      }));
    }
  };

  // The 2 specific posts highlighted in Wireframe Tela 01 // Página 5
  const wireframePosts = [
    {
      title: "Design de Produto: do briefing ao lançamento",
      date: "8 NOV 2026",
      category: "UX DESIGN",
      slug: "design-de-produto-do-briefing-ao-lancamento"
    },
    {
      title: "Por que sua PME precisa de um sistema",
      date: "5 NOV 2026",
      category: "TECNOLOGIA",
      slug: "por-que-sua-pme-precisa-de-um-sistema"
    }
  ];

  return (
    <div id="home-page" className="space-y-16 lg:space-y-24 pb-20 animate-fade-in font-sans">
      
      {/* ============================================================ */}
      {/* TELA 01 // TOPO E HERO (PRIMEIRA DOBRA) - Conforme Wireframe */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-white pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Sites e sistemas pensados para resolver <span className="text-blue-700">problemas reais</span> do seu negócio.
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Desenvolvimento digital para pequenas e médias empresas, com experiência, clareza e foco na experiência de quem vai usar.
              </p>
              
              {/* Primary Hero CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => handleOpenConsultor()}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 border border-blue-600"
                  id="hero-cta-tell-needs"
                >
                  <MessageSquare className="h-5 w-5 text-orange-400" />
                  <span>Conte o que sua empresa precisa</span>
                </button>
              </div>

              {/* Tagline / Authority Badge */}
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-blue-900 font-mono">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                <span>20 anos de experiência em tecnologia e soluções digitais</span>
              </div>

            </div>

            {/* Hero Right Visual: [ REPRESENTAÇÃO VISUAL / UI DASHBOARD ] */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs text-slate-300">
                
                {/* Dashboard Window Header */}
                <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="text-[11px] font-bold text-slate-400 ml-2">oz-digital-core.v1</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                    ONLINE
                  </span>
                </div>

                {/* Tab Switcher */}
                <div className="bg-slate-900/50 px-3 pt-2.5 flex gap-1 border-b border-slate-800">
                  <button
                    onClick={() => setActiveTab('sistema')}
                    className={`px-3 py-1.5 rounded-t-lg text-[11px] font-bold transition-all cursor-pointer ${
                      activeTab === 'sistema' ? 'bg-slate-950 text-orange-400 border-t-2 border-orange-500' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sistema Web
                  </button>
                  <button
                    onClick={() => setActiveTab('sitewp')}
                    className={`px-3 py-1.5 rounded-t-lg text-[11px] font-bold transition-all cursor-pointer ${
                      activeTab === 'sitewp' ? 'bg-slate-950 text-blue-400 border-t-2 border-blue-500' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Site WP
                  </button>
                  <button
                    onClick={() => setActiveTab('ecommerce')}
                    className={`px-3 py-1.5 rounded-t-lg text-[11px] font-bold transition-all cursor-pointer ${
                      activeTab === 'ecommerce' ? 'bg-slate-950 text-emerald-400 border-t-2 border-emerald-500' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    E-commerce
                  </button>
                </div>

                {/* Dashboard Body Preview */}
                <div className="p-4 space-y-4">
                  {activeTab === 'sistema' && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Aplicação:</span>
                        <strong className="text-white">GestorPlus PME</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block">Uptime</span>
                          <span className="text-emerald-400 font-bold text-sm">99.98%</span>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block">Latência</span>
                          <span className="text-amber-400 font-bold text-sm">118ms</span>
                        </div>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-[10px] space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>Stack:</span>
                          <span className="text-blue-400">React + Express + Docker</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Status:</span>
                          <span className="text-emerald-400">4 microserviços ativos</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'sitewp' && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Performance:</span>
                        <strong className="text-white">Core Web Vitals</strong>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block">Mobile</span>
                          <span className="text-emerald-400 font-bold text-sm">98/100</span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block">LCP</span>
                          <span className="text-emerald-400 font-bold text-sm">0.9s</span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block">CLS</span>
                          <span className="text-emerald-400 font-bold text-sm">0.00</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        WordPress ultrarrápido construído do zero, sem temas pesados e hospedado em VPS Cloud NVMe.
                      </p>
                    </div>
                  )}

                  {activeTab === 'ecommerce' && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Fluxo de Checkout:</span>
                        <strong className="text-white">1-Click Fast</strong>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[10px] space-y-1.5">
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                          <span>PIX com aprovação instantânea</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                          <span>Cálculo automático de frete Correios/Melhor Envio</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                          <span>Recuperador de carrinho integrado</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terminal snippet bottom bar */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-orange-400" />
                      $ docker compose up -d
                    </span>
                    <span className="text-emerald-400">success: 0 errors</span>
                  </div>

                </div>

              </div>
            </div>

          </div>

          {/* Quick Interactive Selector Bar (Bottom of Hero Dobra) - Conforme Wireframe Tela 01 */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5">
              <span className="font-mono text-xs font-black uppercase text-slate-600 tracking-wider text-center md:text-left">
                O QUE VOCÊ PRECISA RESOLVER?
              </span>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={() => handleOpenConsultor('Preciso de um site institucional profissional para a minha empresa.')}
                  className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-400 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Preciso de um site
                </button>

                <button
                  onClick={() => handleOpenConsultor('Quero um sistema web sob medida para automatizar os processos do meu negócio.')}
                  className="bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-300 hover:border-orange-400 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Quero um sistema
                </button>

                <button
                  onClick={() => handleOpenConsultor('Gostaria de melhorar um fluxo existente de vendas, atendimento ou sistema legado.')}
                  className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-300 hover:border-emerald-400 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Melhorar fluxo existente
                </button>

                <button
                  onClick={() => handleOpenConsultor('Gostaria de explorar possibilidades e entender o que a Oz Digital pode criar para meu negócio.')}
                  className="bg-blue-700 hover:bg-blue-800 text-white border border-blue-600 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Explorar possibilidades
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* TELA 01 // SERVIÇOS E PROCESSO - Conforme Wireframe Página 4 */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Coluna 1: | Soluções Digitais */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-700 rounded-full"></span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Soluções Digitais
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Sites Institucionais */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  [SITES]
                </span>
                <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                  Institucionais
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apresente sua empresa de forma profissional.
                </p>
                <div className="pt-2">
                  <Link
                    to="/servicos/wordpress"
                    className="text-xs font-bold text-blue-700 hover:text-orange-500 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Saiba mais</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Sistemas Web sob medida */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-orange-300 hover:shadow-md transition-all space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  [SISTEMAS]
                </span>
                <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                  Web sob medida
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Software para automatizar seus processos.
                </p>
                <div className="pt-2">
                  <Link
                    to="/servicos/projetos"
                    className="text-xs font-bold text-orange-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Ver cases</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Lojas Virtuais */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-emerald-300 hover:shadow-md transition-all space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  [ECOMMERCE]
                </span>
                <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                  Lojas Virtuais
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Experiência clara de venda e checkout.
                </p>
                <div className="pt-2">
                  <Link
                    to="/servicos/projetos?cat=E-COMMERCE"
                    className="text-xs font-bold text-emerald-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Saiba mais</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Card 4: Fluxos e Interfaces */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-purple-300 hover:shadow-md transition-all space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  [UX DESIGN]
                </span>
                <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                  Fluxos e Interfaces
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Design focado na facilidade de uso.
                </p>
                <div className="pt-2">
                  <Link
                    to="/servicos/processo"
                    className="text-xs font-bold text-purple-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Ver método</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/servicos"
                className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-blue-700 hover:text-orange-500 transition-colors"
              >
                <span>TODOS OS SERVIÇOS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Coluna 2: | Nosso Processo */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Nosso Processo
              </h2>
            </div>

            <div className="space-y-4">
              {/* Etapa 1 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 transition-colors">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 font-extrabold text-sm flex items-center justify-center border border-blue-200 shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    Entender o negócio
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Alinhamento de objetivos e dores.
                  </p>
                </div>
              </div>

              {/* Etapa 2 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 transition-colors">
                <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-600 font-extrabold text-sm flex items-center justify-center border border-orange-200 shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    Organizar fluxos e UX
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Arquitetura e experiência do usuário.
                  </p>
                </div>
              </div>

              {/* Etapa 3 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 transition-colors">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-sm flex items-center justify-center border border-emerald-200 shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    Desenvolver
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Construção técnica e integrações.
                  </p>
                </div>
              </div>

              {/* Etapa 4 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 transition-colors">
                <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-700 font-extrabold text-sm flex items-center justify-center border border-purple-200 shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    Testar e Publicar
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Garantia de qualidade e lançamento.
                  </p>
                </div>
              </div>
            </div>

            {/* Foco Técnico Badge */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-slate-500">
              <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                [FOCO TÉCNICO] React // Express // Docker
              </span>

              <Link
                to="/servicos/processo"
                className="font-bold text-blue-700 hover:text-orange-500 inline-flex items-center gap-1 transition-colors"
              >
                <span>Detalhes do processo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* TELA 01 // PROJETOS E SOBRE - Conforme Wireframe Página 5 */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Coluna Esquerda (7 cols): | Vitrine de Projetos (Grid 2x2) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-700 rounded-full"></span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Vitrine de Projetos
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Project 1: GestorPlus */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col group">
                <div className="aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden text-center p-4">
                  <div className="absolute inset-0 bg-blue-600/10"></div>
                  <span className="text-xs font-mono text-slate-400 z-10 font-bold group-hover:text-white transition-colors">
                    Mockup — GestorPlus
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    GestorPlus — Plataforma de Gestão
                  </h4>
                  <p className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-wider">
                    CATEGORIA: SISTEMA WEB
                  </p>
                </div>
              </div>

              {/* Project 2: Broox */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col group">
                <div className="aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden text-center p-4">
                  <div className="absolute inset-0 bg-orange-600/10"></div>
                  <span className="text-xs font-mono text-slate-400 z-10 font-bold group-hover:text-white transition-colors">
                    Mockup — Site Corporativo
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    Broox — Site Corporativo
                  </h4>
                  <p className="text-[10px] font-mono font-bold text-blue-700 uppercase tracking-wider">
                    CATEGORIA: SITE WP
                  </p>
                </div>
              </div>

              {/* Project 3: OzMart */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col group">
                <div className="aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden text-center p-4">
                  <div className="absolute inset-0 bg-emerald-600/10"></div>
                  <span className="text-xs font-mono text-slate-400 z-10 font-bold group-hover:text-white transition-colors">
                    Mockup — Loja OzMart
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    OzMart — E-commerce
                  </h4>
                  <p className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-wider">
                    CATEGORIA: E-COMMERCE
                  </p>
                </div>
              </div>

              {/* Project 4: IntegraAPI */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col group">
                <div className="aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden text-center p-4">
                  <div className="absolute inset-0 bg-purple-600/10"></div>
                  <span className="text-xs font-mono text-slate-400 z-10 font-bold group-hover:text-white transition-colors">
                    Mockup — IntegraAPI
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    IntegraAPI — Conectores
                  </h4>
                  <p className="text-[10px] font-mono font-bold text-purple-600 uppercase tracking-wider">
                    CATEGORIA: INTEGRAÇÃO
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-2">
              <Link
                to="/servicos/projetos"
                className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-blue-700 hover:text-orange-500 transition-colors"
              >
                <span>VER TODOS OS PROJETOS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Coluna Direita (5 cols): | Sobre e | Blog */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Bloco 1: | Sobre */}
            <div className="space-y-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-slate-800 rounded-full"></span>
                <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
                  Sobre
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                A Oz Digital combina 20 anos de experiência em tecnologia com uma abordagem centrada em UX. Liderada por Marcelo Krauthein, a equipe transforma desafios de negócio em software eficiente, escalável e fácil de usar.
              </p>

              <div className="pt-2">
                <Link
                  to="/sobre"
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-blue-700 hover:text-orange-500 transition-colors"
                >
                  <span>CONHEÇA NOSSA HISTÓRIA</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Bloco 2: | Blog */}
            <div className="space-y-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
                  Blog
                </h2>
              </div>

              <div className="space-y-4 divide-y divide-slate-100">
                {wireframePosts.map((post, idx) => (
                  <div key={idx} className={idx > 0 ? "pt-3 space-y-1" : "space-y-1"}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="font-display font-bold text-sm text-slate-900 hover:text-orange-500 transition-colors block leading-snug"
                    >
                      {post.title}
                    </Link>
                    <p className="font-mono text-[10px] text-slate-400 font-semibold tracking-wider">
                      {post.date} // {post.category}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-blue-700 hover:text-orange-500 transition-colors"
                >
                  <span>EXPLORAR BLOG</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* TELA 01 // CONVERSÃO E ASSISTENTE - Conforme Wireframe Pág 6 */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-700 rounded-3xl p-8 sm:p-12 lg:p-16 text-white text-center space-y-8 relative overflow-hidden shadow-2xl">
          
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Pronto para transformar sua ideia em software?
            </h2>
            <p className="text-base sm:text-lg text-blue-100 leading-relaxed font-normal">
              Fale com nosso assistente virtual e receba um resumo estratégico do seu projeto.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleOpenConsultor()}
              className="bg-white hover:bg-slate-100 text-blue-900 font-extrabold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer uppercase tracking-wider"
              id="cta-bottom-tell-needs"
            >
              Conte o que sua empresa precisa
            </button>
          </div>

          {/* [ESTADO DO ASSISTENTE] - Card / Interação visual do robô no wireframe */}
          <div className="max-w-lg mx-auto pt-6 text-left relative z-10 font-mono text-xs">
            <div className="bg-slate-950/95 border border-blue-400/30 rounded-2xl p-5 shadow-xl space-y-3">
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
                [ESTADO DO ASSISTENTE]
              </span>

              {/* Bot bubble */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-200">
                Olá! O que trouxe você aqui hoje?
              </div>

              {/* User interactive options / bubble */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleOpenConsultor('Preciso de um sistema sob medida.')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-3 rounded-xl shadow-sm transition-all hover:scale-102 cursor-pointer text-right flex items-center gap-1.5"
                >
                  <span>Preciso de um sistema sob medida.</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap justify-end gap-2 pt-1 text-[11px]">
                <button
                  onClick={() => handleOpenConsultor('Preciso criar ou modernizar o site da minha empresa.')}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                >
                  Quero modernizar meu site
                </button>
                <button
                  onClick={() => handleOpenConsultor('Gostaria de um orçamento para a Solução 360°')}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                >
                  Orçamento Solução 360°
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
