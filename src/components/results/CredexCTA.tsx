"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, PartyPopper, Rocket, Zap } from "lucide-react";

interface CredexCTAProps {
  totalMonthlySavings: number;
  isHighSavings: boolean;
  isAlreadyOptimal: boolean;
}

export default function CredexCTA({
  totalMonthlySavings,
  isHighSavings,
  isAlreadyOptimal,
}: CredexCTAProps) {
  // Already optimal — honest "you're doing well" message
  if (isAlreadyOptimal || totalMonthlySavings < 100) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <Card className="bg-slate-800/50 border-slate-700 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3">
              <PartyPopper className="text-amber-400" />
              <span className="text-xl font-bold text-slate-100">
                You&apos;re Spending Wisely!
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              Your AI tool spend is already well-optimized. We couldn&apos;t
              find any significant savings for you at this time. Great job!
            </p>
            <Button variant="outline" className="gap-2">
              <Zap size={16} />
              Notify Me When Better Options Appear
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // High savings (>$500) — strong CTA
  if (isHighSavings) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <Card className="bg-gradient-to-br from-purple-600/20 via-slate-800/50 to-slate-800/50 border-purple-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-50">
              <Rocket className="text-purple-400" />
              Ready to Supercharge Your Savings?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300 text-lg">
              You have significant savings potential! Credex can help you
              realize these savings by providing discounted access to top AI
              tools and credits.
            </p>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2"
            >
              Connect with Credex
              <ArrowRight size={18} />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Mid-range savings ($100–$500) — softer CTA
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-12"
    >
      <Card className="bg-gradient-to-br from-emerald-600/10 via-slate-800/50 to-slate-800/50 border-emerald-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-50">
            <Zap className="text-emerald-400" />
            Unlock Your ${totalMonthlySavings.toLocaleString("en-US", { maximumFractionDigits: 0 })}/mo in Savings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300">
            Credex provides discounted AI tool credits from companies that
            overforecast. Apply these savings on top of the plan optimizations
            above.
          </p>
          <Button
            variant="outline"
            className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 gap-2"
          >
            Learn How Credex Works
            <ArrowRight size={18} />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
