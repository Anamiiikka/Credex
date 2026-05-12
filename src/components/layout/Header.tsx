import Link from "next/link";
import { Zap } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/6 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 h-14">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-slate-100 hover:text-white transition-colors"
        >
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-white" aria-hidden="true" />
          </div>
          Credex
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/#how-it-works"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/#audit"
            className="rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 transition-colors px-3 py-1.5 text-xs font-medium"
          >
            Free audit
          </Link>
        </nav>
      </div>
    </header>
  );
}
