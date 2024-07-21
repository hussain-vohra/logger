const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const logger = require("./logger"); // Import the logger

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;

// Serve the webpage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Broadcast function to send logs to all connected clients
const broadcastLogs = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// Listen for new WebSocket connections
wss.on("connection", (ws) => {
  console.log("New client connected");

  // Send the current log file content to the new client
  const logFilePath = path.join(__dirname, "logs/combined.log");
  fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      ws.send("Error reading log file");
    } else {
      ws.send(data);
    }
  });
});

// Watch the log file for changes
const logFilePath = path.join(__dirname, "logs/combined.log");
fs.watchFile(logFilePath, (curr, prev) => {
  fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading log file");
      return;
    }
    broadcastLogs(data);
  });
});

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
