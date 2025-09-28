const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"], // Support both Vite ports
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a database)
let currentPoll = null;
let pollHistory = [];
let connectedStudents = new Map(); // studentId -> {name, socketId, hasAnswered, answer}
let connectedTeachers = new Set();
let chatMessages = []; // Array to store chat messages

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.get('/api/poll/current', (req, res) => {
  res.json({ poll: currentPoll });
});

app.get('/api/poll/history', (req, res) => {
  res.json({ history: pollHistory });
});

app.get('/api/chat/messages', (req, res) => {
  res.json({ messages: chatMessages });
});

app.get('/api/participants', (req, res) => {
  const participants = Array.from(connectedStudents.values()).map(student => ({
    name: student.name,
    status: 'online'
  }));
  res.json({ participants });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Teacher joins
  socket.on('join_as_teacher', () => {
    connectedTeachers.add(socket.id);
    socket.join('teachers');
    console.log('Teacher joined:', socket.id);

    // Send current poll state to the new teacher
    socket.emit('current_poll_state', {
      poll: currentPoll,
      students: Array.from(connectedStudents.values()).map(s => ({
        name: s.name,
        hasAnswered: s.hasAnswered
      }))
    });
  });

  // Student joins with name - FIXED FOR MULTIPLE STUDENTS
  socket.on('join_as_student', (data) => {
    const { name } = data;
    const studentId = uuidv4();

    // Check if student with same name already exists (handle reconnections)
    const existingStudent = Array.from(connectedStudents.values())
      .find(student => student.name.toLowerCase() === name.toLowerCase());

    if (existingStudent) {
      // Remove old connection to prevent duplicates
      connectedStudents.delete(existingStudent.id);
      console.log('Removed duplicate student connection:', existingStudent.name);
    }

    connectedStudents.set(studentId, {
      id: studentId,
      name,
      socketId: socket.id,
      hasAnswered: currentPoll && currentPoll.isActive ? false : true, // If no active poll, mark as answered
      answer: null
    });

    socket.studentId = studentId;
    socket.join('students');
    console.log('Student joined:', name, studentId, 'Total students:', connectedStudents.size);
    console.log('Student added to students room. Socket ID:', socket.id);

    // Notify teachers about new student
    io.to('teachers').emit('student_joined', {
      name,
      totalStudents: connectedStudents.size
    });

    // Send current poll state to the new student (only if poll is active)
    socket.emit('current_poll_state', {
      poll: currentPoll && currentPoll.isActive ? currentPoll : null,
      canAnswer: currentPoll && currentPoll.isActive && !connectedStudents.get(studentId)?.hasAnswered
    });
  });

  // Teacher creates a new poll - FIXED FOR EARLY STUDENT JOINS
  socket.on('create_poll', (pollData) => {
    const { question, options, timer, correctAnswer } = pollData;

    // Check if teacher can create a new poll
    // FIXED: Only block if there's an active poll with students who haven't answered
    const allStudentsAnswered = Array.from(connectedStudents.values())
      .every(student => student.hasAnswered);

    if (currentPoll && currentPoll.isActive && connectedStudents.size > 0 && !allStudentsAnswered) {
      const answeredCount = Array.from(connectedStudents.values()).filter(s => s.hasAnswered).length;
      socket.emit('poll_creation_error', {
        message: `Cannot create new poll. ${answeredCount}/${connectedStudents.size} students have answered the current question. Wait for all students to answer or for the timer to expire.`
      });
      return;
    }

    // Save previous poll to history if exists - FIXED FOR POLL HISTORY
    if (currentPoll) {
      const results = calculatePollResults();
      pollHistory.push({
        ...currentPoll,
        results,
        completedAt: new Date().toISOString()
      });
      console.log('Poll saved to history:', currentPoll.question);
    }

    // Create new poll
    currentPoll = {
      id: uuidv4(),
      question,
      options,
      timer: parseInt(timer.split(' ')[0]), // Extract number from "60 seconds"
      correctAnswer,
      createdAt: new Date().toISOString(),
      isActive: true,
      startTime: Date.now()
    };

    // Reset all students' answer status
    connectedStudents.forEach(student => {
      student.hasAnswered = false;
      student.answer = null;
    });

    console.log('New poll created:', currentPoll);

    // Broadcast new poll to all clients
    console.log('Broadcasting new poll to all clients:', currentPoll.question);
    console.log('Connected students:', connectedStudents.size);
    console.log('Connected teachers:', connectedTeachers.size);

    // Broadcast to everyone
    io.emit('new_poll_created', currentPoll);

    // Also broadcast specifically to students room for redundancy
    io.to('students').emit('new_poll_created', currentPoll);

    console.log('Poll broadcast completed');

    // Start timer for the poll - FIXED TIMER LOGIC
    const pollId = currentPoll.id;
    setTimeout(() => {
      if (currentPoll && currentPoll.id === pollId && currentPoll.isActive) {
        finalizePoll();
      }
    }, currentPoll.timer * 1000);
  });

  // Student submits answer
  socket.on('submit_answer', (data) => {
    const { answer } = data;
    const studentId = socket.studentId;

    if (!currentPoll || !studentId || !connectedStudents.has(studentId)) {
      socket.emit('answer_submission_error', {
        message: 'Invalid submission'
      });
      return;
    }

    const student = connectedStudents.get(studentId);
    if (student.hasAnswered) {
      socket.emit('answer_submission_error', {
        message: 'You have already answered this question'
      });
      return;
    }

    // Update student's answer
    student.hasAnswered = true;
    student.answer = answer;

    console.log(`Student ${student.name} answered:`, answer);

    // Notify student of successful submission
    socket.emit('answer_submitted_successfully');

    // Notify teachers about the answer
    io.to('teachers').emit('student_answered', {
      studentName: student.name,
      totalAnswered: Array.from(connectedStudents.values()).filter(s => s.hasAnswered).length,
      totalStudents: connectedStudents.size
    });

    // Check if all students have answered
    const allStudentsAnswered = Array.from(connectedStudents.values())
      .every(s => s.hasAnswered);

    if (allStudentsAnswered) {
      finalizePoll();
    }
  });

  // Teacher requests to end poll early
  socket.on('end_poll_early', () => {
    if (connectedTeachers.has(socket.id) && currentPoll) {
      finalizePoll();
    }
  });

  // Teacher removes a student
  socket.on('remove_student', (data) => {
    const { studentName } = data;

    if (!connectedTeachers.has(socket.id)) {
      return;
    }

    // Find and remove student
    let studentToRemove = null;
    for (let [id, student] of connectedStudents) {
      if (student.name === studentName) {
        studentToRemove = student;
        connectedStudents.delete(id);
        break;
      }
    }

    if (studentToRemove) {
      // Notify the student they've been removed
      io.to(studentToRemove.socketId).emit('student_removed');

      // Notify teachers
      io.to('teachers').emit('student_removed_success', {
        studentName,
        totalStudents: connectedStudents.size
      });

      console.log('Student removed:', studentName);
    }
  });

  // Chat message handling
  socket.on('send_chat_message', (data) => {
    const { message } = data;

    // Determine sender info
    let senderName = 'Unknown';
    let senderType = 'unknown';

    if (connectedTeachers.has(socket.id)) {
      senderName = 'Teacher';
      senderType = 'teacher';
    } else {
      // Find student name
      for (let student of connectedStudents.values()) {
        if (student.socketId === socket.id) {
          senderName = student.name;
          senderType = 'student';
          break;
        }
      }
    }

    const chatMessage = {
      id: Date.now(),
      message: message.trim(),
      senderName,
      senderType,
      timestamp: new Date().toISOString()
    };

    // Add to chat history
    chatMessages.push(chatMessage);

    // Keep only last 50 messages
    if (chatMessages.length > 50) {
      chatMessages = chatMessages.slice(-50);
    }

    // Broadcast to all connected clients
    io.emit('new_chat_message', chatMessage);

    console.log('Chat message from', senderName + ':', message);
  });

  // Handle disconnection - IMPROVED CLEANUP
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    // Remove from teachers
    if (connectedTeachers.has(socket.id)) {
      connectedTeachers.delete(socket.id);
    }

    // Remove from students
    const studentId = socket.studentId;
    if (studentId && connectedStudents.has(studentId)) {
      const student = connectedStudents.get(studentId);
      connectedStudents.delete(studentId);

      // Notify teachers about student leaving
      io.to('teachers').emit('student_left', {
        studentName: student.name,
        totalStudents: connectedStudents.size
      });
    }

    // Clean up orphaned students (students whose socket disconnected)
    for (let [id, student] of connectedStudents) {
      const studentSocket = io.sockets.sockets.get(student.socketId);
      if (!studentSocket) {
        connectedStudents.delete(id);
        console.log('Cleaned up orphaned student:', student.name);
      }
    }
  });
});

// Helper function to calculate poll results
function calculatePollResults() {
  if (!currentPoll) return null;

  const results = {};
  currentPoll.options.forEach(option => {
    results[option] = 0;
  });

  connectedStudents.forEach(student => {
    if (student.hasAnswered && student.answer) {
      results[student.answer] = (results[student.answer] || 0) + 1;
    }
  });

  return {
    options: results,
    totalResponses: Array.from(connectedStudents.values()).filter(s => s.hasAnswered).length,
    totalStudents: connectedStudents.size
  };
}

// Helper function to finalize poll
function finalizePoll() {
  if (!currentPoll) return;

  currentPoll.isActive = false;
  const results = calculatePollResults();

  console.log('Poll finalized:', currentPoll.question, results);

  // Save to history when finalizing
  if (!pollHistory.find(p => p.id === currentPoll.id)) {
    pollHistory.push({
      ...currentPoll,
      results,
      completedAt: new Date().toISOString()
    });
    console.log('Poll saved to history on finalize:', currentPoll.question);
  }

}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io server ready for connections`);
});