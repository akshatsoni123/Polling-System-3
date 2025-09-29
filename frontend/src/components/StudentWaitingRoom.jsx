import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoll } from '../context/PollContext';
import ChatModal from './ChatModal';




// Styles are included within the component to prevent import errors.
const StudentWaitingRoomStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');

        .student-waiting-room-container {
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
            position: relative;
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

        .waiting-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 52px; 
        }

        .spinner {
            width: 57px;
            height: 57px;
            border-radius: 50%;
            border: 6px solid #500ECE;
            border-left-color: transparent; 
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        .waiting-message {
            font-size: 33px;
            font-weight: 600;
            line-height: 42px;
            color: #000000;
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

        /* Chat Modal Styles */
        .chat-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .chat-modal {
            width: 429px;
            height: 477px;
            background: #FFFFFF;
            border: 1px solid #CECECE;
            border-radius: 5px;
            filter: drop-shadow(4px 4px 20px rgba(0, 0, 0, 0.04)) drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.25));
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .modal-header {
            display: flex;
            border-bottom: 1px solid #E0E0E0;
        }

        .tab {
            flex: 1;
            padding: 1rem;
            background: none;
            border: none;
            cursor: pointer;
            font-family: 'Sora', sans-serif;
            font-size: 16px;
            font-weight: 600;
            color: #888;
            position: relative;
        }

        .tab.active {
            color: #000;
        }

        .tab.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 2px;
            background-color: #4A90E2;
        }

        .modal-content {
            padding: 20px;
            overflow-y: auto;
            flex-grow: 1;
        }

        /* Chat View */
        .chat-view {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .message-container {
            display: flex;
            flex-direction: column;
        }

        .message-container.user-1 {
            align-items: flex-start;
        }
        
        .message-container.user-2 {
            align-items: flex-end;
        }

        .message-user {
            font-size: 14px;
            font-weight: 600;
            color: #4A90E2;
            margin-bottom: 4px;
        }

        .message-text {
            padding: 10px 15px;
            border-radius: 10px;
            max-width: 80%;
            margin: 0;
        }
        
        .user-1 .message-text {
            background-color: #3E3E3E;
            color: white;
        }

        .user-2 .message-text {
            background-color: #4A90E2;
            color: white;
        }


        /* Participants View */
        .participant-header, .participant-name {
            text-align: left;
            padding: 10px 0;
            margin: 0;
        }

        .participant-header {
            color: #333;
            font-weight: normal;
            border-bottom: 1px solid #E0E0E0;
        }
        
        .participant-name {
            font-weight: 600;
        }

    `}</style>
);


function StudentWaitingRoom() {
    const [isChatOpen, setChatOpen] = useState(false);
    const { currentPoll } = usePoll();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('StudentWaitingRoom - currentPoll:', currentPoll);
        if (currentPoll && currentPoll.isActive) {
            console.log('Poll is active, navigating to student poll');
            navigate('/student/poll');
        }
    }, [currentPoll, navigate]);


  return (
    <>
      <StudentWaitingRoomStyles />
      <div className="student-waiting-room-container">
        
        <div className="waiting-content">
            <div className="brand-badge">
                <svg className="brand-badge-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" >
                    <path d="M12 2L14.09 8.26L20 10.34L14.09 12.42L12 18.68L9.91 12.42L4 10.34L9.91 8.26L12 2Z" />
                </svg>
                <span>Intervue Poll</span>
            </div>
            <div className="spinner"></div>
            <h1 className="waiting-message">
                Wait for the teacher to ask questions..
            </h1>
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

export default StudentWaitingRoom;

