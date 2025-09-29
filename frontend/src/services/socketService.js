import { io } from 'socket.io-client';
import API_CONFIG from '../config/api';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.userType = null; // 'teacher' or 'student'
    this.studentName = null;
  }

  connect(serverUrl = API_CONFIG.BASE_URL) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io(serverUrl, {
      transports: ['websocket'],
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to server:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.userType = null;
      this.studentName = null;
    }
  }

  // Teacher methods
  joinAsTeacher() {
    if (this.socket && this.isConnected) {
      this.userType = 'teacher';
      this.socket.emit('join_as_teacher');
      console.log('Joined as teacher');
    }
  }

  createPoll(pollData) {
    if (this.socket && this.isConnected && this.userType === 'teacher') {
      this.socket.emit('create_poll', pollData);
      console.log('Creating poll:', pollData);
    }
  }

  endPollEarly() {
    if (this.socket && this.isConnected && this.userType === 'teacher') {
      this.socket.emit('end_poll_early');
    }
  }

  removeStudent(studentName) {
    if (this.socket && this.isConnected && this.userType === 'teacher') {
      this.socket.emit('remove_student', { studentName });
    }
  }

  // Student methods
  joinAsStudent(name) {
    if (this.socket && this.isConnected) {
      this.userType = 'student';
      this.studentName = name;
      this.socket.emit('join_as_student', { name });
      console.log('Joined as student:', name);
    }
  }

  submitAnswer(answer) {
    if (this.socket && this.isConnected && this.userType === 'student') {
      this.socket.emit('submit_answer', { answer });
      console.log('Submitting answer:', answer);
    }
  }

  // Event listeners
  onNewPollCreated(callback) {
    if (this.socket) {
      this.socket.on('new_poll_created', callback);
    }
  }

  onCurrentPollState(callback) {
    if (this.socket) {
      this.socket.on('current_poll_state', callback);
    }
  }

  onPollResults(callback) {
    if (this.socket) {
      this.socket.on('poll_results', callback);
    }
  }

  onStudentJoined(callback) {
    if (this.socket) {
      this.socket.on('student_joined', callback);
    }
  }

  onStudentLeft(callback) {
    if (this.socket) {
      this.socket.on('student_left', callback);
    }
  }

  onStudentAnswered(callback) {
    if (this.socket) {
      this.socket.on('student_answered', callback);
    }
  }

  onAnswerSubmittedSuccessfully(callback) {
    if (this.socket) {
      this.socket.on('answer_submitted_successfully', callback);
    }
  }

  onAnswerSubmissionError(callback) {
    if (this.socket) {
      this.socket.on('answer_submission_error', callback);
    }
  }

  onPollCreationError(callback) {
    if (this.socket) {
      this.socket.on('poll_creation_error', callback);
    }
  }

  onStudentRemoved(callback) {
    if (this.socket) {
      this.socket.on('student_removed', callback);
    }
  }

  onStudentRemovedSuccess(callback) {
    if (this.socket) {
      this.socket.on('student_removed_success', callback);
    }
  }

  // Remove event listeners
  removeListener(eventName, callback) {
    if (this.socket) {
      this.socket.off(eventName, callback);
    }
  }

  removeAllListeners(eventName) {
    if (this.socket) {
      this.socket.removeAllListeners(eventName);
    }
  }

  // Getters
  getSocket() {
    return this.socket;
  }

  getConnectionStatus() {
    return this.isConnected;
  }

  getUserType() {
    return this.userType;
  }

  getStudentName() {
    return this.studentName;
  }
}

// Create and export a singleton instance
const socketService = new SocketService();
export default socketService;