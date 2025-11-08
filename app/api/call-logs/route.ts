import { NextResponse } from 'next/server'
import { getCallLogs, getCallStats } from '@/lib/database'

export async function GET() {
  try {
    const logs = await getCallLogs()
    const stats = await getCallStats()

    return NextResponse.json({
      logs,
      stats,
      success: true
    })
  } catch (error) {
    console.error('Error fetching call logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch call logs', logs: [], stats: { totalCalls: 0, importantCalls: 0, averageDuration: 0 } },
      { status: 500 }
    )
  }
}
