import OpenAI from 'openai'

export const aiClient = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_AI_API_KEY,
  baseURL: process.env.NEXT_PUBLIC_AI_BASE_URL,
  dangerouslyAllowBrowser: true,
})

export async function getAvailableModels() {
  const models = await aiClient.models.list()
  return models.data
}
