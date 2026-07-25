import { NextResponse } from "next/server"
import { generateAIInsight } from "@/lib/ai-provider"

export async function POST(req: Request) {
  try {
    const { prompt, systemPrompt } = await req.json()
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const result = await generateAIInsight(prompt, systemPrompt)
    return NextResponse.json(result)
  } catch (error) {
    console.error("AI Route Error:", error)
    return NextResponse.json({
      text: "Terjadi kendala pada layanan AI. Sistem beralih ke analisis berbasis aturan otomatis.",
      provider: "rule-engine",
      model: "fallback",
    }, { status: 500 })
  }
}
