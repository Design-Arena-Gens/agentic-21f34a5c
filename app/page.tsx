'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface CallLog {
  id: string
  caller: string
  callerNumber: string
  topic: string
  duration: number
  timestamp: string
  isImportant: boolean
  status: string
}

export default function Home() {
  const [callLogs, setCallLogs] = useState<CallLog[]>([])
  const [stats, setStats] = useState({
    totalCalls: 0,
    importantCalls: 0,
    averageDuration: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCallLogs()
    const interval = setInterval(fetchCallLogs, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchCallLogs = async () => {
    try {
      const response = await fetch('/api/call-logs')
      const data = await response.json()
      setCallLogs(data.logs || [])
      setStats(data.stats || { totalCalls: 0, importantCalls: 0, averageDuration: 0 })
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch call logs:', error)
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '48px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            Iqra AI Assistant
          </h1>
          <p style={{ color: '#666', fontSize: '18px' }}>
            Virtual Call Handler for Syed Eman Ali Shah
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '30px',
            borderRadius: '15px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
              {stats.totalCalls}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Calls</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '30px',
            borderRadius: '15px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
              {stats.importantCalls}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Important Calls</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            padding: '30px',
            borderRadius: '15px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
              {formatDuration(stats.averageDuration)}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Avg Duration</div>
          </div>
        </div>

        <h2 style={{ marginBottom: '20px', color: '#333' }}>Recent Call Logs</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading...
          </div>
        ) : callLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No calls recorded yet. Iqra is ready to handle incoming calls.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {callLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  background: log.isImportant ? '#fff3cd' : '#f8f9fa',
                  padding: '20px',
                  borderRadius: '10px',
                  border: log.isImportant ? '2px solid #ffc107' : '1px solid #dee2e6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}
              >
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '5px', color: '#333' }}>
                    {log.caller}
                    {log.isImportant && (
                      <span style={{
                        marginLeft: '10px',
                        fontSize: '12px',
                        background: '#dc3545',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '5px'
                      }}>
                        IMPORTANT
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#666', fontSize: '14px' }}>{log.callerNumber}</div>
                </div>

                <div style={{ flex: 2, minWidth: '200px' }}>
                  <div style={{ color: '#555', fontSize: '14px' }}>{log.topic}</div>
                </div>

                <div style={{ textAlign: 'right', minWidth: '150px' }}>
                  <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                    {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}
                  </div>
                  <div style={{ color: '#999', fontSize: '12px' }}>
                    Duration: {formatDuration(log.duration)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: '#e7f3ff',
          borderRadius: '10px',
          borderLeft: '4px solid #667eea'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#333' }}>System Status</h3>
          <p style={{ color: '#666', margin: 0 }}>
            ✓ Iqra is online and ready to handle calls<br/>
            ✓ AI engine active<br/>
            ✓ Notification system configured<br/>
            ✓ Voice synthesis ready
          </p>
        </div>
      </div>
    </div>
  )
}
