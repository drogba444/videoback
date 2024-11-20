const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors('*'));

// Define the API route
app.get('/home', (req, res) => {
  return res.status(200).json({ message: 'We are using now' });
});

// Set up HTTP server
const server = http.createServer(app);

// Set up WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('A user connected');

  ws.on('message', (message) => {
    console.log('Received message:', message);
    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('User disconnected');
  });
});

// Start the server (both HTTP and WebSocket)
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`WebSocket server running at http://localhost:${PORT}`);
});
