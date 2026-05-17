"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Tag } from "lucide-react";

/* ── Types ───────────────────────────────────────────────── */
type Category =
  | "All"
  | "Databricks"
  | "AI Agents"
  | "DataOps"
  | "Data Mesh"
  | "dbt"
  | "Enterprise Architecture";

interface Diagram {
  id: string;
  title: string;
  description: string;
  categories: Category[];
  tags: string[];
  accent: {
    label: string;
    labelText: string;
    labelBg: string;
    glow: string;
    border: string;
  };
  Preview: React.FC;
  Detail: React.FC;
}

/* ── SVG primitives ──────────────────────────────────────── */
type N = number | string;

const Arrow = ({
  x1, y1, x2, y2, color = "#52525b",
}: {
  x1: N; y1: N; x2: N; y2: N; color?: string;
}) => (
  <line
    x1={x1} y1={y1} x2={x2} y2={y2}
    stroke={color} strokeWidth="1.5"
    strokeLinecap="round"
    markerEnd={`url(#arrowHead-${color.replace("#", "")})`}
  />
);

const ArrowDefs = ({ colors }: { colors: string[] }) => (
  <defs>
    {colors.map((c) => (
      <marker
        key={c}
        id={`arrowHead-${c.replace("#", "")}`}
        markerWidth="6" markerHeight="6"
        refX="5" refY="3" orient="auto"
      >
        <path d="M 0 0 L 6 3 L 0 6 z" fill={c} />
      </marker>
    ))}
  </defs>
);

const Node = ({
  x, y, w, h, fill, stroke, label, subLabel, textColor = "#a1a1aa", fontSize = 9, rx = 5,
}: {
  x: N; y: N; w: N; h: N;
  fill: string; stroke: string;
  label: string; subLabel?: string;
  textColor?: string; fontSize?: number; rx?: number;
}) => {
  const nx = Number(x), ny = Number(y), nw = Number(w), nh = Number(h);
  return (
    <g>
      <rect x={nx} y={ny} width={nw} height={nh} rx={rx} fill={fill} stroke={stroke} strokeWidth="1" />
      <text
        x={nx + nw / 2} y={ny + (subLabel ? nh / 2 - 4 : nh / 2 + 1)}
        textAnchor="middle" dominantBaseline="middle"
        fill={textColor} fontSize={fontSize}
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        fontWeight="500"
      >
        {label}
      </text>
      {subLabel && (
        <text
          x={nx + nw / 2} y={ny + nh / 2 + 9}
          textAnchor="middle" dominantBaseline="middle"
          fill="#52525b" fontSize={7}
          fontFamily="ui-monospace, SFMono-Regular, monospace"
        >
          {subLabel}
        </text>
      )}
    </g>
  );
};

const LayerLabel = ({ x, y, text, color }: { x: number | string; y: number | string; text: string; color: string }) => (
  <text
    x={x} y={y} textAnchor="middle"
    fill={color} fontSize={8}
    fontFamily="ui-monospace, SFMono-Regular, monospace"
    fontWeight="600" letterSpacing="1"
  >
    {text.toUpperCase()}
  </text>
);

/* ── Diagram 1: Lakehouse Architecture ───────────────────── */
function LakehousePreview() {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" role="img" aria-label="Lakehouse Architecture">
      <ArrowDefs colors={["#52525b", "#f97316", "#818cf8"]} />
      <rect width="320" height="180" fill="#18181b" rx="8" />

      {/* Layer backgrounds */}
      <rect x="8"   y="20" width="64"  height="148" rx="4" fill="#1c1917" stroke="#292524" strokeWidth="1" />
      <rect x="80"  y="20" width="64"  height="148" rx="4" fill="#1c1917" stroke="#78350f" strokeWidth="1" strokeOpacity="0.4" />
      <rect x="152" y="20" width="64"  height="148" rx="4" fill="#1c1917" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3" />
      <rect x="224" y="20" width="88"  height="148" rx="4" fill="#1c1917" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.4" />

      <LayerLabel x="40"  y="15" text="Ingest"  color="#78716c" />
      <LayerLabel x="112" y="15" text="Bronze"  color="#c2410c" />
      <LayerLabel x="184" y="15" text="Silver"  color="#2563eb" />
      <LayerLabel x="268" y="15" text="Gold"    color="#6366f1" />

      {/* Ingest sources */}
      <Node x="14" y="38"  w="52" h="22" fill="#27272a" stroke="#3f3f46" label="S3 / GCS"   fontSize={8} />
      <Node x="14" y="72"  w="52" h="22" fill="#27272a" stroke="#3f3f46" label="REST APIs"  fontSize={8} />
      <Node x="14" y="106" w="52" h="22" fill="#27272a" stroke="#3f3f46" label="Databases"  fontSize={8} />
      <Node x="14" y="140" w="52" h="22" fill="#27272a" stroke="#3f3f46" label="Streams"    fontSize={8} />

      {/* Bronze */}
      <Node x="86"  y="50"  w="52" h="24" fill="#431407" stroke="#c2410c" label="Raw Delta"   subLabel="DLT / COPY" textColor="#fdba74" fontSize={8} />
      <Node x="86"  y="92"  w="52" h="24" fill="#431407" stroke="#c2410c" label="Raw Events"  subLabel="DLT"        textColor="#fdba74" fontSize={8} />
      <Node x="86"  y="134" w="52" h="24" fill="#431407" stroke="#c2410c" label="Raw Streams" subLabel="Autoloader" textColor="#fdba74" fontSize={8} />

      {/* Silver */}
      <Node x="158" y="50"  w="52" h="24" fill="#1e3a5f" stroke="#3b82f6" label="Staged"     subLabel="dbt clean"   textColor="#93c5fd" fontSize={8} />
      <Node x="158" y="92"  w="52" h="24" fill="#1e3a5f" stroke="#3b82f6" label="Conformed"  subLabel="dbt schema"  textColor="#93c5fd" fontSize={8} />
      <Node x="158" y="134" w="52" h="24" fill="#1e3a5f" stroke="#3b82f6" label="Enriched"   subLabel="Joins"       textColor="#93c5fd" fontSize={8} />

      {/* Gold */}
      <Node x="230" y="38"  w="72" h="22" fill="#2e1065" stroke="#818cf8" label="fct_orders"     textColor="#c4b5fd" fontSize={8} />
      <Node x="230" y="68"  w="72" h="22" fill="#2e1065" stroke="#818cf8" label="dim_customers"  textColor="#c4b5fd" fontSize={8} />
      <Node x="230" y="98"  w="72" h="22" fill="#2e1065" stroke="#818cf8" label="Marketing Mart" textColor="#c4b5fd" fontSize={8} />
      <Node x="230" y="128" w="72" h="22" fill="#2e1065" stroke="#818cf8" label="Finance Mart"   textColor="#c4b5fd" fontSize={8} />

      {/* Arrows: ingest → bronze */}
      <Arrow x1="66" y1="49"  x2="84" y2="60"  color="#52525b" />
      <Arrow x1="66" y1="83"  x2="84" y2="103" color="#52525b" />
      <Arrow x1="66" y1="117" x2="84" y2="145" color="#52525b" />

      {/* Arrows: bronze → silver */}
      <Arrow x1="138" y1="62"  x2="156" y2="62"  color="#52525b" />
      <Arrow x1="138" y1="104" x2="156" y2="104" color="#52525b" />
      <Arrow x1="138" y1="146" x2="156" y2="146" color="#52525b" />

      {/* Arrows: silver → gold */}
      <Arrow x1="210" y1="62"  x2="228" y2="49"  color="#818cf8" />
      <Arrow x1="210" y1="104" x2="228" y2="79"  color="#818cf8" />
      <Arrow x1="210" y1="104" x2="228" y2="109" color="#818cf8" />
      <Arrow x1="210" y1="146" x2="228" y2="139" color="#818cf8" />
    </svg>
  );
}

