import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { analyzeCallWithAI, generateResponse } from '@/lib/ai'
import { saveCallLog } from '@/lib/database'
import { sendNotification } from '@/lib/notifications'

const VoiceResponse = twilio.twiml.VoiceResponse

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const speechResult = formData.get('SpeechResult') as string
    const from = formData.get('From') as string
    const callSid = formData.get('CallSid') as string

    console.log('Speech received from', from, ':', speechResult)

    const analysis = await analyzeCallWithAI(speechResult, from)

    await saveCallLog({
      callSid,
      caller: analysis.callerName || 'Unknown',
      callerNumber: from,
      topic: analysis.topic,
      isImportant: analysis.isImportant,
      sentiment: analysis.sentiment,
      transcript: speechResult,
      duration: 0,
    })

    if (analysis.isImportant) {
      await sendNotification({
        caller: analysis.callerName || 'Unknown',
        callerNumber: from,
        topic: analysis.topic,
        summary: analysis.summary,
        timestamp: new Date().toISOString(),
      })
    }

    const aiResponse = await generateResponse(speechResult, analysis)

    const response = new VoiceResponse()

    response.say({
      voice: 'Polly.Joanna',
      language: 'en-US'
    }, aiResponse)

    if (analysis.shouldContinue) {
      response.gather({
        input: ['speech'],
        action: '/api/twilio/process-speech',
        method: 'POST',
        timeout: 5,
        speechTimeout: 'auto',
        language: 'en-US',
      })
    } else {
      response.say({
        voice: 'Polly.Joanna',
        language: 'en-US'
      }, 'Thank you for reaching out. Have a peaceful day ahead.')
      response.hangup()
    }

    return new NextResponse(response.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  } catch (error) {
    console.error('Error processing speech:', error)

    const response = new VoiceResponse()
    response.say('Sorry, there was an error processing your request. Please try again later.')
    response.hangup()

    return new NextResponse(response.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  }
}
