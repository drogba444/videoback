const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { PeerServer } = require('peer'); // PeerJS for managing peer-to-peer connections
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Enable CORS for your frontend's URL
app.use(cors({
  origin: '*', // You can set the exact frontend URL here if required
}));

// Initialize PeerServer to generate unique peer IDs and handle connections
const peerServer = PeerServer({
  path: '/peerjs', // Path for PeerJS connections
});

// Log when a PeerJS client connects
peerServer.on('connection', (client) => {
  console.log('PeerJS client connected: ', client.id); // Unique Peer ID
});

// Serve basic API response
app.get('/', (req, res) => {
  res.send("hi we are live");
});

// Handle socket connections for video call signaling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for incoming offers, answers, and ICE candidates from frontend
  socket.on('offer', (offer) => {
    console.log('Offer received:', offer);
    socket.broadcast.emit('offer', offer); // Send offer to other user
  });

  socket.on('answer', (answer) => {
    console.log('Answer received:', answer);
    socket.broadcast.emit('answer', answer); // Send answer to other user
  });

  socket.on('ice-candidate', (candidate) => {
    console.log('ICE candidate received:', candidate);
    socket.broadcast.emit('ice-candidate', candidate); // Relay ICE candidate to other user
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Export the function to Vercel as a serverless function
module.exports = (req, res) => {
  app(req, res); // Vercel-compatible function that calls Express
};
