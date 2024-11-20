// api/index.js (Vercel Serverless Function)
const express = require('express');
const app = express();

app.get('/api', (req, res) => {
    res.json({ message: 'Hello, Vercel!' });
});

module.exports = app;
