import React, { useMemo, useState } from 'react';
import { getOrbitProjects } from '../../../shared/portfolioData';
import type { ProjectId, ProjectSpec } from '../../../shared/types';
import { useLocale } from '../../context/LocaleContext';

export interface SaturnFallbackSvgProps {
  onSelectProject: (projectId: ProjectId) => void;
}

const VIEWBOX_W = 1000;
const VIEWBOX_H = 720;
const CENTER_X = 520;
const CENTER_Y = 350;
const TILT_DEG = -22;
const TILT_RAD = (TILT_DEG * Math.PI) / 180;
const ORBIT_SCALE = 112;
const ELLIPSE_FLATTEN = 0.34;

interface ProjectedSvgNode {
  project: ProjectSpec;
  leftPct: number;
  topPct: number;
  isFront: boolean;
}

function projectOrbitPoint(radius: number, angle: number) {
  const rx = radius * ORBIT_SCALE;
  const ry = rx * ELLIPSE_FLATTEN;
  const x0 = rx * Math.cos(angle);
  const y0 = ry * Math.sin(angle);
  const cosT = Math.cos(TILT_RAD);
  const sinT = Math.sin(TILT_RAD);
  const x = CENTER_X + x0 * cosT - y0 * sinT;
  const y = CENTER_Y + x0 * sinT + y0 * cosT;
  return {
    x,
    y,
    isFront: Math.sin(angle) >= 0,
  };
}

