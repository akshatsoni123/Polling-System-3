import { useState } from 'react'
import './PollResults.css'
import { usePoll } from '../context/PollContext'
import ChatModal from './ChatModal'

function PollResults({ onNavigateToPollHistory, onNavigateToNewQuestion }) {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const { currentPoll, pollResults, totalStudents } = usePoll()

  // Calculate display data
  const getDisplayResults = () => {
    if (!currentPoll || !pollResults) return []

    return currentPoll.options.map((option, index) => ({
      id: index + 1,
      text: option,
      votes: pollResults.options[option] || 0,
      percentage: pollResults.totalResponses > 0 ? ((pollResults.options[option] || 0) / pollResults.totalResponses * 100).toFixed(1) : 0
    }))
  }

  const handleViewPollHistory = () => {
    if (onNavigateToPollHistory) {
      onNavigateToPollHistory()
    }
  }

  const handleAskNewQuestion = () => {
    if (onNavigateToNewQuestion) {
      onNavigateToNewQuestion()
    }
  }

  return (
    <div className="poll-results">
      <div className="results-container">
        {/* Header with View Poll History button */}
        <div className="results-header">
          <button className="view-history-btn" onClick={handleViewPollHistory}>
            👁 View Poll history
          </button>
        </div>

        {/* Main Results Content */}
        <div className="results-content">
          <h2 className="results-title">Question</h2>

          <div className="question-text">
            {currentPoll?.question || 'No poll data available'}
          </div>

          <div className="poll-summary">
            <p>Total responses: {pollResults?.totalResponses || 0} / {totalStudents}</p>
          </div>

          <div className="results-list">
            {getDisplayResults().map((option) => (
              <div key={option.id} className="result-item">
                <div className="result-info">
                  <div className="result-option">
                    <div className="option-number">{option.id}</div>
                    <div className="option-text">{option.text}</div>
                  </div>
                  <div className="result-votes">
                    {option.votes} votes ({option.percentage}%)
                  </div>
                </div>
                <div className="result-bar">
                  <div
                    className="result-progress"
                    style={{ width: `${option.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <button className="ask-new-question-btn" onClick={handleAskNewQuestion}>
            + Ask a new question
          </button>
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

export default PollResults