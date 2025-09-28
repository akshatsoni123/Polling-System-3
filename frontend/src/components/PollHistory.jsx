import { useState, useEffect } from 'react'
import './PollHistory.css'
import { usePoll } from '../context/PollContext'
import ChatModal from './ChatModal'

function PollHistory() {
  const [pollHistory, setPollHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  // Fetch poll history from backend
  useEffect(() => {
    const fetchPollHistory = async () => {
      try {
        console.log('Fetching poll history...')
        const response = await fetch('http://localhost:3001/api/poll/history')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Raw poll history data:', data)

        // Validate data structure
        if (!data || !Array.isArray(data.history)) {
          console.error('Invalid data structure:', data)
          setPollHistory([])
          setIsLoading(false)
          return
        }

        // Convert backend data to display format with safety checks
        const formattedHistory = data.history.map((poll, index) => {
          // Safety check for poll structure
          if (!poll || !poll.options || !Array.isArray(poll.options)) {
            console.warn('Invalid poll structure:', poll)
            return null
          }

          return {
            id: poll.id || `poll-${index}`,
            question: poll.question || 'Untitled Question',
            options: poll.options.map((option, optionIndex) => ({
              id: optionIndex + 1,
              text: option || 'Option',
              votes: poll.results?.options?.[option] || 0,
              percentage: poll.results?.totalResponses > 0
                ? ((poll.results?.options?.[option] || 0) / poll.results.totalResponses * 100).toFixed(1)
                : 0
            })),
            totalVotes: poll.results?.totalResponses || 0,
            timestamp: poll.completedAt ? new Date(poll.completedAt).toLocaleString() : 'Unknown time'
          }
        }).filter(poll => poll !== null) // Remove any null entries

        console.log('Formatted poll history:', formattedHistory)
        setPollHistory(formattedHistory)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching poll history:', error)
        setError(error.message)
        setPollHistory([])
        setIsLoading(false)
      }
    }

    fetchPollHistory()
  }, [])

  return (
    <div className="poll-history">
      <div className="history-container">
        <h1 className="main-title">
          View <span className="highlight">Poll History</span>
        </h1>

        <div className="history-content">
          {isLoading ? (
            <div className="loading-state">
              <p>Loading poll history...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>Error loading poll history</p>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : pollHistory.length === 0 ? (
            <div className="empty-state">
              <p>No poll history available yet.</p>
              <p>Complete some polls to see them here!</p>
            </div>
          ) : (
            pollHistory.map((poll, index) => (
              <div key={poll.id} className="poll-result-card">
                <h2 className="question-title">Question {index + 1}</h2>

                <div className="question-text">
                  {poll.question}
                </div>

                <div className="results-container">
                  {poll.options && Array.isArray(poll.options) ? poll.options.map((option) => (
                    <div key={option.id || Math.random()} className="result-option">
                      <div className="option-content">
                        <div className="option-info">
                          <div className="option-number">{option.id || '?'}</div>
                          <div className="option-text">{option.text || 'Option'}</div>
                        </div>
                        <div className="option-stats">
                          {option.votes || 0} votes ({option.percentage || 0}%)
                        </div>
                      </div>
                      <div className="result-bar">
                        <div
                          className="result-progress"
                          style={{ width: `${option.percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  )) : (
                    <div>No options available</div>
                  )}
                </div>

                <div className="poll-meta">
                  <span className="total-votes">Total votes: {poll.totalVotes}</span>
                  <span className="poll-timestamp">{poll.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Icon */}
      <div className="chat-icon" onClick={() => setIsChatModalOpen(true)}>
        💬
      </div>

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  )
}

export default PollHistory