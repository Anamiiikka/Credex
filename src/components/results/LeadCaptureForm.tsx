"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Building2, Briefcase, Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadInput } from "@/types";

interface LeadCaptureFormProps {
  auditId: string;
  monthlySavings: number;
}

/** Inline HoneypotField — visually hidden, must stay empty for valid submissions */
function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        opacity: 0,
        tabIndex: -1,
      }}
    >
      {/* Do not fill out this field */}
      <label htmlFor="lead_website">Website</label>
      <input
        id="lead_website"
        name="website"
        type="text"
        autoComplete="off"
        tabIndex={-1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

type FormState = "idle" | "expanded" | "submitting" | "success" | "error";

export default function LeadCaptureForm({
  auditId,
  monthlySavings,
}: LeadCaptureFormProps) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [honeypot, setHoneypot] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleExpand = () => setFormState("expanded");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Email is required.");
      return;
    }

    setFormState("submitting");
    setErrorMsg("");

    const payload: LeadInput = {
      email: email.trim(),
      companyName: companyName.trim() || undefined,
      role: role.trim() || undefined,
      auditId,
      honeypot,
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Something went wrong.");
      }

      setFormState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Submission failed.");
      setFormState("error");
    }
  };

  /* ── Success state ── */
  if (formState === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-2xl border border-emerald-700/40 bg-emerald-950/30 p-6 text-center"
      >
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-400" />
        <p className="text-lg font-semibold text-emerald-300">You&apos;re on the list!</p>
        <p className="mt-1 text-sm text-slate-400">
          Check your inbox — a summary of your audit is on its way.
        </p>
      </motion.div>
    );
  }

  /* ── Idle CTA (collapsed) ── */
  if (formState === "idle") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <button
          id="lead-cta-expand"
          onClick={handleExpand}
          className="group w-full cursor-pointer rounded-2xl border border-slate-700 bg-slate-900/60 p-5 text-left transition-all hover:border-indigo-500/50 hover:bg-slate-800/60"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">
                {monthlySavings > 0
                  ? `Get your $${Math.round(monthlySavings)}/mo savings plan emailed to you`
                  : "Get your AI stack report emailed to you"}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Free · No credit card · Unsubscribe any time
              </p>
            </div>
            <ChevronDown className="h-5 w-5 text-slate-500 transition-transform group-hover:translate-y-0.5" />
          </div>
        </button>
      </motion.div>
    );
  }

  /* ── Expanded form ── */
  return (
    <AnimatePresence>
      <motion.div
        key="lead-form"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mt-8 overflow-hidden"
      >
        <form
          id="lead-capture-form"
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 backdrop-blur"
        >
          {/* Honeypot — hidden from real users */}
          <HoneypotField value={honeypot} onChange={setHoneypot} />

          <h3 className="mb-1 text-base font-semibold text-slate-200">
            Email me my audit results
          </h3>
          <p className="mb-5 text-xs text-slate-500">
            We&apos;ll send a clean summary you can forward to your team.
          </p>

          <div className="space-y-4">
            {/* Email — required */}
            <div className="relative">
              <label
                htmlFor="lead-email"
                className="mb-1 block text-xs font-medium text-slate-400"
              >
                Work email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="lead-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            {/* Company — optional */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="lead-company"
                  className="mb-1 block text-xs font-medium text-slate-400"
                >
                  Company
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="lead-company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Acme Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              {/* Role — optional */}
              <div>
                <label
                  htmlFor="lead-role"
                  className="mb-1 block text-xs font-medium text-slate-400"
                >
                  Your role
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="lead-role"
                    type="text"
                    placeholder="CTO, Founder…"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {formState === "error" && errorMsg && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-xs text-rose-400"
            >
              {errorMsg}
            </motion.p>
          )}

          <Button
            id="lead-submit-btn"
            type="submit"
            className="mt-5 w-full"
            disabled={formState === "submitting"}
          >
            {formState === "submitting" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              "Send me the report →"
            )}
          </Button>

          <p className="mt-3 text-center text-xs text-slate-600">
            No spam. Unsubscribe in one click.
          </p>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
