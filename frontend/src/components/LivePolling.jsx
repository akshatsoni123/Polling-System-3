import { useState, useEffect } from 'react'
import './LivePolling.css'
import { usePoll } from '../context/PollContext'
import ChatModal from './ChatModal'

function LivePolling({ onNavigateToPollHistory }) {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [liveResults, setLiveResults] = useState(null)
  const [studentsAnswered, setStudentsAnswered] = useState(0)

  const { currentPoll, totalStudents, pollResults, endPollEarly, removeStudent } = usePoll()

  // Listen for real-time student answers
  useEffect(() => {
    const socket = window.socketService?.getSocket()
    if (socket) {
      socket.on('student_answered', (data) => {
        setStudentsAnswered(data.totalAnswered)
        console.log(`${data.studentName} answered. ${data.totalAnswered}/${data.totalStudents} completed`)
      })

      return () => {
        socket.off('student_answered')
      }
    }
  }, [])


  const handleAnswerSelect = (optionId) => {
    setSelectedAnswer(optionId)
  }


  const handleAskNewQuestion = () => {
    console.log('Asking new question...')
    // In a real app, this would navigate back to poll creation
    window.location.reload() // Simple refresh for demo
  }

  const handleKickOut = (participantName) => {
    console.log('Kicking out participant:', participantName)
    removeStudent(participantName)
  }

  const handleEndPoll = () => {
    endPollEarly()
  }

  // Calculate vote percentages for display
  const calculateResults = () => {
    if (!currentPoll || !pollResults) return []

    return currentPoll.options.map(option => ({
      text: option,
      votes: pollResults.options[option] || 0,
      percentage: pollResults.totalResponses > 0 ? ((pollResults.options[option] || 0) / pollResults.totalResponses * 100).toFixed(1) : 0
    }))
  }

  const toggleChatModal = () => {
    console.log('LivePolling chat icon clicked, toggling modal:', !isChatModalOpen)
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
              {currentPoll?.question || 'No active poll'}
            </div>

            {currentPoll && (
              <div className="poll-status">
                <p>Students answered: {studentsAnswered} / {totalStudents}</p>
                <p>Poll status: {currentPoll.isActive ? 'Active' : 'Completed'}</p>
              </div>
            )}

            <div className="answer-options">
              {(pollResults ? calculateResults() : currentPoll?.options?.map(option => ({
                text: option,
                votes: 0,
                percentage: 0
              })) || []).map((option, index) => (
                <div
                  key={index}
                  className={`answer-option`}
                >
                  <div className="option-number">{index + 1}</div>
                  <div className="option-text">{option.text}</div>
                  <div className="vote-count">Votes: {option.votes} ({option.percentage}%)</div>
                  <div className="vote-bar">
                    <div
                      className="vote-progress"
                      style={{ width: `${option.percentage}%` }}
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

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  )
}

export default LivePolling