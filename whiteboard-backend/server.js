const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Aapka frontend URL
        methods: ["GET", "POST"]
    }
});

let users = {}; // Connected users ka data store karne ke liye

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // 1. Initial User Setup
    users[socket.id] = {
        id: socket.id,
        x: 0,
        y: 0,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };

    // Sabhi clients ko updated users list bhejein
    io.emit('users-update', Object.values(users));

    // 2. Cursor Movements
    socket.on('cursor-move', (data) => {
        if (users[socket.id]) {
            users[socket.id].x = data.x;
            users[socket.id].y = data.y;
            // Baki sabko cursor position broadcast karein
            socket.broadcast.emit('cursor-update', users[socket.id]);
        }
    });

    // 3. OBJECT ADDITION (Missing listener jo ab add kiya hai)
    socket.on('object-add', (newObj) => {
        console.log(`New ${newObj.type} added by ${socket.id}`);
        // Relay to other clients
        socket.broadcast.emit('remote-object-add', newObj);
    });

    // 4. OBJECT UPDATES (Dragging, Resizing, Text changes)
    socket.on('object-update', (data) => {
        // data mein { id, updates } hona chahiye
        socket.broadcast.emit('remote-object-update', data);
    });

    // 5. OBJECT DELETION
    socket.on('object-delete', (id) => {
        socket.broadcast.emit('remote-object-delete', id);
    });

    // 6. Handle Disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete users[socket.id];
        io.emit('users-update', Object.values(users));
    });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`🚀 Collaborative Server running on port ${PORT}`);
});