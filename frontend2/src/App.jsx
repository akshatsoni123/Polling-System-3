import { useState } from 'react'
import './App.css'

function App() {
  const [selectedRole, setSelectedRole] = useState('student')

  const handleContinue = () => {
    console.log('Selected role:', selectedRole)
  }

  return (
    <main className="polling-container">
      <div className="brand-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L14.09 8.26L20 10.34L14.09 12.42L12 18.68L9.91 12.42L4 10.34L9.91 8.26L12 2Z"/>
        </svg>
        <span>Intervue Poll</span>
      </div>

      <h1>Welcome to the <span className="live-text">Live Polling System</span></h1>
      <p className="subtitle">Please select the role that best describes you to begin using the live polling system</p>

      <div className="role-selection">
        <label>
          <input
            type="radio"
            name="role"
            value="student"
            checked={selectedRole === 'student'}
            onChange={(e) => setSelectedRole(e.target.value)}
          />
          <div className="role-card">
            <h2>I'm a Student</h2>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
          </div>
        </label>

        <label>
          <input
            type="radio"
            name="role"
            value="teacher"
            checked={selectedRole === 'teacher'}
            onChange={(e) => setSelectedRole(e.target.value)}
          />
          <div className="role-card">
            <h2>I'm a Teacher</h2>
            <p>Submit answers and view live poll results in real-time.</p>
          </div>
        </label>
      </div>

      <button className="continue-button" onClick={handleContinue}>Continue</button>
    </main>
  )
}

export default App