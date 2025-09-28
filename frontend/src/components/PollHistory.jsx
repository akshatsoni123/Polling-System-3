import { useState, useEffect } from 'react';
import { usePoll } from '../context/PollContext';
import ChatModal from './ChatModal';

// Reusable Poll Card Component
const PollCard = ({ poll, index }) => {
  // Calculate option data with votes and percentages
  const getOptionData = () => {
    if (!poll.options || !Array.isArray(poll.options)) return [];

    return poll.options.map((option, idx) => {
      const votes = poll.results?.options?.[option] || 0;
      const percentage = poll.results?.totalResponses > 0
        ? ((votes / poll.results.totalResponses) * 100).toFixed(1)
        : 0;
      return { option, votes, percentage, idx };
    });
  };

  const optionData = getOptionData();
  const maxVotes = Math.max(...optionData.map(o => o.votes), 0);

  return (
    <div className="poll-history-item">
        <h2 className="page-title">Question {index + 1}</h2>
        <div className="poll-card">
            <div className="question-header">{poll.question}</div>
            <div className="options-container">
                {optionData.map(({ option, votes, percentage, idx }) => {
                    const isHighest = votes > 0 && votes === maxVotes;
                    return (
                        <div key={idx} className={`option-bar ${isHighest ? 'highlight' : ''}`}>
                            <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
                            <div className="option-content">
                                <div className="option-number">{idx + 1}</div>
                                <span className="option-text">{option}</span>
                            </div>
                            <span className="option-percentage">{votes} votes ({percentage}%)</span>
                        </div>
                    );
                })}
            </div>
            <div style={{ padding: '16px', borderTop: '1px solid #e0e0e0', fontSize: '14px', color: '#666' }}>
                <p>Total responses: {poll.results?.totalResponses || 0} / {poll.results?.totalStudents || 0}</p>
                <p>Completed: {poll.completedAt ? new Date(poll.completedAt).toLocaleString() : 'Unknown time'}</p>
            </div>
        </div>
    </div>
  );
};



// Styles for the entire component
const PollHistoryStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');

        .poll-history-container {
            font-family: 'Sora', sans-serif;
            background-color: #FFFFFF;
            color: #000000;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2rem;
            min-height: 100vh;
        }

        .poll-history-content {
            width: 100%;
            max-width: 727px;
            display: flex;
            flex-direction: column;
            gap: 50px; /* Space between poll cards */
        }
        
        .main-title {
            font-size: 40px;
            font-weight: 400;
            text-align: center;
            margin-bottom: 45px;
            width: 100%;
        }

        .main-title strong {
            font-weight: 600;
        }

        .poll-history-item {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 25px;
            width: 100%;
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
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 9px;
        }
        ::-webkit-scrollbar-track {
            background: #D9D9D9;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
            background: #828282;
            border-radius: 4px;
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


function PollHistory() {
  const [pollHistory, setPollHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChatOpen, setChatOpen] = useState(false);

  // Fetch poll history from backend
  useEffect(() => {
    const fetchPollHistory = async () => {
      try {
        console.log('Fetching poll history...');
        const response = await fetch('http://localhost:3001/api/poll/history');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw poll history data:', data);

        // Validate data structure
        if (!data || !Array.isArray(data.history)) {
          console.error('Invalid data structure:', data);
          setPollHistory([]);
          setIsLoading(false);
          return;
        }

        // Use the backend data directly since it already has the correct format
        setPollHistory(data.history.reverse()); // Show newest first
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching poll history:', error);
        setError(error.message);
        setPollHistory([]);
        setIsLoading(false);
      }
    };

    fetchPollHistory();
  }, []);

  return (
    <>
      <PollHistoryStyles />
      <div className="poll-history-container">
        <h1 className="main-title">View <strong>Poll History</strong></h1>

        <div className="poll-history-content">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
              Loading poll history...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#e74c3c' }}>
              <p>Error loading poll history</p>
              <p>{error}</p>
              <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', marginTop: '10px' }}>
                Retry
              </button>
            </div>
          ) : pollHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
              <p>No poll history available yet.</p>
              <p>Complete some polls to see them here!</p>
            </div>
          ) : (
            pollHistory.map((poll, index) => (
              <PollCard key={poll.id || index} poll={poll} index={index} />
            ))
          )}
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

export default PollHistory;
