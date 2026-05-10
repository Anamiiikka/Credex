"use client";

import { animate } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

function CountUp({ end, duration = 1.8 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, end, {
      duration,
      ease: "easeOut",
      onUpdate(v) { setCount(v); },
    });
    return () => controls.stop();
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-US", { maximumFractionDigits: 0 })}
    </span>
  );
}

interface SavingsHeroProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCredexSavings: number;
  isAlreadyOptimal: boolean;
}

export default function SavingsHero({
  totalMonthlySavings,
  totalAnnualSavings,
  totalCredexSavings,
  isAlreadyOptimal,
}: SavingsHeroProps) {
  const effectiveSavings = totalMonthlySavings + totalCredexSavings;

  if (isAlreadyOptimal || effectiveSavings < 5) {
    return (
      <section className="text-center py-16 space-y-3">
        <div className="text-5xl mb-4" aria-hidden="true">✅</div>
        <h2 className="text-2xl font-bold text-slate-100">
          You&apos;re spending well.
        </h2>
        <p className="text-slate-400 max-w-sm mx-auto leading-relaxed">
          Your current AI stack is well-optimised for your team size and use case.
        </p>
      </section>
    );
  }

  const displayMonthly = totalMonthlySavings > 0 ? totalMonthlySavings : totalCredexSavings;
  const isLarge = displayMonthly >= 100;

  return (
    <section className="text-center py-12 space-y-8">
      {/* Big number */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Potential monthly savings
        </p>

        <div
          className="text-[5rem] md:text-[7rem] font-bold tracking-tight leading-none
                     bg-linear-to-r from-emerald-300 via-emerald-400 to-teal-300
                     bg-clip-text text-transparent"
          aria-label={`$${Math.round(displayMonthly)} per month`}
        >
          $<CountUp end={displayMonthly} />
          <span className="text-3xl font-medium text-slate-500 align-baseline ml-1">/mo</span>
        </div>

        <p className={`text-sm ${isLarge ? "text-emerald-400/80" : "text-slate-500"}`}>
          Based on your provided tool stack and team size.
        </p>
      </div>

      {/* Annual + Credex breakdown */}
      <div className="inline-grid grid-cols-2 divide-x divide-white/8 border border-white/8 rounded-xl overflow-hidden">
        <div className="px-8 py-4 text-center">
          <p className="text-2xl font-bold text-slate-100 tabular-nums">
            $<CountUp end={totalAnnualSavings} />
            <span className="text-sm font-normal text-slate-500 ml-0.5">/yr</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Annual plan savings</p>
        </div>
        <div className="px-8 py-4 text-center">
          <p className="text-2xl font-bold text-emerald-400 tabular-nums">
            +$<CountUp end={totalCredexSavings} />
            <span className="text-sm font-normal text-slate-500 ml-0.5">/mo</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Via Credex credits</p>
        </div>
      </div>
    </section>
  );
}
