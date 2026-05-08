
import SavingsHero from "@/components/results/SavingsHero";

export default function AuditResultPage({ params }: { params: { id: string } }) {
  // Fetch audit results from Supabase using params.id in a server component
  // For now, we'll use mock data.
  const mockAuditData = {
    totalMonthlySavings: 1234.56,
    results: [],
    aiSummary: "This is a mock AI summary.",
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 lg:p-24">
      <div className="w-full max-w-4xl">
        <SavingsHero totalMonthlySavings={mockAuditData.totalMonthlySavings} />
        {/* Tool recommendation cards will go here */}
        {/* Credex CTA will go here */}
      </div>
    </main>
  );
}
