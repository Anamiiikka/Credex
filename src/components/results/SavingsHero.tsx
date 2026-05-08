"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
}

function CountUp({ end, duration = 2, decimals = 0 }: CountUpProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, end, {
      duration,
      ease: "easeOut",
      onUpdate(value: number) {
        setCount(value);
      },
    });
    return () => controls.stop();
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
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
  if (isAlreadyOptimal || totalMonthlySavings === 0) {
    return (
      <section className="text-center my-12 space-y-3">
        <div className="text-4xl">✅</div>
        <h2 className="text-2xl font-bold text-slate-200">
          You&apos;re spending well.
        </h2>
        <p className="text-slate-400">
          Your current AI stack is optimized for your team size and use case.
        </p>
      </section>
    );
  }

  const savingsColor =
    totalMonthlySavings > 100 ? "text-emerald-400" : "text-amber-400";

  return (
    <section className="text-center my-12 space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
          Potential Monthly Savings
        </p>
        <div className={`text-6xl md:text-8xl font-bold tracking-tighter ${savingsColor}`}>
          $<CountUp end={totalMonthlySavings} />
          <span className="text-2xl font-medium text-slate-400">/mo</span>
        </div>
        <p className="text-slate-400 text-lg">
          Based on your provided tool stack and team size.
        </p>
      </div>

      {/* Annual + Credex breakdown */}
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-4 border-t border-slate-700">
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-slate-200 tabular-nums">
            $<CountUp end={totalAnnualSavings} />
            <span className="text-sm font-normal text-slate-400">/yr</span>
          </p>
          <p className="text-xs text-slate-400">Annual plan savings</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-emerald-400 tabular-nums">
            +$<CountUp end={totalCredexSavings} />
            <span className="text-sm font-normal text-slate-400">/mo</span>
          </p>
          <p className="text-xs text-slate-400">Additional via Credex</p>
        </div>
      </div>
    </section>
  );
}
