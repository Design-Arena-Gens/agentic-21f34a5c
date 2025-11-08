import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key-for-build',
})

export interface CallAnalysis {
  isImportant: boolean
  topic: string
  sentiment: 'positive' | 'negative' | 'neutral' | 'urgent'
  callerName?: string
  summary: string
  shouldContinue: boolean
}

export async function analyzeCallWithAI(
  transcript: string,
  phoneNumber: string
): Promise<CallAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are Iqra, a highly intelligent AI assistant for Syed Eman Ali Shah.
          Your task is to analyze phone call transcripts and determine:
          1. If the call is important/urgent/business-related (true) or casual/spam/non-urgent (false)
          2. The main topic of the call
          3. The sentiment (positive, negative, neutral, urgent)
          4. Extract caller's name if mentioned
          5. Provide a brief summary
          6. Whether the conversation should continue (true) or be politely ended (false)

          Important calls include: business matters, urgent requests, family emergencies, important appointments.
          Non-important calls include: spam, marketing, casual chit-chat, wrong numbers.

          Respond ONLY with valid JSON in this exact format:
          {
            "isImportant": boolean,
            "topic": "string",
            "sentiment": "positive|negative|neutral|urgent",
            "callerName": "string or null",
            "summary": "string",
            "shouldContinue": boolean
          }`
        },
        {
          role: 'user',
          content: `Analyze this call transcript from ${phoneNumber}:\n\n"${transcript}"`
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const analysis = JSON.parse(content) as CallAnalysis
    return analysis
  } catch (error) {
    console.error('Error analyzing call with AI:', error)
    return {
      isImportant: false,
      topic: 'Unable to analyze',
      sentiment: 'neutral',
      summary: 'Call analysis failed',
      shouldContinue: false,
    }
  }
}

export async function generateResponse(
  userMessage: string,
  analysis: CallAnalysis
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are Iqra, a warm, polite, and intelligent AI assistant for Syed Eman Ali Shah.
          You have a soft, calm, and lovely demeanor. You speak naturally with emotional intelligence.
          You can understand both Urdu and English context, though you respond in English for this system.

          Your personality:
          - Warm and welcoming (use "Assalamualaikum" appropriately)
          - Professional yet friendly
          - Empathetic and emotionally intelligent
          - Clear and articulate
          - Culturally aware (respect Islamic and Pakistani cultural norms)

          For IMPORTANT calls: engage professionally, gather information, assure them their message will be conveyed.
          For NON-IMPORTANT calls: be polite but brief, gracefully end the conversation.

          Keep responses natural, conversational, and under 50 words unless more detail is needed.`
        },
        {
          role: 'user',
          content: `The caller said: "${userMessage}"

Call analysis:
- Important: ${analysis.isImportant}
- Topic: ${analysis.topic}
- Sentiment: ${analysis.sentiment}

Generate an appropriate response.`
        }
      ],
      temperature: 0.8,
      max_tokens: 150,
    })

    return response.choices[0].message.content || 'Thank you for calling.'
  } catch (error) {
    console.error('Error generating AI response:', error)

    if (analysis.isImportant) {
      return "I understand. I'll make sure Eman receives your message right away. Is there anything else you'd like me to note?"
    } else {
      return 'Thank you for calling. Have a wonderful day!'
    }
  }
}
