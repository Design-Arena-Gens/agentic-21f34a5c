import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const CALL_LOGS_FILE = path.join(DATA_DIR, 'call-logs.json')

export interface CallLog {
  id?: string
  callSid: string
  caller: string
  callerNumber: string
  topic: string
  isImportant: boolean
  sentiment: string
  transcript: string
  duration: number
  timestamp?: string
  status?: string
}

export interface CallStats {
  totalCalls: number
  importantCalls: number
  averageDuration: number
}

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
}

async function readCallLogs(): Promise<CallLog[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(CALL_LOGS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function writeCallLogs(logs: CallLog[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(CALL_LOGS_FILE, JSON.stringify(logs, null, 2))
}

export async function saveCallLog(log: CallLog): Promise<void> {
  const logs = await readCallLogs()

  const newLog = {
    ...log,
    id: `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    status: 'completed'
  }

  logs.unshift(newLog)

  // Keep only last 100 logs
  if (logs.length > 100) {
    logs.splice(100)
  }

  await writeCallLogs(logs)
}

export async function getCallLogs(): Promise<CallLog[]> {
  const logs = await readCallLogs()
  return logs.slice(0, 50) // Return last 50 logs
}

export async function getCallStats(): Promise<CallStats> {
  const logs = await readCallLogs()

  const totalCalls = logs.length
  const importantCalls = logs.filter(log => log.isImportant).length
  const totalDuration = logs.reduce((sum, log) => sum + (log.duration || 0), 0)
  const averageDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0

  return {
    totalCalls,
    importantCalls,
    averageDuration
  }
}

export async function updateCallDuration(callSid: string, duration: number): Promise<void> {
  const logs = await readCallLogs()
  const logIndex = logs.findIndex(log => log.callSid === callSid)

  if (logIndex !== -1) {
    logs[logIndex].duration = duration
    await writeCallLogs(logs)
  }
}
