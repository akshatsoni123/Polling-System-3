import { useState, useEffect } from 'react';
import './ChatModal.css';
import chatService from '../services/chatService';
import { usePoll } from '../context/PollContext';

function ChatModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('Chat');
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);

  const { userType, studentName, removeStudent } = usePoll();

  // Listen for chat updates when modal is open
  useEffect(() => {
    if (isOpen) {
      const handleChatUpdate = (data) => {
        setMessages(data.messages);
        setParticipants(data.participants);
      };

      chatService.addListener(handleChatUpdate);

      // Initial data load
      setMessages(chatService.getMessages());
      setParticipants(chatService.getParticipants());

      // Force refresh participants when modal opens
      chatService.fetchParticipants();

      return () => {
        chatService.removeListener(handleChatUpdate);
      };
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      chatService.sendMessage(chatMessage);
      setChatMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleKickOut = (participantName) => {
    if (userType === 'teacher') {
      removeStudent(participantName);
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-tabs">
            <button
              className={`tab ${activeTab === 'Chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('Chat')}
            >
              Chat ({messages.length})
            </button>
            <button
              className={`tab ${activeTab === 'Participants' ? 'active' : ''}`}
              onClick={() => setActiveTab('Participants')}
            >
              Participants ({participants.length})
            </button>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'Chat' && (
            <div className="chat-content">
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="empty-chat">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="message-group">
                      <div className="message-header">
                        <span className="message-user">
                          {msg.senderName}
                          {msg.senderType === 'teacher' && (
                            <span className="teacher-badge">Teacher</span>
                          )}
                        </span>
                        <span className="message-time">
                          {formatMessageTime(msg.timestamp)}
                        </span>
                      </div>
                      <div className={`message ${
                        (userType === 'teacher' && msg.senderType === 'teacher') ||
                        (userType === 'student' && msg.senderName === studentName)
                          ? 'own-message'
                          : 'other-message'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  maxLength={200}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Participants' && (
            <div className="participants-content">
              <div className="participants-header">
                <div className="header-item">Name</div>
                {userType === 'teacher' && (
                  <div className="header-item">Action</div>
                )}
              </div>
              <div className="participants-list">
                {participants.length === 0 ? (
                  <div className="empty-participants">
                    <p>No participants yet.</p>
                  </div>
                ) : (
                  participants.map((participant, index) => (
                    <div key={index} className="participant-row">
                      <div className="participant-name-cell">
                        <span className="participant-name">{participant.name}</span>
                        <span className="participant-status">{participant.status}</span>
                      </div>
                      {userType === 'teacher' && (
                        <div className="participant-action-cell">
                          <button
                            className="kick-out-btn"
                            onClick={() => handleKickOut(participant.name)}
                          >
                            Kick out
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatModal;