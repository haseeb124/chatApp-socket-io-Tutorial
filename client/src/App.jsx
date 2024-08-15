import React, { useEffect, useMemo, useState } from 'react'
import {io} from 'socket.io-client'
import {Container, TextField, Typography, Button, Box, Stack} from '@mui/material'

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("")
  const [socketId, setSocketId] = useState("")
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  console.log(messages)
  
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {message , room})
    setMessage("");

  }

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id)
      console.log("connected", socket.id)
    });
    socket.on("welcome", (data) => {
      console.log(data)
    });

    socket.on("receive-message", (data) => {
      console.log(data)
      setMessages((messages) => [...messages, data])
    });

    

    return () => {
      socket.disconnect();
    }

  }, [])

  return (
    <Container maxWidth="sm">
    <Box sx={{height: 200}}/>
    <Typography variant="h6" component="div">
  {socket.id}
</Typography>

    <form onSubmit={handleJoinRoom}>
    <TextField value={roomName} onChange={(e) => setRoomName(e.target.value)} id="outlined-basic" label="Room Name" variant="outlined" />
    <Button type='submit'  variant="contained">Join</Button>

    </form>

    <form onSubmit={handleSubmit}>
    <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="message" variant="outlined" />
    <TextField value={room} onChange={(e) => setRoom(e.target.value)} id="outlined-basic" label="room" variant="outlined" />

    <Button type='submit'  variant="contained">Send</Button>
    </form>
   <Stack>
    {
      messages.map((m, i) => (
        
        <Typography key={i} variant='h6' component='div' gutterBottom>
            {m}
        </Typography>
      ))
    }
   </Stack>


    </Container>

  )
}

export default App