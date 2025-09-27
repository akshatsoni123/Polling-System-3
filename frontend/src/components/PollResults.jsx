import { useState } from 'react'
import './PollResults.css'

function PollResults({ onNavigateToPollHistory, onNavigateToNewQuestion }) {
  // Poll results data
  const pollResults = {
    question: "Which planet is known as the Red Planet?",
    options: [
      { id: 1, text: "Mars", votes: 15, percentage: 75 },
      { id: 2, text: "Venus", votes: 1, percentage: 5 },
      { id: 3, text: "Jupiter", votes: 1, percentage: 5 },
      { id: 4, text: "Saturn", votes: 3, percentage: 15 }
    ],
    totalVotes: 20
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
            {pollResults.question}
          </div>

          <div className="results-list">
            {pollResults.options.map((option) => (
              <div key={option.id} className="result-item">
                <div className="result-info">
                  <div className="result-option">
                    <div className="option-number">{option.id}</div>
                    <div className="option-text">{option.text}</div>
                  </div>
                  <div className="result-percentage">
                    {option.percentage}%
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
      <div className="chat-icon">
        💬
      </div>
    </div>
  )
}

export default PollResults