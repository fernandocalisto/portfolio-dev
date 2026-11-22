import React, { useEffect, useId, useMemo, useState } from 'react';
import type { DiagramNodeSpec, Locale, ProjectSpec } from '../../../shared/types';
import { useLocale } from '../../context/LocaleContext';

export interface ProjectArchitectureDiagramProps {
  project: ProjectSpec;
  locale: Locale;
}

interface AccentTheme {
  stroke: string;
  activeFill: string;
  badgeBg: string;
  text: string;
}

const ACCENT_THEMES: Record<NonNullable<DiagramNodeSpec['accent']>, AccentTheme> = {
  teal: {
    stroke: '#38B2AC',
    activeFill: 'rgba(24, 91, 99, 0.34)',
    badgeBg: 'rgba(56, 178, 172, 0.14)',
    text: '#38B2AC',
  },
  gold: {
    stroke: '#C59538',
    activeFill: 'rgba(197, 149, 56, 0.22)',
    badgeBg: 'rgba(197, 149, 56, 0.14)',
    text: '#E5B85B',
  },
  copper: {
    stroke: '#D4722C',
    activeFill: 'rgba(212, 114, 44, 0.24)',
    badgeBg: 'rgba(212, 114, 44, 0.15)',
    text: '#F4A261',
  },
  crimson: {
    stroke: '#F87171',
    activeFill: 'rgba(209, 67, 56, 0.24)',
    badgeBg: 'rgba(248, 113, 113, 0.15)',
    text: '#F87171',
  },
  blue: {
    stroke: '#60A5FA',
    activeFill: 'rgba(30, 111, 168, 0.28)',
    badgeBg: 'rgba(96, 165, 250, 0.15)',
    text: '#60A5FA',
  },
};

const NODE_WIDTH = 128;
const NODE_HEIGHT = 56;
const HALF_W = NODE_WIDTH / 2;
const HALF_H = NODE_HEIGHT / 2;

function computeEdgeSegment(from: DiagramNodeSpec, to: DiagramNodeSpec) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 0 && dy === 0) return null;

  const startScale =
    1 / Math.max(Math.abs(dx) / (HALF_W + 2), Math.abs(dy) / (HALF_H + 2));
  const endScale =
    1 / Math.max(Math.abs(dx) / (HALF_W + 7), Math.abs(dy) / (HALF_H + 7));

  return {
    x1: from.x + dx * startScale,
    y1: from.y + dy * startScale,
    x2: to.x - dx * endScale,
    y2: to.y - dy * endScale,
  };
}

export const ProjectArchitectureDiagram: React.FC<
  ProjectArchitectureDiagramProps
