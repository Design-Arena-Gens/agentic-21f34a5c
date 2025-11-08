import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Iqra - AI Call Assistant',
  description: 'Intelligent AI assistant for handling calls with emotional intelligence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
