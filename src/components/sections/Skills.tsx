import React, { useState } from 'react';
import { Cpu, Layers, Server, Code2, Database, Terminal, Bot, Box, Palette, Network } from 'lucide-react';
import { skillsData } from '../../data/skills';

export const Skills: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'backend' | 'frontend' | 'ai' | 'database'>('all');

  const categories = [
    { id: 'all', label: 'Todas as Skills' },
    { id: 'backend', label: 'Backend & Java' },
    { id: 'frontend', label: 'React & Frontend' },
    { id: 'ai', label: 'IA & Automação' },
    { id: 'database', label: 'Bancos de Dados' }
  ];

  const filteredSkills = filter === 'all'
    ? skillsData
    : skillsData.filter((s) => s.category === filter);

  // Render appropriate lucide icon
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-8 h-8" />;
      case 'Layers': return <Layers className="w-8 h-8" />;
      case 'Server': return <Server className="w-8 h-8" />;
      case 'Code2': return <Code2 className="w-8 h-8" />;
      case 'Database': return <Database className="w-8 h-8" />;
      case 'Terminal': return <Terminal className="w-8 h-8" />;
      case 'Bot': return <Bot className="w-8 h-8" />;
      case 'Box': return <Box className="w-8 h-8" />;
      case 'Palette': return <Palette className="w-8 h-8" />;
      case 'Network': return <Network className="w-8 h-8" />;
      default: return <Cpu className="w-8 h-8" />;
    }
  };

  return (
    <section id="skills" className="py-20 bg-brand-surface/90 border-t border-brand-borderMuted/40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-brand-gold font-mono text-sm font-bold uppercase tracking-wider">
            <span className="text-lg text-brand-amber">▣</span>
            <h2>SKILLS &amp; ARSENAL TECNOLÓGICO</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">STACK PRINCIPAL &amp; ECOSSISTEMA AI-FIRST</span>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-4 py-2 rounded-lg font-mono text-xs transition-all ${
                filter === cat.id
                  ? 'bg-brand-teal text-white font-bold border border-brand-teal shadow-md'
                  : 'bg-brand-card text-slate-400 border border-brand-border hover:text-slate-200 hover:border-slate-500'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-brand-card hover:bg-brand-cardHover border border-brand-border hover:border-brand-teal/80 rounded-2xl p-5 flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1 group shadow-lg"
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider group-hover:text-brand-gold transition-colors">
                {skill.categoryLabel}
              </span>

              <div
                className="my-3 transition-transform group-hover:scale-110"
                style={{ color: skill.color }}
              >
                {getIcon(skill.icon)}
              </div>

              <div className="w-full">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-100 font-display truncate">
                  {skill.name}
                </h3>
                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                  {skill.level}
                </span>

                <div
                  className="w-8 h-0.5 mx-auto mt-2.5 rounded-full transition-all group-hover:w-16"
                  style={{ backgroundColor: skill.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
