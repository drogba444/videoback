const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { PeerServer } = require('peer');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS to allow connections from the frontend
app.use(cors({
  origin: "https://your-frontend-url.com", // Replace with actual frontend URL
  methods: ["GET", "POST"]
}));

// Initialize PeerJS server for peer-to-peer connections
const peerServer = PeerServer({
  path: '/peerjs', // Default path for PeerJS
});

// Log when a PeerJS client connects
peerServer.on('connection', (client) => {
  console.log('PeerJS client connected:', client.id);
});

// Serve the frontend (optional)
app.get('/', (req, res) => {
  res.send("Video call backend is live!");
});

// Socket.io connection handler
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all for now, but you can change this to specific domains
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle signaling events (offer, answer, ice-candidate)
  socket.on('offer', (offer) => {
    console.log('Offer received:', offer);
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    console.log('Answer received:', answer);
    socket.broadcast.emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate) => {
    console.log('ICE candidate received:', candidate);
    socket.broadcast.emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Export server for Vercel
module.exports = (req, res) => {
  server(req, res);
};
