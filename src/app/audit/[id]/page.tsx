
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import SavingsHero from "@/components/results/SavingsHero";
import ToolCard from "@/components/results/ToolCard";
import CredexCTA from "@/components/results/CredexCTA";
import { AuditResult, ToolRecommendation } from "@/types";

interface Props {
  params: { id: string };
}

// Dynamic OG tags per audit
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from("audits")
    .select("total_monthly_savings, total_annual_savings")
    .eq("id", params.id)
    .single();

  const savings = data?.total_monthly_savings ?? 0;
  const annualSavings = data?.total_annual_savings ?? 0;
  const savingsAmount = Math.round(savings);
  const annualAmount = Math.round(annualSavings);

  const title = savingsAmount > 0
    ? `Save $${savingsAmount}/mo on AI tools`
    : "Your AI Spend Audit Results";

  const description = savingsAmount > 0
    ? `Found $${annualAmount}/year in AI tool savings. Audit yours free.`
    : "See where your team can optimize AI tool spend.";

  return {
    title,
    description,
    openGraph: {
      title: savingsAmount > 0
        ? `Save $${savingsAmount}/mo on AI tools 🚀`
        : "My AI Spend Audit Results",
      description: "Free AI spend audit at credex.rocks",
      type: "website",
      url: `https://credex.rocks/audit/${params.id}`,
      images: [
        {
          url: "https://credex.rocks/og-image.png",
          width: 1200,
          height: 630,
          alt: "AI Spend Audit Results",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: savingsAmount > 0
        ? `I could save $${savingsAmount}/mo on AI tools`
        : "My AI Spend Audit",
      description,
    },
  };
}

export default async function AuditResultPage({ params }: Props) {
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) notFound();

  const auditResult: AuditResult = data.results;
  const recommendations: ToolRecommendation[] = auditResult.recommendations;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 lg:p-24">
      <div className="w-full max-w-4xl">
        {/* Audit context — PII stripped (no email/company shown) */}
        <p className="text-center text-sm text-slate-400 mb-6">
          {data.tools.length} tool{data.tools.length !== 1 ? "s" : ""} audited
          &nbsp;·&nbsp; Team of {data.team_size}
          &nbsp;·&nbsp; {data.use_case} use case
        </p>

        <SavingsHero
          totalMonthlySavings={auditResult.totalMonthlySavings}
          totalAnnualSavings={auditResult.totalAnnualSavings}
          totalCredexSavings={auditResult.totalCredexSavings}
          isAlreadyOptimal={auditResult.isAlreadyOptimal}
        />

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-200 mb-4">
            Recommendations
          </h2>
          {recommendations.map((rec) => (
            <ToolCard
              key={`${rec.tool}-${rec.recommendedAction}`}
              recommendation={rec}
            />
          ))}
        </div>

        {/* AI summary if available */}
        {data.ai_summary && (
          <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <p className="text-sm font-medium text-slate-400 mb-2">AI Analysis</p>
            <p className="text-slate-300 text-sm leading-relaxed">{data.ai_summary}</p>
          </div>
        )}

        <CredexCTA
          totalMonthlySavings={auditResult.totalMonthlySavings}
          isHighSavings={auditResult.isHighSavings}
          isAlreadyOptimal={auditResult.isAlreadyOptimal}
        />
      </div>
    </main>
  );
}
