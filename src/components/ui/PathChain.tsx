import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface PathChainNode {
  key: string;
  label: string;
  sublabel?: string;
  href?: string;
}

interface PathChainProps {
  nodes: PathChainNode[];
  /** Optional label rendered above each connector, e.g. "~2 yrs" for a promotion step. */
  connectorLabels?: (string | undefined)[];
}

function Connector({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center px-1 py-2 sm:px-2">
      {label && <span className="mb-1 font-mono text-[10px] text-paper-400">{label}</span>}
      <svg width="32" height="16" viewBox="0 0 32 16" className="text-signal-teal" aria-hidden="true">
        <line x1="0" y1="8" x2="24" y2="8" stroke="currentColor" strokeWidth="2" className="traversal-line" />
        <path d="M24 3.5 L30 8 L24 12.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Node({ node }: { node: PathChainNode }) {
  const inner: ReactNode = (
    <>
      <p className="font-display text-sm font-medium text-paper-50">{node.label}</p>
      {node.sublabel && <p className="mt-0.5 font-mono text-[11px] text-paper-400">{node.sublabel}</p>}
    </>
  );

  const className =
    "shrink-0 rounded-lg border border-ink-600 bg-ink-800 px-4 py-2.5 text-center transition-colors hover:border-signal-teal/50";

  return node.href ? (
    <Link to={node.href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}

/** Renders `nodes` as a chain connected by animated dashed traversal lines. Wraps on narrow viewports. */
export function PathChain({ nodes, connectorLabels }: PathChainProps) {
  return (
    <div className="flex flex-wrap items-center gap-y-3">
      {nodes.map((node, i) => (
        <div key={node.key} className="flex items-center">
          <Node node={node} />
          {i < nodes.length - 1 && <Connector label={connectorLabels?.[i]} />}
        </div>
      ))}
    </div>
  );
}
