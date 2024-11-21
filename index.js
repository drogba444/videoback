const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { PeerServer } = require('peer');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Enable CORS
app.use(cors());

// Test API Route
app.get('/home', (req, res) => {
  res.status(200).json({ message: 'Server is live!' });
});

// Set up the HTTP server
const server = http.createServer(app);

// Set up the WebSocket server with Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with your frontend's URL in production
    methods: ['GET', 'POST'],
  },
});

// Store active peer IDs
const activePeers = new Set();

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Register a peer ID
  socket.on('register-peer', (peerId) => {
    activePeers.add(peerId);
    console.log('Registered peer ID:', peerId);
  });

  // Forward signaling messages to the target peer
  socket.on('offer', (data) => {
    socket.broadcast.emit('offer', data);
  });

  socket.on('answer', (data) => {
    socket.broadcast.emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
    socket.broadcast.emit('ice-candidate', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    activePeers.delete(socket.id);
  });
});

// Start the HTTP and WebSocket server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Initialize the PeerJS server
const peerServer = PeerServer({
  port: 9000, // Adjust if needed
  path: '/peerjs',
});

// Handle PeerJS client connections
peerServer.on('connection', (client) => {
  console.log('PeerJS client connected:', client.id);
});

peerServer.on('disconnect', (client) => {
  console.log('PeerJS client disconnected:', client.id);
});
