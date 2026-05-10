
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import SavingsHero from "@/components/results/SavingsHero";
import ToolCard from "@/components/results/ToolCard";
import CredexCTA from "@/components/results/CredexCTA";
import LeadCaptureForm from "@/components/results/LeadCaptureForm";
import ShareButtons from "@/components/results/ShareButtons";
import { AuditResult, ToolRecommendation } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabase
    .from("audits")
    .select("total_monthly_savings, total_annual_savings")
    .eq("id", id)
    .single();

  const monthly = Math.round(data?.total_monthly_savings ?? 0);
  const annual = Math.round(data?.total_annual_savings ?? 0);

  const title = monthly > 0 ? `Save $${monthly}/mo on AI tools` : "Your AI Spend Audit";
  const description = monthly > 0
    ? `Found $${annual}/year in AI tool savings. Audit yours free.`
    : "See where your team can optimise AI tool spend.";

  return {
    title,
    description,
    openGraph: {
      title: monthly > 0 ? `Save $${monthly}/mo on AI tools 🚀` : "My AI Spend Audit",
      description: "Free AI spend audit at credex.rocks",
      type: "website",
      url: `https://credex.rocks/audit/${id}`,
      images: [{ url: "https://credex.rocks/og-image.png", width: 1200, height: 630, alt: "AI Spend Audit Results" }],
    },
    twitter: {
      card: "summary_large_image",
      title: monthly > 0 ? `I could save $${monthly}/mo on AI tools` : "My AI Spend Audit",
      description,
    },
  };
}

export default async function AuditResultPage({ params }: Props) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const auditResult: AuditResult = data.results;
  const recommendations: ToolRecommendation[] = auditResult.recommendations;

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-12 md:py-16">
      <div className="w-full max-w-3xl">

        {/* Context bar */}
        <p className="text-center text-xs text-slate-500 mb-8 tracking-wide">
          {data.tools.length} tool{data.tools.length !== 1 ? "s" : ""} audited
          &nbsp;·&nbsp; Team of {data.team_size}
          &nbsp;·&nbsp; {data.use_case} use case
        </p>

        {/* Savings headline */}
        <SavingsHero
          totalMonthlySavings={auditResult.totalMonthlySavings}
          totalAnnualSavings={auditResult.totalAnnualSavings}
          totalCredexSavings={auditResult.totalCredexSavings}
          isAlreadyOptimal={auditResult.isAlreadyOptimal}
        />

        {/* Recommendation cards */}
        {recommendations.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">
              Recommendations
            </h2>
            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <ToolCard
                  key={`${rec.tool}-${rec.recommendedAction}-${i}`}
                  recommendation={rec}
                />
              ))}
            </div>
          </section>
        )}

        {/* AI analysis */}
        {data.ai_summary && (
          <div className="mt-8 rounded-xl border border-slate-700/60 bg-slate-800/40 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
              AI analysis
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">{data.ai_summary}</p>
          </div>
        )}

        {/* Credex CTA */}
        <CredexCTA
          totalMonthlySavings={auditResult.totalMonthlySavings}
          totalCredexSavings={auditResult.totalCredexSavings}
          isHighSavings={auditResult.isHighSavings}
          isAlreadyOptimal={auditResult.isAlreadyOptimal}
        />

        {/* Share + lead capture */}
        <div className="mt-10 space-y-4">
          <ShareButtons
            auditId={id}
            monthlySavings={auditResult.totalMonthlySavings}
          />
          <LeadCaptureForm
            auditId={id}
            monthlySavings={auditResult.totalMonthlySavings}
          />
        </div>

      </div>
    </main>
  );
}
