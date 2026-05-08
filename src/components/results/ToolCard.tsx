
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolRecommendation } from "@/types";
import { ArrowRight, TrendingDown } from "lucide-react";

interface ToolCardProps {
  recommendation: ToolRecommendation;
}

export default function ToolCard({ recommendation }: ToolCardProps) {
  const {
    tool,
    currentPlan,
    recommendedPlan,
    savings,
    reason,
  } = recommendation;

  return (
    <Card className="bg-slate-800/50 border-slate-700 mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Placeholder for tool icon */}
            <div className="w-8 h-8 bg-slate-700 rounded-md"></div>
            <span className="text-xl font-bold text-slate-100">{tool}</span>
          </div>
          {savings > 0 && (
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingDown size={20} />
              <span className="text-xl font-bold">
                ${savings.toFixed(2)}/mo
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
          {/* Current Spend */}
          <div className="p-4 bg-slate-900/70 rounded-lg">
            <p className="text-sm text-slate-400">Current</p>
            <p className="text-lg font-semibold text-slate-200">
              {currentPlan.name}
            </p>
            <p className="text-2xl font-bold text-slate-100">
              ${currentPlan.price.toFixed(2)}
            </p>
          </div>

          <div className="hidden md:block text-slate-500">
            <ArrowRight size={32} className="mx-auto" />
          </div>

          {/* Recommended Spend */}
          <div className="p-4 bg-emerald-900/30 rounded-lg border border-emerald-700/50">
            <p className="text-sm text-emerald-300">Recommendation</p>
            <p className="text-lg font-semibold text-slate-200">
              {recommendedPlan.name}
            </p>
            <p className="text-2xl font-bold text-emerald-400">
              ${recommendedPlan.price.toFixed(2)}
            </p>
          </div>
        </div>
        <p className="text-slate-300 mt-4 text-center md:text-left">
          <span className="font-semibold">Reason:</span> {reason}
        </p>
      </CardContent>
    </Card>
  );
}
