import nodemailer from 'nodemailer'

export interface NotificationData {
  caller: string
  callerNumber: string
  topic: string
  summary: string
  timestamp: string
}

export async function sendNotification(data: NotificationData): Promise<void> {
  console.log('Sending notification for important call:', data)

  await Promise.all([
    sendEmailNotification(data),
    sendWhatsAppNotification(data)
  ])
}

async function sendEmailNotification(data: NotificationData): Promise<void> {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log('Gmail credentials not configured, skipping email notification')
      return
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">🔔 Important Call Alert from Iqra</h2>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>Caller:</strong> ${data.caller}</p>
          <p><strong>Phone Number:</strong> ${data.callerNumber}</p>
          <p><strong>Topic:</strong> ${data.topic}</p>
          <p><strong>Time:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
        </div>

        <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <h3 style="margin-top: 0;">Summary:</h3>
          <p>${data.summary}</p>
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This notification was sent by Iqra AI Assistant
        </p>
      </div>
    `

    await transporter.sendMail({
      from: `"Iqra AI Assistant" <${process.env.GMAIL_USER}>`,
      to: process.env.NOTIFICATION_EMAIL || process.env.GMAIL_USER,
      subject: `🔔 Important Call from ${data.caller}`,
      html: emailContent,
    })

    console.log('Email notification sent successfully')
  } catch (error) {
    console.error('Error sending email notification:', error)
  }
}

async function sendWhatsAppNotification(data: NotificationData): Promise<void> {
  try {
    if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
      console.log('WhatsApp credentials not configured, skipping WhatsApp notification')
      return
    }

    const message = `🔔 *Important Call Alert*

*Caller:* ${data.caller}
*Phone:* ${data.callerNumber}
*Topic:* ${data.topic}
*Time:* ${new Date(data.timestamp).toLocaleString()}

*Summary:*
${data.summary}

_Sent by Iqra AI Assistant_`

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: process.env.OWNER_WHATSAPP,
          type: 'text',
          text: {
            body: message,
          },
        }),
      }
    )

    if (response.ok) {
      console.log('WhatsApp notification sent successfully')
    } else {
      console.error('WhatsApp API error:', await response.text())
    }
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error)
  }
}
