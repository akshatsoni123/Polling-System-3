import { useState, useEffect } from 'react'
import './StudentWaitingRoom.css'

function StudentWaitingRoom({ onNavigateToStudentPoll }) {
  const [isWaiting, setIsWaiting] = useState(true)
  const [activeTab, setActiveTab] = useState('Chat')
  const [chatMessage, setChatMessage] = useState('')
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  // Simulate teacher starting a poll after some time (for demo purposes)
  useEffect(() => {
    // In a real app, this would listen for WebSocket events or poll an API
    const timer = setTimeout(() => {
      // For demo, automatically transition to poll participation after 3 seconds
      // In real implementation, this would be triggered by teacher starting a poll
      if (onNavigateToStudentPoll) {
        onNavigateToStudentPoll()
      }
    }, 3000) // 3 seconds for demo

    return () => clearTimeout(timer)
  }, [onNavigateToStudentPoll])

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

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message:', chatMessage)
      setChatMessage('')
    }
  }

  const toggleChatModal = () => {
    setIsChatModalOpen(!isChatModalOpen)
  }

  return (
    <div className="student-waiting-room">
      <div className="logo-container">
        <div className="logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">Intervue Poll</span>
        </div>
      </div>

      <div className="waiting-content">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>

        <h2 className="waiting-message">
          Wait for the teacher to ask questions..
        </h2>
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

export default StudentWaitingRoom