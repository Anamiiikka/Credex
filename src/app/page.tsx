import type { Metadata } from "next";
import { SpendForm } from "@/components/spend-form/SpendForm";
import { BarChart3, Shield, Zap, ChevronDown, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Credex — Free AI Spend Auditor",
  description:
    "Stop overpaying for AI tools. Audit your team's ChatGPT, Claude, Cursor, and Copilot spend in under 2 minutes — free.",
};

const VALUE_PROPS = [
  {
    icon: BarChart3,
    title: "Exact dollar savings",
    desc: "Not vague percentages. We calculate your specific monthly and annual savings based on real vendor pricing.",
  },
  {
    icon: Zap,
    title: "Plus 20% via Credex",
    desc: "Stack extra savings on top of plan optimizations by routing AI billing through Credex credits.",
  },
  {
    icon: Shield,
    title: "No account needed",
    desc: "No signup, no credit card. Enter your tools, get results instantly — your data stays private.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Enter your AI stack",
    desc: "List the tools your team uses, select your current plans, and enter seat counts.",
  },
  {
    step: "2",
    title: "Engine analyzes spend",
    desc: "We compare your spend against all available plans, team pricing, and consolidation opportunities.",
  },
  {
    step: "3",
    title: "Get exact recommendations",
    desc: "Receive specific actions with dollar amounts — downgrade, consolidate, or add Credex credits.",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4">

      {/* ── Hero ── */}
      <section className="w-full max-w-2xl text-center pt-20 pb-14 space-y-6">
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

        <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-lg mx-auto">
          Most teams overspend on AI subscriptions by 30–60%. Get a free, instant
          breakdown — and see exactly where to cut.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="#audit"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all duration-150 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40"
          >
            Audit My AI Spend
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </a>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-emerald-500" />
              2 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-emerald-500" />
              No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-emerald-500" />
              Instant results
            </span>
          </div>
        </div>
      </section>

      {/* ── Value props ── */}
      <section className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 pb-16">
        {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex flex-col gap-3 rounded-xl border border-white/6 bg-white/3 p-5 hover:border-white/12 hover:bg-white/5 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-indigo-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100 mb-1">{title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="w-full max-w-2xl pb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6 text-center">
          How it works
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map(({ step, title, desc }) => (
            <div
              key={step}
              className="relative flex flex-col gap-2 rounded-xl border border-white/6 bg-white/3 p-5 hover:border-white/12 hover:bg-white/5 transition-all duration-200"
            >
              <span className="text-4xl font-bold leading-none text-white/6 select-none">
                {step}
              </span>
              <p className="text-sm font-semibold text-slate-100">{title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Form / CTA ── */}
      <section id="audit" className="w-full max-w-xl pb-16">
        <div className="text-center mb-6 space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
            Audit your AI spend
          </h2>
          <p className="text-sm text-slate-500">
            Enter your current tools and plans — results appear in seconds.
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/3 p-6 md:p-8 shadow-2xl shadow-black/50 backdrop-blur-sm">
          <p className="text-sm font-semibold text-slate-300 mb-6">Your AI tool stack</p>
          <SpendForm />
        </div>
      </section>

    </main>
  );
}
