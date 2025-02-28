const express = require('express');
const router = express.Router();
const { Server } = require('socket.io');

function initializeChat(server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('user message', (data) => {
            io.to('support').emit('support message', data);
        });

        socket.on('support message', (data) => {
            io.to(data.userId).emit('user message', data);
        });

        socket.on('join support', () => {
            socket.join('support');
        });

        socket.on('join user', (userId) => {
            socket.join(userId);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}

module.exports = { initializeChat, router };