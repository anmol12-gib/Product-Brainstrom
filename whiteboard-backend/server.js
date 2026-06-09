const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://product-brainstrom.vercel.app",
      "https://product-brainstorm.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

let users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  users[socket.id] = {
    id: socket.id,
    x: 0,
    y: 0,
    color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
  };

  io.emit('users-update', Object.values(users));

  socket.on('cursor-move', (data) => {
    if (users[socket.id]) {
      users[socket.id].x = data.x;
      users[socket.id].y = data.y;
      socket.broadcast.emit('cursor-update', users[socket.id]);
    }
  });

  socket.on('object-add', (newObj) => {
    console.log(`New ${newObj.type} added by ${socket.id}`);
    socket.broadcast.emit('remote-object-add', newObj);
  });

  socket.on('object-update', (data) => {
    socket.broadcast.emit('remote-object-update', data);
  });

  socket.on('object-delete', (id) => {
    socket.broadcast.emit('remote-object-delete', id);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete users[socket.id];
    io.emit('users-update', Object.values(users));
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Collaborative Server running on port ${PORT}`);
});


