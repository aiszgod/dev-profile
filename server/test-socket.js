// server/test-socket.js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);
const PORT = 5001; // Different port to avoid conflicts

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Simple test endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Socket.IO Test Server Running',
    port: PORT,
    activeConnections: io.engine.clientsCount
  });
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  
  // Send welcome message
  socket.emit('welcome', {
    message: 'Connected to Socket.IO test server!',
    socketId: socket.id,
    timestamp: new Date().toISOString()
  });

  // Test: Join room
  socket.on('join-test-room', ({ username }) => {
    const roomId = 'test-room-123';
    socket.join(roomId);
    
    console.log(`👤 ${username} joined ${roomId}`);
    
    // Notify room
    io.to(roomId).emit('user-joined', {
      username,
      message: `${username} joined the room`,
      timestamp: new Date().toISOString()
    });
    
    // Send existing messages
    socket.emit('load-messages', [
      {
        sender: 'System',
        message: 'Welcome to the test chat room!',
        timestamp: new Date().toISOString()
      }
    ]);
  });

  // Test: Send message
  socket.on('send-test-message', ({ roomId, message, username }) => {
    console.log(`💬 ${username} in ${roomId}: ${message}`);
    
    const messageData = {
      sender: username,
      message,
      timestamp: new Date().toISOString()
    };
    
    // Broadcast to room
    io.to(roomId).emit('receive-message', messageData);
  });

  // Test: Typing indicator
  socket.on('typing', ({ roomId, username }) => {
    socket.to(roomId).emit('user-typing', { username });
  });

  socket.on('stop-typing', ({ roomId }) => {
    socket.to(roomId).emit('user-stop-typing');
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.clear();
  console.log('='.repeat(60));
  console.log(`🧪 Socket.IO Test Server`);
  console.log(`🚀 Running on: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log(`📝 Test page: http://localhost:5173/socket-test`);
  console.log('='.repeat(60));
});