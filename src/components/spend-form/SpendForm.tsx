"use client";

import { useState, useEffect } from "react";
import { FormState, ToolEntry, ToolName, UseCase } from "@/types";
import { getPlansForTool, getPlan, calculateMonthlyCost } from "@/lib/pricing-data";
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
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("credex-form");
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("credex-form");
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("credex-form", JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const addTool = () => {
    const defaultToolId: ToolName = "chatgpt";
    const defaultPlanId = "chatgpt_plus";
    const newTool: ToolEntry = {
      id: crypto.randomUUID(),
      toolId: defaultToolId,
      planId: defaultPlanId,
      seats: state.teamSize,
      monthlySpend: calculateMonthlyCost(defaultToolId, defaultPlanId, state.teamSize),
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
        if ("toolId" in updates || "planId" in updates || "seats" in updates) {
          const plan = getPlan(updated.toolId, updated.planId);
          if (plan && plan.monthlyPricePerSeat > 0) {
            updated.monthlySpend = calculateMonthlyCost(updated.toolId, updated.planId, updated.seats);
          }
        }
        return updated;
      })
    }));
  };

  const handleSubmit = () => {
    const errs: string[] = [];
    state.tools.forEach((t, i) => {
      if (!t.toolId) errs.push(`Tool ${i + 1}: select a tool.`);
      if (!t.planId) errs.push(`Tool ${i + 1}: select a plan.`);
      if (t.seats < 1) errs.push(`Tool ${i + 1}: seats must be at least 1.`);
    });
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    onSubmit(state);
  };

  if (!isLoaded) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-24 rounded-lg bg-muted" />
      <div className="h-48 rounded-lg bg-muted" />
      <div className="h-12 rounded-lg bg-muted" />
    </div>
  );

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

      {errors.length > 0 && (
        <ul className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
          {errors.map((e, i) => <li key={i}>• {e}</li>)}
        </ul>
      )}

      <Button size="lg" className="w-full" onClick={handleSubmit} disabled={state.tools.length === 0}>
        <Calculator className="w-4 h-4 mr-2" /> Run Audit
      </Button>
    </div>
  );
}
