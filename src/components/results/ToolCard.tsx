
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolRecommendation, RecommendationAction } from "@/types";
import { ArrowRight, TrendingDown } from "lucide-react";

const ACTION_COLOR: Record<RecommendationAction, string> = {
  downgrade: "text-blue-400",
  upgrade: "text-purple-400",
  switch_vendor: "text-orange-400",
  consolidate: "text-orange-400",
  use_credex: "text-emerald-400",
  keep_current: "text-slate-400",
};

const ACTION_LABEL: Record<RecommendationAction, string> = {
  downgrade: "Downgrade Plan",
  upgrade: "Upgrade Plan",
  switch_vendor: "Switch Vendor",
  consolidate: "Consolidate",
  use_credex: "Use Credex Credits",
  keep_current: "Already Optimal",
};

interface ToolCardProps {
  recommendation: ToolRecommendation;
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function ToolCard({ recommendation }: ToolCardProps) {
  const {
    tool,
    currentPlan,
    recommendedPlan,
    savings,
    reason,
    recommendedAction,
    credexSavings,
  } = recommendation;

  const actionColor = ACTION_COLOR[recommendedAction];
  const actionLabel = ACTION_LABEL[recommendedAction];

  return (
    <Card className="bg-slate-800/50 border-slate-700 mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-700 rounded-md" aria-hidden="true" />
            <span className="text-xl font-bold text-slate-100">{tool}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${actionColor}`}>
              {actionLabel}
            </span>
            {savings > 0 && (
              <div className={`flex items-center gap-1 ${actionColor}`}>
                <TrendingDown size={18} />
                <span className="text-lg font-bold">${formatMoney(savings)}/mo</span>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
          <div className="p-4 bg-slate-900/70 rounded-lg">
            <p className="text-sm text-slate-400">Current</p>
            <p className="text-lg font-semibold text-slate-200">{currentPlan.name}</p>
            <p className="text-2xl font-bold text-slate-100">${formatMoney(currentPlan.price)}/mo</p>
          </div>

          <div className="hidden md:block text-slate-500">
            <ArrowRight size={32} className="mx-auto" />
          </div>

          <div className="p-4 bg-emerald-900/30 rounded-lg border border-emerald-700/50">
            <p className="text-sm text-emerald-300">Recommended</p>
            <p className="text-lg font-semibold text-slate-200">{recommendedPlan.name}</p>
            <p className="text-2xl font-bold text-emerald-400">${formatMoney(recommendedPlan.price)}/mo</p>
          </div>
        </div>

        <p className="text-slate-300 text-center md:text-left">
          <span className="font-semibold">Why: </span>{reason}
        </p>

        {credexSavings && credexSavings > 5 && (
          <div className="rounded-lg bg-emerald-900/20 border border-emerald-700/30 px-3 py-2 text-xs text-emerald-400">
            ⚡ Save an additional ${formatMoney(credexSavings)}/mo by purchasing through Credex credits
          </div>
        )}
      </CardContent>
    </Card>
  );
}
