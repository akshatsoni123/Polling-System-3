import { useState } from 'react'
import './PollHistory.css'

function PollHistory() {
  // Sample historical poll data
  const [pollHistory] = useState([
    {
      id: 1,
      question: "Which planet is known as the Red Planet?",
      options: [
        { id: 1, text: "Mars", votes: 15, percentage: 75 },
        { id: 2, text: "Venus", votes: 1, percentage: 5 },
        { id: 3, text: "Jupiter", votes: 1, percentage: 5 },
        { id: 4, text: "Saturn", votes: 3, percentage: 15 }
      ],
      totalVotes: 20,
      timestamp: "2024-09-28 10:30 AM"
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: [
        { id: 1, text: "Mars", votes: 15, percentage: 75 },
        { id: 2, text: "Venus", votes: 1, percentage: 5 },
        { id: 3, text: "Jupiter", votes: 1, percentage: 5 },
        { id: 4, text: "Saturn", votes: 3, percentage: 15 }
      ],
      totalVotes: 20,
      timestamp: "2024-09-28 11:15 AM"
    }
  ])

  return (
    <div className="poll-history">
      <div className="history-container">
        <h1 className="main-title">
          View <span className="highlight">Poll History</span>
        </h1>

        <div className="history-content">
          {pollHistory.map((poll, index) => (
            <div key={poll.id} className="poll-result-card">
              <h2 className="question-title">Question {index + 1}</h2>

              <div className="question-text">
                {poll.question}
              </div>

              <div className="results-container">
                {poll.options.map((option) => (
                  <div key={option.id} className="result-option">
                    <div className="option-content">
                      <div className="option-info">
                        <div className="option-number">{option.id}</div>
                        <div className="option-text">{option.text}</div>
                      </div>
                      <div className="option-percentage">
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

              <div className="poll-meta">
                <span className="total-votes">Total votes: {poll.totalVotes}</span>
                <span className="poll-timestamp">{poll.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Icon */}
      <div className="chat-icon">
        💬
      </div>
    </div>
  )
}

export default PollHistory