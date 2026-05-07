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
  const isPayg = currentPlan?.monthlyPricePerSeat === 0 && entry.planId.includes("payg");

  return (
    <Card className="transition-all duration-300">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-3 space-y-2">
          <label className="text-sm font-medium leading-none">Tool</label>
          <Select 
            value={entry.toolId} 
            onValueChange={(v) => {
              const newToolId = v as ToolName;
              const newPlan = getPlansForTool(newToolId)[0];
              onUpdate({ toolId: newToolId, planId: newPlan.id });
            }}
          >
            <SelectTrigger>
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
          <label className="text-sm font-medium leading-none">Plan</label>
          <Select 
            value={entry.planId} 
            onValueChange={(v) => onUpdate({ planId: v as string })}
          >
            <SelectTrigger>
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
          <label className="text-sm font-medium leading-none">Seats</label>
          <Input 
            type="number" 
            min="1" 
            value={entry.seats} 
            onChange={(e) => onUpdate({ seats: parseInt(e.target.value) || 1 })} 
          />
        </div>

        <div className="md:col-span-3 space-y-2">
          <label className="text-sm font-medium leading-none">Monthly Spend ($)</label>
          <Input 
            type="number" 
            min="0"
            step="1"
            value={entry.monthlySpend} 
            onChange={(e) => onUpdate({ monthlySpend: parseFloat(e.target.value) || 0 })}
            disabled={!isPayg} // Only allow manual edit for payg, else it's calculated
          />
        </div>

        <div className="md:col-span-1 flex justify-end">
          <Button variant="ghost" size="icon" onClick={onRemove} className="text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
