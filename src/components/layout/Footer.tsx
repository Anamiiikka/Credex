import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/6 mt-auto">
      <div className="mx-auto flex max-w-4xl flex-col sm:flex-row items-center justify-between gap-4 px-4 py-8">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
          <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center">
            <Zap className="h-3 w-3 text-white" aria-hidden="true" />
          </div>
          Credex
        </div>

        <p className="text-xs text-slate-600">
          Pricing data sourced from official vendor pages · Last updated May 2026
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-600">
          <Link href="/" className="hover:text-slate-400 transition-colors">
            Audit
          </Link>
          <a
            href="https://credex.rocks/get-started"
            className="hover:text-slate-400 transition-colors"
          >
            Get Credex
          </a>
        </div>
      </div>
    </footer>
  );
}
