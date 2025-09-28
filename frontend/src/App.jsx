import { useState, useEffect } from 'react';

// CSS is now included in the component to resolve the import error.
const AppStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');

    /* Reset and base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Sora', sans-serif;
      background-color: #FFFFFF;
      color: #000000;
    }

    /* Main application container for centering content */
    .app {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
      width: 100%;
    }

    /* Wrapper for all page content */
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem; /* Spacing between elements */
      width: 100%;
      max-width: 981px; /* Max width from the design */
    }

    /* "Intervue Poll" badge */
    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%);
      color: #FFFFFF;
      padding: 9px 12px;
      border-radius: 24px;
      font-size: 14px;
      font-weight: 600;
    }

    .brand-badge-icon {
      width: 15px;
      height: 15px;
    }

    /* Main title: "Welcome to the Live Polling System" */
    .main-title {
      font-size: 40px;
      font-weight: 400;
      line-height: 50px;
      text-align: center;
      color: #000000;
      margin-top: 2rem;
    }

    /* Subtitle text */
    .subtitle {
      font-size: 19px;
      line-height: 24px;
      text-align: center;
      color: rgba(0, 0, 0, 0.5);
      max-width: 737px;
      margin-top: -1rem; /* Adjust spacing */
    }

    /* Container for the two role selection cards */
    .role-cards {
      display: flex;
      flex-wrap: wrap; /* Allow cards to wrap on smaller screens */
      justify-content: center;
      gap: 40px; /* Space between the cards */
      margin-top: 2.5rem;
    }

    /* Individual role card styling */
    .role-card {
      box-sizing: border-box;
      width: 387px;
      height: 143px;
      border: 1px solid #D9D9D9;
      border-radius: 10px;
      padding: 25px;
      display: flex;
      flex-direction: column;
      gap: 17px;
      cursor: pointer;
      transition: border-color 0.3s ease, background-color 0.3s ease;
    }

    /* Styling for the selected card */
    .role-card.selected {
      border: 2px solid #7565D9;
      background-color: rgba(117, 101, 217, 0.05);
    }

    .role-title {
      font-size: 23px;
      font-weight: 600;
      line-height: 29px;
      color: #000000;
    }

    .role-description {
      font-size: 16px;
      line-height: 20px;
      color: #454545;
      max-width: 326px;
    }

    /* "Continue" button styling */
    .continue-btn {
      font-family: 'Sora', sans-serif;
      width: 234px;
      height: 58px;
      padding: 17px 70px;
      border: none;
      background: linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%);
      border-radius: 34px;
      color: #FFFFFF;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.3s ease;
      margin-top: 2.5rem;
    }

    .continue-btn:hover:not(:disabled) {
      opacity: 0.9;
    }

    .continue-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Simple message box for notifications */
    .message-box {
        display: none;
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        border: 1px solid #eee;
    }

    .message-box button {
        margin-top: 10px;
        padding: 5px 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
  `}</style>
);


// Mock context for demonstration. Replace with your actual context.
const usePoll = () => ({
  joinAsTeacher: () => console.log('Joined as Teacher'),
  joinAsStudent: () => console.log('Joined as Student'),
  userType: null,
  isConnected: true, // Set to true for UI display
  pollResults: null,
  currentPoll: null,
});

function App() {
  const [selectedRole, setSelectedRole] = useState('student'); // Default selection
  const [currentPage, setCurrentPage] = useState('roleSelection');
  const [message, setMessage] = useState('');
  const { isConnected, joinAsTeacher, joinAsStudent } = usePoll();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole && isConnected) {
      if (selectedRole === 'teacher') {
        joinAsTeacher();
        // setCurrentPage('pollCreation'); // Uncomment for navigation
      } else if (selectedRole === 'student') {
        joinAsStudent();
        // setCurrentPage('studentView'); // Uncomment for navigation
      }
      setMessage(`Continuing as: ${selectedRole}`);
    }
  };

  const closeMessage = () => {
    setMessage('');
  }


  // Mocking other components for a complete view
  if (currentPage !== 'roleSelection') {
    return <div>Navigated to {currentPage}</div>;
  }

  return (
    <>
      <AppStyles />
      {message && (
          <div className="message-box" style={{display: 'block'}}>
            <p>{message}</p>
            <button onClick={closeMessage}>Close</button>
          </div>
      )}
      <div className="app">
        <div className="content">
          <div className="brand-badge">
            <svg
              className="brand-badge-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
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
              <h3 className="role-title">I’m a Student</h3>
              <p className="role-description">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>
            </div>

            <div
              className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('teacher')}
            >
              <h3 className="role-title">I’m a Teacher</h3>
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
            Continue
          </button>

        </div>
      </div>
    </>
  );
}

export default App;

