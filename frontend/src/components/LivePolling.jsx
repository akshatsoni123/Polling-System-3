import { useState } from 'react'
import './LivePolling.css'

function LivePolling({ onNavigateToPollHistory }) {
  const [activeTab, setActiveTab] = useState('Chat')
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [chatMessage, setChatMessage] = useState('')
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  // Sample poll data
  const currentPoll = {
    question: "Which planet is known as the Red Planet?",
    options: [
      { id: 1, text: "Mars", votes: 15 },
      { id: 2, text: "Venus", votes: 3 },
      { id: 3, text: "Jupiter", votes: 1 },
      { id: 4, text: "Saturn", votes: 2 }
    ]
  }

  // Sample chat messages
  const [chatMessages] = useState([
    { id: 1, user: "User 1", message: "Hey There , how can I help?", isOwn: false },
    { id: 2, user: "User 2", message: "Nothing bro..just chill!", isOwn: true }
  ])

  // Sample participants
  const [participants, setParticipants] = useState([
    { id: 1, name: "Rahul Arora", status: "online" },
    { id: 2, name: "Pushpender Rautela", status: "online" },
    { id: 3, name: "Rijul Zalpuri", status: "online" },
    { id: 4, name: "Nadeem N", status: "online" },
    { id: 5, name: "Ashwin Sharma", status: "online" }
  ])

  const handleAnswerSelect = (optionId) => {
    setSelectedAnswer(optionId)
  }

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Add message to chat (in real app, this would send to server)
      console.log('Sending message:', chatMessage)
      setChatMessage('')
    }
  }

  const handleAskNewQuestion = () => {
    console.log('Asking new question...')
    // Navigate back to poll creation or show new question form
  }

  const handleKickOut = (participantId) => {
    console.log('Kicking out participant:', participantId)
    setParticipants(participants.filter(p => p.id !== participantId))
  }

  const toggleChatModal = () => {
    setIsChatModalOpen(!isChatModalOpen)
  }

  return (
    <div className="live-polling">
      <div className="polling-container">
        {/* Left Panel - Question */}
        <div className="question-panel">
          <div className="question-header">
            <h2>Question</h2>
          </div>

          <div className="question-content">
            <div className="question-text">
              {currentPoll.question}
            </div>

            <div className="answer-options">
              {currentPoll.options.map((option) => (
                <div
                  key={option.id}
                  className={`answer-option ${selectedAnswer === option.id ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(option.id)}
                >
                  <div className="option-number">{option.id}</div>
                  <div className="option-text">{option.text}</div>
                  <div className="vote-bar">
                    <div
                      className="vote-progress"
                      style={{ width: `${(option.votes / 21) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="action-buttons">
              <button className="ask-new-question-btn" onClick={handleAskNewQuestion}>
                + Ask a new question
              </button>

              <button
                className="view-history-btn"
                onClick={() => onNavigateToPollHistory && onNavigateToPollHistory()}
              >
                View Poll History
              </button>
            </div>
          </div>
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
                  <div className="participants-header">
                    <div className="header-item">Name</div>
                    <div className="header-item">Action</div>
                  </div>
                  <div className="participants-list">
                    {participants.map((participant) => (
                      <div key={participant.id} className="participant-row">
                        <div className="participant-name-cell">
                          {participant.name}
                        </div>
                        <div className="participant-action-cell">
                          <button
                            className="kick-out-btn"
                            onClick={() => handleKickOut(participant.id)}
                          >
                            Kick out
                          </button>
                        </div>
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

export default LivePolling