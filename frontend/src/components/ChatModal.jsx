import { useState, useEffect } from 'react';
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
      console.log('ChatModal opened, initializing...');

      const handleChatUpdate = (data) => {
        console.log('Chat update received:', data);
        setMessages(data.messages);
        setParticipants(data.participants);
      };

      chatService.addListener(handleChatUpdate);

      // Initial data load
      const initialMessages = chatService.getMessages();
      const initialParticipants = chatService.getParticipants();
      console.log('Initial data:', { messages: initialMessages, participants: initialParticipants });

      setMessages(initialMessages);
      setParticipants(initialParticipants);

      // Force refresh participants when modal opens
      chatService.fetchParticipants();
      chatService.fetchChatHistory();

      return () => {
        chatService.removeListener(handleChatUpdate);
      };
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message:', chatMessage);
      console.log('User type:', userType);
      console.log('Student name:', studentName);
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

        <div className="modal-content">
          {activeTab === 'Chat' && (
            <div className="chat-view">
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`message-container ${
                    (userType === 'teacher' && msg.senderType === 'teacher') ||
                    (userType === 'student' && msg.senderName === studentName)
                      ? 'user-2'
                      : 'user-1'
                  }`}>
                    <div className="message-user">
                      {msg.senderName}
                      {msg.senderType === 'teacher' && ' (Teacher)'}
                    </div>
                    <div className="message-text">
                      {msg.message}
                    </div>
                  </div>
                ))
              )}

              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '20px',
                padding: '10px',
                borderTop: '1px solid #e0e0e0'
              }}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  maxLength={200}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim()}
                  style={{
                    background: chatMessage.trim() ? '#6366f1' : '#d1d5db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    cursor: chatMessage.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Participants' && (
            <div style={{ padding: '20px' }}>
              {userType === 'teacher' && (
                <h3 className="participant-header" style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '10px', marginBottom: '15px' }}>
                  Participants ({participants.length})
                </h3>
              )}
              {participants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  <p>No participants yet.</p>
                </div>
              ) : (
                participants.map((participant, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: index < participants.length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}>
                    <div>
                      <p className="participant-name" style={{ margin: 0, fontWeight: '600' }}>
                        {participant.name}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#10b981' }}>
                        {participant.status}
                      </p>
                    </div>
                    {userType === 'teacher' && (
                      <button
                        onClick={() => handleKickOut(participant.name)}
                        style={{
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Kick out
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatModal;