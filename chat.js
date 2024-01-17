const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/custom_chat.html'); // Change the filename to make it unique
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('user connected', (userName) => {
        io.emit('chat message', { name: 'Server', message: `${userName} has joined the conversation` });
    });

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is up and running at http://localhost:3000');
});
