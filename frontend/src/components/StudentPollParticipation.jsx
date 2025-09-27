import { useState, useEffect } from 'react'
import './StudentPollParticipation.css'

function StudentPollParticipation({ onNavigateToResults }) {
  const [selectedAnswer, setSelectedAnswer] = useState(1) // Default to Mars selected
  const [timeLeft, setTimeLeft] = useState(15) // 15 seconds remaining
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState('Chat')
  const [chatMessage, setChatMessage] = useState('')
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  // Current poll data
  const currentPoll = {
    id: 1,
    question: "Which planet is known as the Red Planet?",
    options: [
      { id: 1, text: "Mars" },
      { id: 2, text: "Venus" },
      { id: 3, text: "Jupiter" },
      { id: 4, text: "Saturn" }
    ],
    duration: 60 // Total duration in seconds
  }

  // Sample chat messages
  const [chatMessages] = useState([
    { id: 1, user: "User 1", message: "Hey There , how can I help?", isOwn: false },
    { id: 2, user: "User 2", message: "Nothing bro..just chill!", isOwn: true }
  ])

  // Sample participants
  const participants = [
    { id: 1, name: "Rahul Arora", status: "online" },
    { id: 2, name: "Pushpender Rautela", status: "online" },
    { id: 3, name: "Rijul Zalpuri", status: "online" },
    { id: 4, name: "Nadeem N", status: "online" },
    { id: 5, name: "Ashwin Sharma", status: "online" }
  ]

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isSubmitted) {
      // Auto-submit when time runs out
      handleSubmit()
    }
  }, [timeLeft, isSubmitted, onNavigateToResults])

  const handleAnswerSelect = (optionId) => {
    if (!isSubmitted) {
      setSelectedAnswer(optionId)
    }
  }

  const handleSubmit = () => {
    if (!isSubmitted) {
      setIsSubmitted(true)
      console.log('Submitted answer:', selectedAnswer)

      // Navigate to post-submission waiting immediately
      setTimeout(() => {
        if (onNavigateToResults) {
          onNavigateToResults()
        }
      }, 1000) // Reduced delay to 1 second
    }
  }

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message:', chatMessage)
      setChatMessage('')
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
            {currentPoll.question}
          </div>

          <div className="answer-options-container">
            <div className="answer-options">
              {currentPoll.options.map((option) => (
                <div
                  key={option.id}
                  className={`answer-option ${selectedAnswer === option.id ? 'selected' : ''} ${isSubmitted ? 'disabled' : ''}`}
                  onClick={() => handleAnswerSelect(option.id)}
                >
                  <div className="option-number">{option.id}</div>
                  <div className="option-text">{option.text}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            className={`submit-btn ${isSubmitted ? 'submitted' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitted}
          >
            {isSubmitted ? 'Submitted! Redirecting...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Chat Icon */}
      <div className="chat-icon" onClick={toggleChatModal}>
        💬
      </div>

      {/* Chat Modal */}
      {isChatModalOpen && (
        <div className="chat-modal-overlay" onClick={toggleChatModal}>
          <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-tabs">
                <button
                  className={`tab ${activeTab === 'Chat' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Chat')}
                >
                  Chat
                </button>
                <button
                  className={`tab ${activeTab === 'Participants' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Participants')}
                >
                  Participants
                </button>
              </div>
              <button className="close-btn" onClick={toggleChatModal}>
                ×
              </button>
            </div>

            <div className="modal-content">
              {activeTab === 'Chat' && (
                <div className="chat-content">
                  <div className="chat-messages">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="message-group">
                        <div className="message-user">{msg.user}</div>
                        <div className={`message ${msg.isOwn ? 'own-message' : 'other-message'}`}>
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="chat-input">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage}>Send</button>
                  </div>
                </div>
              )}

              {activeTab === 'Participants' && (
                <div className="participants-content">
                  <div className="participants-header">Name</div>
                  <div className="participants-list">
                    {participants.map((participant) => (
                      <div key={participant.id} className="participant-name-item">
                        {participant.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentPollParticipation