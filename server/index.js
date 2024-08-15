import express from 'express'

import { Server } from 'socket.io';
import {createServer} from 'http';
import cookieParser from 'cookie-parser';


const app = express();



const PORT = 3000;

// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["POST", "GET"],
//   credentials: true
// }));

app.use(express.json());
app.use(cookieParser());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["POST", "GET"],
    credentials: true
  }
});


io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.emit("welcome", `Welcome to the server, ${socket.id}`);
  socket.broadcast.emit("welcome", `${socket.id} joined the server`);

  socket.on("message", ({room, message}) => {
    console.log(room,message)
    socket.to(room).emit("receive-message", message)
  })

  socket.on("join-room", (room) => {
    socket.join(room)
  })

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`)
  })
});

server.listen(PORT, () => {
  console.log(`server connected on port ${PORT}`)
});