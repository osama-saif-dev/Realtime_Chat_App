import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['https://realtime-chat-app-client-eosin.vercel.app']
    }
});

const userSocketMap = {};


export default function getRecieverSocketId (userId) {
    return userSocketMap[userId];
}

// connection 
io.on('connection', (socket) => {
    console.log('A user conneted ' + socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;
    
    // Online Users
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // Event Typing 
    // socket.on('typing', ({ recieverId, isTyping }) => {
    //     console.log('Event Typing');
    //     const recieverSocketId = getRecieverSocketId(recieverId);
    //     if (recieverSocketId){
    //         socket.to(recieverId).emit('userTyping', {
    //             userId,
    //             isTyping
    //         })
    //     }
    // });
    
    // Disconneted
    socket.on('disconnect', () => {
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
        console.log(`A user disconnect ${socket.id}`);
    })
});

export { io, app, server } 