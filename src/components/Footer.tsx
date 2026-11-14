import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Globe, Award } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Gerenciador de Conteúdo: Exibir apenas informações essenciais de rodapé
  if (isAdmin) {
    return (
      <footer id="admin-footer" className="bg-slate-900 border-t border-slate-800 py-4 px-4 sm:px-8 text-xs text-slate-400 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p>
            &copy; {currentYear} AGÊNCIA OZ Soluções Web. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2">
            <Link to="/politica-privacidade" target="_blank" className="hover:text-blue-400 transition-colors font-medium">
              Política de Privacidade
            </Link>
            <span className="flex items-center gap-1 text-slate-400">
              <Shield className="h-3.5 w-3.5 text-slate-500" /> Protótipo Referência WordPress
            </span>
            <span className="text-slate-400">Canoas / RS</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-400 border-t border-slate-800/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        
        {/* Wireframe 3-Column Technical Layout: OZ DIGITAL // NAVEGAÇÃO // CONTATO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-start">
          
          {/* Coluna 1: OZ DIGITAL */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <Logo size="md" className="hover:scale-[1.02] transition-transform" />
            </Link>
            
            <div className="space-y-1.5 text-xs text-slate-400 leading-relaxed font-mono">
              <p className="font-bold text-slate-200">© 2026 OZ DIGITAL LTDA.</p>
              <p className="text-orange-400 font-bold uppercase tracking-wider">20 ANOS DE EXPERIÊNCIA EM TECNOLOGIA.</p>
              <p className="text-slate-400">FLORIANÓPOLIS/SC // CANOAS/RS</p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed pt-2">
              Desenvolvimento de sites e sistemas pensados para resolver problemas reais de pequenas e médias empresas. Liderada por Marcelo Krauthein com foco em engenharia e UX.
            </p>
          </div>

          {/* Coluna 2: NAVEGAÇÃO */}
          <div className="space-y-4">
            <h3 className="text-white font-mono text-xs font-bold tracking-widest uppercase border-l-2 border-orange-500 pl-3">
              NAVEGAÇÃO
            </h3>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-medium">
              <div className="space-y-2">
                <Link to="/" className="block text-slate-300 hover:text-orange-400 transition-colors">
                  Home
                </Link>
                <Link to="/sobre" className="block text-slate-300 hover:text-orange-400 transition-colors">
                  Sobre a Oz Digital
                </Link>
                <Link to="/servicos" className="block text-slate-300 hover:text-orange-400 transition-colors font-bold text-white">
                  Serviços (Visão Geral)
                </Link>
                <Link to="/servicos/projetos" className="block text-orange-400 hover:text-orange-300 transition-colors font-bold">
                  ↳ Projetos & Cases
                </Link>
                <Link to="/servicos/processo" className="block text-emerald-400 hover:text-emerald-300 transition-colors font-bold">
                  ↳ Nosso Processo
                </Link>
              </div>

              <div className="space-y-2">
                <Link to="/blog" className="block text-slate-300 hover:text-orange-400 transition-colors">
                  Blog
                </Link>
                <Link to="/contato" className="block text-slate-300 hover:text-orange-400 transition-colors">
                  Contato
                </Link>
                <Link to="/360-graus" className="block text-slate-400 hover:text-orange-400 transition-colors">
                  Solução 360°
                </Link>
                <Link to="/servicos/wordpress" className="block text-slate-400 hover:text-orange-400 transition-colors">
                  Sites WordPress
                </Link>
                <Link to="/servicos/hospedagem" className="block text-slate-400 hover:text-orange-400 transition-colors">
                  Hospedagem cPanel
                </Link>
              </div>
            </div>
          </div>

          {/* Coluna 3: CONTATO */}
          <div className="space-y-4">
            <h3 className="text-white font-mono text-xs font-bold tracking-widest uppercase border-l-2 border-blue-500 pl-3">
              CONTATO
            </h3>

            <div className="space-y-3 text-xs">
              <a
                href="https://wa.me/5548991984678?text=Ola%21+Vim+pelo+site+da+Oz+Digital."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>WhatsApp: (48) 99198-4678</span>
              </a>

              <a
                href="mailto:contato@agenciaoz.com.br"
                className="block text-slate-300 hover:text-white transition-colors"
              >
                E-mail: <span className="text-slate-400">contato@agenciaoz.com.br</span>
              </a>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-slate-300 hover:text-blue-400 transition-colors"
              >
                LinkedIn: <span className="text-slate-400">Oz Digital // Marcelo Krauthein</span>
              </a>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (typeof (window as any).openOzzyChat === 'function') {
                      (window as any).openOzzyChat('Olá Ozzy! Gostaria de contar o que minha empresa precisa.');
                    } else {
                      window.dispatchEvent(new CustomEvent('open-ozzy-chat', {
                        detail: { prompt: 'Olá Ozzy! Gostaria de contar o que minha empresa precisa.' }
                      }));
                    }
                  }}
                  className="bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700/60 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Falar com Assistente Ozzy</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>
            &copy; {currentYear} OZ DIGITAL LTDA. // Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/politica-privacidade" className="hover:text-slate-400 transition-colors">
              Privacidade
            </Link>
            <Link to="/admin/blog" className="text-amber-500/80 hover:text-amber-400 transition-colors font-sans">
              Gestor Admin
            </Link>
            <span className="text-slate-600">React // Express // Docker</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
