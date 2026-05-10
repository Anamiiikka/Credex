import { ToolRecommendation, RecommendationAction } from "@/types";
import { ArrowRight, TrendingDown } from "lucide-react";

/* ── Action badge styles ─────────────────────────────────────────────────── */
const ACTION_BADGE: Record<RecommendationAction, string> = {
  downgrade:    "bg-sky-500/10     border-sky-500/20     text-sky-300",
  upgrade:      "bg-violet-500/10  border-violet-500/20  text-violet-300",
  switch_vendor:"bg-amber-500/10   border-amber-500/20   text-amber-300",
  consolidate:  "bg-rose-500/10    border-rose-500/20    text-rose-300",
  use_credex:   "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
  keep_current: "bg-slate-500/10   border-slate-500/20   text-slate-400",
};

const ACTION_LABEL: Record<RecommendationAction, string> = {
  downgrade:    "Downgrade plan",
  upgrade:      "Team plan",
  switch_vendor:"Switch vendor",
  consolidate:  "Consolidate",
  use_credex:   "Use Credex",
  keep_current: "Already optimal",
};

/* ── Per-tool colour + abbreviation ─────────────────────────────────────── */
const TOOL_META: Record<string, { colors: string; abbrev: string }> = {
  "ChatGPT":       { colors: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20", abbrev: "GP" },
  "Claude":        { colors: "bg-purple-500/15  text-purple-300  ring-purple-500/20",  abbrev: "Cl" },
  "Cursor":        { colors: "bg-blue-500/15    text-blue-300    ring-blue-500/20",    abbrev: "Cu" },
  "GitHub Copilot":{ colors: "bg-indigo-500/15  text-indigo-300  ring-indigo-500/20",  abbrev: "GH" },
  "Windsurf":      { colors: "bg-cyan-500/15    text-cyan-300    ring-cyan-500/20",    abbrev: "WS" },
  "OpenAI API":    { colors: "bg-green-500/15   text-green-300   ring-green-500/20",   abbrev: "OA" },
  "Anthropic API": { colors: "bg-amber-500/15   text-amber-300   ring-amber-500/20",   abbrev: "AN" },
  "Gemini":        { colors: "bg-sky-500/15     text-sky-300     ring-sky-500/20",     abbrev: "Ge" },
};

const FALLBACK_META = { colors: "bg-slate-500/15 text-slate-300 ring-slate-500/20", abbrev: "??" };

interface Props {
  recommendation: ToolRecommendation;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function ToolCard({ recommendation }: Props) {
  const { tool, currentPlan, recommendedPlan, savings, reason, recommendedAction, credexSavings } = recommendation;

  const actionBadge = ACTION_BADGE[recommendedAction];
  const actionLabel = ACTION_LABEL[recommendedAction];
  const { colors: toolColors, abbrev } = TOOL_META[tool] ?? FALLBACK_META;

  return (
    <div className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-b border-white/6">
        {/* Tool identity */}
        <div className="flex items-center gap-3">
          <div className={`h-8 w-8 rounded-lg ring-1 flex items-center justify-center text-xs font-bold shrink-0 ${toolColors}`}>
            {abbrev}
          </div>
          <span className="text-base font-semibold text-slate-100 tracking-tight">{tool}</span>
        </div>

        {/* Action badge + savings — savings always emerald */}
        <div className="flex items-center gap-2.5">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${actionBadge}`}>
            {actionLabel}
          </span>
          {savings > 0 && (
            <span className="flex items-center gap-1 text-sm font-bold tabular-nums text-emerald-400">
              <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
              ${fmt(savings)}/mo
            </span>
          )}
        </div>
      </div>

      {/* ── Plan comparison ── */}
      <div className="px-5 py-4 space-y-4">
        <div className="grid grid-cols-[1fr_32px_1fr] items-center gap-2">
          {/* Current */}
          <div className="rounded-lg bg-white/4 border border-white/6 p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Current</p>
            <p className="text-sm font-medium text-slate-300 leading-tight truncate">{currentPlan.name}</p>
            <p className="text-xl font-bold text-slate-100 tabular-nums mt-0.5">
              ${fmt(currentPlan.price)}<span className="text-xs font-normal text-slate-500">/mo</span>
            </p>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="h-4 w-4 text-slate-600" aria-hidden="true" />
          </div>

          {/* Recommended */}
          <div className="rounded-lg bg-emerald-950/40 border border-emerald-700/30 p-3 text-center">
            <p className="text-xs text-emerald-500 mb-1">Recommended</p>
            <p className="text-sm font-medium text-slate-300 leading-tight truncate">{recommendedPlan.name}</p>
            <p className="text-xl font-bold text-emerald-400 tabular-nums mt-0.5">
              ${fmt(recommendedPlan.price)}<span className="text-xs font-normal text-emerald-600">/mo</span>
            </p>
          </div>
        </div>

        {/* Reason */}
        <p className="text-sm text-slate-400 leading-relaxed">
          <span className="font-medium text-slate-300">Why: </span>
          {reason}
        </p>

        {/* Credex callout */}
        {credexSavings !== undefined && credexSavings > 5 && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-700/25 bg-emerald-950/30 px-3 py-2">
            <span className="text-emerald-400 text-xs" aria-hidden="true">⚡</span>
            <p className="text-xs text-emerald-400">
              Save an extra <span className="font-semibold">${fmt(credexSavings)}/mo</span> by purchasing through Credex credits
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