function LakehouseDetail() {
  return (
    <svg viewBox="0 0 560 340" className="w-full h-full" role="img" aria-label="Lakehouse Architecture Detail">
      <ArrowDefs colors={["#52525b", "#f97316", "#818cf8", "#3b82f6"]} />
      <rect width="560" height="340" fill="#18181b" rx="10" />

      {/* Layer backgrounds */}
      <rect x="12"  y="30" width="100" height="296" rx="6" fill="#1c1917" stroke="#292524" strokeWidth="1" />
      <rect x="122" y="30" width="110" height="296" rx="6" fill="#1c1917" stroke="#78350f" strokeWidth="1" strokeOpacity="0.5" />
      <rect x="244" y="30" width="110" height="296" rx="6" fill="#1c1917" stroke="#1d4ed8" strokeWidth="1" strokeOpacity="0.4" />
      <rect x="366" y="30" width="178" height="296" rx="6" fill="#1c1917" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.5" />

      <LayerLabel x="62"  y="24" text="Sources"  color="#78716c" />
      <LayerLabel x="177" y="24" text="Bronze"   color="#ea580c" />
      <LayerLabel x="299" y="24" text="Silver"   color="#2563eb" />
      <LayerLabel x="455" y="24" text="Gold"     color="#6366f1" />

      {/* Sources */}
      <Node x="20" y="48"  w="84" h="28" fill="#27272a" stroke="#3f3f46" label="Amazon S3"    subLabel="Object store"   textColor="#d4d4d8" />
      <Node x="20" y="90"  w="84" h="28" fill="#27272a" stroke="#3f3f46" label="REST APIs"    subLabel="3rd-party SaaS" textColor="#d4d4d8" />
      <Node x="20" y="132" w="84" h="28" fill="#27272a" stroke="#3f3f46" label="Databases"    subLabel="Oracle / MSSQL" textColor="#d4d4d8" />
      <Node x="20" y="174" w="84" h="28" fill="#27272a" stroke="#3f3f46" label="Kafka Topics" subLabel="Redpanda"       textColor="#d4d4d8" />
      <Node x="20" y="216" w="84" h="28" fill="#27272a" stroke="#3f3f46" label="Webhooks"     subLabel="Event streams"  textColor="#d4d4d8" />

      {/* Bronze */}
      <Node x="130" y="56"  w="94" h="32" fill="#431407" stroke="#c2410c" label="Raw Transactions" subLabel="DLT · Autoloader"  textColor="#fdba74" />
      <Node x="130" y="104" w="94" h="32" fill="#431407" stroke="#c2410c" label="Raw API Events"   subLabel="COPY INTO"          textColor="#fdba74" />
      <Node x="130" y="152" w="94" h="32" fill="#431407" stroke="#c2410c" label="Raw CDC Records"  subLabel="Debezium → DLT"     textColor="#fdba74" />
      <Node x="130" y="200" w="94" h="32" fill="#431407" stroke="#c2410c" label="Raw Streams"      subLabel="Delta Live Tables"  textColor="#fdba74" />
      <Node x="130" y="248" w="94" h="32" fill="#431407" stroke="#c2410c" label="Dead Letter Q"    subLabel="Malformed events"   textColor="#f87171" />

      {/* Silver */}
      <Node x="252" y="56"  w="94" h="32" fill="#1e3a5f" stroke="#3b82f6" label="stg_transactions" subLabel="dbt staging"     textColor="#93c5fd" />
      <Node x="252" y="104" w="94" h="32" fill="#1e3a5f" stroke="#3b82f6" label="stg_customers"    subLabel="dbt staging"     textColor="#93c5fd" />
      <Node x="252" y="152" w="94" h="32" fill="#1e3a5f" stroke="#3b82f6" label="int_enriched"     subLabel="dbt intermediate" textColor="#93c5fd" />
      <Node x="252" y="200" w="94" h="32" fill="#1e3a5f" stroke="#3b82f6" label="int_risk_signals" subLabel="dbt intermediate" textColor="#93c5fd" />

      {/* Gold */}
      <Node x="374" y="48"  w="154" h="28" fill="#2e1065" stroke="#818cf8" label="fct_transactions"  textColor="#c4b5fd" />
      <Node x="374" y="84"  w="154" h="28" fill="#2e1065" stroke="#818cf8" label="dim_customers"     textColor="#c4b5fd" />
      <Node x="374" y="120" w="154" h="28" fill="#2e1065" stroke="#818cf8" label="dim_products"      textColor="#c4b5fd" />
      <Node x="374" y="156" w="154" h="28" fill="#1a1a2e" stroke="#6366f1" label="Marketing Mart"    textColor="#a5b4fc" />
      <Node x="374" y="192" w="154" h="28" fill="#1a1a2e" stroke="#6366f1" label="Finance Mart"      textColor="#a5b4fc" />
      <Node x="374" y="228" w="154" h="28" fill="#1a1a2e" stroke="#6366f1" label="Risk Mart"         textColor="#a5b4fc" />
      <Node x="374" y="264" w="154" h="28" fill="#0a0a1a" stroke="#4f46e5" label="MetricFlow Metrics" textColor="#818cf8" />

      {/* Arrows src→bronze */}
      {[[62,62,128,72],[62,104,128,120],[62,146,128,168],[62,188,128,216],[62,230,128,264]].map(([x1,y1,x2,y2],i) => (
        <Arrow key={i} x1={x1} y1={y1} x2={x2} y2={y2} color="#52525b" />
      ))}
      {/* Arrows bronze→silver */}
      {[[224,72,250,72],[224,120,250,120],[224,168,250,168],[224,216,250,216]].map(([x1,y1,x2,y2],i) => (
        <Arrow key={i} x1={x1} y1={y1} x2={x2} y2={y2} color="#52525b" />
      ))}
      {/* Arrows silver→gold */}
      {[[346,72,372,62],[346,120,372,98],[346,168,372,142],[346,216,372,170],[346,216,372,206]].map(([x1,y1,x2,y2],i) => (
        <Arrow key={i} x1={x1} y1={y1} x2={x2} y2={y2} color="#818cf8" />
      ))}

      {/* Unity Catalog badge */}
      <rect x="8" y="292" width="544" height="36" rx="6" fill="#1a1625" stroke="#4f46e5" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="4 3" />
      <text x="280" y="314" textAnchor="middle" fill="#818cf8" fontSize={9} fontFamily="ui-monospace,monospace" fontWeight="600" letterSpacing="1">
        UNITY CATALOG — LINEAGE · GOVERNANCE · ACCESS POLICIES · PII TAGS
      </text>
    </svg>
  );
}

