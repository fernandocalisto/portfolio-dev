import React from 'react';
import { Mail, Github, Linkedin, Phone, Trophy, Building, Rocket } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="sobre" className="py-20 border-t border-brand-borderMuted/40 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Indicator */}
        <div className="flex items-center gap-2 mb-10 text-brand-gold font-mono text-sm font-bold uppercase tracking-wider">
          <span className="text-lg text-brand-amber">▣</span>
          <h2>SOBRE MIM</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Profile Column */}
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl p-1.5 bg-gradient-to-tr from-brand-teal via-brand-gold/60 to-brand-amber mb-5 shadow-2xl">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-brand-dark border border-brand-border">
                <img
                  src="/assets/profile.jpg"
                  alt="Fernando Calisto"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white font-display">
              Fernando Henrique Braga Calisto
            </h3>
            <p className="text-xs font-mono text-brand-teal font-semibold mt-1">
              Desenvolvedor Full-Stack &amp; Arquiteto de Software
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="mailto:fernandocalisto.dev@gmail.com"
                aria-label="Enviar e-mail para Fernando Calisto"
                className="w-10 h-10 rounded-xl bg-brand-card border border-brand-border hover:border-brand-amber hover:text-brand-amber text-slate-400 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
              </a>

              <a
                href="https://github.com/fernandocalisto"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Perfil no GitHub"
                className="w-10 h-10 rounded-xl bg-brand-card border border-brand-border hover:border-brand-teal hover:text-brand-teal text-slate-400 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href="https://www.linkedin.com/in/fernando-henrique-braga-calisto-34a703350/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Perfil no LinkedIn"
                className="w-10 h-10 rounded-xl bg-brand-card border border-brand-border hover:border-brand-teal hover:text-brand-teal text-slate-400 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href="tel:+5518991554376"
                aria-label="Ligue ou mande mensagem no WhatsApp"
                className="w-10 h-10 rounded-xl bg-brand-card border border-brand-border hover:border-brand-amber hover:text-brand-amber text-slate-400 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Description Text Column */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
              Engenharia, Liderança Executiva e Resiliência
            </h3>

            {/* Official Bio */}
            <div className="text-slate-300 text-sm sm:text-base leading-relaxed bg-brand-card/70 border border-brand-border p-6 sm:p-7 rounded-2xl shadow-xl space-y-3">
              <p>
                Estudante de Engenharia da Computação focado em criar arquiteturas de software escaláveis e interfaces
                modernas. Possuo uma forte mentalidade de engenharia de produto,
                com experiência na integração de serviços escaláveis e automação de processos complexos.
              </p>
              <p>
                Sou fundador da startup <strong className="text-white font-semibold">TALOS</strong> e atuo como CEO da
                empresa júnior <strong className="text-white font-semibold">DRAKON Code</strong>, liderando o desenvolvimento
                de soluções tecnológicas de ponta a ponta.
              </p>
              <p className="text-slate-400 text-sm">
                Minha trajetória também conta com vivência internacional como atleta de alto nível, o que consolidou minha
                disciplina, foco cirúrgico e resiliência para entregar resultados consistentes em cenários de alta pressão.
              </p>
            </div>

            {/* Key Pillar Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="bg-brand-card p-4 rounded-xl border border-brand-border hover:border-brand-amber/60 transition-colors">
                <span className="text-brand-amber flex items-center gap-2 text-sm font-bold mb-1.5">
                  <Rocket className="w-4 h-4" />
                  Startup TALOS
                </span>
                <span className="text-slate-400 block text-[11px]">Fundador &amp; Tech Lead Full-Stack</span>
              </div>

              <div className="bg-brand-card p-4 rounded-xl border border-brand-border hover:border-brand-crimson/60 transition-colors">
                <span className="text-brand-crimson flex items-center gap-2 text-sm font-bold mb-1.5">
                  <Building className="w-4 h-4" />
                  DRAKON Code
                </span>
                <span className="text-slate-400 block text-[11px]">CEO &amp; Arquiteto de Software</span>
              </div>

              <div className="sm:col-span-2 bg-brand-card p-4 rounded-xl border border-brand-border hover:border-brand-gold/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <span className="text-brand-gold flex items-center gap-2 text-sm font-bold mb-1.5">
                    <Trophy className="w-4 h-4" />
                    Engenharia &amp; Performance
                  </span>
                  <span className="text-slate-400 block text-[11px]">Foco em Arquiteturas Escaláveis e UI/UX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
