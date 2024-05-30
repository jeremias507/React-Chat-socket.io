import express from 'express'
import morgan from 'morgan'
import cors from 'cors' 
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app) 
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(`Usuario actual: ${socket.id}`)

    
    socket.on("join_room",(data)=>{
        socket.join(data)
        console.log(`Usuario con id: ${socket.id} se unio a la sala: ${data}`)

    })

    socket.on("send_message",(data)=>{
        socket.to(data.room).emit("receive_message",data)
    })

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id)
    })
})

app.use(express.json())
app.use(morgan('dev'))
app.use(cors({
    // origin: 'http://localhost:5173',
    // credentials: true
}))

httpServer.listen(3000, () => { 
    console.log("server on port", 3000)
})