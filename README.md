# AI Spend Auditor

A tool to help startup founders and engineering managers audit their AI tool spending and discover savings.

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.local.example` to `.env.local` and add your keys
4. Run development server: `npm run dev`

## Key Decisions

1. **Next.js App Router**: Chosen for its seamless full-stack capabilities and server-side rendering for optimal shareable URLs (OG tags).
2. **Supabase**: Chosen for fast PostgreSQL setup to securely separate public audit data from private lead data via Row Level Security (RLS).
3. **Anthropic API**: Preferred per specification for generating concise, intelligent summaries of audit results.
4. **Tailwind CSS + shadcn/ui**: For rapid, accessible, and highly customizable UI component development without being locked into a bloated template.
5. **Vitest**: Chosen over Jest for faster execution and native TypeScript support in Next.js projects.
