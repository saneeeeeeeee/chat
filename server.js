const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.send('hello');
});

app.get('/data', (req, res) => {
    const jsonResponse = { greeting: 'hello', values: [4, 5, 6] };
    res.json(jsonResponse);
});

app.get('/feedback', (req, res) => {
    const input = req.query.input || '';
    
    const normalResponse = { type: 'normal', content: input };

    const emphaticResponse = { type: 'emphatic', content: input.toUpperCase() };

    const characterCount = { type: 'character count', count: input.length };

    const reversedResponse = { type: 'reversed', content: input.split('').reverse().join('') };

    res.json({ normalResponse, emphaticResponse, characterCount, reversedResponse });
});

app.get('/realtime', (req, res) => {
    res.sendFile(__dirname + '/chat.html'); 
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('user connected', (userName) => {
        io.emit('chat message', { name: 'Server', message: `${userName} has entered the conversation` });
    });

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}`);
});
