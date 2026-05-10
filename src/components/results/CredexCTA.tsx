"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

const CREDEX_SIGNUP_URL = "https://credex.rocks/get-started";

interface CredexCTAProps {
  totalMonthlySavings: number;
  totalCredexSavings: number;
  isHighSavings: boolean;
  isAlreadyOptimal: boolean;
}

export default function CredexCTA({
  totalMonthlySavings,
  totalCredexSavings,
  isHighSavings,
  isAlreadyOptimal,
}: CredexCTAProps) {
  const effectiveSavings = totalMonthlySavings + totalCredexSavings;

  // Truly nothing to surface — don't render
  if (effectiveSavings < 5) return null;

  // ── High savings (≥ $500) — prominent gradient CTA ────────────────────────
  if (isHighSavings) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12"
      >
        <div className="relative overflow-hidden rounded-2xl border border-purple-500/40 bg-linear-to-br from-purple-600/20 via-slate-800/60 to-indigo-900/20 p-8">
          {/* Glow accent */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" aria-hidden="true" />
                <span className="text-sm font-semibold uppercase tracking-widest text-purple-400">
                  Big savings available
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-50">
                Save up to{" "}
                <span className="text-purple-300">
                  ${Math.round(effectiveSavings).toLocaleString("en-US")}
                </span>
                /mo with Credex
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-slate-400">
                Credex lets you buy pre-paid AI credits at a 20% discount by pooling
                unused capacity from other companies. Apply the savings on top of any
                plan optimizations above.
              </p>
            </div>

            <a
              href={CREDEX_SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
            >
              Get started free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Mid-range or Credex-only savings ($5–$499) — softer CTA ──────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12"
    >
      <Card className="border-emerald-700/30 bg-emerald-950/20">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span className="text-sm font-semibold text-emerald-400">
                {isAlreadyOptimal
                  ? "One more unlock available"
                  : `$${Math.round(effectiveSavings).toLocaleString("en-US")}/mo more with Credex`}
              </span>
            </div>
            <p className="text-sm text-slate-400">
              {totalCredexSavings > 0
                ? `Credex credits give you a flat 20% discount on AI tool billing — $${Math.round(totalCredexSavings)}/mo on top of the plan changes above.`
                : "Credex provides discounted AI credits from companies with unused capacity — stack the savings on top of the plan changes above."}
            </p>
          </div>

          <a
            href={CREDEX_SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-emerald-600/50 px-5 py-2.5 text-sm font-medium text-emerald-400 transition hover:border-emerald-500 hover:bg-emerald-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            Learn how Credex works
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
}