/* ── Diagram 2: AI Orchestration ─────────────────────────── */
function AIOrchestrationPreview() {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" role="img" aria-label="AI Agent Orchestration">
      <ArrowDefs colors={["#52525b", "#a78bfa", "#818cf8"]} />
      <rect width="320" height="180" fill="#18181b" rx="8" />

      {/* Central agent */}
      <rect x="120" y="70" width="80" height="40" rx="8" fill="#2e1065" stroke="#818cf8" strokeWidth="1.5" />
      <text x="160" y="87" textAnchor="middle" fill="#c4b5fd" fontSize={9} fontFamily="ui-monospace,monospace" fontWeight="700">AI Agent</text>
      <text x="160" y="100" textAnchor="middle" fill="#7c3aed" fontSize={7.5} fontFamily="ui-monospace,monospace">Router / Planner</text>

      {/* LLM */}
      <Node x="14" y="72" w="80" h="36" fill="#1a0533" stroke="#a78bfa" label="LLM API" subLabel="GPT-4 · Claude" textColor="#c4b5fd" />
      {/* MCP Server */}
      <Node x="228" y="38" w="80" h="30" fill="#1a1025" stroke="#6d28d9" label="MCP Server" subLabel="Tool dispatcher" textColor="#a78bfa" />
      {/* Databricks */}
      <Node x="228" y="78" w="80" h="28" fill="#1c1917" stroke="#f97316" label="Databricks" subLabel="Unity Catalog" textColor="#fdba74" />
      {/* dbt */}
      <Node x="228" y="116" w="80" h="28" fill="#1c1917" stroke="#fbbf24" label="dbt Cloud" subLabel="Schema + test" textColor="#fde68a" />
      {/* Vector DB */}
      <Node x="120" y="138" w="80" h="30" fill="#1a2533" stroke="#38bdf8" label="Vector Store" subLabel="RAG context" textColor="#7dd3fc" />
      {/* User */}
      <Node x="14" y="20" w="80" h="28" fill="#27272a" stroke="#3f3f46" label="User / App" subLabel="NL request" textColor="#e4e4e7" />
      {/* Response */}
      <Node x="14" y="128" w="80" h="30" fill="#27272a" stroke="#3f3f46" label="Response" subLabel="Grounded answer" textColor="#e4e4e7" />

      {/* Arrows */}
      <Arrow x1="94" y1="34" x2="118" y2="72" color="#52525b" />
      <Arrow x1="94" y1="90" x2="118" y2="90" color="#a78bfa" />
      <Arrow x1="200" y1="82" x2="226" y2="54" color="#a78bfa" />
      <Arrow x1="200" y1="90" x2="226" y2="92" color="#a78bfa" />
      <Arrow x1="200" y1="98" x2="226" y2="128" color="#a78bfa" />
      <Arrow x1="160" y1="110" x2="160" y2="136" color="#38bdf8" />
      <Arrow x1="120" y1="153" x2="94" y2="143" color="#38bdf8" />
      <Arrow x1="72" y1="138" x2="72" y2="118" color="#52525b" />

      {/* Pulse dot on agent */}
      <circle cx="160" cy="90" r="3" fill="#818cf8" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function AIOrchestrationDetail() {
  return (
    <svg viewBox="0 0 560 340" className="w-full h-full" role="img" aria-label="AI Agent Orchestration Detail">
      <ArrowDefs colors={["#52525b", "#a78bfa", "#818cf8", "#38bdf8", "#f97316"]} />
      <rect width="560" height="340" fill="#18181b" rx="10" />

      {/* Central hub */}
      <rect x="200" y="128" width="160" height="60" rx="10" fill="#2e1065" stroke="#818cf8" strokeWidth="2" />
      <text x="280" y="152" textAnchor="middle" fill="#c4b5fd" fontSize={11} fontFamily="ui-monospace,monospace" fontWeight="700">AI Agent Orchestrator</text>
      <text x="280" y="168" textAnchor="middle" fill="#7c3aed" fontSize={9} fontFamily="ui-monospace,monospace">Planner · Router · Executor</text>
      <circle cx="280" cy="158" r="5" fill="#818cf8" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* LLM */}
      <Node x="14" y="120" w="110" h="44" fill="#1a0533" stroke="#a78bfa" label="LLM API" subLabel="claude-3 · gpt-4o" textColor="#c4b5fd" />
      {/* User */}
      <Node x="14" y="50" w="110" h="40" fill="#27272a" stroke="#3f3f46" label="User / Application" subLabel="Natural language" textColor="#e4e4e7" />
      {/* Response */}
      <Node x="14" y="230" w="110" h="40" fill="#27272a" stroke="#4f46e5" label="Grounded Response" subLabel="Cited · Validated" textColor="#a5b4fc" />

      {/* MCP layer */}
      <rect x="368" y="100" width="174" height="26" rx="6" fill="#1a1025" stroke="#6d28d9" strokeWidth="1" />
      <text x="455" y="117" textAnchor="middle" fill="#a78bfa" fontSize={8.5} fontFamily="ui-monospace,monospace" fontWeight="600">MCP SERVER LAYER</text>

      {/* Tools */}
      <Node x="368" y="136" w="80" h="32" fill="#1c1917" stroke="#f97316" label="Databricks" subLabel="Unity Catalog" textColor="#fdba74" />
      <Node x="458" y="136" w="80" h="32" fill="#1c1917" stroke="#fbbf24" label="dbt Cloud"   subLabel="Run · Test · Docs" textColor="#fde68a" />
      <Node x="368" y="180" w="80" h="32" fill="#1a2533" stroke="#38bdf8" label="Vector Store" subLabel="RAG · Embeddings" textColor="#7dd3fc" />
      <Node x="458" y="180" w="80" h="32" fill="#1a2a1a" stroke="#34d399" label="Data APIs"   subLabel="Metrics · KPIs" textColor="#6ee7b7" />
      <Node x="368" y="224" w="170" h="32" fill="#1c1c1c" stroke="#3f3f46" label="GitHub · Slack · Notion" subLabel="Operational tools" textColor="#a1a1aa" />

      {/* Memory / context */}
      <Node x="200" y="50" w="160" h="44" fill="#14261f" stroke="#34d399" label="Conversation Memory" subLabel="Tool history · Short-term state" textColor="#6ee7b7" />

      {/* Eval */}
      <Node x="200" y="272" w="160" h="44" fill="#1a1a2e" stroke="#6366f1" label="Eval + Guardrails" subLabel="Hallucination · Scope checks" textColor="#a5b4fc" />

      {/* Arrows */}
      <Arrow x1="124" y1="70" x2="198" y2="148" color="#52525b" />
      <Arrow x1="124" y1="142" x2="198" y2="155" color="#a78bfa" />
      <Arrow x1="198" y1="165" x2="124" y2="248" color="#52525b" />
      <Arrow x1="280" y1="128" x2="280" y2="96" color="#34d399" />
      <Arrow x1="360" y1="158" x2="368" y2="152" color="#a78bfa" />
      <Arrow x1="360" y1="158" x2="368" y2="174" color="#a78bfa" />
      <Arrow x1="360" y1="175" x2="368" y2="194" color="#a78bfa" />
      <Arrow x1="360" y1="175" x2="368" y2="240" color="#52525b" />
      <Arrow x1="280" y1="188" x2="280" y2="270" color="#6366f1" />
    </svg>
  );
}

