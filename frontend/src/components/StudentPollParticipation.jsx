import { useState, useEffect } from 'react'
import './StudentPollParticipation.css'
import { usePoll } from '../context/PollContext'
import ChatModal from './ChatModal'

function StudentPollParticipation({ onNavigateToResults }) {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  const { currentPoll, timeLeft, submitAnswer, hasAnswered } = usePoll()


  // Handle answer submission success
  useEffect(() => {
    if (hasAnswered && !isSubmitted) {
      setIsSubmitted(true)
      setTimeout(() => {
        if (onNavigateToResults) {
          onNavigateToResults()
        }
      }, 1000)
    }
  }, [hasAnswered, isSubmitted, onNavigateToResults])

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted && selectedAnswer) {
      handleSubmit()
    }
  }, [timeLeft, isSubmitted, selectedAnswer])

  const handleAnswerSelect = (option) => {
    if (!isSubmitted && !hasAnswered) {
      setSelectedAnswer(option)
    }
  }

  const handleSubmit = () => {
    if (!isSubmitted && !hasAnswered && selectedAnswer) {
      console.log('Submitting answer:', selectedAnswer)
      submitAnswer(selectedAnswer)
    }
  }


  const toggleChatModal = () => {
    setIsChatModalOpen(!isChatModalOpen)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="student-poll-participation">
      <div className="poll-container">
        <div className="poll-header">
          <h2 className="question-number">Question 1</h2>
          <div className="timer">
            <span className="timer-icon">⏱</span>
            <span className="timer-text">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="question-section">
          <div className="question-text">
            {currentPoll?.question || 'Loading question...'}
          </div>

          <div className="answer-options-container">
            <div className="answer-options">
              {currentPoll?.options?.map((option, index) => (
                <div
                  key={index}
                  className={`answer-option ${selectedAnswer === option ? 'selected' : ''} ${isSubmitted || hasAnswered ? 'disabled' : ''}`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <div className="option-number">{index + 1}</div>
                  <div className="option-text">{option}</div>
                </div>
              )) || (
                <div>Loading options...</div>
              )}
            </div>
          </div>

          <button
            className={`submit-btn ${isSubmitted || hasAnswered ? 'submitted' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitted || hasAnswered || !selectedAnswer}
          >
            {isSubmitted || hasAnswered ? 'Submitted! Redirecting...' : 'Submit'}
          </button>
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

export default StudentPollParticipation