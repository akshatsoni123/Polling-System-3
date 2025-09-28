import { useState, useEffect } from 'react'
import './App.css'
import { usePoll } from './context/PollContext'
import PollCreation from './components/PollCreation'
import StudentOnboarding from './components/StudentOnboarding'
import StudentWaitingRoom from './components/StudentWaitingRoom'
import StudentPollParticipation from './components/StudentPollParticipation'
import StudentPostSubmissionWaiting from './components/StudentPostSubmissionWaiting'
import KickedOut from './components/KickedOut'
import LivePolling from './components/LivePolling'
import PollHistory from './components/PollHistory'

function App() {
  const [selectedRole, setSelectedRole] = useState('')
  const [currentPage, setCurrentPage] = useState('roleSelection')
  const [hasJoinedBefore, setHasJoinedBefore] = useState(false)
  const { joinAsTeacher, joinAsStudent, userType, isConnected, currentPoll } = usePoll()

  // Navigate students to participation when poll is active and they haven't answered
  useEffect(() => {
    if (currentPoll && currentPoll.isActive && userType === 'student' &&
        currentPage === 'studentWaiting') {
      console.log('Navigating student to active poll')
      setCurrentPage('studentPoll')
    }
  }, [currentPoll, userType, currentPage])

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (selectedRole && isConnected) {
      if (selectedRole === 'teacher') {
        joinAsTeacher()
        setCurrentPage('pollCreation')
      } else if (selectedRole === 'student') {
        setCurrentPage('studentView')
      }
    }
  }

  // Track when user has actually joined
  useEffect(() => {
    if (userType !== null) {
      setHasJoinedBefore(true)
    }
  }, [userType])

  // Listen for when student gets kicked out (only if they were previously connected)
  useEffect(() => {
    if (userType === null && hasJoinedBefore && currentPage !== 'roleSelection') {
      console.log('Student kicked out - navigating to kicked out page')
      setCurrentPage('kickedOut')
    }
  }, [userType, hasJoinedBefore, currentPage])

  // Debug logging
  useEffect(() => {
    console.log('App state:', { userType, hasJoinedBefore, currentPage, selectedRole })
  }, [userType, hasJoinedBefore, currentPage, selectedRole])

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
    console.log('Rendering StudentWaitingRoom for user:', userType)
    return <StudentWaitingRoom onNavigateToStudentPoll={navigateToStudentPoll} />
  }

  if (currentPage === 'studentPoll') {
    console.log('Rendering StudentPollParticipation for user:', userType, 'poll:', currentPoll)
    return <StudentPollParticipation onNavigateToResults={navigateToPostSubmissionWaiting} />
  }

  if (currentPage === 'studentPostSubmissionWaiting') {
    return <StudentPostSubmissionWaiting onNavigateToNextQuestion={navigateToStudentPoll} />
  }


  if (currentPage === 'livePolling') {
    return <LivePolling
      onNavigateToPollHistory={navigateToPollHistory}
      onNavigateToNewQuestion={navigateToNewQuestion}
    />
  }

  if (currentPage === 'pollHistory') {
    return <PollHistory />
  }

  if (currentPage === 'kickedOut') {
    return <KickedOut />
  }

  return (
    <div className="app">
      {/* This new 'content' div now wraps everything for easier centering */}
      <div className="content">
        {/* Replaced the old logo with the new badge design */}
        <div className="brand-badge">
          <svg
            className="brand-badge-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L14.09 8.26L20 10.34L14.09 12.42L12 18.68L9.91 12.42L4 10.34L9.91 8.26L12 2Z" />
          </svg>
          <span>Intervue Poll</span>
        </div>

        {/* Removed the extra highlight span from the title */}
        <h1 className="main-title">
          Welcome to the Live Polling System
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
          disabled={!selectedRole || !isConnected}
        >
          {isConnected ? 'Continue' : 'Connecting...'}
        </button>

        {!isConnected && (
          // Replaced inline style with a class for consistency
          <p className="connecting-text">
            Connecting to server...
          </p>
        )}
      </div>
    </div>
  );
}

export default App
