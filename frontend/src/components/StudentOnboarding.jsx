import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoll } from '../context/PollContext';


// Styles are included within the component to prevent import errors.
const StudentOnboardingStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');

        .student-onboarding-container {
            font-family: 'Sora', sans-serif;
            background-color: #FFFFFF;
            color: #000000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            min-height: 100vh;
            text-align: center;
        }

        .student-onboarding-content {
            width: 100%;
            max-width: 762px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
        }
        
        .brand-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: linear-gradient(90deg, #4A90E2 0%, #2563EB 100%);
            color: #FFFFFF;
            padding: 9px 12px;
            border-radius: 24px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        .brand-badge-icon {
            width: 15px;
            height: 15px;
        }

        .main-title {
            font-size: 40px;
            font-weight: 400;
            line-height: 50px;
            margin: 0;
        }
        
        .subtitle {
            font-size: 19px;
            line-height: 25px;
            color: #5C5B5B;
            max-width: 762px;
        }

        .name-section {
            width: 100%;
            max-width: 507px;
            margin-top: 2rem;
        }
        
        .name-label {
            display: block;
            text-align: left;
            font-size: 18px;
            font-weight: 400;
            line-height: 23px;
            margin-bottom: 12px;
            color: #000000;
        }
        
        .name-input {
            width: 100%;
            height: 60px;
            background: #F2F2F2;
            border-radius: 2px;
            border: none;
            padding: 0 23px;
            font-family: 'Sora', sans-serif;
            font-size: 18px;
            color: #000000;
        }

        .name-input:focus {
            outline: 1px solid #4A90E2;
        }
        
        .continue-btn {
            width: 234px;
            height: 58px;
            border: none;
            background: linear-gradient(99.18deg, #5B9BD5 -46.89%, #1D68BD 223.45%);
            border-radius: 34px;
            color: #FFFFFF;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 2rem;
        }

        .continue-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `}</style>
);


function StudentOnboarding() {
  const [studentName, setStudentName] = useState('Rahul Bajaj');
  const { joinAsStudent } = usePoll();
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setStudentName(e.target.value);
  };

  const handleContinue = () => {
    if (studentName.trim()) {
      console.log('Student attempting to join:', studentName.trim());
      joinAsStudent(studentName.trim());
      navigate('/student/waiting');
    }
  };

  return (
    <>
      <StudentOnboardingStyles />
      <div className="student-onboarding-container">
        <div className="student-onboarding-content">

            <div className="brand-badge">
                <svg className="brand-badge-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" >
                    <path d="M12 2L14.09 8.26L20 10.34L14.09 12.42L12 18.68L9.91 12.42L4 10.34L9.91 8.26L12 2Z" />
                </svg>
                <span>Intervue Poll</span>
            </div>

            <h1 className="main-title">Let’s Get Started</h1>

            <p className="subtitle">
                If you’re a student, you’ll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates
            </p>

            <div className="name-section">
                <label className="name-label">Enter your Name</label>
                <input
                    type="text"
                    className="name-input"
                    value={studentName}
                    onChange={handleNameChange}
                    placeholder="e.g. Rahul Bajaj"
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
    </>
  );
}

export default StudentOnboarding;