/* ── Diagram 3: Data Mesh ─────────────────────────────────── */
function DataMeshPreview() {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" role="img" aria-label="Data Mesh Architecture">
      <ArrowDefs colors={["#52525b", "#34d399"]} />
      <rect width="320" height="180" fill="#18181b" rx="8" />

      {/* Central governance */}
      <rect x="112" y="68" width="96" height="44" rx="8" fill="#14261f" stroke="#34d399" strokeWidth="1.5" />
      <text x="160" y="87" textAnchor="middle" fill="#6ee7b7" fontSize={8.5} fontFamily="ui-monospace,monospace" fontWeight="700">Data Catalog</text>
      <text x="160" y="101" textAnchor="middle" fill="#059669" fontSize={7} fontFamily="ui-monospace,monospace">Governance plane</text>

      {/* Domain nodes */}
      <Node x="14"  y="18"  w="88" h="50" fill="#1a1025" stroke="#818cf8" label="Marketing Domain" subLabel="Data Products" textColor="#c4b5fd" />
      <Node x="218" y="18"  w="88" h="50" fill="#1c1917" stroke="#f97316" label="Finance Domain"   subLabel="Data Products" textColor="#fdba74" />
      <Node x="14"  y="112" w="88" h="50" fill="#1a2533" stroke="#38bdf8" label="Operations"       subLabel="Data Products" textColor="#7dd3fc" />
      <Node x="218" y="112" w="88" h="50" fill="#14261f" stroke="#34d399" label="Product Domain"   subLabel="Data Products" textColor="#6ee7b7" />

      {/* Data products inside domains */}
      <rect x="20" y="36" width="34" height="16" rx="3" fill="#2e1065" stroke="#6366f1" strokeWidth="0.5" />
      <text x="37" y="46" textAnchor="middle" fill="#818cf8" fontSize={6.5} fontFamily="ui-monospace,monospace">campaigns</text>
      <rect x="60" y="36" width="34" height="16" rx="3" fill="#2e1065" stroke="#6366f1" strokeWidth="0.5" />
      <text x="77" y="46" textAnchor="middle" fill="#818cf8" fontSize={6.5} fontFamily="ui-monospace,monospace">leads</text>

      {/* Mesh connections */}
      <Arrow x1="102" y1="43" x2="110" y2="78"  color="#34d399" />
      <Arrow x1="218" y1="43" x2="210" y2="78"  color="#34d399" />
      <Arrow x1="102" y1="137" x2="110" y2="100" color="#34d399" />
      <Arrow x1="218" y1="137" x2="210" y2="100" color="#34d399" />
      {/* Cross-domain */}
      <line x1="102" y1="43" x2="218" y2="43" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 3" />
      <line x1="102" y1="137" x2="218" y2="137" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 3" />

      {/* Self-serve label */}
      <rect x="8" y="168" width="304" height="10" rx="3" fill="#14261f" stroke="#34d399" strokeWidth="0.5" strokeOpacity="0.5" />
      <text x="160" y="175" textAnchor="middle" fill="#059669" fontSize={6.5} fontFamily="ui-monospace,monospace" letterSpacing="1">SELF-SERVE DATA PLATFORM — FEDERATED GOVERNANCE</text>
    </svg>
  );
}

function DataMeshDetail() {
  return (
    <svg viewBox="0 0 560 340" className="w-full h-full" role="img" aria-label="Data Mesh Detail">
      <ArrowDefs colors={["#52525b", "#34d399", "#818cf8"]} />
      <rect width="560" height="340" fill="#18181b" rx="10" />

      {/* Governance plane */}
      <rect x="180" y="130" width="200" height="60" rx="10" fill="#14261f" stroke="#34d399" strokeWidth="2" />
      <text x="280" y="156" textAnchor="middle" fill="#6ee7b7" fontSize={11} fontFamily="ui-monospace,monospace" fontWeight="700">Data Catalog</text>
      <text x="280" y="174" textAnchor="middle" fill="#059669" fontSize={9} fontFamily="ui-monospace,monospace">Federated Governance Plane</text>

      {/* Domain: Marketing */}
      <rect x="20" y="20" width="160" height="100" rx="8" fill="#1a1025" stroke="#818cf8" strokeWidth="1.5" />
      <text x="100" y="40" textAnchor="middle" fill="#c4b5fd" fontSize={10} fontFamily="ui-monospace,monospace" fontWeight="700">Marketing Domain</text>
      <Node x="30"  y="50" w="64" h="24" fill="#2e1065" stroke="#6366f1" label="campaigns"   fontSize={8} textColor="#a5b4fc" />
      <Node x="106" y="50" w="64" h="24" fill="#2e1065" stroke="#6366f1" label="leads"       fontSize={8} textColor="#a5b4fc" />
      <Node x="30"  y="84" w="64" h="24" fill="#2e1065" stroke="#6366f1" label="attribution"  fontSize={8} textColor="#a5b4fc" />
      <Node x="106" y="84" w="64" h="24" fill="#2e1065" stroke="#6366f1" label="funnels"     fontSize={8} textColor="#a5b4fc" />

      {/* Domain: Finance */}
      <rect x="380" y="20" width="160" height="100" rx="8" fill="#1c1917" stroke="#f97316" strokeWidth="1.5" />
      <text x="460" y="40" textAnchor="middle" fill="#fdba74" fontSize={10} fontFamily="ui-monospace,monospace" fontWeight="700">Finance Domain</text>
      <Node x="390" y="50" w="64" h="24" fill="#431407" stroke="#c2410c" label="revenue"    fontSize={8} textColor="#fdba74" />
      <Node x="466" y="50" w="64" h="24" fill="#431407" stroke="#c2410c" label="invoices"   fontSize={8} textColor="#fdba74" />
      <Node x="390" y="84" w="64" h="24" fill="#431407" stroke="#c2410c" label="budgets"    fontSize={8} textColor="#fdba74" />
      <Node x="466" y="84" w="64" h="24" fill="#431407" stroke="#c2410c" label="forecasts"  fontSize={8} textColor="#fdba74" />

      {/* Domain: Operations */}
      <rect x="20" y="220" width="160" height="100" rx="8" fill="#1a2533" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="100" y="240" textAnchor="middle" fill="#7dd3fc" fontSize={10} fontFamily="ui-monospace,monospace" fontWeight="700">Operations Domain</text>
      <Node x="30"  y="250" w="64" h="24" fill="#0c4a6e" stroke="#0284c7" label="orders"    fontSize={8} textColor="#7dd3fc" />
      <Node x="106" y="250" w="64" h="24" fill="#0c4a6e" stroke="#0284c7" label="inventory" fontSize={8} textColor="#7dd3fc" />
      <Node x="30"  y="284" w="64" h="24" fill="#0c4a6e" stroke="#0284c7" label="logistics" fontSize={8} textColor="#7dd3fc" />
      <Node x="106" y="284" w="64" h="24" fill="#0c4a6e" stroke="#0284c7" label="suppliers" fontSize={8} textColor="#7dd3fc" />

      {/* Domain: Product */}
      <rect x="380" y="220" width="160" height="100" rx="8" fill="#14261f" stroke="#34d399" strokeWidth="1.5" />
      <text x="460" y="240" textAnchor="middle" fill="#6ee7b7" fontSize={10} fontFamily="ui-monospace,monospace" fontWeight="700">Product Domain</text>
      <Node x="390" y="250" w="64" h="24" fill="#052e16" stroke="#16a34a" label="features"  fontSize={8} textColor="#6ee7b7" />
      <Node x="466" y="250" w="64" h="24" fill="#052e16" stroke="#16a34a" label="events"    fontSize={8} textColor="#6ee7b7" />
      <Node x="390" y="284" w="64" h="24" fill="#052e16" stroke="#16a34a" label="sessions"  fontSize={8} textColor="#6ee7b7" />
      <Node x="466" y="284" w="64" h="24" fill="#052e16" stroke="#16a34a" label="cohorts"   fontSize={8} textColor="#6ee7b7" />

      {/* Connections to catalog */}
      <Arrow x1="180" y1="70"  x2="178" y2="148" color="#34d399" />
      <Arrow x1="380" y1="70"  x2="382" y2="148" color="#34d399" />
      <Arrow x1="180" y1="270" x2="178" y2="192" color="#34d399" />
      <Arrow x1="380" y1="270" x2="382" y2="192" color="#34d399" />

      {/* Cross-domain dashed */}
      <line x1="180" y1="70" x2="380" y2="70" stroke="#3f3f46" strokeWidth="1" strokeDasharray="6 4" />
      <line x1="180" y1="270" x2="380" y2="270" stroke="#3f3f46" strokeWidth="1" strokeDasharray="6 4" />

      {/* Bottom bar */}
      <rect x="12" y="330" width="536" height="8" rx="4" fill="#14261f" stroke="#34d399" strokeWidth="0.5" strokeOpacity="0.5" />
      <text x="280" y="337" textAnchor="middle" fill="#059669" fontSize={7} fontFamily="ui-monospace,monospace" letterSpacing="1">SELF-SERVE PLATFORM · FEDERATED GOVERNANCE · INTEROPERABLE DATA PRODUCTS</text>
    </svg>
  );
}

