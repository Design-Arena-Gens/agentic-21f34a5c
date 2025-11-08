import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const VoiceResponse = twilio.twiml.VoiceResponse

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const from = formData.get('From')
    const callSid = formData.get('CallSid')

    console.log('Incoming call from:', from, 'CallSid:', callSid)

    const response = new VoiceResponse()

    response.say({
      voice: 'Polly.Joanna',
      language: 'en-US'
    }, 'Assalamualaikum, this is Iqra, Syed Eman Ali Shah\'s virtual assistant. How may I help you today?')

    response.gather({
      input: ['speech'],
      action: '/api/twilio/process-speech',
      method: 'POST',
      timeout: 5,
      speechTimeout: 'auto',
      language: 'en-US',
    })

    response.say('I did not receive any input. Goodbye.')
    response.hangup()

    return new NextResponse(response.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  } catch (error) {
    console.error('Error handling Twilio webhook:', error)

    const response = new VoiceResponse()
    response.say('Sorry, there was an error. Please try again later.')
    response.hangup()

    return new NextResponse(response.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  }
}
