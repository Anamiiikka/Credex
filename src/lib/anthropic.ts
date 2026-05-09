import { Groq } from "groq-sdk";

/**
 * Singleton Groq client
 * Uses GROQ_API_KEY from environment
 * Falls back gracefully if key is missing (returns null client)
 */
export function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.warn(
      "GROQ_API_KEY not found in environment. AI summaries will use fallback template."
    );
    return null;
  }

  return new Groq({ apiKey });
}

/**
 * Test whether Groq API is available
 */
export function isGroqAvailable(): boolean {
  return !!process.env.GROQ_API_KEY;
}