> = ({ project, locale }) => {
  const { t } = useLocale();
  const rawUid = useId();
  const uid = rawUid.replace(/:/g, '');
  const { diagram } = project;

  const [activeNodeId, setActiveNodeId] = useState<string>(
    diagram.nodes[0]?.id ?? ''
  );

  useEffect(() => {
    setActiveNodeId(project.diagram.nodes[0]?.id ?? '');
  }, [project.id, project.diagram.nodes]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, DiagramNodeSpec>();
    for (const node of diagram.nodes) {
      map.set(node.id, node);
    }
    return map;
  }, [diagram.nodes]);

  const activeNode =
    nodeMap.get(activeNodeId) ?? diagram.nodes[0] ?? null;
  const activeIndex = activeNode
    ? diagram.nodes.findIndex((n) => n.id === activeNode.id)
    : -1;
  const activeAccent =
    ACCENT_THEMES[activeNode?.accent ?? 'teal'];

  const handleNodeKeyDown = (
    event: React.KeyboardEvent<SVGGElement>,
    index: number
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveNodeId(diagram.nodes[index].id);
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = (index + 1) % diagram.nodes.length;
      setActiveNodeId(diagram.nodes[next].id);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prev =
        (index - 1 + diagram.nodes.length) % diagram.nodes.length;
      setActiveNodeId(diagram.nodes[prev].id);
    }
  };

  return (
    <div className="rounded-xl bg-brand-obsidian border border-brand-hairline overflow-hidden">
      {/* Diagram Header */}
      <div className="px-4 py-3 border-b border-brand-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-brand-surface/60">
        <span className="font-mono text-xs font-medium text-brand-ivory">
          {t.modal.diagramTitle}
        </span>
        <span className="font-sans text-[11px] text-brand-muted">
          {t.modal.diagramHint}
        </span>
      </div>

      {/* Responsive SVG Canvas */}
      <div className="px-3 py-4 sm:px-4 sm:py-5 overflow-x-auto bg-[radial-gradient(circle_at_50%_0%,rgba(24,91,99,0.12),transparent_70%)]">
        <svg
          viewBox={`0 0 ${diagram.viewBoxWidth} ${diagram.viewBoxHeight}`}
          className="w-full min-w-[540px] h-auto block select-none"
          role="img"
          aria-label={`${t.modal.diagramTitle}: ${project.title[locale]}`}
        >
          <defs>
            <pattern
              id={`grid-${uid}`}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="#24303C"
                strokeOpacity="0.28"
                strokeWidth="0.7"
              />
            </pattern>

            <marker
              id={`arrow-muted-${uid}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#64748B" />
            </marker>

            <marker
              id={`arrow-active-${uid}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill={activeAccent.stroke} />
            </marker>
          </defs>

          {/* Blueprint Grid Backdrop */}
          <rect
            x="0"
            y="0"
            width={diagram.viewBoxWidth}
            height={diagram.viewBoxHeight}
            fill={`url(#grid-${uid})`}
            rx="8"
          />

          {/* Directional Edges */}
          <g>
            {diagram.edges.map((edge) => {
              const fromNode = nodeMap.get(edge.from);
              const toNode = nodeMap.get(edge.to);
              if (!fromNode || !toNode) return null;

              const seg = computeEdgeSegment(fromNode, toNode);
              if (!seg) return null;

              const isConnected =
                edge.from === activeNode?.id || edge.to === activeNode?.id;

              return (
                <g key={`${edge.from}->${edge.to}`}>
                  <line
                    x1={seg.x1}
                    y1={seg.y1}
                    x2={seg.x2}
                    y2={seg.y2}
                    stroke={isConnected ? activeAccent.stroke : '#475569'}
                    strokeOpacity={isConnected ? 0.95 : 0.55}
                    strokeWidth={isConnected ? 1.8 : 1.2}
                    strokeDasharray={isConnected ? '4 2.5' : undefined}
                    markerEnd={
                      isConnected
                        ? `url(#arrow-active-${uid})`
                        : `url(#arrow-muted-${uid})`
                    }
                  />
                  {edge.label && (
                    <text
                      x={(seg.x1 + seg.x2) / 2}
                      y={(seg.y1 + seg.y2) / 2 - 6}
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="8.5"
                      fontFamily='"JetBrains Mono", monospace'
                    >
                      {edge.label[locale]}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Interactive Architecture Nodes */}
          <g>
            {diagram.nodes.map((node, index) => {
              const isActive = node.id === activeNode?.id;
              const theme = ACCENT_THEMES[node.accent ?? 'teal'];
              const rectX = node.x - HALF_W;
              const rectY = node.y - HALF_H;

              return (
                <g
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  aria-label={`${node.label[locale]}${
                    node.sublabel ? ` — ${node.sublabel[locale]}` : ''
                  }`}
                  onClick={() => setActiveNodeId(node.id)}
                  onMouseEnter={() => setActiveNodeId(node.id)}
                  onFocus={() => setActiveNodeId(node.id)}
                  onKeyDown={(e) => handleNodeKeyDown(e, index)}
                  className="cursor-pointer outline-none"
                >
                  {/* Active Halo */}
                  {isActive && (
                    <rect
                      x={rectX - 3}
                      y={rectY - 3}
                      width={NODE_WIDTH + 6}
                      height={NODE_HEIGHT + 6}
                      rx="11"
                      fill="none"
                      stroke={theme.stroke}
                      strokeOpacity="0.4"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Node Card */}
                  <rect
                    x={rectX}
                    y={rectY}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    rx="8"
                    fill={isActive ? theme.activeFill : '#12181F'}
                    stroke={isActive ? theme.stroke : '#24303C'}
                    strokeWidth={isActive ? 1.6 : 1.1}
                  />

                  {/* Top Accent Indicator Bar */}
                  <rect
                    x={rectX + 12}
                    y={rectY}
                    width={NODE_WIDTH - 24}
                    height="2.5"
                    rx="1.25"
                    fill={theme.stroke}
                    fillOpacity={isActive ? 1 : 0.6}
                  />

                  {/* Node Label */}
                  <text
                    x={node.x}
                    y={node.sublabel ? node.y - 4 : node.y + 4}
                    textAnchor="middle"
                    fill="#F1EFEA"
                    fontSize="9.8"
                    fontWeight="600"
                    fontFamily='"JetBrains Mono", monospace'
                  >
                    {node.label[locale]}
                  </text>

                  {/* Node Sublabel */}
                  {node.sublabel && (
                    <text
                      x={node.x}
                      y={node.y + 13}
                      textAnchor="middle"
                      fill={isActive ? theme.text : '#94A3B8'}
                      fontSize="8.8"
                      fontFamily='"DM Sans", sans-serif'
                    >
                      {node.sublabel[locale]}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Node Inspection Detail Panel */}
      {activeNode && (
        <div
          aria-live="polite"
          className="px-4 py-3.5 border-t border-brand-hairline bg-brand-card/90 flex flex-col gap-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded border"
                style={{
                  color: activeAccent.text,
                  backgroundColor: activeAccent.badgeBg,
                  borderColor: `${activeAccent.stroke}55`,
                }}
              >
                {String(activeIndex + 1).padStart(2, '0')} /{' '}
                {String(diagram.nodes.length).padStart(2, '0')}
              </span>
              <span className="font-mono text-xs font-semibold text-brand-ivory">
                {activeNode.label[locale]}
              </span>
              {activeNode.sublabel && (
                <span className="font-sans text-xs text-brand-muted">
                  · {activeNode.sublabel[locale]}
                </span>
              )}
            </div>

            {/* Quick Step Dots for Mobile & Keyboard Discovery */}
            <div className="flex items-center gap-1.5">
              {diagram.nodes.map((node) => {
                const isSelected = node.id === activeNode.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveNodeId(node.id)}
                    aria-label={node.label[locale]}
                    aria-pressed={isSelected}
                    className={`h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 ${
                      isSelected
                        ? 'w-5 bg-brand-gold'
                        : 'w-2 bg-brand-hairline hover:bg-brand-muted'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <p className="font-sans text-xs sm:text-sm text-brand-ivory/90 leading-relaxed">
            {activeNode.detail[locale]}
          </p>
        </div>
      )}
    </div>
  );
};