/* ── Diagram 4: dbt Lineage ──────────────────────────────── */
function DbtLineagePreview() {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" role="img" aria-label="dbt Lineage DAG">
      <ArrowDefs colors={["#52525b", "#fbbf24", "#34d399"]} />
      <rect width="320" height="180" fill="#18181b" rx="8" />

      {/* Sources */}
      <Node x="10" y="20"  w="68" h="24" fill="#27272a" stroke="#3f3f46" label="src_orders"    fontSize={8} textColor="#a1a1aa" />
      <Node x="10" y="54"  w="68" h="24" fill="#27272a" stroke="#3f3f46" label="src_customers"  fontSize={8} textColor="#a1a1aa" />
      <Node x="10" y="88"  w="68" h="24" fill="#27272a" stroke="#3f3f46" label="src_payments"   fontSize={8} textColor="#a1a1aa" />
      <Node x="10" y="122" w="68" h="24" fill="#27272a" stroke="#3f3f46" label="src_products"   fontSize={8} textColor="#a1a1aa" />

      {/* Staging */}
      <Node x="100" y="20"  w="72" h="24" fill="#431407" stroke="#fbbf24" label="stg_orders"    fontSize={7.5} textColor="#fde68a" />
      <Node x="100" y="54"  w="72" h="24" fill="#431407" stroke="#fbbf24" label="stg_customers"  fontSize={7.5} textColor="#fde68a" />
      <Node x="100" y="88"  w="72" h="24" fill="#431407" stroke="#fbbf24" label="stg_payments"   fontSize={7.5} textColor="#fde68a" />
      <Node x="100" y="122" w="72" h="24" fill="#431407" stroke="#fbbf24" label="stg_products"   fontSize={7.5} textColor="#fde68a" />

      {/* Intermediate */}
      <Node x="196" y="37" w="72" h="24" fill="#1c1917" stroke="#f97316" label="int_order_items" fontSize={7} textColor="#fdba74" />
      <Node x="196" y="87" w="72" h="24" fill="#1c1917" stroke="#f97316" label="int_payments"    fontSize={7} textColor="#fdba74" />

      {/* Marts */}
      <Node x="286" y="20"  w="30" h="54" fill="#2e1065" stroke="#818cf8" label="fct" subLabel="orders" textColor="#c4b5fd" rx={4} />
      <Node x="286" y="86"  w="30" h="54" fill="#2e1065" stroke="#818cf8" label="dim" subLabel="cust." textColor="#c4b5fd" rx={4} />
      <Node x="286" y="148" w="30" h="24" fill="#052e16" stroke="#34d399" label="MF"           fontSize={7} textColor="#6ee7b7" />

      {/* Arrows */}
      <Arrow x1="78" y1="32"  x2="98"  y2="32"  color="#52525b" />
      <Arrow x1="78" y1="66"  x2="98"  y2="66"  color="#52525b" />
      <Arrow x1="78" y1="100" x2="98"  y2="100" color="#52525b" />
      <Arrow x1="78" y1="134" x2="98"  y2="134" color="#52525b" />
      <Arrow x1="172" y1="32"  x2="194" y2="47"  color="#fbbf24" />
      <Arrow x1="172" y1="66"  x2="194" y2="49"  color="#fbbf24" />
      <Arrow x1="172" y1="100" x2="194" y2="97"  color="#fbbf24" />
      <Arrow x1="172" y1="134" x2="194" y2="99"  color="#fbbf24" />
      <Arrow x1="268" y1="47"  x2="284" y2="40"  color="#f97316" />
      <Arrow x1="268" y1="97"  x2="284" y2="110" color="#f97316" />
      <Arrow x1="300" y1="74"  x2="300" y2="84"  color="#818cf8" />
      <Arrow x1="300" y1="140" x2="300" y2="146" color="#34d399" />

      {/* Layer labels */}
      <LayerLabel x="44"  y="158" text="Sources"  color="#52525b" />
      <LayerLabel x="136" y="158" text="Staging"  color="#92400e" />
      <LayerLabel x="232" y="158" text="Intermediate" color="#9a3412" />
      <LayerLabel x="301" y="175" text="Marts" color="#4f46e5" />
    </svg>
  );
}

