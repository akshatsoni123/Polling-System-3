import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
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

// Role Selection Component
function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState('')
  const { joinAsTeacher, isConnected } = usePoll()
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (selectedRole && isConnected) {
      if (selectedRole === 'teacher') {
        joinAsTeacher()
        navigate('/teacher/create-poll')
      } else if (selectedRole === 'student') {
        navigate('/student/onboarding')
      }
    }
  }

  return (
    <div className="app">
      <div className="content">
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
          <p className="connecting-text">
            Connecting to server...
          </p>
        )}
      </div>
    </div>
  )
}

function App() {
  const [hasJoinedBefore, setHasJoinedBefore] = useState(false)
  const { userType, currentPoll } = usePoll()
  const navigate = useNavigate()
  const location = useLocation()

  // Navigate students to participation when poll is active and they haven't answered
  useEffect(() => {
    if (currentPoll && currentPoll.isActive && userType === 'student') {
      // Navigate from waiting room to poll participation
      if (location.pathname === '/student/waiting') {
        console.log('Navigating student from waiting room to active poll')
        navigate('/student/poll')
      }
      // Navigate from post-submission waiting to new poll participation
      else if (location.pathname === '/student/waiting-results') {
        console.log('Navigating student from post-submission to new poll')
        navigate('/student/poll')
      }
    }
  }, [currentPoll, userType, location.pathname, navigate])

  // Track when user has actually joined
  useEffect(() => {
    if (userType !== null) {
      setHasJoinedBefore(true)
    }
  }, [userType])

  // Listen for when student gets kicked out (only if they were previously connected)
  useEffect(() => {
    if (userType === null && hasJoinedBefore && location.pathname !== '/') {
      console.log('Student kicked out - navigating to kicked out page')
      navigate('/kicked-out')
    }
  }, [userType, hasJoinedBefore, location.pathname, navigate])

  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/teacher/create-poll" element={<PollCreation />} />
      <Route path="/teacher/live-polling" element={<LivePolling />} />
      <Route path="/teacher/poll-history" element={<PollHistory />} />
      <Route path="/student/onboarding" element={<StudentOnboarding />} />
      <Route path="/student/waiting" element={<StudentWaitingRoom />} />
      <Route path="/student/poll" element={<StudentPollParticipation />} />
      <Route path="/student/waiting-results" element={<StudentPostSubmissionWaiting />} />
      <Route path="/kicked-out" element={<KickedOut />} />
    </Routes>
  )
}

export default App
