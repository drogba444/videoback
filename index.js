const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { PeerServer } = require('peer');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Enable CORS for all origins (use specific domains in production)
app.use(cors("*"));

// Define the API route
app.get("/home", (req, res) => {
  return res.status(200).json({ message: "We are using now" });
});

// Set up HTTP server to work with both Express and Socket.io
const server = http.createServer(app);

// Set up the WebSocket server with Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (change to your frontend URL in production)
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handler
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Handle signaling events (offer, answer, ice-candidate)
//   socket.on('offer', (offer) => {
//     console.log('Offer received:', offer);
//     socket.broadcast.emit('offer', offer);
//   });

//   socket.on('answer', (answer) => {
//     console.log('Answer received:', answer);
//     socket.broadcast.emit('answer', answer);
//   });

//   socket.on('ice-candidate', (candidate) => {
//     console.log('ICE candidate received:', candidate);
//     socket.broadcast.emit('ice-candidate', candidate);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// Set up PeerJS server for peer-to-peer connections
// const peerServer = PeerServer({
//   port: 9000, // PeerJS server port
//   path: '/peerjs' // Path for PeerJS connections
// });

// Log when a PeerJS client connects
// peerServer.on('connection', (client) => {
//   console.log('PeerJS client connected:', client.id);
// });

// Start the server (both HTTP and WebSocket)
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`WebSocket and PeerJS server running at http://localhost:${PORT}`);
});
