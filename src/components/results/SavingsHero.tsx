"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
}

function CountUp({ end, duration = 2, decimals = 2 }: CountUpProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      const controls = motion.animate(0, end, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          setCount(value);
        },
      });
      return () => controls.stop();
    }
  }, [inView, end, duration]);

  return (
    <motion.span ref={ref}>
      {count.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </motion.span>
  );
}


interface SavingsHeroProps {
  totalMonthlySavings: number;
}

export default function SavingsHero({ totalMonthlySavings }: SavingsHeroProps) {
  const savingsColor = totalMonthlySavings > 100 ? "text-emerald-400" : "text-amber-400";

  return (
    <section className="text-center my-12">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-200 mb-2">
        Potential Monthly Savings
      </h1>
      <div
        className={`text-6xl md:text-8xl font-bold tracking-tighter ${savingsColor}`}
      >
        $
        <CountUp end={totalMonthlySavings} />
      </div>
      <p className="text-slate-400 mt-2 text-lg">
        Based on your provided tool stack and team size.
      </p>
    </section>
  );
}
