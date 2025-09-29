import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoll } from '../context/PollContext';

// Styles are now included within the component to resolve the import error.
const PollCreationStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');

        .poll-creation-container {
            font-family: 'Sora', sans-serif;
            background-color: #FFFFFF;
            color: #000000;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2rem;
            min-height: 100vh;
        }

        .poll-creation-content {
            width: 100%;
            max-width: 900px; /* Adjusted for better layout */
        }

        .header {
            width: 100%;
            margin-bottom: 2.5rem;
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
        }

        .brand-badge-icon {
            width: 15px;
            height: 15px;
        }

        .title-section {
            margin-bottom: 3rem;
        }

        .main-title {
            font-size: 40px;
            font-weight: 400;
            line-height: 50px;
            margin-bottom: 12px;
        }

        .subtitle {
            font-size: 19px;
            line-height: 24px;
            color: rgba(0, 0, 0, 0.5);
            max-width: 737px;
        }

        .question-section {
            margin-bottom: 2rem;
        }

        .question-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .question-label {
            font-size: 20px;
            font-weight: 600;
        }

        .timer-dropdown {
            position: relative;
            background: #F1F1F1;
            border-radius: 7px;
            display: flex;
            align-items: center;
            padding: 10px 18px;
        }

        .timer-dropdown select {
            background: transparent;
            border: none;
            font-family: 'Sora', sans-serif;
            font-size: 18px;
            color: #000000;
            appearance: none;
            -webkit-appearance: none;
            padding-right: 25px; /* space for arrow */
        }

        .timer-dropdown select:focus {
            outline: none;
        }

        .dropdown-arrow {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%) rotate(180deg);
            pointer-events: none;
            width: 19px;
            height: 18px;
            background-color: #2563EB;
            clip-path: polygon(50% 100%, 0 0, 100% 0);
        }

        .question-input-container {
            position: relative;
        }

        .question-input {
            width: 100%;
            height: 174px;
            background: #F2F2F2;
            border-radius: 2px;
            border: none;
            padding: 20px;
            font-family: 'Sora', sans-serif;
            font-size: 18px;
            color: #000000;
            resize: none;
        }

        .question-input:focus {
            outline: 1px solid #4A90E2;
        }

        .char-count {
            position: absolute;
            bottom: 15px;
            right: 15px;
            font-size: 15px;
            color: #000000;
        }

        .options-container {
            display: flex;
            justify-content: space-between;
            gap: 2rem;
            margin-top: 2rem;
            flex-wrap: wrap; /* for responsiveness */
        }

        .options-editor, .correctness-checker {
            flex: 1;
            min-width: 300px; /* prevent excessive shrinking */
        }

        .section-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        .option-item {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }

        .option-number {
            width: 24px;
            height: 24px;
            border-radius: 22px;
            background: linear-gradient(243.94deg, #5B9BD5 -50.82%, #2563EB 216.33%);
            color: #FFFFFF;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 11px;
            font-weight: 600;
            flex-shrink: 0;
        }

        .option-input {
            width: 100%;
            height: 60px;
            background: #F2F2F2;
            border-radius: 2px;
            border: none;
            padding: 0 20px;
            font-family: 'Sora', sans-serif;
            font-size: 18px;
            color: #000000;
        }

        .option-input:focus {
            outline: 1px solid #4A90E2;
        }

        .add-more-btn {
            background: transparent;
            border: 1px solid #4A90E2;
            border-radius: 11px;
            padding: 10px;
            width: 169px;
            height: 45px;
            font-family: 'Sora', sans-serif;
            font-size: 14px;
            font-weight: 600;
            color: #5B9BD5;
            cursor: pointer;
            margin-top: 1rem;
        }

        .radio-group {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .radio-option {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 17px;
            font-weight: 600;
            cursor: pointer;
        }

        .radio-option input {
            display: none;
        }

        .radio-custom {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border: 1px solid #B4B4B4;
            background: #D9D9D9;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .radio-option input:checked + .radio-custom {
            background: #FFFFFF;
            border: 2px solid #5B9BD5;
        }

        .radio-option input:checked + .radio-custom .radio-dot {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #5B9BD5;
        }

        .footer {
            width: 100%;
            border-top: 1px solid #B6B6B6;
            margin-top: 3rem;
            padding-top: 2rem;
            display: flex;
            justify-content: flex-end;
        }

        .ask-question-btn {
            width: 234px;
            height: 58px;
            padding: 17px 70px;
            border: none;
            background: linear-gradient(99.18deg, #5B9BD5 -46.89%, #1D68BD 223.45%);
            border-radius: 34px;
            color: #FFFFFF;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .ask-question-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `}</style>
);


function PollCreation() {
  const [question, setQuestion] = useState('');
  const [timer, setTimer] = useState(60);
  const [options, setOptions] = useState(['', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0); // Using index for correct answer
  const [error, setError] = useState('');

  const { createPoll, currentPoll, isConnected, userType } = usePoll();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('PollCreation - Connection status:', isConnected, 'User type:', userType);
  }, [isConnected, userType]);

  useEffect(() => {
    console.log('PollCreation - currentPoll changed:', currentPoll);
    if (currentPoll && currentPoll.isActive) {
      console.log('Poll is active, navigating to live polling');
      navigate('/teacher/live-polling');
    }
  }, [currentPoll, navigate]);

  useEffect(() => {
    // Listen for poll creation errors
    const socket = window.socketService?.getSocket();
    if (socket) {
      const handlePollCreationError = (data) => {
        setError(data.message);
      };

      socket.on('poll_creation_error', handlePollCreationError);

      return () => {
        socket.off('poll_creation_error', handlePollCreationError);
      };
    }
  }, []);

  const handleQuestionChange = (e) => {
    if (e.target.value.length <= 100) {
      setQuestion(e.target.value);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addMoreOption = () => {
    setOptions([...options, '']);
  };

  const handleAskQuestion = () => {
    console.log('Ask Question button clicked');

    // Check connection status
    if (!isConnected) {
      setError('Not connected to server. Please refresh the page.');
      return;
    }

    // Check user type
    if (userType !== 'teacher') {
      setError('You must be logged in as a teacher to create polls.');
      return;
    }

    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }
    if (options.some(opt => !opt.trim())) {
        setError('All options must be filled out.');
        return;
    }
    setError('');

    const pollData = {
      question,
      timer: `${timer} seconds`,
      options,
      correctAnswer: options[correctAnswerIndex],
    };

    console.log('Poll data to be sent:', pollData);
    console.log('Socket service status:', window.socketService?.getConnectionStatus());
    console.log('User type:', window.socketService?.getUserType());

    try {
      createPoll(pollData);
      console.log('Poll creation request sent successfully');
    } catch (error) {
      console.error('Error creating poll:', error);
      setError('Failed to create poll. Please try again.');
    }
  };

  return (
    <>
      <PollCreationStyles />
      <div className="poll-creation-container">
        <div className="poll-creation-content">
          <header className="header">
            <div className="brand-badge">
                <svg className="brand-badge-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" >
                    <path d="M12 2L14.09 8.26L20 10.34L14.09 12.42L12 18.68L9.91 12.42L4 10.34L9.91 8.26L12 2Z" />
                </svg>
                <span>Intervue Poll</span>
            </div>
          </header>

          <section className="title-section">
            <h1 className="main-title">Let’s Get Started</h1>
            <p className="subtitle">
                You’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
            </p>
          </section>

          <section className="question-section">
            <div className="question-header">
                <label className="question-label">Enter your question</label>
                <div className="timer-dropdown">
                    <select value={timer} onChange={(e) => setTimer(Number(e.target.value))}>
                        <option value={30}>30 seconds</option>
                        <option value={60}>60 seconds</option>
                        <option value={90}>90 seconds</option>
                        <option value={120}>120 seconds</option>
                    </select>
                    <div className="dropdown-arrow"></div>
                </div>
            </div>
            <div className="question-input-container">
                <textarea
                    className="question-input"
                    value={question}
                    onChange={handleQuestionChange}
                />
                <span className="char-count">{question.length}/100</span>
            </div>
          </section>

          <div className="options-container">
            <section className="options-editor">
                <h3 className="section-title">Edit Options</h3>
                {options.map((option, index) => (
                    <div key={index} className="option-item">
                        <div className="option-number">{index + 1}</div>
                        <input
                            type="text"
                            className="option-input"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                        />
                    </div>
                ))}
                <button className="add-more-btn" onClick={addMoreOption}>+ Add More option</button>
            </section>
            <section className="correctness-checker">
                <h3 className="section-title">Is it Correct?</h3>
                <div className="radio-group">
                    {options.map((_, index) => (
                         <label key={index} className="radio-option">
                            <input
                                type="radio"
                                name="correct-answer"
                                checked={correctAnswerIndex === index}
                                onChange={() => setCorrectAnswerIndex(index)}
                            />
                            <span className="radio-custom"><span className="radio-dot"></span></span>
                            {/* The labels Yes/No seem to be placeholders in the design, dynamically matching them to options is better */}
                            Option {index + 1}
                        </label>
                    ))}
                </div>
            </section>
          </div>
          
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

          {currentPoll && currentPoll.isActive && (
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              padding: '1rem',
              marginTop: '1rem',
              color: '#856404'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>⚠️ Active Poll in Progress</h4>
              <p style={{ margin: 0 }}>
                There's currently an active poll. Wait for all students to answer or for the timer to expire before creating a new poll.
              </p>
            </div>
          )}
          
          <footer className="footer">
            <button
              className="ask-question-btn"
              onClick={handleAskQuestion}
              disabled={!question.trim() || options.some(opt => !opt.trim())}
            >
                Ask Question
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}

export default PollCreation;

