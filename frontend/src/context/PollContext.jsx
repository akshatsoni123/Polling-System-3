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
  const [pollResults, setPollResults] = useState(null);
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pollHistory, setPollHistory] = useState([]);

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
        setCurrentPoll(data.poll);
        if (data.students) {
          setConnectedStudents(data.students);
          setTotalStudents(data.students.length);
        }
        if (data.canAnswer !== undefined) {
          setHasAnswered(!data.canAnswer);
        }
      });

      socket.on('new_poll_created', (poll) => {
        console.log('New poll received:', poll);
        setCurrentPoll(poll);
        setPollResults(null);
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

        return () => clearInterval(timer);
      });

      socket.on('poll_results', (data) => {
        setPollResults(data.results);
        setCurrentPoll(data.poll);
        setTimeLeft(0);
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

      socket.on('answer_submitted_successfully', () => {
        setHasAnswered(true);
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
    setPollResults(null);
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
    setPollResults(null);
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
    pollResults,
    connectedStudents,
    totalStudents,
    hasAnswered,
    timeLeft,
    pollHistory,

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