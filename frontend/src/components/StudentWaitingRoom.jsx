import { useState, useEffect } from 'react'
import './StudentWaitingRoom.css'
import { usePoll } from '../context/PollContext'
import ChatModal from './ChatModal'

function StudentWaitingRoom({ onNavigateToStudentPoll }) {
  const [isWaiting, setIsWaiting] = useState(true)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  const { currentPoll, totalStudents, studentName } = usePoll()

  // Listen for when a poll is created and navigate to participation
  useEffect(() => {
    if (currentPoll && currentPoll.isActive) {
      setIsWaiting(false)
      if (onNavigateToStudentPoll) {
        onNavigateToStudentPoll()
      }
    }
  }, [currentPoll, onNavigateToStudentPoll])



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

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  )
}

export default StudentWaitingRoom