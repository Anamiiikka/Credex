"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Check, Twitter, Linkedin } from "lucide-react";

interface ShareButtonsProps {
  auditId: string;
  monthlySavings: number;
}

export default function ShareButtons({ auditId, monthlySavings }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const auditUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/audit/${auditId}`
      : `https://credex.rocks/audit/${auditId}`;

  const shareText =
    monthlySavings > 0
      ? `I just found $${Math.round(monthlySavings)}/mo in AI tool savings with @credexrocks — audit yours free 👇`
      : `Just ran a free AI spend audit with @credexrocks — see where your team could optimise 👇`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(auditUrl)}`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    auditUrl
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(auditUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = auditUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mt-6">
      <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-slate-500">
        Share your results
      </p>
      <div className="flex items-center justify-center gap-3">
        {/* Copy link */}
        <button
          id="share-copy-link"
          onClick={handleCopy}
          title="Copy shareable link"
          className="group flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-indigo-500/50 hover:bg-slate-700/60 hover:text-slate-100"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Check className="h-4 w-4 text-emerald-400" />
              </motion.span>
            ) : (
              <motion.span
                key="link"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Link2 className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "copied" : "copy"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {copied ? "Copied!" : "Copy link"}
            </motion.span>
          </AnimatePresence>
        </button>

        {/* Twitter / X */}
        <a
          id="share-twitter"
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on X (Twitter)"
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-sky-500/40 hover:bg-slate-700/60 hover:text-sky-400"
        >
          {/* X (Twitter) SVG icon */}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4 fill-current"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
          </svg>
          <span className="hidden sm:inline">Post on X</span>
          <span className="sm:hidden">X</span>
        </a>

        {/* LinkedIn */}
        <a
          id="share-linkedin"
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on LinkedIn"
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-blue-500/40 hover:bg-slate-700/60 hover:text-blue-400"
        >
          <Linkedin className="h-4 w-4" />
          <span className="hidden sm:inline">LinkedIn</span>
        </a>
      </div>

      {/* Shareable URL preview */}
      <p className="mt-3 truncate text-center text-xs text-slate-600" title={auditUrl}>
        {auditUrl}
      </p>
    </div>
  );
}