// Deterministic pseudo-random stars & dust specks for SSR/hydration stability
function seededValue(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

export const SaturnFallbackSvg: React.FC<SaturnFallbackSvgProps> = ({ onSelectProject }) => {
  const { locale, t } = useLocale();
  const [activeId, setActiveId] = useState<ProjectId | null>(null);

  const ringRadii = useMemo(() => [2.35, 2.95, 3.45], []);

  const dustParticles = useMemo(() => {
    const items: Array<{ x: number; y: number; r: number; opacity: number; fill: string; isFront: boolean }> = [];
    for (let i = 0; i < 160; i++) {
      const band = i % 3;
      const baseR = band === 0 ? 2.15 : band === 1 ? 2.72 : 3.28;
      const jitter = (seededValue(i * 3 + 1) - 0.5) * 0.42;
      const angle = seededValue(i * 3 + 2) * Math.PI * 2;
      const pt = projectOrbitPoint(baseR + jitter, angle);
      const tone = seededValue(i * 3 + 3);
      const fill = tone > 0.72 ? '#F1EFEA' : tone > 0.35 ? '#C59538' : '#D4722C';
      items.push({
        x: pt.x,
        y: pt.y,
        r: 0.9 + seededValue(i * 7) * 1.4,
        opacity: 0.2 + seededValue(i * 11) * 0.5,
        fill,
        isFront: pt.isFront,
      });
    }
    return items;
  }, []);

  const stars = useMemo(() => {
    const items: Array<{ x: number; y: number; r: number; opacity: number }> = [];
    for (let i = 0; i < 64; i++) {
      items.push({
        x: seededValue(i * 17 + 5) * VIEWBOX_W,
        y: seededValue(i * 19 + 9) * VIEWBOX_H,
        r: 0.7 + seededValue(i * 23 + 3) * 1.2,
        opacity: 0.14 + seededValue(i * 29 + 7) * 0.42,
      });
    }
    return items;
  }, []);

  const nodes = useMemo<ProjectedSvgNode[]>(() => {
    return getOrbitProjects().map(({ project, orbit }) => {
      const pt = projectOrbitPoint(orbit.radius, orbit.initialAngle);
      return {
        project,
        leftPct: (pt.x / VIEWBOX_W) * 100,
        topPct: (pt.y / VIEWBOX_H) * 100,
        isFront: pt.isFront,
      };
    });
  }, []);

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      role="region"
      aria-label={
        locale === 'en'
          ? 'Saturn Orbital System — Orbiting Projects'
          : 'Sistema Orbital Saturno — Projetos em órbita'
      }
    >
      {/* Subtle atmospheric ambient backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 66% 42%, rgba(197, 149, 56, 0.12) 0%, rgba(24, 91, 99, 0.09) 34%, transparent 66%)',
        }}
      />

      {/* Aligned SVG + interactive HTML satellite stage */}
      <div className="absolute inset-x-0 top-10 sm:top-8 lg:inset-y-0 lg:left-[26%] lg:right-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-[920px] aspect-[1000/720]">
          <svg
            viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
            className="w-full h-full block"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="saturn-core" cx="38%" cy="35%" r="68%">
                <stop offset="0%" stopColor="#16212A" />
                <stop offset="52%" stopColor="#0D1319" />
                <stop offset="86%" stopColor="#0B0F13" />
                <stop offset="100%" stopColor="#1C150E" />
              </radialGradient>

              <radialGradient id="saturn-fresnel" cx="50%" cy="50%" r="50%">
                <stop offset="68%" stopColor="#C59538" stopOpacity="0" />
                <stop offset="89%" stopColor="#D4722C" stopOpacity="0.28" />
                <stop offset="97%" stopColor="#C59538" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#F1EFEA" stopOpacity="0.22" />
              </radialGradient>

              <linearGradient id="saturn-teal-band" x1="0%" y1="30%" x2="100%" y2="70%">
                <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0" />
                <stop offset="32%" stopColor="#2DD4BF" stopOpacity="0.22" />
                <stop offset="52%" stopColor="#38B2AC" stopOpacity="0.34" />
                <stop offset="74%" stopColor="#2DD4BF" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
              </linearGradient>

              <radialGradient id="saturn-halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C59538" stopOpacity="0.22" />
                <stop offset="50%" stopColor="#185B63" stopOpacity="0.09" />
                <stop offset="100%" stopColor="#0B0F13" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="ring-metallic" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C59538" stopOpacity="0.48" />
                <stop offset="45%" stopColor="#D4722C" stopOpacity="0.22" />
                <stop offset="75%" stopColor="#38B2AC" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#C59538" stopOpacity="0.42" />
              </linearGradient>

              <clipPath id="saturn-clip">
                <circle cx={CENTER_X} cy={CENTER_Y} r={116} />
              </clipPath>

              <clipPath id="ring-back-clip">
                <rect x="0" y="0" width={VIEWBOX_W} height={CENTER_Y} />
              </clipPath>

              <clipPath id="ring-front-clip">
                <rect x="0" y={CENTER_Y} width={VIEWBOX_W} height={VIEWBOX_H - CENTER_Y} />
              </clipPath>
            </defs>

            {/* Distant starfield */}
            <g>
              {stars.map((s, idx) => (
                <circle key={idx} cx={s.x} cy={s.y} r={s.r} fill="#F1EFEA" opacity={s.opacity} />
              ))}
            </g>

            {/* Outer ambient planetary aura */}
            <circle cx={CENTER_X} cy={CENTER_Y} r={240} fill="url(#saturn-halo)" />

            {/* Back half of orbital rings & dust */}
            <g transform={`rotate(${TILT_DEG} ${CENTER_X} ${CENTER_Y})`} clipPath="url(#ring-back-clip)">
              <ellipse
                cx={CENTER_X}
                cy={CENTER_Y}
                rx={2.78 * ORBIT_SCALE}
                ry={2.78 * ORBIT_SCALE * ELLIPSE_FLATTEN}
                fill="none"
                stroke="#C59538"
                strokeOpacity="0.09"
                strokeWidth="42"
              />
              {ringRadii.map((r, idx) => (
                <ellipse
                  key={`back-${idx}`}
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  rx={r * ORBIT_SCALE}
                  ry={r * ORBIT_SCALE * ELLIPSE_FLATTEN}
                  fill="none"
                  stroke="url(#ring-metallic)"
                  strokeWidth={idx === 1 ? 1.35 : 1}
                  strokeDasharray={idx === 2 ? '3 6' : undefined}
                  opacity={0.72}
                />
              ))}
            </g>

            {/* Back dust particles */}
            <g>
              {dustParticles
                .filter((p) => !p.isFront)
                .map((p, idx) => (
                  <circle
                    key={`bd-${idx}`}
                    cx={p.x}
                    cy={p.y}
                    r={p.r}
                    fill={p.fill}
                    opacity={p.opacity * 0.65}
                  />
                ))}
            </g>

            {/* Central Saturn obsidian sphere */}
            <g>
              <circle cx={CENTER_X} cy={CENTER_Y} r={116} fill="url(#saturn-core)" />
              {/* Internal subtle teal atmospheric filament */}
              <g clipPath="url(#saturn-clip)" transform={`rotate(${TILT_DEG} ${CENTER_X} ${CENTER_Y})`}>
                <ellipse
                  cx={CENTER_X}
                  cy={CENTER_Y + 6}
                  rx={142}
                  ry={22}
                  fill="url(#saturn-teal-band)"
                />
                <ellipse
                  cx={CENTER_X}
                  cy={CENTER_Y - 26}
                  rx={136}
                  ry={11}
                  fill="#C59538"
                  opacity="0.08"
                />
              </g>
              {/* Bronze-gold Fresnel rim glow */}
              <circle cx={CENTER_X} cy={CENTER_Y} r={116} fill="url(#saturn-fresnel)" />
              <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r={116}
                fill="none"
                stroke="#C59538"
                strokeOpacity="0.34"
                strokeWidth="1.2"
              />
            </g>

            {/* Front half of orbital rings */}
            <g transform={`rotate(${TILT_DEG} ${CENTER_X} ${CENTER_Y})`} clipPath="url(#ring-front-clip)">
              <ellipse
                cx={CENTER_X}
                cy={CENTER_Y}
                rx={2.78 * ORBIT_SCALE}
                ry={2.78 * ORBIT_SCALE * ELLIPSE_FLATTEN}
                fill="none"
                stroke="#C59538"
                strokeOpacity="0.13"
                strokeWidth="42"
              />
              {ringRadii.map((r, idx) => (
                <ellipse
                  key={`front-${idx}`}
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  rx={r * ORBIT_SCALE}
                  ry={r * ORBIT_SCALE * ELLIPSE_FLATTEN}
                  fill="none"
                  stroke="url(#ring-metallic)"
                  strokeWidth={idx === 1 ? 1.5 : 1.15}
                  strokeDasharray={idx === 2 ? '3 6' : undefined}
                />
              ))}
            </g>

            {/* Front dust particles */}
            <g>
              {dustParticles
                .filter((p) => p.isFront)
                .map((p, idx) => (
                  <circle key={`fd-${idx}`} cx={p.x} cy={p.y} r={p.r} fill={p.fill} opacity={p.opacity} />
                ))}
            </g>
          </svg>

          {/* 5 Accessible Interactive Satellite Nodes */}
          <div className="absolute inset-0 pointer-events-none">
            {nodes.map(({ project, leftPct, topPct, isFront }) => {
              const isActive = activeId === project.id;
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => onSelectProject(project.id)}
                  onMouseEnter={() => setActiveId(project.id)}
                  onMouseLeave={() => setActiveId((prev) => (prev === project.id ? null : prev))}
                  onFocus={() => setActiveId(project.id)}
                  onBlur={() => setActiveId((prev) => (prev === project.id ? null : prev))}
                  aria-label={t.hero.satelliteClickAria(project.shortName)}
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    zIndex: isActive ? 30 : isFront ? 20 : 10,
                    opacity: isActive ? 1 : isFront ? 0.96 : 0.72,
                  }}
                  className="pointer-events-auto group absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full px-2.5 py-1.5 bg-brand-surface/85 backdrop-blur-md border border-brand-hairline hover:border-brand-gold/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold transition-all duration-200 shadow-lg"
                >
                  <span
                    aria-hidden="true"
                    className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: project.badgeTextColor,
                      boxShadow: `0 0 12px ${project.accentColor}`,
                    }}
                  />
                  <span className="font-mono text-[11px] sm:text-xs font-medium tracking-wide text-brand-ivory whitespace-nowrap">
                    {project.shortName}
                  </span>

                  {/* Micro-preview tooltip on hover or focus */}
                  {isActive && (
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute left-1/2 bottom-full mb-2.5 -translate-x-1/2 w-max max-w-[220px] rounded-lg bg-brand-obsidian/95 border border-brand-gold/45 px-3 py-2 text-left shadow-xl"
                    >
                      <span
                        className="block font-mono text-[10px] uppercase tracking-wider"
                        style={{ color: project.badgeTextColor }}
                      >
                        {project.shortName}
                      </span>
                      <span className="block text-xs font-sans text-brand-ivory/90 leading-snug mt-0.5">
                        {project.role[locale]}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaturnFallbackSvg;
