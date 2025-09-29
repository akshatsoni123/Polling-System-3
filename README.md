# 🗳️ Intervue Poll - Live Polling System

A real-time polling system built with React and Node.js that enables teachers to create interactive polls and students to participate in live voting sessions.

## ✨ Features

### 👨‍🏫 Teacher Features
- **Poll Creation**: Create multiple-choice polls with custom questions and options
- **Timer Control**: Set countdown timers for polls (customizable duration)
- **Live Results**: View real-time poll results as students submit answers
- **Student Management**: Monitor connected students and remove participants if needed
- **Poll History**: Access previous polls and their results
- **Early Poll Termination**: End polls before timer expires

### 👨‍🎓 Student Features
- **Easy Joining**: Join sessions with just a name
- **Real-time Participation**: Submit answers during active polls
- **Live Results**: View poll results immediately after submission
- **Automatic Navigation**: Seamless transition between waiting rooms and active polls
- **Chat Functionality**: Communicate with other participants

### 🔄 Real-time Features
- **WebSocket Integration**: Instant updates using Socket.IO
- **Live Vote Tracking**: Real-time vote counting and percentage display
- **Automatic Poll Management**: Smart poll lifecycle management
- **Connection Status**: Real-time connection monitoring

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **React Router DOM** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Vite** - Fast build tool and development server
- **CSS3** - Custom styling with modern design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/polling-system-3.git
   cd polling-system-3
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   # or for development with auto-reload
   npm run dev
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

## 📱 Usage Guide

### For Teachers
1. Open the application and select "I'm a Teacher"
2. Create a new poll with your question and multiple-choice options
3. Set a timer duration for the poll
4. Watch as students join and submit their answers in real-time
5. View live results and manage participants
6. Access poll history to review previous sessions

### For Students
1. Open the application and select "I'm a Student"
2. Enter your name to join the session
3. Wait for the teacher to start a poll
4. Submit your answer before the timer expires
5. View real-time results after submission
6. Participate in chat discussions

## 🏗️ Project Structure

```
polling-system-3/
├── backend/
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   └── node_modules/          # Backend packages
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── PollCreation.jsx
│   │   │   ├── LivePolling.jsx
│   │   │   ├── StudentOnboarding.jsx
│   │   │   ├── StudentPollParticipation.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── PollContext.jsx # Global state management
│   │   ├── services/
│   │   │   ├── socketService.js
│   │   │   └── chatService.js
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # App entry point
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
└── README.md                  # Project documentation
```

## 🔧 API Endpoints

### REST API
- `GET /api/health` - Server health check
- `GET /api/poll/current` - Get current active poll
- `GET /api/poll/history` - Get poll history
- `GET /api/chat/messages` - Get chat messages
- `GET /api/participants` - Get connected participants

### WebSocket Events
- `join_as_teacher` - Teacher joins session
- `join_as_student` - Student joins with name
- `create_poll` - Create new poll
- `submit_answer` - Submit poll answer
- `send_chat_message` - Send chat message
- `remove_student` - Remove student from session

## 🎨 Features in Detail

### Real-time Synchronization
- Automatic poll state synchronization across all connected clients
- Live vote counting with percentage calculations
- Instant notification of new participants joining/leaving

### Smart Poll Management
- Automatic poll timer management
- Prevention of duplicate submissions
- Graceful handling of late-joining students
- Automatic poll finalization when all students answer

### User Experience
- Clean, modern UI with blue color scheme
- Responsive design for various screen sizes
- Intuitive navigation between different states
- Real-time feedback and status updates

## 🚀 Deployment

The application is configured for deployment on platforms like Render, Heroku, or similar services.

### Backend Deployment
The backend includes a build script for deployment platforms:
```bash
npm run build  # No build step required for backend
```

### Frontend Deployment
Build the frontend for production:
```bash
npm run build  # Creates optimized production build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Known Issues & Future Enhancements

### Current Limitations
- In-memory storage (consider database integration for production)
- Limited to 50 chat messages in history
- No user authentication system

### Planned Features
- User authentication and persistent sessions
- Database integration for poll history
- Advanced poll types (ranking, multiple select)
- Analytics and reporting features
- Mobile app version

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

**Built with ❤️ using React and Node.js**
