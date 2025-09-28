import { useState, useEffect } from 'react'
import './StudentPostSubmissionWaiting.css'
import { usePoll } from '../context/PollContext'
import ChatModal from './ChatModal'

function StudentPostSubmissionWaiting({ onNavigateToNextQuestion }) {
  const [timeLeft, setTimeLeft] = useState(15)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  const { currentPoll, pollResults, totalStudents } = usePoll()

  // Get real poll results for display
  const getDisplayResults = () => {
    if (!currentPoll || !pollResults) return []

    return currentPoll.options.map((option, index) => ({
      id: index + 1,
      text: option,
      votes: pollResults.options[option] || 0,
      percentage: pollResults.totalResponses > 0 ? ((pollResults.options[option] || 0) / pollResults.totalResponses * 100).toFixed(1) : 0
    }))
  }


  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      // When timer ends, wait for teacher's next question
      // In real app, this would listen for WebSocket events
    }
  }, [timeLeft])

  // Navigate to next question when new poll is created
  useEffect(() => {
    if (currentPoll && currentPoll.isActive && onNavigateToNextQuestion) {
      onNavigateToNextQuestion()
    }
  }, [currentPoll, onNavigateToNextQuestion])

  const toggleChatModal = () => {
    console.log('Chat icon clicked, toggling modal:', !isChatModalOpen)
    setIsChatModalOpen(!isChatModalOpen)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="student-post-submission-waiting">
      <div className="main-container">
        <div className="results-header">
          <h2 className="question-number">Question 1</h2>
          <div className="timer">
            <span className="timer-icon">⏱</span>
            <span className="timer-text">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="question-text">
          {currentPoll?.question || 'Loading question...'}
        </div>

        <div className="live-results">
          {getDisplayResults().map((option) => (
            <div key={option.id} className="result-option">
              <div className="option-content">
                <div className="option-info">
                  <div className="option-number">{option.id}</div>
                  <div className="option-text">{option.text}</div>
                </div>
              </div>
              <div className="vote-count">
                {option.votes} votes ({option.percentage}%)
              </div>
              <div className="vote-bar">
                <div
                  className="vote-progress"
                  style={{ width: `${Math.min(option.percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="waiting-message">
          Wait for the teacher to ask a new question.
        </div>
      </div>

      {/* Chat Icon */}
      <div className="chat-icon" onClick={toggleChatModal}>
        💬
      </div>

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  )
}

export default StudentPostSubmissionWaiting