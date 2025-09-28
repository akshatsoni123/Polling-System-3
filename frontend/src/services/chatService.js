import socketService from './socketService';

class ChatService {
  constructor() {
    this.messages = [];
    this.participants = [];
    this.listeners = new Set();
    this.isInitialized = false;
  }

  // Initialize chat functionality
  initialize() {
    if (this.isInitialized) return; // Prevent multiple initializations

    const socket = socketService.getSocket();
    if (!socket) return;

    // Listen for new chat messages
    socket.on('new_chat_message', (message) => {
      this.messages.push(message);
      this.notifyListeners();
    });

    // Listen for participant changes
    socket.on('student_joined', () => {
      this.fetchParticipants();
    });

    socket.on('student_left', () => {
      this.fetchParticipants();
    });

    socket.on('student_removed_success', () => {
      this.fetchParticipants();
    });

    this.isInitialized = true;

    // Fetch initial chat history
    this.fetchChatHistory();
    this.fetchParticipants();
  }

  // Fetch chat history from backend
  async fetchChatHistory() {
    try {
      const response = await fetch('http://localhost:3001/api/chat/messages');
      const data = await response.json();
      this.messages = data.messages || [];
      this.notifyListeners();
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  }

  // Fetch participants list
  async fetchParticipants() {
    try {
      const response = await fetch('http://localhost:3001/api/participants');
      const data = await response.json();
      this.participants = data.participants || [];
      this.notifyListeners();
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  }

  // Send a chat message
  sendMessage(message) {
    const socket = socketService.getSocket();
    if (!socket || !message.trim()) return;

    socket.emit('send_chat_message', { message: message.trim() });
  }

  // Get current messages
  getMessages() {
    return this.messages;
  }

  // Get current participants
  getParticipants() {
    return this.participants;
  }

  // Add listener for chat updates
  addListener(callback) {
    this.listeners.add(callback);
  }

  // Remove listener
  removeListener(callback) {
    this.listeners.delete(callback);
  }

  // Notify all listeners of updates
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback({
          messages: this.messages,
          participants: this.participants
        });
      } catch (error) {
        console.error('Error notifying chat listener:', error);
      }
    });
  }

  // Clean up
  cleanup() {
    const socket = socketService.getSocket();
    if (socket) {
      socket.off('new_chat_message');
      socket.off('student_joined');
      socket.off('student_left');
      socket.off('student_removed_success');
    }
    this.listeners.clear();
    this.isInitialized = false;
  }
}

// Create and export singleton instance
const chatService = new ChatService();
export default chatService;