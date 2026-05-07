"use client";

import { useState, useEffect } from "react";
import { FormState, ToolEntry, ToolName, UseCase } from "@/types";
import { getAllToolIds, getPlansForTool, getPlan, calculateMonthlyCost } from "@/lib/pricing-data";
import { ToolEntryRow } from "./ToolEntryRow";
import { TeamInfo } from "./TeamInfo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Calculator } from "lucide-react";

export function SpendForm({ onSubmit }: { onSubmit: (state: FormState) => void }) {
  const [state, setState] = useState<FormState>({
    tools: [],
    teamSize: 1,
    useCase: "coding",
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("credex-form");
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("credex-form", JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const addTool = () => {
    const newTool: ToolEntry = {
      id: crypto.randomUUID(),
      toolId: "chatgpt",
      planId: "chatgpt_plus",
      seats: state.teamSize,
      monthlySpend: 20 * state.teamSize, // default calculated spend
    };
    setState(s => ({ ...s, tools: [...s.tools, newTool] }));
  };

  const removeTool = (id: string) => {
    setState(s => ({ ...s, tools: s.tools.filter(t => t.id !== id) }));
  };

  const updateTool = (id: string, updates: Partial<ToolEntry>) => {
    setState(s => ({
      ...s,
      tools: s.tools.map(t => {
        if (t.id !== id) return t;
        const updated = { ...t, ...updates };
        
        // Auto-calculate spend if tool or plan or seats changed
        if (updates.toolId || updates.planId || updates.seats !== undefined) {
          const plan = getPlan(updated.toolId, updated.planId);
          if (plan && plan.monthlyPricePerSeat > 0) {
            updated.monthlySpend = calculateMonthlyCost(updated.toolId, updated.planId, updated.seats);
          }
        }
        return updated;
      })
    }));
  };

  if (!isLoaded) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <TeamInfo 
        teamSize={state.teamSize} 
        useCase={state.useCase} 
        onChange={(updates) => setState(s => ({ ...s, ...updates }))} 
      />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Your AI Stack</h3>
        {state.tools.length === 0 ? (
          <Card className="p-8 text-center border-dashed text-muted-foreground">
            No tools added yet. Click below to add your first AI tool.
          </Card>
        ) : (
          <div className="space-y-4">
            {state.tools.map(tool => (
              <ToolEntryRow 
                key={tool.id} 
                entry={tool} 
                onUpdate={(updates) => updateTool(tool.id, updates)} 
                onRemove={() => removeTool(tool.id)} 
              />
            ))}
          </div>
        )}

        <Button variant="outline" onClick={addTool} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add AI Tool
        </Button>
      </div>

      <Button size="lg" className="w-full" onClick={() => onSubmit(state)} disabled={state.tools.length === 0}>
        <Calculator className="w-4 h-4 mr-2" /> Run Audit
      </Button>
    </div>
  );
}
