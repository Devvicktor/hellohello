const http = require("http");
const path=require('path')
const express =require('express')
const formatMessage=require('./utils/messages')
const {userJoin,getCurrentUser,userLeave,
  getRoomUsers }=require('./utils/users')
const socketio=require('socket.io')
const app=express()

const port = process.env.PORT || 3001;
const webServer=http.createServer(app)
  //server files
app.use(express.static(path.join(__dirname,'public')))

webServer.listen(port, function () {
  console.log("Server is listening on port *:3001");
});
//initialize socket io
const io= socketio(webServer)

const botName='Zetialpha Bot'
io.on("connection", (socket) => {
  socket.on('joinRoom',({username,room})=>{
    const user=userJoin(socket.id,username,room)
    socket.join(user.room)
    //welcome urrent user
      socket.emit('message',formatMessage(botName,'welcome to Zetialpha!'))
      //broadcast when a user connects
     socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username}has joined chat` ))
  io.to(user.room).emit('roomUsers',{
    room:user.room,
    users:getRoomUsers(user.room)
  })
    })

    socket.on("usertyping", (msg) => {
    socket.broadcast.emit('usertyping',msg)
  });
  //listen to chat message
  socket.on("chatMessage", (msg) => {
    const user=getCurrentUser(socket.id)
      io.to(user.room).emit("message", formatMessage(user.username,msg) );
    });

//when a user disconects
  socket.on('disconnect',()=>{
    const user=userLeave(socket.id)
    if(user){
      io.to(user.room).emit('message',formatMessage(botName,`${user.username}has left the chat`))
      io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
      })
    }

  })

});