function DbtLineageDetail() {
  return (
    <svg viewBox="0 0 560 320" className="w-full h-full" role="img" aria-label="dbt Lineage Detail">
      <ArrowDefs colors={["#52525b", "#fbbf24", "#f97316", "#818cf8", "#34d399"]} />
      <rect width="560" height="320" fill="#18181b" rx="10" />

      {/* Layer backgrounds */}
      <rect x="8"   y="24" width="94"  height="272" rx="6" fill="#1c1917" stroke="#3f3f46" strokeWidth="1" strokeOpacity="0.5" />
      <rect x="114" y="24" width="100" height="272" rx="6" fill="#1c1917" stroke="#78350f" strokeWidth="1" strokeOpacity="0.4" />
      <rect x="226" y="24" width="100" height="272" rx="6" fill="#1c1917" stroke="#9a3412" strokeWidth="1" strokeOpacity="0.4" />
      <rect x="338" y="24" width="104" height="272" rx="6" fill="#1c1917" stroke="#4338ca" strokeWidth="1" strokeOpacity="0.4" />
      <rect x="454" y="24" width="98"  height="272" rx="6" fill="#1c1917" stroke="#34d399" strokeWidth="1" strokeOpacity="0.4" />

      <LayerLabel x="55"  y="18" text="Sources"      color="#52525b" />
      <LayerLabel x="164" y="18" text="Staging"      color="#92400e" />
      <LayerLabel x="276" y="18" text="Intermediate" color="#9a3412" />
      <LayerLabel x="390" y="18" text="Marts"        color="#4f46e5" />
      <LayerLabel x="503" y="18" text="MetricFlow"   color="#059669" />

      {/* Sources */}
      {[["src_orders","#e4e4e7"],["src_customers","#e4e4e7"],["src_payments","#e4e4e7"],["src_products","#e4e4e7"],["src_returns","#e4e4e7"],["src_events","#e4e4e7"]].map(([label,color],i) => (
        <Node key={label as string} x="16" y={40 + i*42} w="78" h="26" fill="#27272a" stroke="#3f3f46" label={label as string} fontSize={7.5} textColor={color as string} />
      ))}

      {/* Staging */}
      {[["stg_orders","#fde68a"],["stg_customers","#fde68a"],["stg_payments","#fde68a"],["stg_products","#fde68a"],["stg_returns","#fde68a"],["stg_events","#fde68a"]].map(([label,color],i) => (
        <Node key={label as string} x="122" y={40 + i*42} w="84" h="26" fill="#431407" stroke="#fbbf24" label={label as string} fontSize={7.5} textColor={color as string} />
      ))}

      {/* Intermediate */}
      <Node x="234" y="52"  w="84" h="26" fill="#1c1917" stroke="#f97316" label="int_order_items" fontSize={7} textColor="#fdba74" />
      <Node x="234" y="102" w="84" h="26" fill="#1c1917" stroke="#f97316" label="int_payments"    fontSize={7} textColor="#fdba74" />
      <Node x="234" y="152" w="84" h="26" fill="#1c1917" stroke="#f97316" label="int_customers"   fontSize={7} textColor="#fdba74" />
      <Node x="234" y="202" w="84" h="26" fill="#1c1917" stroke="#f97316" label="int_returns"     fontSize={7} textColor="#fdba74" />
      <Node x="234" y="252" w="84" h="26" fill="#1c1917" stroke="#f97316" label="int_events"      fontSize={7} textColor="#fdba74" />

      {/* Marts */}
      <Node x="346" y="44"  w="88" h="30" fill="#2e1065" stroke="#818cf8" label="fct_orders"      fontSize={8} textColor="#c4b5fd" />
      <Node x="346" y="86"  w="88" h="30" fill="#2e1065" stroke="#818cf8" label="fct_payments"    fontSize={8} textColor="#c4b5fd" />
      <Node x="346" y="130" w="88" h="30" fill="#2e1065" stroke="#818cf8" label="dim_customers"   fontSize={8} textColor="#c4b5fd" />
      <Node x="346" y="172" w="88" h="30" fill="#2e1065" stroke="#818cf8" label="dim_products"    fontSize={8} textColor="#c4b5fd" />
      <Node x="346" y="220" w="88" h="30" fill="#1a1a2e" stroke="#6366f1" label="Marketing Mart"  fontSize={8} textColor="#a5b4fc" />
      <Node x="346" y="260" w="88" h="30" fill="#1a1a2e" stroke="#6366f1" label="Finance Mart"    fontSize={8} textColor="#a5b4fc" />

      {/* MetricFlow */}
      <Node x="462" y="86"  w="82" h="28" fill="#052e16" stroke="#34d399" label="revenue_mtd"    fontSize={7.5} textColor="#6ee7b7" />
      <Node x="462" y="124" w="82" h="28" fill="#052e16" stroke="#34d399" label="orders_daily"   fontSize={7.5} textColor="#6ee7b7" />
      <Node x="462" y="162" w="82" h="28" fill="#052e16" stroke="#34d399" label="cac_by_channel" fontSize={7.5} textColor="#6ee7b7" />
      <Node x="462" y="200" w="82" h="28" fill="#052e16" stroke="#34d399" label="ltv_segments"   fontSize={7.5} textColor="#6ee7b7" />

      {/* Arrows src→stg */}
      {[0,1,2,3,4,5].map(i => (
        <Arrow key={i} x1="94" y1={53 + i*42} x2="120" y2={53 + i*42} color="#52525b" />
      ))}
      {/* stg→int */}
      <Arrow x1="206" y1="53"  x2="232" y2="64"  color="#fbbf24" />
      <Arrow x1="206" y1="95"  x2="232" y2="65"  color="#fbbf24" />
      <Arrow x1="206" y1="137" x2="232" y2="115" color="#fbbf24" />
      <Arrow x1="206" y1="179" x2="232" y2="165" color="#fbbf24" />
      <Arrow x1="206" y1="221" x2="232" y2="215" color="#fbbf24" />
      <Arrow x1="206" y1="263" x2="232" y2="265" color="#fbbf24" />
      {/* int→mart */}
      <Arrow x1="318" y1="64"  x2="344" y2="59"  color="#f97316" />
      <Arrow x1="318" y1="115" x2="344" y2="101" color="#f97316" />
      <Arrow x1="318" y1="165" x2="344" y2="145" color="#f97316" />
      <Arrow x1="318" y1="215" x2="344" y2="235" color="#f97316" />
      <Arrow x1="318" y1="265" x2="344" y2="275" color="#f97316" />
      {/* mart→metricflow */}
      <Arrow x1="434" y1="101" x2="460" y2="100" color="#34d399" />
      <Arrow x1="434" y1="145" x2="460" y2="138" color="#34d399" />
      <Arrow x1="434" y1="235" x2="460" y2="176" color="#34d399" />
      <Arrow x1="434" y1="275" x2="460" y2="214" color="#34d399" />
    </svg>
  );
}

/* ── Diagram 5: MLOps Pipeline ───────────────────────────── */
function MLOpsPipelinePreview() {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" role="img" aria-label="MLOps Pipeline">
      <ArrowDefs colors={["#52525b", "#38bdf8", "#34d399", "#f97316"]} />
      <rect width="320" height="180" fill="#18181b" rx="8" />

      {/* Pipeline stages */}
      <Node x="10"  y="70" w="48" h="40" fill="#1a2533" stroke="#38bdf8" label="Data"      subLabel="Feature eng."  textColor="#7dd3fc" />
      <Node x="72"  y="70" w="48" h="40" fill="#1e3a5f" stroke="#3b82f6" label="Features"  subLabel="Store"          textColor="#93c5fd" />
      <Node x="134" y="70" w="48" h="40" fill="#1c1917" stroke="#f97316" label="Train"     subLabel="Databricks ML"  textColor="#fdba74" />
      <Node x="196" y="70" w="48" h="40" fill="#431407" stroke="#ef4444" label="Validate"  subLabel="A/B · canary"   textColor="#fca5a5" />
      <Node x="258" y="70" w="52" h="40" fill="#14261f" stroke="#34d399" label="Serve"     subLabel="Real-time API"  textColor="#6ee7b7" />

      {/* Monitor loop */}
      <Node x="116" y="138" w="88" h="28" fill="#27272a" stroke="#fbbf24" label="Monitor + Retrain" fontSize={7.5} textColor="#fde68a" />

      {/* Arrows forward */}
      <Arrow x1="58"  y1="90" x2="70"  y2="90" color="#38bdf8" />
      <Arrow x1="120" y1="90" x2="132" y2="90" color="#3b82f6" />
      <Arrow x1="182" y1="90" x2="194" y2="90" color="#f97316" />
      <Arrow x1="244" y1="90" x2="256" y2="90" color="#f97316" />

      {/* Monitor arrows */}
      <Arrow x1="284" y1="110" x2="284" y2="134" color="#fbbf24" />  {/* Serve → Monitor           */}
      <Arrow x1="160" y1="138" x2="158" y2="110" color="#fbbf24" />  {/* Monitor → Train (retrain) */}

      {/* Registry node + model lifecycle arrows */}
      <Node x="134" y="24" w="52" h="28" fill="#2e1065" stroke="#818cf8" label="Registry"  subLabel="MLflow"         textColor="#c4b5fd" />
      <Arrow x1="158" y1="70"  x2="158" y2="52"  color="#a78bfa" />  {/* Train → Registry (register)  */}
      <Arrow x1="162" y1="52"  x2="218" y2="70"  color="#a78bfa" />  {/* Registry → Validate (deploy) */}

      {/* Drift indicator */}
      <circle cx="204" cy="60" r="6" fill="#ef4444" opacity="0.15" />
      <circle cx="204" cy="60" r="3" fill="#ef4444" opacity="0.6">
        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="214" y="58" fill="#ef4444" fontSize={6.5} fontFamily="ui-monospace,monospace">drift!</text>
    </svg>
  );
}

