const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const { PeerServer } = require('peer');
const cors = require('cors');

const app = express();

app.get("/home", (req, res) => {
  return res.status(200).json({ message: "We are using now" });
});
// Enable CORS to allow connections from frontend
app.use(cors("*"));


// Socket.io setup
// const io = socketIo(server, {
//   cors: {
//     origin: "*", // Your frontend URL
//     methods: ["GET", "POST"]
//   }
// });

// PeerJS server setup
const peerServer = PeerServer({
  port: 9000, // PeerJS server port
  path: '/peerjs' // Path for PeerJS connections
});

// Log when a PeerJS client connects
peerServer.on('connection', (client) => {
  console.log('PeerJS client connected:', client.id);
});
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
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
// Start the WebSocket server
server.listen(4000, () => {
  console.log('WebSocket and PeerJS server running at http://localhost:4000');
});
