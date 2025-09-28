import { useState, useEffect } from 'react';
import { usePoll } from '../context/PollContext';
import ChatModal from './ChatModal';

// Styles for the entire component
const LivePollingStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');

        .live-polling-container {
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
        
        .view-poll-history-btn {
            position: fixed;
            top: 40px;
            right: 40px;
            background: linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%);
            color: white;
            border: none;
            border-radius: 34px;
            padding: 15px 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 100;
        }

        .view-poll-history-btn svg {
            width: 22px;
            height: 22px;
        }

        .main-content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 25px;
            width: 100%;
            max-width: 727px;
        }

        .page-title {
            font-size: 22px;
            font-weight: 600;
        }

        .poll-card {
            width: 100%;
            border: 1px solid #AF8FF1;
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
            position: relative;
        }

        .option-bar.highlight {
            border: 1.5px solid #8F64E1;
        }
        
        .progress-bar {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background-color: #6766D5;
            border-radius: 5px;
            z-index: 1;
        }

        .option-content {
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 2;
            width: 100%;
        }

        .option-number {
            width: 24px;
            height: 24px;
            background-color: #FFFFFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6766D5;
            font-size: 11px;
            font-weight: 600;
            flex-shrink: 0;
        }

        .option-text {
            font-size: 16px;
            font-weight: 400;
            color: #000000 !important;
        }

        .option-bar .progress-bar + .option-content .option-text {
             color: #FFFFFF;
        }
        
        .option-percentage {
            margin-left: auto;
            font-size: 16px;
            font-weight: 600;
            z-index: 2;
        }

        .new-question-btn {
            background: linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%);
            border-radius: 34px;
            border: none;
            color: white;
            padding: 17px 40px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            align-self: center;
            margin-top: 29px;
        }

        .chat-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: #5A66D1;
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
            height: 2px; background-color: #7565D9;
        }
        .modal-content { padding: 20px; overflow-y: auto; flex-grow: 1; }
        .chat-view { display: flex; flex-direction: column; gap: 15px; }
        .message-container { display: flex; flex-direction: column; }
        .message-container.user-1 { align-items: flex-start; }
        .message-container.user-2 { align-items: flex-end; }
        .message-user { font-size: 14px; font-weight: 600; color: #7565D9; margin-bottom: 4px; }
        .message-text { padding: 10px 15px; border-radius: 10px; max-width: 80%; margin: 0; }
        .user-1 .message-text { background-color: #3E3E3E; color: white; }
        .user-2 .message-text { background-color: #7565D9; color: white; }
        .participant-header, .participant-name { text-align: left; padding: 10px 0; margin: 0; }
        .participant-header { color: #333; font-weight: normal; border-bottom: 1px solid #E0E0E0; }
        .participant-name { font-weight: 600; }
    `}</style>
);


function LivePolling({ onNavigateToPollHistory, onNavigateToNewQuestion }) {
  const { currentPoll, totalStudents, endPollEarly, removeStudent, pollResults } = usePoll();
  const [isChatOpen, setChatOpen] = useState(false);
  const [studentsAnswered, setStudentsAnswered] = useState(0);

  // Listen for real-time student answers and poll results
  useEffect(() => {
    const socket = window.socketService?.getSocket();
    if (socket) {
      const handleStudentAnswered = (data) => {
        setStudentsAnswered(data.totalAnswered);
        console.log(`${data.studentName} answered. ${data.totalAnswered}/${data.totalStudents} completed`);
      };

      const handlePollResultsUpdated = (data) => {
        console.log('Teacher received poll results update:', data);
        // Results are already handled by PollContext, just log for debugging
      };

      const handlePollResultsFinal = (data) => {
        console.log('Teacher received final poll results:', data);
        // Results are already handled by PollContext, just log for debugging
      };

      socket.on('student_answered', handleStudentAnswered);
      socket.on('poll_results_updated', handlePollResultsUpdated);
      socket.on('poll_results_final', handlePollResultsFinal);

      return () => {
        socket.off('student_answered', handleStudentAnswered);
        socket.off('poll_results_updated', handlePollResultsUpdated);
        socket.off('poll_results_final', handlePollResultsFinal);
      };
    }
  }, []);

  // Calculate vote percentages for display using real poll results
  const calculateResults = () => {
    if (!currentPoll?.options || !pollResults) {
      return currentPoll?.options?.map(option => ({
        text: option,
        votes: 0,
        percentage: 0
      })) || [];
    }

    const totalResponses = pollResults.totalResponses || 0;

    return currentPoll.options.map(option => {
      const votes = pollResults.options?.[option] || 0;
      const percentage = totalResponses > 0 ? Math.round((votes / totalResponses) * 100) : 0;
      return {
        text: option,
        votes,
        percentage
      };
    });
  };

  const handleViewPollHistory = () => {
    if (onNavigateToPollHistory) {
      onNavigateToPollHistory();
    }
  };

  const handleAskNewQuestion = () => {
    if (onNavigateToNewQuestion) {
      onNavigateToNewQuestion();
    }
  };

  return (
    <>
      <LivePollingStyles />
      <div className="live-polling-container">
        <button className="view-poll-history-btn" onClick={handleViewPollHistory}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>View Poll history</span>
        </button>
        <div className="main-content">
          <h2 className="page-title">Question {currentPoll?.questionNumber || ''}</h2>
          {currentPoll ? (
            <div className="poll-card">
              <div className="question-header">{currentPoll.question}</div>
              <div className="options-container">
                {calculateResults().map((option, index) => {
                  const results = calculateResults();
                  const maxVotes = Math.max(...results.map(r => r.votes));
                  const isHighest = option.votes > 0 && option.votes === maxVotes;

                  return (
                    <div key={index} className={`option-bar ${isHighest ? 'highlight' : ''}`}>
                      <div className="progress-bar" style={{ width: `${option.percentage}%` }}></div>
                      <div className="option-content">
                          <div className="option-number">{index + 1}</div>
                          <span className="option-text">{option.text}</span>
                      </div>
                      <span className="option-percentage">{option.percentage}% ({option.votes} votes)</span>
                    </div>
                  );
                })}
              </div>
              {currentPoll && (
                <div style={{ padding: '16px', borderTop: '1px solid #e0e0e0', fontSize: '14px', color: '#666' }}>
                  <p>Students answered: {pollResults?.totalResponses || 0} / {totalStudents}</p>
                  <p>Poll status: {currentPoll.isActive ? 'Active' : 'Completed'}</p>
                  {pollResults && pollResults.totalResponses > 0 && (
                    <p>Total votes: {pollResults.totalResponses}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="poll-card">
              <div className="question-header">No active poll</div>
              <div className="options-container">
                <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  Create a poll to see live results here
                </p>
              </div>
            </div>
          )}
          <button className="new-question-btn" onClick={handleAskNewQuestion}>+ Ask a new question</button>
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

export default LivePolling;

