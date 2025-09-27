import { useState, useEffect } from 'react'
import './StudentPostSubmissionWaiting.css'

function StudentPostSubmissionWaiting({ onNavigateToNextQuestion }) {
  const [activeTab, setActiveTab] = useState('Participants')
  const [timeLeft, setTimeLeft] = useState(15)
  const [chatMessage, setChatMessage] = useState('')
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  // Live poll results (updating as other students vote)
  const [pollResults, setPollResults] = useState({
    question: "Which planet is known as the Red Planet?",
    options: [
      { id: 1, text: "Mars", votes: 12, percentage: 60 },
      { id: 2, text: "Venus", votes: 2, percentage: 10 },
      { id: 3, text: "Jupiter", votes: 3, percentage: 15 },
      { id: 4, text: "Saturn", votes: 3, percentage: 15 }
    ],
    totalVotes: 20
  })

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

  // Simulate live results updating
  useEffect(() => {
    const interval = setInterval(() => {
      setPollResults(prev => ({
        ...prev,
        options: prev.options.map(option => ({
          ...option,
          votes: option.votes + Math.floor(Math.random() * 2), // Random vote increases
          percentage: Math.floor(Math.random() * 30) + (option.id === 1 ? 50 : 5) // Mars stays highest
        }))
      }))
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

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
          {pollResults.question}
        </div>

        <div className="live-results">
          {pollResults.options.map((option) => (
            <div key={option.id} className="result-option">
              <div className="option-content">
                <div className="option-info">
                  <div className="option-number">{option.id}</div>
                  <div className="option-text">{option.text}</div>
                </div>
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

export default StudentPostSubmissionWaiting