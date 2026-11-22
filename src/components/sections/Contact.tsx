import React, { useEffect, useRef, useState } from 'react';
import {
  Mail,
  Github,
  Linkedin,
  Send,
  Loader2,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import { PROFILE } from '../../../shared/portfolioData';
import type { ContactSubject } from '../../../shared/types';
import { useLocale } from '../../context/LocaleContext';

export interface ContactPrefill {
  subject: ContactSubject;
  projectTitle?: string;
  nonce: number;
}

export interface ContactProps {
  prefill?: ContactPrefill | null;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const CONTACT_SUBJECTS: readonly ContactSubject[] = [
  'talos',
  'opportunity',
  'drakon',
  'project',
  'other',
];

export const Contact: React.FC<ContactProps> = ({
  prefill = null,
  onSuccess,
  onError,
}) => {
  const { t } = useLocale();
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    subject: ContactSubject;
    message: string;
    website: string;
  }>({
    name: '',
    email: '',
    subject: 'talos',
    message: '',
    website: '',
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);
  const appliedPrefillNonceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!prefill) return;
    if (appliedPrefillNonceRef.current === prefill.nonce) return;

    appliedPrefillNonceRef.current = prefill.nonce;
    setFormData((prev) => ({
      ...prev,
      subject: prefill.subject,
      message: prefill.projectTitle
        ? t.contact.projectPrefillMessage(prefill.projectTitle)
        : prev.message,
    }));
  }, [prefill, t]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(PROFILE.email);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = PROFILE.email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      setCopied(true);
      onSuccess(t.contact.copiedToast);

      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2400);
    } catch {
      onError(t.contact.genericError);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      onError(t.contact.fillAllError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          subject: formData.subject,
          message: trimmedMessage,
          source: 'form',
          website: formData.website,
        }),
      });

      let data: { error?: string } | null = null;
      try {
        data = (await response.json()) as { error?: string };
      } catch {
        throw new Error(t.contact.genericError);
      }

      if (!response.ok) {
        throw new Error(data?.error || t.contact.genericError);
      }

      onSuccess(t.contact.successMessage(trimmedName));
      setFormData({
        name: '',
        email: '',
        subject: 'talos',
        message: '',
        website: '',
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.message ? err.message : t.contact.genericError;
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contato"
      className="py-24 bg-brand-obsidian border-t border-brand-hairline relative"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden="true" className="w-6 h-px bg-brand-gold" />
            <span className="font-mono text-xs text-brand-gold tracking-wide">
              05 / {t.contact.sectionTitle}
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-brand-ivory tracking-tight max-w-2xl">
            {t.contact.heading}
          </h2>
          <p className="font-sans text-brand-muted text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
            {t.contact.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Direct Official Channels Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Email Card + Copy Button */}
            <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-brand-card border border-brand-hairline hover:border-brand-gold/60 transition-colors">
              <a
                href={`mailto:${PROFILE.email}`}
                className="flex items-center gap-3.5 min-w-0 flex-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 rounded-lg"
              >
                <div className="w-11 h-11 rounded-lg bg-brand-gold/15 border border-brand-gold/30 text-brand-gold flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-sans text-xs text-brand-muted block">
                    {t.contact.emailLabel}
                  </span>
                  <span className="font-mono text-xs sm:text-sm text-brand-ivory group-hover:text-brand-gold transition-colors font-medium truncate block">
                    {PROFILE.email}
                  </span>
                </div>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-sans font-medium flex-shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 ${
                  copied
                    ? 'bg-brand-teal/25 border-brand-tealLight/60 text-brand-tealLight'
                    : 'bg-brand-surface border-brand-hairline text-brand-ivory hover:border-brand-gold/60 hover:text-brand-gold'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.contact.copiedEmail}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.contact.copyEmail}</span>
                  </>
                )}
              </button>
            </div>

            {/* GitHub */}
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-4 rounded-xl bg-brand-card border border-brand-hairline hover:border-brand-tealLight/60 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
            >
              <div className="w-11 h-11 rounded-lg bg-brand-teal/20 border border-brand-tealLight/30 text-brand-tealLight flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Github className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="font-sans text-xs text-brand-muted block">
                  {t.contact.githubLabel}
                </span>
                <span className="font-mono text-xs sm:text-sm text-brand-ivory group-hover:text-brand-tealLight transition-colors font-medium truncate block">
                  github.com/fernandocalisto
                </span>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-4 rounded-xl bg-brand-card border border-brand-hairline hover:border-brand-tealLight/60 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
            >
              <div className="w-11 h-11 rounded-lg bg-brand-teal/20 border border-brand-tealLight/30 text-brand-tealLight flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="font-sans text-xs text-brand-muted block">
                  {t.contact.linkedinLabel}
                </span>
                <span className="font-sans text-sm text-brand-ivory group-hover:text-brand-tealLight transition-colors font-medium truncate block">
                  {PROFILE.fullName}
                </span>
              </div>
            </a>
          </div>

          {/* Interactive Contact Form */}
          <div className="lg:col-span-7 bg-brand-surface border border-brand-hairline p-6 sm:p-8 rounded-2xl shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Hidden Honeypot Anti-Spam Input */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, website: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-sans text-xs font-medium text-brand-muted mb-1.5"
                  >
                    {t.contact.nameLabel}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder={t.contact.namePlaceholder}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full bg-brand-obsidian border border-brand-hairline rounded-xl px-4 py-3 text-brand-ivory placeholder:text-brand-muted/60 font-sans text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-sans text-xs font-medium text-brand-muted mb-1.5"
                  >
                    {t.contact.emailFieldLabel}
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder={t.contact.emailPlaceholder}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full bg-brand-obsidian border border-brand-hairline rounded-xl px-4 py-3 text-brand-ivory placeholder:text-brand-muted/60 font-sans text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Subject Selector */}
              <div>
                <label
                  htmlFor="contact-subject"
                  className="block font-sans text-xs font-medium text-brand-muted mb-1.5"
                >
                  {t.contact.subjectLabel}
                </label>
                <div className="relative">
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subject: e.target.value as ContactSubject,
                      }))
                    }
                    style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
                    className="w-full appearance-none bg-brand-obsidian border border-brand-hairline rounded-xl px-4 py-3 pr-10 text-brand-ivory font-sans text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors cursor-pointer"
                  >
                    {CONTACT_SUBJECTS.map((subj) => (
                      <option
                        key={subj}
                        value={subj}
                        className="bg-brand-surface text-brand-ivory"
                      >
                        {t.contact.subjects[subj]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="w-4 h-4 text-brand-muted pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-sans text-xs font-medium text-brand-muted mb-1.5"
                >
                  {t.contact.messageLabel}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  placeholder={t.contact.messagePlaceholder}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="w-full bg-brand-obsidian border border-brand-hairline rounded-xl px-4 py-3 text-brand-ivory placeholder:text-brand-muted/60 font-sans text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-5 bg-brand-copper hover:bg-brand-copper/90 text-brand-ivory font-sans text-sm font-medium rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.contact.sending}</span>
                  </>
                ) : (
                  <>
                    <span>{t.contact.submit}</span>
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
