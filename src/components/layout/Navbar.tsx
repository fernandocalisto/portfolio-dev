import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Sobre', href: '#sobre' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Skills', href: '#skills' },
    { name: 'Laboratório', href: '#laboratorio' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-darkElevated/95 backdrop-blur-md border-b border-brand-borderMuted/40 py-3 shadow-xl'
          : 'bg-transparent border-b border-brand-borderMuted/20 py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#hero"
          className="group flex items-center gap-1.5 font-mono font-bold text-lg sm:text-xl text-white tracking-wide hover:text-brand-gold transition-colors duration-200"
          aria-label="Fernando Calisto - Página Inicial"
        >
          <span className="text-brand-teal font-extrabold transition-transform group-hover:-translate-x-1">&lt;/</span>
          <span className="text-slate-100 group-hover:text-white font-sans font-extrabold tracking-tight">Fernando Calisto</span>
          <span className="text-brand-teal font-extrabold transition-transform group-hover:translate-x-1">&gt;</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-400">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative py-1 hover:text-brand-gold transition-colors font-mono text-xs uppercase tracking-wider"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="#contato"
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-mono font-semibold text-brand-gold border border-brand-gold/60 rounded hover:bg-brand-amber hover:text-white hover:border-brand-amber transition-all duration-300 shadow-[0_0_12px_rgba(197,149,56,0.15)] group"
          >
            <span>FALE COMIGO</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg bg-brand-card border border-brand-border text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
            aria-label="Alternar menu de navegação"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5 text-brand-amber" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-darkElevated/98 backdrop-blur-xl border-b border-brand-borderMuted px-6 py-6 animate-fadeIn">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-brand-gold font-mono text-sm py-2 border-b border-brand-border/40 flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="text-brand-teal text-xs">→</span>
              </a>
            ))}
            <a
              href="#contato"
              onClick={() => setIsOpen(false)}
              className="mt-2 w-full text-center py-3 text-xs font-mono font-bold tracking-wider uppercase bg-brand-amber text-white rounded hover:bg-brand-crimson transition-colors"
            >
              FALE COMIGO
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
