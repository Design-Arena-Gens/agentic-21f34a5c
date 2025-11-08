# Iqra AI Assistant

An intelligent, emotionally engaging AI call-handling assistant with a warm, professional voice. Iqra automatically answers calls, understands context, handles conversations naturally, and notifies the owner about important calls.

## Features

- 🎯 **Intelligent Call Handling**: Automatically answers and manages incoming calls
- 🧠 **AI-Powered Analysis**: Uses GPT-4 to understand call importance, sentiment, and context
- 🔔 **Smart Notifications**: Sends WhatsApp and email alerts for important calls
- 📊 **Call Logging**: Maintains detailed logs with caller info, topics, and duration
- 🌐 **Bilingual Support**: Understands both Urdu and English context
- 💬 **Natural Conversations**: Responds with emotional intelligence and cultural awareness
- 📈 **Dashboard**: Beautiful web interface to view call logs and statistics

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **AI Engine**: OpenAI GPT-4 Turbo
- **Voice**: Twilio Voice API with Amazon Polly
- **Notifications**:
  - WhatsApp Business API
  - Gmail/Nodemailer
- **Database**: JSON file-based storage (upgradeable to PostgreSQL/MongoDB)

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `TWILIO_ACCOUNT_SID` - Your Twilio Account SID
- `TWILIO_AUTH_TOKEN` - Your Twilio Auth Token
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number
- `OPENAI_API_KEY` - Your OpenAI API key
- `GMAIL_USER` - Your Gmail address
- `GMAIL_APP_PASSWORD` - Gmail app-specific password
- `NOTIFICATION_EMAIL` - Email to receive notifications
- `OWNER_WHATSAPP` - WhatsApp number for notifications (format: +923001234567)
- `WHATSAPP_ACCESS_TOKEN` - WhatsApp Business API token
- `WHATSAPP_PHONE_NUMBER_ID` - WhatsApp Business phone number ID

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Configure Twilio Webhook

1. Go to your Twilio Console
2. Navigate to Phone Numbers → Active Numbers
3. Select your phone number
4. Under "Voice Configuration", set:
   - **A CALL COMES IN**: Webhook
   - **URL**: `https://your-domain.vercel.app/api/twilio`
   - **HTTP**: POST

### 5. Deploy to Vercel

```bash
vercel deploy --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## How It Works

1. **Incoming Call**: Twilio receives the call and sends a webhook to `/api/twilio`
2. **Greeting**: Iqra greets the caller: "Assalamualaikum, this is Iqra, Syed Eman Ali Shah's virtual assistant..."
3. **Speech Recognition**: Twilio captures the caller's speech
4. **AI Analysis**: GPT-4 analyzes the conversation to determine:
   - Is it important/urgent?
   - What's the topic?
   - What's the sentiment?
   - Should conversation continue?
5. **Smart Response**: Iqra generates and delivers an appropriate response
6. **Notification**: If important, sends WhatsApp + Email notification to owner
7. **Call Logging**: Saves all call details to the database
8. **Dashboard Update**: Real-time stats visible on the web dashboard

## Call Classification

**Important Calls** (triggers notification):
- Business matters
- Urgent requests
- Family emergencies
- Important appointments
- Professional inquiries

**Non-Important Calls** (polite dismissal):
- Spam/marketing
- Wrong numbers
- Casual non-urgent chat
- Robocalls

## Customization

### Change Greeting Message

Edit `/app/api/twilio/route.ts`:

```typescript
response.say({
  voice: 'Polly.Joanna',
  language: 'en-US'
}, 'Your custom greeting here')
```

### Adjust AI Personality

Edit `/lib/ai.ts` in the `generateResponse` function to modify Iqra's personality traits.

### Add More Voices

Twilio supports multiple voices. See [Twilio Voice documentation](https://www.twilio.com/docs/voice/twiml/say/text-speech#available-voices-and-languages).

## Database

Currently uses JSON file storage in `/data/call-logs.json`. For production with high volume:

1. Migrate to PostgreSQL with Prisma
2. Use Supabase for serverless database
3. Or MongoDB for NoSQL approach

## Cost Considerations

- **Twilio**: ~$0.013/min for calls
- **OpenAI GPT-4 Turbo**: ~$0.01/1K tokens
- **WhatsApp Business API**: Check Meta pricing
- **Vercel**: Free tier sufficient for low-medium traffic

## Support

For issues or questions, check:
- Twilio Console for call logs
- Vercel logs for application errors
- OpenAI dashboard for API usage

## License

Private project for Syed Eman Ali Shah

---

Built with ❤️ by Claude
