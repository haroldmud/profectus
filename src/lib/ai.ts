import OpenAI from 'openai'

let _client: OpenAI | null = null

export function getAIClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_AI_API_KEY ?? 'missing-key',
      baseURL: process.env.NEXT_PUBLIC_AI_BASE_URL,
      dangerouslyAllowBrowser: true,
    })
  }
  return _client
}
