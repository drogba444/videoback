const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { PeerServer } = require('peer');
const cors = require('cors');
const fs = require('fs'); // For SSL certificate, only if you're using https

// Initialize the Express app
const app = express();

// Enable CORS for all origins (use specific domains in production)
app.use(cors("*"));

// Define the API route (Test Route)
app.get("/home", (req, res) => {
  return res.status(200).json({ message: "We are using now" });
});

// Set up HTTP server to work with both Express and Socket.io
const server = http.createServer(app);

// Set up the WebSocket server with Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins, adjust for production
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handler
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

// Start the server (both HTTP and WebSocket)
const PORT = process.env.PORT || 4000; // Use environment variable for the port if available
server.listen(PORT, () => {
  console.log(`WebSocket server running at http://localhost:${PORT}`);
});

// Initialize PeerJS server for peer-to-peer connections
const peerServer = PeerServer({ 
  path: '/peerjs',  // Path should be '/peerjs' to match frontend path
  port: 4000, // Same port as Express server
  secure: true,  // Enable secure connection for production (make sure your server supports https)
  // Uncomment the lines below if you're using SSL certificates for https
  // ssl: {
  //   key: fs.readFileSync('path/to/private-key.pem'),
  //   cert: fs.readFileSync('path/to/certificate.pem'),
  // }
});

// Log when a PeerJS client connects
peerServer.on('connection', (client) => {
  console.log('PeerJS client connected:', client.id);
});

// Serve the frontend (optional)
app.get('/api', (req, res) => {
  res.send("Video call backend is live!");
});
