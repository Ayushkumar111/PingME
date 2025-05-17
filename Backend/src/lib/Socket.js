import {Server} from 'socket.io';
import http from 'http';
import express from 'express';


const app = express();

const server = http.createServer(app);

const io = new Server ( server , {
    cors: {
        origin : ['http://localhost:5173'],
        credentials : true,
    }
});

export function getRecieverSocketId(userId){
    return userSocketMap[userId];
}


 // use to store online users 
 const userSocketMap = {};// {user.id = socket id }

io.on("connection" , (socket)=>{
    console.log("A user has been connnected", socket.id)
    // store user id and socket id in map
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // emit online users to all clients


    socket.on("disconnect",()=> {
        console.log("A user has been disconnected", socket.id)
        // remove user id and socket id from map
        delete userSocketMap[userId];
        io.emit("getOnlineUsers" , Object.keys(userSocketMap)); // emit online users to all clients about the client who disconnected
    })
})

export { io , server , app };