import { SpendForm } from "@/components/spend-form/SpendForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-12 lg:p-24">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-50">
            AI Spend Auditor
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Discover how much you could save on your AI tool stack.
          </p>
        </div>
        <SpendForm />
      </div>
    </main>
  );
}
