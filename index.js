const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { PeerServer } = require('peer'); // PeerJS for managing peer-to-peer connections
const cors = require('cors'); 
const app = express();
const server = http.createServer(app);
const io = socketIo(server);


https://videoback-beta.vercel.app/?vercelToolbarCode=fwXPAO4QDQ6iWKB/


// Enable CORS for your frontend's URL
app.use(cors({
  origin: '*', // Frontend URL via LocalTunnel or Ngrok
  // methods: ['GET', 'POST'],
  // allowedHeaders: ['Content-Type', 'Authorization']
}));


// Initialize PeerServer to generate unique peer IDs and handle connections
const peerServer = PeerServer({
  port: 9000, // Port for PeerJS server
  path: '/peerjs', // Path for PeerJS connections
});

// Log when a PeerJS client connects
peerServer.on('connection', (client) => {
  console.log('PeerJS client connected: ', client.id); // Unique Peer ID
});

// Serve the frontend HTML (optional, you can serve your React app from here too)
app.get('/', (req, res) => {
  res.send("hi we aare on live")
  // res.sendFile(__dirname + '/index.html');
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

// Start the server on port 4000
server.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
