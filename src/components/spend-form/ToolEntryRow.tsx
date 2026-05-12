import { ToolEntry, ToolName } from "@/types";
import { getAllToolIds, getToolDisplayName, getPlansForTool, getPlan, calculateMonthlyCost } from "@/lib/pricing-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface Props {
  entry: ToolEntry;
  onUpdate: (updates: Partial<ToolEntry>) => void;
  onRemove: () => void;
}

export function ToolEntryRow({ entry, onUpdate, onRemove }: Props) {
  const tools = getAllToolIds();
  const plans = getPlansForTool(entry.toolId);
  const currentPlan = getPlan(entry.toolId, entry.planId);
  const isManualSpend = currentPlan?.monthlyPricePerSeat === 0;
  const autoSpend = calculateMonthlyCost(entry.toolId, entry.planId, entry.seats);

  return (
    <div className="rounded-lg border border-white/8 bg-white/4 p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3 md:flex md:items-end md:gap-3">

        {/* Tool — full row on mobile (col-span-2), flex-1 on desktop */}
        <div className="col-span-2 md:col-span-1 flex-1 min-w-0 space-y-1.5">
          <label htmlFor={`tool-${entry.id}`} className="block text-xs font-medium text-slate-400">
            Tool
          </label>
          <Select
            value={entry.toolId}
            onValueChange={(v) => {
              const newToolId = v as ToolName;
              const newPlans = getPlansForTool(newToolId);
              onUpdate({ toolId: newToolId, planId: newPlans[0]?.id ?? "" });
            }}
          >
            <SelectTrigger id={`tool-${entry.id}`}>
              <span className="truncate">{getToolDisplayName(entry.toolId)}</span>
            </SelectTrigger>
            <SelectContent>
              {tools.map(t => (
                <SelectItem key={t} value={t}>{getToolDisplayName(t)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Plan — full row on mobile, flex-1 on desktop */}
        <div className="col-span-2 md:col-span-1 flex-1 min-w-0 space-y-1.5">
          <label htmlFor={`plan-${entry.id}`} className="block text-xs font-medium text-slate-400">
            Plan
          </label>
          <Select
            value={entry.planId}
            onValueChange={(v) => onUpdate({ planId: v as string })}
          >
            <SelectTrigger id={`plan-${entry.id}`}>
              <span className="truncate">{currentPlan?.name ?? entry.planId}</span>
            </SelectTrigger>
            <SelectContent>
              {plans.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Seats */}
        <div className="w-18 shrink-0 space-y-1.5 md:w-18">
          <label htmlFor={`seats-${entry.id}`} className="block text-xs font-medium text-slate-400">
            Seats
          </label>
          <Input
            id={`seats-${entry.id}`}
            type="number"
            min="1"
            value={entry.seats}
            onChange={(e) => onUpdate({ seats: parseInt(e.target.value) || 1 })}
          />
        </div>

        {/* Delete — aligned to bottom-right on mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="shrink-0 mb-0.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 self-end"
          aria-label="Remove tool"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Spend line */}
      {isManualSpend ? (
        <div className="space-y-1.5">
          <label htmlFor={`spend-${entry.id}`} className="block text-xs font-medium text-slate-400">
            Monthly Spend ($)
          </label>
          <Input
            id={`spend-${entry.id}`}
            type="number"
            min="0"
            step="1"
            value={entry.monthlySpend}
            onChange={(e) => onUpdate({ monthlySpend: parseFloat(e.target.value) || 0 })}
          />
        </div>
      ) : (
        <p className="text-xs text-slate-600">
          ${autoSpend.toLocaleString("en-US", { maximumFractionDigits: 0 })}/mo · auto-calculated from plan × seats
        </p>
      )}
    </div>
  );
}
