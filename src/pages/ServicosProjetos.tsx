import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  Cpu, 
  Code2, 
  Layout, 
  Database, 
  ShoppingBag, 
  ShieldCheck, 
  Sparkles,
  Server
} from 'lucide-react';

interface ProjectItem {
  id: string;
  name: string;
  subtitle: string;
  category: 'SISTEMA WEB' | 'SITE WP' | 'E-COMMERCE' | 'INTEGRAÇÃO';
  categoryLabel: string;
  description: string;
  metrics: string;
  technologies: string[];
  deliverables: string[];
  image: string;
  link?: string;
  isWireframeHighlighted?: boolean;
}

export default function ServicosProjetos() {
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');

  const projects: ProjectItem[] = [
    {
      id: 'gestorplus',
      name: 'GestorPlus — Plataforma de Gestão',
      subtitle: 'Software Web sob medida para automação de processos',
      category: 'SISTEMA WEB',
      categoryLabel: 'SISTEMA WEB',
      description: 'Plataforma web completa desenvolvida para centralizar vendas, ordens de serviço, emissão de propostas comerciais e fluxo financeiro em um único painel intuitivo e responsivo.',
      metrics: 'Economia de 18h semanais em tarefas manuais',
      technologies: ['React', 'Express', 'Docker', 'PostgreSQL', 'Tailwind CSS'],
      deliverables: [
        'Painel administrativo multiusuário com níveis de permissão',
        'Emissão e envio automático de propostas em PDF por WhatsApp',
        'Controle financeiro com gráficos em tempo real',
        'Arquitetura desacoplada conteinerizada em Docker'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?fm=webp&fit=crop&w=800&q=75',
      isWireframeHighlighted: true
    },
    {
      id: 'broox',
      name: 'Broox — Site Corporativo',
      subtitle: 'Site institucional corporativo em WordPress de elite',
      category: 'SITE WP',
      categoryLabel: 'SITE WP',
      description: 'Presença digital institucional focada em autoridade corporativa, geração de leads qualificados e nota máxima no Google PageSpeed (98/100 Mobile).',
      metrics: 'Nota 98/100 no Google PageSpeed e carga em 0.9s',
      technologies: ['WordPress', 'PHP 8.3', 'cPanel Cloud', 'Tailwind CSS', 'Schema.org'],
      deliverables: [
        'Tema WordPress exclusivo construído do zero sem bloatware',
        'Estruturação semântica para motores de busca e IAs (GEO)',
        'Formulários com validação inteligente e alerta no WhatsApp',
        'Painel intuitivo para a equipe interna editar conteúdos'
      ],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?fm=webp&fit=crop&w=800&q=75',
      isWireframeHighlighted: true
    },
    {
      id: 'ozmart',
      name: 'OzMart — E-commerce',
      subtitle: 'Loja virtual com experiência clara de venda e checkout',
      category: 'E-COMMERCE',
      categoryLabel: 'E-COMMERCE',
      description: 'Loja virtual de alta conversão projetada com foco absoluto na fluidez de compra, cálculo automático de frete e checkout em 1 etapa.',
      metrics: '+34% de aumento na taxa de conversão de carrinho',
      technologies: ['WooCommerce', 'React', 'Gateways de Pagamento', 'Redis Cache', 'cPanel'],
      deliverables: [
        'Checkout transparente sem redirecionamentos confusos',
        'Integração direta com Melhor Envio, Jadlog e Correios',
        'Recuperação automática de pedidos e carrinhos abandonados',
        'Catálogo de produtos com variações de cor e tamanho'
      ],
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?fm=webp&fit=crop&w=800&q=75',
      isWireframeHighlighted: true
    },
    {
      id: 'integraapi',
      name: 'IntegraAPI — Conectores',
      subtitle: 'Conectores de microsserviços e integrações sob medida',
      category: 'INTEGRAÇÃO',
      categoryLabel: 'INTEGRAÇÃO',
      description: 'Módulo de microsserviços desenvolvido para unificar sistemas legados da empresa com gateways de pagamento, plataformas de CRM e APIs de logística.',
      metrics: '100% de confiabilidade e sincronicidade entre bancos',
      technologies: ['Node.js', 'Express', 'Webhooks', 'Docker', 'Redis'],
      deliverables: [
        'Conexão segura com Webhooks em tempo real e fila de retentativas',
        'Sincronização bidirecional entre ERP e plataforma e-commerce',
        'Logs estruturados de auditoria e monitoramento de integridade',
        'Documentação técnica Swagger para futuras expansões'
      ],
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?fm=webp&fit=crop&w=800&q=75',
      isWireframeHighlighted: true
    },
    {
      id: 'cssgapa',
      name: 'CSSGAPA Canoas — Portal Institucional',
      subtitle: 'Portal da Aeronáutica com agendamentos e eventos',
      category: 'SITE WP',
      categoryLabel: 'SITE WP',
      description: 'Portal oficial desenvolvido com suporte a agendamento de quadras, publicação de atas oficiais, galeria de eventos e acessibilidade em conformidade com as normas federais.',
      metrics: 'Mais de 15.000 acessos mensais estabilizados',
      technologies: ['WordPress', 'cPanel Cloud', 'PHP 8', 'MySQL', 'CDN Cloudflare'],
      deliverables: [
        'Sistema de agendamento online integrado com notificações',
        'Área de sócios com consulta de dependentes e eventos',
        'Acessibilidade digital integral (Libras e alto contraste)',
        'Hospedagem VPS Cloud com redundância e backups diários'
      ],
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?fm=webp&fit=crop&w=800&q=75',
      link: 'https://cssgapa.com.br'
    }
  ];

  const categories = ['TODOS', 'SISTEMA WEB', 'SITE WP', 'E-COMMERCE', 'INTEGRAÇÃO'];

  const filteredProjects = selectedCategory === 'TODOS'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const handleOpenOzzy = (projectName: string) => {
    if (typeof (window as any).openOzzyChat === 'function') {
      (window as any).openOzzyChat(`Olá! Gostei do projeto "${projectName}" e gostaria de entender como desenvolver algo semelhante para a minha empresa.`);
    } else {
      window.dispatchEvent(new CustomEvent('open-ozzy-chat', {
        detail: { prompt: `Olá! Gostei do projeto "${projectName}" e gostaria de entender como desenvolver algo semelhante para a minha empresa.` }
      }));
    }
  };

  return (
    <div id="projetos-page" className="space-y-16 pb-20 animate-fade-in font-sans">
      
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-25" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Layers className="h-3.5 w-3.5 text-blue-400" />
            <span>Portfólio & Vitrine Técnica</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Projetos reais pensados para resolver gargalos do seu negócio.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            De sistemas web sob medida e lojas virtuais de alta conversão a portais corporativos em WordPress. Conheça as soluções que desenvolvemos com foco na experiência do usuário e em resultados comerciais tangíveis.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Code2 className="w-4 h-4 text-orange-400" /> React // Express // Docker
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Server className="w-4 h-4 text-blue-400" /> Hospedagem Cloud NVMe
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 20 Anos de Experiência
            </span>
          </div>
        </div>
      </section>

      {/* Filter Chips Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400 mr-2 tracking-wider">Filtrar por:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-700 text-white shadow-md shadow-blue-100'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Exibindo <strong>{filteredProjects.length}</strong> projetos
          </span>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Mockup Preview Area */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden border-b border-slate-100">
                <img
                  src={project.image}
                  alt={project.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white px-2.5 py-1 rounded-md shadow-sm">
                      CATEGORIA: {project.categoryLabel}
                    </span>
                    <h3 className="font-display text-lg font-bold text-white tracking-tight">
                      {project.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                    {project.subtitle}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Impact badge */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-800">
                      Resultado: <span className="text-emerald-600">{project.metrics}</span>
                    </span>
                  </div>

                  {/* Deliverables list */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Entregas Principais:
                    </span>
                    <ul className="space-y-1">
                      {project.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tech chips & Action CTA */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleOpenOzzy(project.name)}
                      className="text-xs font-bold text-blue-700 hover:text-orange-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Quero um projeto semelhante</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium"
                      >
                        <span>Visitar</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Conversion Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Transformação Digital na Prática
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
              Tem uma ideia ou um sistema antigo que precisa ser modernizado?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Converse agora com o nosso assistente estratégico ou marque um diagnóstico técnico com Marcelo Krauthein para avaliar a viabilidade e o investimento.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
            <button
              onClick={() => handleOpenOzzy('Gostaria de solicitar uma consultoria para um novo projeto')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 cursor-pointer text-center"
            >
              Conte o que sua empresa precisa
            </button>
            <Link
              to="/servicos/processo"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm px-6 py-3.5 rounded-xl transition-all text-center"
            >
              Ver Nosso Processo
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
