import { useState } from 'react'
import './App.css'
import PollCreation from './components/PollCreation'
import StudentOnboarding from './components/StudentOnboarding'
import StudentWaitingRoom from './components/StudentWaitingRoom'
import StudentPollParticipation from './components/StudentPollParticipation'
import StudentPostSubmissionWaiting from './components/StudentPostSubmissionWaiting'
import KickedOut from './components/KickedOut'
import PollResults from './components/PollResults'
import LivePolling from './components/LivePolling'
import PollHistory from './components/PollHistory'

function App() {
  const [selectedRole, setSelectedRole] = useState('')
  const [currentPage, setCurrentPage] = useState('roleSelection')

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (selectedRole) {
      if (selectedRole === 'teacher') {
        setCurrentPage('pollCreation')
      } else if (selectedRole === 'student') {
        setCurrentPage('studentView')
      }
    }
  }

  const navigateToLivePolling = () => {
    setCurrentPage('livePolling')
  }

  const navigateToWaitingRoom = () => {
    setCurrentPage('studentWaiting')
  }

  const navigateToPollHistory = () => {
    setCurrentPage('pollHistory')
  }

  const navigateToStudentPoll = () => {
    setCurrentPage('studentPoll')
  }

  const navigateToPollResults = () => {
    setCurrentPage('pollResults')
  }

  const navigateToNewQuestion = () => {
    setCurrentPage('pollCreation')
  }

  const navigateToPostSubmissionWaiting = () => {
    setCurrentPage('studentPostSubmissionWaiting')
  }

  const navigateToKickedOut = () => {
    setCurrentPage('kickedOut')
  }

  // Render different pages based on current page
  if (currentPage === 'pollCreation') {
    return <PollCreation onNavigateToLivePolling={navigateToLivePolling} />
  }

  if (currentPage === 'studentView') {
    return <StudentOnboarding onNavigateToWaitingRoom={navigateToWaitingRoom} />
  }

  if (currentPage === 'studentWaiting') {
    return <StudentWaitingRoom onNavigateToStudentPoll={navigateToStudentPoll} />
  }

  if (currentPage === 'studentPoll') {
    return <StudentPollParticipation onNavigateToResults={navigateToPostSubmissionWaiting} />
  }

  if (currentPage === 'studentPostSubmissionWaiting') {
    return <StudentPostSubmissionWaiting onNavigateToNextQuestion={navigateToStudentPoll} />
  }

  if (currentPage === 'pollResults') {
    return <PollResults onNavigateToPollHistory={navigateToPollHistory} onNavigateToNewQuestion={navigateToNewQuestion} />
  }

  if (currentPage === 'livePolling') {
    return <LivePolling onNavigateToPollHistory={navigateToPollHistory} />
  }

  if (currentPage === 'pollHistory') {
    return <PollHistory />
  }

  if (currentPage === 'kickedOut') {
    return <KickedOut />
  }

  return (
    <div className="app">
      <div className="logo-container">
        <div className="logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">Intervue Poll</span>
        </div>
      </div>

      <div className="content">
        <h1 className="main-title">
          Welcome to the <span className="highlight">Live Polling System</span>
        </h1>
        <p className="subtitle">
          Please select the role that best describes you to begin using the live polling system
        </p>

        <div className="role-cards">
          <div
            className={`role-card ${selectedRole === 'student' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('student')}
          >
            <h3 className="role-title">I'm a Student</h3>
            <p className="role-description">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry
            </p>
          </div>

          <div
            className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('teacher')}
          >
            <h3 className="role-title">I'm a Teacher</h3>
            <p className="role-description">
              Submit answers and view live poll results in real-time.
            </p>
          </div>
        </div>

        <button
          className="continue-btn"
          onClick={handleContinue}
          disabled={!selectedRole}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default App
