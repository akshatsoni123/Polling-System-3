import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoll } from '../context/PollContext';
import ChatModal from './ChatModal';



// Styles for the entire component
const StudentPollParticipationStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');

        .student-poll-container {
            font-family: 'Sora', sans-serif;
            background-color: #FFFFFF;
            color: #000000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
        }

        .main-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 25px;
            width: 100%;
            max-width: 727px;
        }

        .header-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            max-width: 678px;
            margin: 0 auto;
        }

        .page-title {
            font-size: 22px;
            font-weight: 600;
            margin: 0;
        }
        
        .timer-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .timer-icon {
            width: 16px;
            height: 19px;
        }

        .timer-text {
            font-size: 18px;
            font-weight: 600;
            color: #CB1206;
        }

        .poll-card {
            width: 100%;
            border: 1px solid #93C5FD;
            border-radius: 9px;
            overflow: hidden;
        }

        .question-header {
            background: linear-gradient(90deg, #343434 0%, #6E6E6E 100%);
            color: #FFFFFF;
            font-size: 17px;
            font-weight: 600;
            padding: 14px 16px;
        }

        .options-container {
            padding: 18px 16px;
            display: flex;
            flex-direction: column;
            gap: 11px;
        }

        .option-bar {
            background: #F7F7F7;
            border: 1px solid rgba(141, 141, 141, 0.19);
            border-radius: 6px;
            padding: 15px 21px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .option-bar.selected {
            border: 1.5px solid #5B9BD5 !important;
            background-color: #FFFFFF !important;
        }
        
        .option-number {
            width: 24px;
            height: 24px;
            background: #8D8D8D;
            border-radius: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 11px;
            font-weight: 600;
            flex-shrink: 0;
        }
        
        .option-bar.selected .option-number {
            background: linear-gradient(243.94deg, #5B9BD5 -50.82%, #2563EB 216.33%);
        }

        .option-text {
            font-size: 16px;
            font-weight: 400;
            color: #2E2E2E !important;
        }
        
        .option-bar.selected .option-text {
            font-weight: 600;
        }
        
        .submit-btn {
            background: linear-gradient(99.18deg, #5B9BD5 -46.89%, #1D68BD 223.45%);
            border-radius: 34px;
            border: none;
            color: white;
            padding: 17px 70px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 29px; /* Matches figma distance */
        }
        
        .chat-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: #3B82F6;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .chat-bubble-icon {
            width: 30px;
            height: 30px;
        }

        /* Modal Styles */
        .chat-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.2);
            display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .chat-modal {
            width: 429px; height: 477px; background: #FFFFFF;
            border: 1px solid #CECECE; border-radius: 5px;
            filter: drop-shadow(4px 4px 20px rgba(0, 0, 0, 0.04)) drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.25));
            display: flex; flex-direction: column; overflow: hidden;
        }
        .modal-header { display: flex; border-bottom: 1px solid #E0E0E0; }
        .tab {
            flex: 1; padding: 1rem; background: none; border: none; cursor: pointer;
            font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 600; color: #888; position: relative;
        }
        .tab.active { color: #000; }
        .tab.active::after {
            content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
            height: 2px; background-color: #4A90E2;
        }
        .modal-content { padding: 20px; overflow-y: auto; flex-grow: 1; }
        .chat-view { display: flex; flex-direction: column; gap: 15px; }
        .message-container { display: flex; flex-direction: column; }
        .message-container.user-1 { align-items: flex-start; }
        .message-container.user-2 { align-items: flex-end; }
        .message-user { font-size: 14px; font-weight: 600; color: #4A90E2; margin-bottom: 4px; }
        .message-text { padding: 10px 15px; border-radius: 10px; max-width: 80%; margin: 0; }
        .user-1 .message-text { background-color: #3E3E3E; color: white; }
        .user-2 .message-text { background-color: #4A90E2; color: white; }
        .participant-header, .participant-name { text-align: left; padding: 10px 0; margin: 0; }
        .participant-header { color: #333; font-weight: normal; border-bottom: 1px solid #E0E0E0; }
        .participant-name { font-weight: 600; }

    `}</style>
);

function StudentPollParticipation() {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isChatOpen, setChatOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { currentPoll, submitAnswer, hasAnswered, timeLeft } = usePoll();
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    console.log('StudentPollParticipation state:', {
      selectedAnswer,
      hasSubmitted,
      hasAnswered,
      currentPoll: currentPoll?.question,
      timeLeft
    });
  }, [selectedAnswer, hasSubmitted, hasAnswered, currentPoll, timeLeft]);

  // Handle timer expiry
  useEffect(() => {
    if (timeLeft === 0 && !hasSubmitted && currentPoll) {
      // Time's up, auto-submit or navigate
      handleTimeUp();
    }
  }, [timeLeft, hasSubmitted, currentPoll]);

  // Navigate immediately after local submission (don't wait for backend confirmation)
  useEffect(() => {
    if (hasSubmitted && selectedAnswer && currentPoll) {
      // Navigate immediately after user submits, don't wait for backend confirmation
      console.log('Student submitted answer, navigating to results page immediately');
      navigate('/student/waiting-results');
    }
  }, [hasSubmitted, selectedAnswer, currentPoll, navigate]);

  const handleTimeUp = () => {
    if (selectedAnswer && !hasSubmitted) {
      handleSubmit();
    } else {
      navigate('/student/waiting-results');
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer && !hasSubmitted) {
      console.log('Student clicking submit button, answer:', selectedAnswer);
      setHasSubmitted(true);
      submitAnswer(selectedAnswer);
      // Navigation will happen via useEffect when hasSubmitted becomes true
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <StudentPollParticipationStyles />
      <div className="student-poll-container">
        <div className="main-content">
            <div className="header-section">
                <h2 className="page-title">Question {currentPoll?.questionNumber || 1}</h2>
                <div className="timer-container">
                    <svg className="timer-icon" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 11.2222V6.77778C14 3.58985 11.3137 1 8 1C4.68629 1 2 3.58985 2 6.77778V11.2222C2 14.4101 4.68629 17 8 17C11.3137 17 14 14.4101 14 11.2222Z" stroke="black" strokeWidth="2"/>
                        <path d="M8 7.66699V11.2225" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M5 1H11" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M5 19H11" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="timer-text">{formatTime(timeLeft)}</span>
                </div>
            </div>
            
            <div className="poll-card">
                <div className="question-header">{currentPoll?.question || 'No question available'}</div>
                <div className="options-container">
                    {currentPoll?.options?.map((option, idx) => (
                        <div
                            key={idx}
                            className={`option-bar ${selectedAnswer === option ? 'selected' : ''}`}
                            onClick={() => {
                              console.log('Option clicked:', option, 'hasSubmitted:', hasSubmitted, 'poll active:', currentPoll?.isActive);
                              if (!hasSubmitted && currentPoll?.isActive) {
                                console.log('Setting selected answer to:', option);
                                setSelectedAnswer(option);
                              }
                            }}
                            style={{
                              cursor: (hasSubmitted || !currentPoll?.isActive) ? 'not-allowed' : 'pointer',
                              opacity: (hasSubmitted || !currentPoll?.isActive) ? 0.6 : 1
                            }}
                        >
                            <div className="option-number">{idx + 1}</div>
                            <span className="option-text">{option}</span>
                        </div>
                    )) || (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                            No options available
                        </div>
                    )}
                </div>
            </div>
          
            <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={!selectedAnswer || hasSubmitted || !currentPoll?.isActive}
                style={{ opacity: (!selectedAnswer || hasSubmitted || !currentPoll?.isActive) ? 0.5 : 1 }}
            >
                {hasSubmitted ? 'Answer Submitted' : 'Submit'}
            </button>
        </div>

        <button className="chat-button" aria-label="Open Chat" onClick={() => setChatOpen(true)}>
            <svg className="chat-bubble-icon" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H18L22 22V4C22 2.9 21.1 2 20 2Z" />
            </svg>
        </button>

        <ChatModal isOpen={isChatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </>
  );
}

export default StudentPollParticipation;
