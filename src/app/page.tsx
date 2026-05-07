"use client";

import { useState } from "react";
import { SpendForm } from "@/components/spend-form/SpendForm";
import { FormState, AuditResult } from "@/types";
import { runAuditEngine } from "@/lib/audit-engine";

export default function Home() {
  const [, setAuditResult] = useState<AuditResult | null>(null);

  const handleAudit = async (state: FormState) => {
    // In Day 3 this will call the API, but for now we can just run the engine locally for preview
    const result = runAuditEngine(state);
    
    // Set dummy ID and date for now
    setAuditResult({
      ...result,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    });
    
    console.log("Audit Result:", result);
    // TODO: Transition to results view or lead capture
    alert("Audit completed! See console for details. (UI coming soon)");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            AI Spend Auditor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find out if you&apos;re overpaying for AI tools. We&apos;ll analyze your stack and find savings.
          </p>
        </div>

        <div className="bg-card shadow-sm rounded-xl border p-6 md:p-8">
          <SpendForm onSubmit={handleAudit} />
        </div>
      </main>
    </div>
  );
}
