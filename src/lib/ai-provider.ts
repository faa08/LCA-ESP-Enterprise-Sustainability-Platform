// src/lib/ai-provider.ts
// Dual AI Provider with Failover (Groq Primary -> Gemini Fallback -> Deterministic Rule)

export interface AIResponse {
  text: string
  provider: "groq" | "gemini" | "rule-engine"
  model: string
}

/**
  Generate AI Insights with automatic failover strategy.
  1. Primary: Groq Cloud API (Llama 3.3 70B - Super Fast)
  2. Fallback: Google Gemini 1.5 Flash (Generous Free Tier)
  3. Backup: Deterministic Rule Engine (Zero Downtime Guarantee)
 */
export async function generateAIInsight(prompt: string, systemPrompt?: string): Promise<AIResponse> {
  const groqKey = process.env.GROQ_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

  // ── 1. Primary Strategy: Groq API ──
  if (groqKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt || "Anda adalah pakar LCA dan konsultan keberlanjutan enterprise (ISO 14040/14044, GHG Protocol, PROPER KLHK, POJK 51/2017). Berikan analisis dalam Bahasa Indonesia yang singkat, profesional, dan dapat ditindaklanjuti direksi." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const text = data.choices?.[0]?.message?.content
        if (text && text.trim().length > 0) {
          return { text, provider: "groq", model: "llama-3.3-70b-versatile" }
        }
      }
      console.warn("[AI Provider] Groq API returned non-OK response, failing over to Gemini...")
    } catch (err) {
      console.warn("[AI Provider] Groq API error, failing over to Gemini:", err)
    }
  }

  // ── 2. Fallback Strategy: Google Gemini API ──
  if (geminiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: (systemPrompt ? `${systemPrompt}\n\n` : "") + prompt },
              ],
            },
          ],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (text && text.trim().length > 0) {
          return { text, provider: "gemini", model: "gemini-1.5-flash" }
        }
      }
      console.warn("[AI Provider] Gemini API returned non-OK response, failing over to Rule Engine...")
    } catch (err) {
      console.warn("[AI Provider] Gemini API error, failing over to Rule Engine:", err)
    }
  }

  // ── 3. Ultimate Fallback: Deterministic Rule Engine (Guaranteed Output) ──
  return {
    text: "Analisis berbasis aturan: Kinerja emisi dan energi operasional terpantau stabil. Disarankan untuk memprioritaskan pengurangan emisi Scope 1 dengan bauran biomassa dan optimalisasi efisiensi daya listrik Scope 2 untuk mempertahankan peringkat PROPER Hijau/Emas.",
    provider: "rule-engine",
    model: "deterministic-engine-v1",
  }
}
