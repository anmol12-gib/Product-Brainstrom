const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: {
            "http://localhost:5173",
      "https://product-brainstrom.vercel.app",  
      "https://*.vercel.app"
        }, 
        methods: ["GET", "POST"]
    }
});

let users = {}; 

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    
    users[socket.id] = {
        id: socket.id,
        x: 0,
        y: 0,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };

    
    io.emit('users-update', Object.values(users));


    socket.on('cursor-move', (data) => {
        if (users[socket.id]) {
            users[socket.id].x = data.x;
            users[socket.id].y = data.y;
            
            socket.broadcast.emit('cursor-update', users[socket.id]);
        }
    });

<<<<<<< HEAD
    // 3. OBJECT ADDITION
=======
    // 3. OBJECT ADDITION 
>>>>>>> e149a24 (add html2canvas)
    socket.on('object-add', (newObj) => {
        console.log(`New ${newObj.type} added by ${socket.id}`);
        
        socket.broadcast.emit('remote-object-add', newObj);
    });

    // 4. OBJECT UPDATES (Dragging, Resizing, Text changes)
    socket.on('object-update', (data) => {
        // data mein { id, updates } 
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
<<<<<<< HEAD
    console.log(`🚀 Collaborative Server running on port ${PORT}`);
});
=======
    console.log(`Collaborative Server running on port ${PORT}`);
});
>>>>>>> e149a24 (add html2canvas)
