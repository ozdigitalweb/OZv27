import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import Breadcrumbs from './Breadcrumbs';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setServicesDropdown(false);
    setAboutDropdown(false);
  }, [location]);

  // Handle scroll event to add background on header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = "https://wa.me/5548991984678?text=Ol%C3%A1%21+Gostaria+de+falar+com+um+consultor+da+OZ+Digital.";

  const navLinks = [
    { path: '/', label: 'Início' },
    { path: '/sobre', label: 'Sobre' },
    { path: '/clientes', label: 'Clientes' },
    { path: '/blog', label: 'Blog' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contato', label: 'Contato' },
  ];

  const services = [
    { path: '/servicos', label: 'Todos os Serviços' },
    { path: '/360-graus', label: 'Solução 360° (Auxílio Geral)' },
    { path: '/servicos/landingpages', label: 'Landingpages' },
    { path: '/servicos/midia', label: 'Mídia & Divulgação' },
    { path: '/servicos/hospedagem', label: 'Hospedagem Cloud' },
    { path: '/servicos/wordpress', label: 'Desenvolvimento WordPress' },
    { path: '/servicos/seo', label: 'SEO / GEO Posicionamento' },
  ];

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3' 
          : 'bg-white py-4 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Breadcrumbs */}
          <div className="flex flex-col items-start justify-center">
            <Link 
              to="/" 
              className="flex items-center gap-3 mb-[20px]"
              id="header-logo"
            >
              <Logo className="hover:scale-[1.02] transition-transform" />
            </Link>
            <Breadcrumbs />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7" aria-label="Menu Principal">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `font-medium text-sm transition-all hover:text-orange-500 ${
                  isActive ? 'text-orange-500 border-b-2 border-orange-500 pb-1 font-bold' : 'text-slate-600 pb-1 border-b-2 border-transparent'
                }`
              }
            >
              Home
            </NavLink>

            {/* Sobre Dropdown */}
            <div className="relative group/dropdown">
              <button
                className={`flex items-center gap-1 font-medium text-sm transition-all hover:text-orange-500 focus:outline-none pb-1 border-b-2 ${
                  location.pathname === '/sobre' || location.pathname === '/clientes' ? 'text-orange-500 border-orange-500 font-bold' : 'text-slate-600 border-transparent'
                }`}
                onClick={() => setAboutDropdown(!aboutDropdown)}
                onMouseEnter={() => setAboutDropdown(true)}
              >
                Sobre
                <ChevronDown className="h-4 w-4 transition-transform group-hover/dropdown:rotate-180" />
              </button>
              
              <div 
                className="absolute left-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-slate-200 py-2 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 transform translate-y-1 group-hover/dropdown:translate-y-0 z-50"
                onMouseLeave={() => setAboutDropdown(false)}
              >
                <NavLink
                  to="/sobre"
                  className={({ isActive }) =>
                    `block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-orange-50/60 hover:text-orange-600 ${
                      isActive ? 'text-orange-600 font-bold bg-orange-50/70' : 'text-slate-600'
                    }`
                  }
                >
                  Sobre a Oz Digital
                </NavLink>
                <NavLink
                  to="/clientes"
                  className={({ isActive }) =>
                    `block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-orange-50/60 hover:text-orange-600 ${
                      isActive ? 'text-orange-600 font-bold bg-orange-50/70' : 'text-slate-600'
                    }`
                  }
                >
                  Nossos Clientes
                </NavLink>
              </div>
            </div>

            {/* Services Dropdown - Conforme Wireframe Seção 02: Projetos e Processo agrupados em Serviços */}
            <div className="relative group/dropdown">
              <button
                className={`flex items-center gap-1 font-medium text-sm transition-all hover:text-orange-500 focus:outline-none pb-1 border-b-2 ${
                  location.pathname.startsWith('/servicos') || location.pathname === '/projetos' || location.pathname === '/processo' ? 'text-orange-500 border-orange-500 font-bold' : 'text-slate-600 border-transparent'
                }`}
                onClick={() => setServicesDropdown(!servicesDropdown)}
                onMouseEnter={() => setServicesDropdown(true)}
              >
                Serviços
                <ChevronDown className="h-4 w-4 transition-transform group-hover/dropdown:rotate-180" />
              </button>
              
              <div 
                className="absolute left-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-slate-200 p-2 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 transform translate-y-1 group-hover/dropdown:translate-y-0 z-50 divide-y divide-slate-100"
                onMouseLeave={() => setServicesDropdown(false)}
              >
                {/* Destaques Wireframe: Visão Geral, Projetos, Processo */}
                <div className="pb-2 space-y-1">
                  <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Visão Geral & Método
                  </span>
                  <NavLink
                    to="/servicos"
                    end
                    className={({ isActive }) =>
                      `block px-3 py-2 text-sm font-bold rounded-lg transition-colors hover:bg-blue-50 hover:text-blue-700 ${
                        isActive ? 'text-blue-700 bg-blue-50/80' : 'text-slate-800'
                      }`
                    }
                  >
                    Visão Geral de Serviços
                  </NavLink>
                  <NavLink
                    to="/servicos/projetos"
                    className={({ isActive }) =>
                      `block px-3 py-2 text-sm font-bold rounded-lg transition-colors hover:bg-orange-50 hover:text-orange-600 flex items-center justify-between ${
                        isActive ? 'text-orange-600 bg-orange-50/80' : 'text-slate-800'
                      }`
                    }
                  >
                    <span>Vitrine de Projetos</span>
                    <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase">Cases</span>
                  </NavLink>
                  <NavLink
                    to="/servicos/processo"
                    className={({ isActive }) =>
                      `block px-3 py-2 text-sm font-bold rounded-lg transition-colors hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between ${
                        isActive ? 'text-emerald-700 bg-emerald-50/80' : 'text-slate-800'
                      }`
                    }
                  >
                    <span>Nosso Processo</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">React // Express</span>
                  </NavLink>
                </div>

                {/* Páginas de Serviço Individual */}
                <div className="pt-2 space-y-0.5">
                  <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Soluções Digitais
                  </span>
                  <NavLink
                    to="/servicos/wordpress"
                    className="block px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-orange-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Sites Institucionais & WordPress
                  </NavLink>
                  <NavLink
                    to="/servicos/landingpages"
                    className="block px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-orange-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Landing Pages de Alta Conversão
                  </NavLink>
                  <NavLink
                    to="/servicos/hospedagem"
                    className="block px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-orange-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Hospedagem Cloud cPanel NVMe
                  </NavLink>
                  <NavLink
                    to="/360-graus"
                    className="block px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-orange-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Solução 360° (Auxílio Geral)
                  </NavLink>
                  <NavLink
                    to="/servicos/seo"
                    className="block px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-orange-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    SEO / GEO Posicionamento
                  </NavLink>
                  <NavLink
                    to="/servicos/midia"
                    className="block px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-orange-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Mídia & Assistente Virtual IA
                  </NavLink>
                  <NavLink
                    to="/servicos/streaming"
                    className="block px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-orange-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    PROVOX Rádio & Som Ambiente
                  </NavLink>
                </div>
              </div>
            </div>

            <NavLink 
              to="/blog" 
              className={({ isActive }) => 
                `font-medium text-sm transition-all hover:text-orange-500 ${
                  isActive ? 'text-orange-500 border-b-2 border-orange-500 pb-1 font-bold' : 'text-slate-600 pb-1 border-b-2 border-transparent'
                }`
              }
            >
              Blog
            </NavLink>

            <NavLink 
              to="/contato" 
              className={({ isActive }) => 
                `font-medium text-sm transition-all hover:text-orange-500 ${
                  isActive ? 'text-orange-500 border-b-2 border-orange-500 pb-1 font-bold' : 'text-slate-600 pb-1 border-b-2 border-transparent'
                }`
              }
            >
              Contato
            </NavLink>

            {/* Botão WhatsApp em destaque ao lado de Contato */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/35 transition-all hover:-translate-y-0.5 active:scale-95 group ml-1 border border-emerald-400/40"
              id="header-whatsapp-cta-btn"
              title="Conversar diretamente pelo WhatsApp com a OZ Digital"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-100 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
          </nav>

          {/* Mobile Hamburguer Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none"
              aria-expanded={isOpen}
              aria-label="Abrir menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-inner animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              Início
            </NavLink>
            {/* Sobre Nós for Mobile */}
            <div className="py-1 border-b border-slate-50 my-1">
              <span className="block px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                Sobre Nós
              </span>
              <NavLink
                to="/sobre"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'text-orange-600 font-bold bg-orange-50/70' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
                  }`
                }
              >
                Sobre a Agência
              </NavLink>
              <NavLink
                to="/clientes"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'text-orange-600 font-bold bg-orange-50/70' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
                  }`
                }
              >
                Nossos Clientes
              </NavLink>
            </div>
            
            {/* Services for Mobile */}
            <div className="py-1 border-b border-slate-50 my-1">
              <span className="block px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                Serviços & Metodologia
              </span>
              <NavLink
                to="/servicos"
                end
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-2 rounded-lg text-sm font-semibold ${
                    isActive ? 'text-blue-700 font-bold bg-blue-50/70' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                  }`
                }
              >
                Visão Geral
              </NavLink>
              <NavLink
                to="/servicos/projetos"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                    isActive ? 'text-orange-600 font-bold bg-orange-50/70' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
                  }`
                }
              >
                <span>Vitrine de Projetos</span>
                <span className="text-[9px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase">Cases</span>
              </NavLink>
              <NavLink
                to="/servicos/processo"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                    isActive ? 'text-emerald-700 font-bold bg-emerald-50/70' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`
                }
              >
                <span>Nosso Processo</span>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">React/Express</span>
              </NavLink>
              <NavLink
                to="/servicos/wordpress"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Sites WordPress sob Medida
              </NavLink>
              <NavLink
                to="/servicos/hospedagem"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Hospedagem Cloud cPanel
              </NavLink>
              <NavLink
                to="/360-graus"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Solução 360° (Auxílio Geral)
              </NavLink>
            </div>

            <NavLink
              to="/blog"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              Blog
            </NavLink>
            <NavLink
              to="/contato"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              Contato
            </NavLink>

            <div className="pt-3 border-t border-slate-100">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white w-full py-2.5 rounded-xl font-bold text-xs shadow-sm"
              >
                <MessageSquare className="h-4 w-4" />
                WhatsApp Direto: (48) 99198-4678
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
