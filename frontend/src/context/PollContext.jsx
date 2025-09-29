import { createContext, useContext, useState, useEffect } from 'react';
import socketService from '../services/socketService';
import chatService from '../services/chatService';

const PollContext = createContext();

export const usePoll = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePoll must be used within a PollProvider');
  }
  return context;
};

export const PollProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userType, setUserType] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [currentPoll, setCurrentPoll] = useState(null);
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pollHistory, setPollHistory] = useState([]);
  const [pollResults, setPollResults] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    socketService.connect();

    // Initialize chat service
    chatService.initialize();

    // Make services available globally for components
    window.socketService = socketService;
    window.chatService = chatService;

    // Set up event listeners
    const socket = socketService.getSocket();

    if (socket) {
      socket.on('connect', () => {
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('current_poll_state', (data) => {
        console.log('PollContext - current_poll_state received:', {
          poll: data.poll?.question,
          isActive: data.poll?.isActive,
          canAnswer: data.canAnswer,
          userType: userType
        });

        setCurrentPoll(data.poll);
        if (data.students) {
          setConnectedStudents(data.students);
          setTotalStudents(data.students.length);
        }
        // Only set hasAnswered if there's an active poll
        if (data.canAnswer !== undefined && data.poll && data.poll.isActive) {
          const newHasAnswered = !data.canAnswer;
          console.log('PollContext - Setting hasAnswered to:', newHasAnswered);
          setHasAnswered(newHasAnswered);
        } else if (!data.poll || !data.poll.isActive) {
          // If no active poll, student hasn't answered anything yet
          console.log('PollContext - No active poll, setting hasAnswered to false');
          setHasAnswered(false);
        }
      });

      socket.on('new_poll_created', (poll) => {
        console.log('PollContext - New poll received:', poll);
        console.log('User type:', userType);
        setCurrentPoll(poll);
        setHasAnswered(false);
        setTimeLeft(poll.timer);

        // Start countdown timer
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      });


      socket.on('student_joined', (data) => {
        setTotalStudents(data.totalStudents);
      });

      socket.on('student_left', (data) => {
        setTotalStudents(data.totalStudents);
      });

      socket.on('student_answered', (data) => {
        // Update connected students list if needed
        console.log(`${data.studentName} answered. ${data.totalAnswered}/${data.totalStudents} completed`);
      });

      socket.on('answer_submitted_successfully', (data) => {
        setHasAnswered(true);
        // If poll results are included, set them immediately
        if (data && data.pollResults) {
          console.log('PollContext - Poll results received with answer submission:', data.pollResults);
          setPollResults(data.pollResults);
          setCurrentPoll(prev => prev ? { ...prev, results: data.pollResults } : null);
        }
      });

      socket.on('poll_results_updated', (data) => {
        console.log('PollContext - Poll results updated:', data);
        console.log('PollContext - Current user type:', userType);
        console.log('PollContext - Current poll ID:', currentPoll?.id);
        if (data.pollId === currentPoll?.id) {
          setPollResults(data.results);
          // Also update the current poll with results
          setCurrentPoll(prev => prev ? { ...prev, results: data.results } : null);
        }
      });

      socket.on('poll_results_final', (data) => {
        console.log('PollContext - Poll results final:', data);
        console.log('PollContext - Current user type:', userType);
        setPollResults(data.results);
        // Update current poll with final results and mark as inactive
        setCurrentPoll(prev => prev ? { ...prev, results: data.results, isActive: false } : null);
      });

      socket.on('student_removed', () => {
        // Student was kicked out
        setUserType(null);
        setCurrentPoll(null);
        // The component should handle navigation to kicked out page
      });
    }

    return () => {
      // Cleanup
      if (socket) {
        socket.removeAllListeners();
      }
      chatService.cleanup();
    };
  }, []);

  const joinAsTeacher = () => {
    socketService.joinAsTeacher();
    setUserType('teacher');
  };

  const joinAsStudent = (name) => {
    socketService.joinAsStudent(name);
    setUserType('student');
    setStudentName(name);
    // Reset student-specific state when joining
    setHasAnswered(false);
  };

  const createPoll = (pollData) => {
    socketService.createPoll(pollData);
  };

  const submitAnswer = (answer) => {
    socketService.submitAnswer(answer);
  };

  const endPollEarly = () => {
    socketService.endPollEarly();
  };

  const removeStudent = (studentName) => {
    socketService.removeStudent(studentName);
  };

  const disconnect = () => {
    socketService.disconnect();
    setIsConnected(false);
    setUserType(null);
    setStudentName('');
    setCurrentPoll(null);
    setConnectedStudents([]);
    setTotalStudents(0);
    setHasAnswered(false);
    setTimeLeft(0);
  };

  const value = {
    // Connection state
    isConnected,
    userType,
    studentName,

    // Poll state
    currentPoll,
    connectedStudents,
    totalStudents,
    hasAnswered,
    timeLeft,
    pollHistory,
    pollResults,

    // Actions
    joinAsTeacher,
    joinAsStudent,
    createPoll,
    submitAnswer,
    endPollEarly,
    removeStudent,
    disconnect,

    // Setters for component-specific state
    setHasAnswered,
    setPollHistory
  };

  return (
    <PollContext.Provider value={value}>
      {children}
    </PollContext.Provider>
  );
};