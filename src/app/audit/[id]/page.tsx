
import CredexCTA from "@/components/results/CredexCTA";
import SavingsHero from "@/components/results/SavingsHero";
import ToolCard from "@/components/results/ToolCard";
import { supabase } from "@/lib/supabase";
import { AuditResult, ToolRecommendation } from "@/types";

interface AuditResultPageProps {
  params: Promise<{ id: string }>;
}

export default async function AuditResultPage({ params }: AuditResultPageProps) {
  const { id } = await params;

  // Fetch audit results from Supabase
  const { data: auditRecord, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !auditRecord) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-200 mb-2">Audit Not Found</h1>
          <p className="text-slate-400">
            The audit results you&apos;re looking for don&apos;t exist or have been deleted.
          </p>
        </div>
      </main>
    );
  }

  // Extract the full audit result from the stored data
  const auditResults: AuditResult = auditRecord.results || {
    recommendations: [],
    totalMonthlySavings: 0,
    totalCredexSavings: 0,
    totalAnnualSavings: 0,
    isAlreadyOptimal: true,
    isHighSavings: false,
  };

  const recommendations: ToolRecommendation[] = auditResults.recommendations || [];

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 lg:p-24">
      <div className="w-full max-w-4xl">
        <SavingsHero
          totalMonthlySavings={auditResults.totalMonthlySavings}
          totalAnnualSavings={auditResults.totalAnnualSavings}
          totalCredexSavings={auditResults.totalCredexSavings}
          isAlreadyOptimal={auditResults.isAlreadyOptimal}
        />
        {recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-200 mb-4">
              Recommendations
            </h2>
            {recommendations.map((rec, index) => (
              <ToolCard key={index} recommendation={rec} />
            ))}
          </div>
        )}
        <CredexCTA
          totalMonthlySavings={auditResults.totalMonthlySavings}
          isHighSavings={auditResults.isHighSavings}
          isAlreadyOptimal={auditResults.isAlreadyOptimal}
        />
      </div>
    </main>
  );
}
