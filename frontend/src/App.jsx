import { useState, useEffect } from 'react'
import './App.css'
import { getHealth, getDbStatus } from './services/api'

function App() {
  const [backendStatus, setBackendStatus] = useState('checking...')
  const [dbStatus, setDbStatus] = useState('checking...')
  const [userCount, setUserCount] = useState(null)

  useEffect(() => {
    // Check backend health
    getHealth()
      .then(data => {
        setBackendStatus(data.status)
      })
      .catch(error => {
        console.error('Backend health check failed:', error)
        setBackendStatus('offline')
      })

    // Check database connection
    getDbStatus()
      .then(data => {
        setDbStatus(data.status)
        if (data.data && data.data.userCount !== undefined) {
          setUserCount(data.data.userCount)
        }
      })
      .catch(error => {
        console.error('Database check failed:', error)
        setDbStatus('offline')
      })
  }, [])

  const getStatusColor = (status) => {
    if (status === 'ok') return '#10b981' // green
    if (status === 'offline') return '#ef4444' // red
    return '#f59e0b' // yellow/orange for checking
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>DMAT – Digital Marketing Automation Tool</h1>
      </header>
      <main className="app-main">
        <h2>Hello DMAT – Phase 0</h2>
        <p>Frontend is successfully running!</p>

        <div className="status-container">
          <div className="status-item">
            <span className="status-label">Backend Status:</span>
            <span
              className="status-value"
              style={{ color: getStatusColor(backendStatus) }}
            >
              {backendStatus}
            </span>
          </div>

          <div className="status-item">
            <span className="status-label">Database Status:</span>
            <span
              className="status-value"
              style={{ color: getStatusColor(dbStatus) }}
            >
              {dbStatus}
            </span>
          </div>

          {userCount !== null && (
            <div className="status-item">
              <span className="status-label">Users in Database:</span>
              <span className="status-value" style={{ color: '#667eea' }}>
                {userCount}
              </span>
            </div>
          )}
        </div>

        {backendStatus === 'ok' && dbStatus === 'ok' && (
          <div className="success-message">
            ✅ All systems connected successfully!
          </div>
        )}
      </main>
    </div>
  )
}

export default App
