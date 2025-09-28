import { useState } from 'react'
import './StudentOnboarding.css'
import { usePoll } from '../context/PollContext'

function StudentOnboarding({ onNavigateToWaitingRoom }) {
  const [studentName, setStudentName] = useState('')
  const { joinAsStudent } = usePoll()

  const handleNameChange = (e) => {
    setStudentName(e.target.value)
  }

  const handleContinue = () => {
    if (studentName.trim()) {
      console.log('Student joining as:', studentName.trim())
      joinAsStudent(studentName.trim())
      // Navigate to waiting room
      if (onNavigateToWaitingRoom) {
        onNavigateToWaitingRoom()
      }
    }
  }

  return (
    <div className="student-onboarding">
      <div className="logo-container">
        <div className="logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">Intervue Poll</span>
        </div>
      </div>

      <div className="content">
        <h1 className="main-title">Let's Get Started</h1>
        <p className="subtitle">
          If you're a student, you'll be able to <span className="highlight">submit your answers</span>, participate in live polls, and see how your responses compare with your classmates
        </p>

        <div className="name-section">
          <label className="name-label">Enter your Name</label>
          <input
            type="text"
            className="name-input"
            value={studentName}
            onChange={handleNameChange}
            placeholder="Enter your name"
          />
        </div>

        <button
          className="continue-btn"
          onClick={handleContinue}
          disabled={!studentName.trim()}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default StudentOnboarding