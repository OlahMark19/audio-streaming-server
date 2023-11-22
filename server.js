const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket)=>{
    console.log('A user connected');

    socket.on('disconnect', ()=>{
        console.log('User disconnected');
    });

    socket.on('audio', (data)=> {
        io.emit('audio', data);
    });
});
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})