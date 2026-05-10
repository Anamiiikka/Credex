import type { Metadata } from "next";
import { SpendForm } from "@/components/spend-form/SpendForm";
import { BarChart3, Clock, Shield, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Credex — Free AI Spend Auditor",
  description:
    "Stop overpaying for AI tools. Audit your team's ChatGPT, Claude, Cursor, and Copilot spend in under 2 minutes — free.",
};

const FEATURES = [
  {
    icon: Clock,
    label: "2-minute audit",
    desc: "Enter your tools and plans — results are instant.",
  },
  {
    icon: BarChart3,
    label: "Real savings numbers",
    desc: "Specific dollar amounts, not vague percentages.",
  },
  {
    icon: Zap,
    label: "Credex credit discount",
    desc: "Stack an extra 20% off on top of plan optimizations.",
  },
  {
    icon: Shield,
    label: "No account required",
    desc: "No signup, no credit card, no strings attached.",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-16 md:py-24">
      {/* ── Hero ── */}
      <div className="w-full max-w-2xl text-center mb-14 space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
          <Zap className="h-3 w-3" aria-hidden="true" />
          Free · No signup required
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-50 leading-tight">
          Stop overpaying for{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
            AI tools
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          Most teams overspend on AI subscriptions by 30–60%. Get a free breakdown
          of your ChatGPT, Claude, Cursor, and Copilot spend — and see exactly where
          to cut.
        </p>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-3 text-left mt-8 max-w-lg mx-auto">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-slate-200">{label}</p>
                <p className="text-xs text-slate-500 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 shadow-xl shadow-black/40 backdrop-blur">
        <h2 className="text-base font-semibold text-slate-200 mb-6">
          Your AI tool stack
        </h2>
        <SpendForm />
      </div>

      {/* ── Footer note ── */}
      <p className="mt-10 text-xs text-slate-600 text-center">
        Pricing data sourced from official vendor pages · Last updated May 2026
      </p>
    </main>
  );
}