function MLOpsDetail() {
  return (
    <svg viewBox="0 0 560 320" className="w-full h-full" role="img" aria-label="MLOps Pipeline Detail">
      <ArrowDefs colors={["#52525b", "#38bdf8", "#3b82f6", "#f97316", "#34d399", "#fbbf24", "#a78bfa"]} />
      <rect width="560" height="320" fill="#18181b" rx="10" />

      {/* Stage nodes */}
      <Node x="10"  y="100" w="80" h="70" fill="#1a2533" stroke="#38bdf8" label="Data Sources"  subLabel="S3 · APIs · DB" textColor="#7dd3fc" rx={8} />
      <Node x="110" y="100" w="80" h="70" fill="#1e3a5f" stroke="#3b82f6" label="Feature Store" subLabel="Feast · Tecton" textColor="#93c5fd" rx={8} />
      <Node x="210" y="100" w="80" h="70" fill="#1c1917" stroke="#f97316" label="Training"      subLabel="Databricks ML" textColor="#fdba74" rx={8} />
      <Node x="310" y="100" w="80" h="70" fill="#431407" stroke="#ef4444" label="Validation"    subLabel="A/B · Shadow"  textColor="#fca5a5" rx={8} />
      <Node x="410" y="100" w="80" h="70" fill="#14261f" stroke="#34d399" label="Serving"       subLabel="RT API · Batch" textColor="#6ee7b7" rx={8} />
      <Node x="490" y="100" w="62" h="70" fill="#27272a" stroke="#3f3f46" label="Feedback"      subLabel="Logs · Metrics" textColor="#a1a1aa" rx={8} />

      {/* Sub-nodes inside stages */}
      <Node x="18"  y="130" w="64" h="18" fill="#0c4a6e" stroke="#0284c7" label="DLT Pipelines"  fontSize={7} textColor="#7dd3fc" />
      <Node x="18"  y="152" w="64" h="18" fill="#0c4a6e" stroke="#0284c7" label="dbt transforms" fontSize={7} textColor="#7dd3fc" />
      <Node x="118" y="130" w="64" h="18" fill="#1e3a5f" stroke="#2563eb" label="Online store"   fontSize={7} textColor="#93c5fd" />
      <Node x="118" y="152" w="64" h="18" fill="#1e3a5f" stroke="#2563eb" label="Offline store"  fontSize={7} textColor="#93c5fd" />
      <Node x="218" y="130" w="64" h="18" fill="#431407" stroke="#c2410c" label="AutoML"         fontSize={7} textColor="#fdba74" />
      <Node x="218" y="152" w="64" h="18" fill="#431407" stroke="#c2410c" label="HPO runs"       fontSize={7} textColor="#fdba74" />

      {/* Registry */}
      <Node x="200" y="32" w="160" h={44} fill="#2e1065" stroke="#818cf8" label="Model Registry" subLabel="MLflow · versioned artifacts" textColor="#c4b5fd" rx={8} />

      {/* Monitor bar */}
      <rect x="10" y="240" width="542" height="54" rx="8" fill="#1c1917" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="0" />
      <text x="20" y="260" fill="#fde68a" fontSize={8.5} fontFamily="ui-monospace,monospace" fontWeight="700">MONITOR · OBSERVE · RETRAIN LOOP</text>
      <Node x="20"  y="268" w="84" h="20" fill="#292524" stroke="#fbbf24" label="Data drift"     fontSize={7} textColor="#fde68a" />
      <Node x="114" y="268" w="84" h="20" fill="#292524" stroke="#fbbf24" label="Model drift"    fontSize={7} textColor="#fde68a" />
      <Node x="208" y="268" w="84" h="20" fill="#292524" stroke="#ef4444" label="Perf degradation" fontSize={6.5} textColor="#fca5a5" />
      <Node x="302" y="268" w="84" h="20" fill="#292524" stroke="#fbbf24" label="Auto-retrain"   fontSize={7} textColor="#fde68a" />
      <Node x="396" y="268" w="84" h="20" fill="#14261f" stroke="#34d399" label="CI/CD deploy"   fontSize={7} textColor="#6ee7b7" />
      <Node x="490" y="268" w="54" h="20" fill="#292524" stroke="#fbbf24" label="Alerting"       fontSize={7} textColor="#fde68a" />

      {/* ── Forward data-flow arrows (left → right) ── */}
      <Arrow x1="90"  y1="135" x2="110" y2="135" color="#38bdf8" />  {/* Data Sources → Feature Store */}
      <Arrow x1="190" y1="135" x2="210" y2="135" color="#3b82f6" />  {/* Feature Store → Training    */}
      <Arrow x1="290" y1="135" x2="310" y2="135" color="#f97316" />  {/* Training → Validation       */}
      <Arrow x1="390" y1="135" x2="410" y2="135" color="#34d399" />  {/* Validation → Serving        */}
      {/* Serving and Feedback are directly adjacent (no gap) — connection implied visually */}

      {/* ── Model Registry arrows ──
            Reference architecture:
            1. Training registers model artifact → Registry  (UP)
            2. Registry sends model to Validation for testing (DOWN-RIGHT)
            Validated model is then deployed via Validation → Serving arrow above.       */}
      <Arrow x1="250" y1="100" x2="250" y2="76"  color="#a78bfa" />  {/* Training → Registry (straight up)      */}
      <Arrow x1="280" y1="76"  x2="328" y2="100" color="#a78bfa" />  {/* Registry → Validation (diagonal down)  */}

      {/* ── Monitor / feedback arrows ── */}
      {/* Serving production metrics flow down into monitor bar */}
      <Arrow x1="450" y1="170" x2="450" y2="240" color="#fbbf24" />
      {/* Feedback logs flow down into monitor bar */}
      <Arrow x1="521" y1="170" x2="521" y2="240" color="#fbbf24" />
      {/* Auto-retrain trigger: stepped path from monitor → Training bottom
            302,240 = top-left of Auto-retrain node  →  up to clear the pipeline
            302,192 = above Training/Validation row  →  left to Training center
            250,192 = aligned with Training           →  up to Training bottom  */}
      <path d="M 302 240 L 302 192 L 250 192 L 250 170"
        stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        fill="none" markerEnd="url(#arrowHead-fbbf24)" />

      {/* ── Drift indicator (production serving drift, triggers monitor) ── */}
      <circle cx="430" cy="82" r="5" fill="#ef4444" opacity="0.2" />
      <circle cx="430" cy="82" r="3" fill="#ef4444" opacity="0.7">
        <animate attributeName="r" values="2;5;2" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <text x="438" y="78" fill="#ef4444" fontSize={7} fontFamily="ui-monospace,monospace">drift detected</text>
    </svg>
  );
}

