import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.AI_API_KEY ?? '',
  baseURL: process.env.AI_BASE_URL,
})

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  try {
    const res = await client.chat.completions.create({
      model: 'claude-haiku-4-5',
      messages,
    })
    return NextResponse.json({ content: res.choices[0]?.message?.content ?? '' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI request failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
