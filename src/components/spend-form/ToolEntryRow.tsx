import { ToolEntry, ToolName } from "@/types";
import { getAllToolIds, getToolDisplayName, getPlansForTool, getPlan } from "@/lib/pricing-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

  return (
    <Card className="transition-all duration-300">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-3 space-y-2">
          <label htmlFor={`tool-${entry.id}`} className="text-sm font-medium leading-none">Tool</label>
          <Select 
            value={entry.toolId} 
            onValueChange={(v) => {
              const newToolId = v as ToolName;
              const newPlans = getPlansForTool(newToolId);
              onUpdate({ toolId: newToolId, planId: newPlans[0]?.id ?? "" });
            }}
          >
            <SelectTrigger id={`tool-${entry.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tools.map(t => (
                <SelectItem key={t} value={t}>{getToolDisplayName(t)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-3 space-y-2">
          <label htmlFor={`plan-${entry.id}`} className="text-sm font-medium leading-none">Plan</label>
          <Select 
            value={entry.planId} 
            onValueChange={(v) => onUpdate({ planId: v as string })}
          >
            <SelectTrigger id={`plan-${entry.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {plans.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label htmlFor={`seats-${entry.id}`} className="text-sm font-medium leading-none">Seats</label>
          <Input 
            id={`seats-${entry.id}`}
            type="number" 
            min="1" 
            value={entry.seats} 
            onChange={(e) => onUpdate({ seats: parseInt(e.target.value) || 1 })} 
          />
        </div>

        <div className="md:col-span-3 space-y-2">
          <label htmlFor={`spend-${entry.id}`} className="text-sm font-medium leading-none">Monthly Spend ($)</label>
          <Input 
            id={`spend-${entry.id}`}
            type="number" 
            min="0"
            step="1"
            value={entry.monthlySpend} 
            onChange={(e) => onUpdate({ monthlySpend: parseFloat(e.target.value) || 0 })}
            disabled={!isManualSpend} 
          />
          {!isManualSpend && (
            <p className="text-xs text-muted-foreground">Auto-calculated from plan × seats</p>
          )}
        </div>

        <div className="md:col-span-1 flex justify-end">
          <Button variant="ghost" size="icon" onClick={onRemove} className="text-destructive" aria-label="Remove tool">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