/* ── Diagram registry ─────────────────────────────────────── */
const DIAGRAMS: Diagram[] = [
  {
    id: "lakehouse",
    title: "Lakehouse Architecture",
    description:
      "Medallion pattern on Databricks — Bronze raw ingestion via DLT, Silver dbt cleaning, Gold analytics marts with MetricFlow metrics and Unity Catalog governance.",
    categories: ["Databricks", "Enterprise Architecture"],
    tags: ["Databricks", "Delta Lake", "dbt", "Unity Catalog", "Medallion", "MetricFlow"],
    accent: {
      label: "Databricks",
      labelText: "text-orange-400",
      labelBg: "bg-orange-950/60 border-orange-800/40",
      glow: "hover:shadow-orange-900/20",
      border: "hover:border-orange-700/50",
    },
    Preview: LakehousePreview,
    Detail: LakehouseDetail,
  },
  {
    id: "ai-orchestration",
    title: "AI Agent Orchestration",
    description:
      "MCP-powered agent architecture routing natural language requests through LLM APIs, governed data tools, and a RAG pipeline to produce grounded, validated responses.",
    categories: ["AI Agents", "Enterprise Architecture"],
    tags: ["MCP", "LLM", "RAG", "LangChain", "Guardrails", "Databricks"],
    accent: {
      label: "AI Agents",
      labelText: "text-violet-400",
      labelBg: "bg-violet-950/60 border-violet-800/40",
      glow: "hover:shadow-violet-900/20",
      border: "hover:border-violet-700/50",
    },
    Preview: AIOrchestrationPreview,
    Detail: AIOrchestrationDetail,
  },
  {
    id: "data-mesh",
    title: "Data Mesh Architecture",
    description:
      "Federated domain ownership model with a central governance plane — Marketing, Finance, Operations, and Product domains each publishing interoperable data products.",
    categories: ["Data Mesh", "Enterprise Architecture"],
    tags: ["Data Mesh", "Domain Ownership", "Data Products", "Federated Governance", "Self-Serve"],
    accent: {
      label: "Data Mesh",
      labelText: "text-emerald-400",
      labelBg: "bg-emerald-950/60 border-emerald-800/40",
      glow: "hover:shadow-emerald-900/20",
      border: "hover:border-emerald-700/50",
    },
    Preview: DataMeshPreview,
    Detail: DataMeshDetail,
  },
  {
    id: "dbt-lineage",
    title: "dbt Transformation Lineage",
    description:
      "Full dbt DAG from raw source tables through staging, intermediate, and mart layers to MetricFlow certified metrics — with test coverage at every node.",
    categories: ["dbt", "DataOps"],
    tags: ["dbt", "DAG", "Lineage", "MetricFlow", "Data Contracts", "Staging"],
    accent: {
      label: "dbt",
      labelText: "text-amber-400",
      labelBg: "bg-amber-950/60 border-amber-800/40",
      glow: "hover:shadow-amber-900/20",
      border: "hover:border-amber-700/50",
    },
    Preview: DbtLineagePreview,
    Detail: DbtLineageDetail,
  },
  {
    id: "mlops-pipeline",
    title: "MLOps Pipeline",
    description:
      "End-to-end ML lifecycle — Feature Store ingestion, Databricks AutoML training, MLflow model registry, canary validation, real-time serving, and automated drift-triggered retraining.",
    categories: ["AI Agents", "DataOps", "Databricks"],
    tags: ["MLOps", "MLflow", "Feature Store", "Databricks", "AutoML", "Drift Detection"],
    accent: {
      label: "DataOps",
      labelText: "text-cyan-400",
      labelBg: "bg-cyan-950/60 border-cyan-800/40",
      glow: "hover:shadow-cyan-900/20",
      border: "hover:border-cyan-700/50",
    },
    Preview: MLOpsPipelinePreview,
    Detail: MLOpsDetail,
  },
];

const ALL_CATEGORIES: Category[] = [
  "All", "Databricks", "AI Agents", "DataOps", "Data Mesh", "dbt", "Enterprise Architecture",
];

/* ── Main section ─────────────────────────────────────────── */
export function ArchitectureGallery() {
  const [selected, setSelected] = useState<Category>("All");
  const [active, setActive] = useState<Diagram | null>(null);

  const filtered = selected === "All"
    ? DIAGRAMS
    : DIAGRAMS.filter((d) => d.categories.includes(selected));

  const closeModal = useCallback(() => setActive(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeModal]);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  return (
    <>
      <section className="section-padding border-t border-zinc-800/50 relative overflow-hidden">
        {/* Background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 100%, rgba(99,102,241,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="section-container relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
              Architecture Gallery
            </p>
            <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
              Platform Thinking
            </h2>
            <p className="mt-3 max-w-xl text-zinc-500 text-base">
              Technical architecture diagrams for production data and AI systems.
              Click any diagram to explore in detail.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 flex flex-wrap gap-2"
          >
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelected(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 ${
                  selected === cat
                    ? "border-indigo-600 bg-indigo-600/20 text-indigo-300"
                    : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 bg-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <motion.div
            layout
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((diagram, i) => (
                <DiagramCard
                  key={diagram.id}
                  diagram={diagram}
                  index={i}
                  onClick={() => setActive(diagram)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox modal */}
      <AnimatePresence>
        {active && <DiagramModal diagram={active} onClose={closeModal} />}
      </AnimatePresence>
    </>
  );
}

/* ── Diagram card ─────────────────────────────────────────── */
function DiagramCard({
  diagram, index, onClick,
}: {
  diagram: Diagram;
  index: number;
  onClick: () => void;
}) {
  const { accent, Preview } = diagram;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" as const }}
    >
      <button
        onClick={onClick}
        className={`group relative w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 text-left transition-all duration-300 ${accent.border} hover:shadow-2xl ${accent.glow} hover:bg-zinc-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
      >
        {/* Diagram preview */}
        <div className="relative overflow-hidden bg-zinc-950/60 border-b border-zinc-800">
          <div className="aspect-[16/9]">
            <Preview />
          </div>
          {/* Zoom overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/0 transition-all duration-300 group-hover:bg-zinc-950/40">
            <div className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/90 px-3 py-1.5 opacity-0 transition-all duration-200 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
              <ZoomIn className="h-3.5 w-3.5 text-zinc-300" />
              <span className="text-xs text-zinc-300">Expand</span>
            </div>
          </div>
        </div>

        {/* Card content */}
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-medium ${accent.labelBg} ${accent.labelText}`}>
              {accent.label}
            </span>
            <div className="flex flex-wrap gap-1 justify-end">
              {diagram.categories.slice(0, 2).map((cat) => (
                <span key={cat} className="text-xs text-zinc-700 font-mono">
                  {cat !== accent.label ? cat : null}
                </span>
              ))}
            </div>
          </div>

          <h3 className="mb-2 text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug">
            {diagram.title}
          </h3>

          <p className="mb-4 text-xs leading-relaxed text-zinc-500 line-clamp-2">
            {diagram.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {diagram.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-xs font-mono text-zinc-600"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
            {diagram.tags.length > 4 && (
              <span className="text-xs font-mono text-zinc-700 px-1 py-0.5">
                +{diagram.tags.length - 4}
              </span>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
}

/* ── Lightbox modal ───────────────────────────────────────── */
function DiagramModal({
  diagram, onClose,
}: {
  diagram: Diagram;
  onClose: () => void;
}) {
  const { Detail, accent } = diagram;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-md" />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.25, ease: "easeOut" as const }}
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono font-medium ${accent.labelBg} ${accent.labelText}`}>
              {accent.label}
            </span>
            <h2 className="text-base font-semibold text-zinc-100">{diagram.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Diagram */}
        <div className="bg-zinc-950/60 p-6">
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <Detail />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 px-6 py-4">
          <p className="mb-3 text-sm text-zinc-400 leading-relaxed max-w-2xl">
            {diagram.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {diagram.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-xs font-mono text-zinc-500"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
