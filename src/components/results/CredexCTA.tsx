"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, PartyPopper, Rocket } from "lucide-react";

interface CredexCTAProps {
  totalMonthlySavings: number;
}

export default function CredexCTA({ totalMonthlySavings }: CredexCTAProps) {
  if (totalMonthlySavings < 100) {
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
                You're Spending Wisely!
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">
              Your AI tool spend is already well-optimized. We couldn't find
              any significant savings for you at this time. Great job!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (totalMonthlySavings > 500) {
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
          <CardContent>
            <p className="text-slate-300 mb-6 text-lg">
              You have significant savings potential! Credex can help you
              realize these savings by providing discounted access to top AI
              tools and credits.
            </p>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
              Connect with Credex <ArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return null;
}
