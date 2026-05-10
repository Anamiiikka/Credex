import type { Metadata } from "next";
import { SpendForm } from "@/components/spend-form/SpendForm";
import { BarChart3, Clock, Shield, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Credex — Free AI Spend Auditor",
  description:
    "Stop overpaying for AI tools. Audit your team's ChatGPT, Claude, Cursor, and Copilot spend in under 2 minutes — free.",
};

const FEATURES = [
  { icon: Clock,     label: "2-minute audit",        desc: "Enter your tools and plans — results are instant." },
  { icon: BarChart3, label: "Real savings numbers",   desc: "Specific dollar amounts, not vague percentages." },
  { icon: Zap,       label: "Credex 20% discount",    desc: "Stack extra savings on top of plan optimizations." },
  { icon: Shield,    label: "No account required",    desc: "No signup, no credit card, no strings attached." },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-16 md:py-24">

      {/* ── Hero ── */}
      <div className="w-full max-w-xl text-center mb-12 space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-4 py-1.5 text-xs font-medium text-indigo-300 tracking-wide">
          <Zap className="h-3 w-3" aria-hidden="true" />
          Free · No signup required
        </div>

        <h1 className="text-5xl md:text-[3.75rem] font-bold tracking-tight leading-[1.1] text-white">
          Stop overpaying for{" "}
          <span className="bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            AI&nbsp;tools
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-md mx-auto">
          Most teams overspend on AI subscriptions by 30–60%. Get a free, instant
          breakdown — and see exactly where to cut.
        </p>

        {/* Feature pills */}
        <div className="grid grid-cols-2 gap-2.5 text-left pt-2 max-w-md mx-auto">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-start gap-2.5 rounded-xl border border-white/6 bg-white/3 px-3 py-2.5"
            >
              <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-slate-200 leading-tight">{label}</p>
                <p className="text-xs text-slate-500 leading-snug mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form ── */}
      <div className="w-full max-w-xl">
        <div className="rounded-2xl border border-white/8 bg-white/3 p-6 md:p-8 shadow-2xl shadow-black/50 backdrop-blur-sm">
          <p className="text-sm font-semibold text-slate-300 mb-6">Your AI tool stack</p>
          <SpendForm />
        </div>
      </div>

      {/* ── Footer ── */}
      <p className="mt-12 text-xs text-slate-600 text-center">
        Pricing data sourced from official vendor pages · Last updated May 2026
      </p>

    </main>
  );
}
