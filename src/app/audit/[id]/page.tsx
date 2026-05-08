
import CredexCTA from "@/components/results/CredexCTA";
import SavingsHero from "@/components/results/SavingsHero";
import ToolCard from "@/components/results/ToolCard";
import { ToolRecommendation } from "@/types";

export default function AuditResultPage() {
  // Fetch audit results from Supabase in a server component
  // For now, we'll use mock data.
  const mockRecommendations: ToolRecommendation[] = [
    {
      tool: "GitHub Copilot",
      currentPlan: { name: "Business", price: 19 },
      recommendedPlan: { name: "Enterprise (via Credex)", price: 15 },
      savings: 4,
      reason: "Credex offers discounted seats for GitHub Copilot Enterprise.",
    },
    {
      tool: "OpenAI API",
      currentPlan: { name: "Pay-as-you-go", price: 250 },
      recommendedPlan: { name: "Claude 3 Sonnet (via Credex)", price: 180 },
      savings: 70,
      reason: "For your use case, Claude 3 Sonnet provides similar performance at a lower cost.",
    },
  ];

  const mockAuditData = {
    totalMonthlySavings: 1234.56,
    totalAnnualSavings: 14815,
    totalCredexSavings: 340,
    isAlreadyOptimal: false,
    results: mockRecommendations,
    aiSummary: "This is a mock AI summary.",
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 lg:p-24">
      <div className="w-full max-w-4xl">
        <SavingsHero
          totalMonthlySavings={mockAuditData.totalMonthlySavings}
          totalAnnualSavings={mockAuditData.totalAnnualSavings}
          totalCredexSavings={mockAuditData.totalCredexSavings}
          isAlreadyOptimal={mockAuditData.isAlreadyOptimal}
        />
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-200 mb-4">
            Recommendations
          </h2>
          {mockAuditData.results.map((rec, index) => (
            <ToolCard key={index} recommendation={rec} />
          ))}
        </div>
        <CredexCTA totalMonthlySavings={mockAuditData.totalMonthlySavings} />
      </div>
    </main>
  );
}
