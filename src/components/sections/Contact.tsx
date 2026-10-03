import React, { useState } from 'react';
import { Mail, Phone, Github, Linkedin, Send, Loader2 } from 'lucide-react';

interface ContactProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      onError('Por favor, preencha todos os campos do formulário.');
      return;
    }

    setLoading(true);

    // Realiza o envio via API serverless
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error('Erro ao processar resposta do servidor.');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao enviar mensagem.');
      }

      onSuccess(`Obrigado, ${formData.name}! Sua mensagem foi enviada com sucesso. Entrarei em contato em breve.`);
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      onError(err.message || 'Ocorreu um erro ao enviar sua mensagem. Tente novamente ou use o WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contato" className="py-20 bg-brand-surface/90 border-t border-brand-borderMuted/40 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4 text-brand-gold font-mono text-sm font-bold uppercase tracking-wider">
          <span className="text-lg text-brand-amber">▣</span>
          <h2>VAMOS CONVERSAR</h2>
        </div>

        <p className="text-slate-300 text-base max-w-xl mb-12">
          Fique à vontade para entrar em contato. Vamos conversar sobre arquitetura de software, inovação com IA,
          oportunidades na TALOS ou soluções sob medida para sua empresa.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Direct Channels Column */}
          <div className="lg:col-span-6 space-y-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/5518991554376"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-amber/80 transition-all duration-200 group shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-amber/15 text-brand-amber flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-mono text-slate-400 block uppercase">WHATSAPP / TELEFONE</span>
                <span className="text-white font-mono text-sm tracking-wide group-hover:text-brand-amber transition-colors font-bold">
                  (18) 99155-4376
                </span>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:fernandocalisto.dev@gmail.com"
              className="flex items-center gap-4 p-4 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/80 transition-all duration-200 group shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-mono text-slate-400 block uppercase">E-MAIL PRINCIPAL</span>
                <span className="text-white font-mono text-sm tracking-wide group-hover:text-brand-gold transition-colors font-bold truncate block">
                  fernandocalisto.dev@gmail.com
                </span>
              </div>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/fernandocalisto"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-teal/80 transition-all duration-200 group shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-teal/20 text-brand-teal flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Github className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-mono text-slate-400 block uppercase">GITHUB</span>
                <span className="text-white font-mono text-sm tracking-wide group-hover:text-brand-teal transition-colors font-bold">
                  github.com/fernandocalisto
                </span>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/fernando-henrique-braga-calisto-34a703350/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-teal/80 transition-all duration-200 group shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-teal/20 text-brand-teal flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-mono text-slate-400 block uppercase">LINKEDIN</span>
                <span className="text-white font-mono text-sm tracking-wide group-hover:text-brand-teal transition-colors font-bold truncate block">
                  Fernando Henrique Braga Calisto
                </span>
              </div>
            </a>
          </div>

          {/* Polished Interactive Form */}
          <div className="lg:col-span-6 bg-brand-card border border-brand-border p-6 sm:p-8 rounded-2xl shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Seu Nome
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Como posso lhe chamar?"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 text-slate-200 text-sm focus:border-brand-amber focus:ring-1 focus:ring-brand-amber outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Seu E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="exemplo@empresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 text-slate-200 text-sm focus:border-brand-amber focus:ring-1 focus:ring-brand-amber outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Mensagem ou Ideia de Projeto
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Conte-me um pouco sobre sua ideia, proposta ou oportunidade..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 text-slate-200 text-sm focus:border-brand-amber focus:ring-1 focus:ring-brand-amber outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-amber hover:bg-brand-crimson text-white font-mono text-sm font-bold tracking-wider uppercase rounded-xl transition-all duration-200 shadow-md glow-amber-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Mensagem</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
