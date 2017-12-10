const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);
const PORT = process.env.PORT || 5000;
const {generateMessage,sendMessage,sendLocation}  = require('./util');
const {userHelper}  = require('./user');
const {sendVertificationEmail} = require('./email');


const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath))

io.on('connection', socket => {
  var room;
  var finalUser;


  socket.on('verifyEmail',email => {
    const code = Math.floor(Math.random() * 10000);
    sendVertificationEmail(email.email,code);
    socket.emit('codeNumber',{code})
  })

  socket.on('newUser', (user,callback) => {
    userHelper.getUserList(user.room).then(value => {
      //check userName
      if(value.some(userName => userName === user.user)){
        console.log('valid is trigger')
        callback('Username is taken')
      }
      else{
        callback({
          status:true
        })
        //new user join a particular chatRoom
        socket.join(user.room);
        userHelper.addUser(socket.id,user.user,user.room)
        userHelper.getUserList(user.room).then(value => io.to(user.room).emit('updateUserList',value))
        .then(() =>  socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app')))
        .then(() => socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin',`${user.user} joined`)))
        .then(() => {
          room = user.room
          finalUser = user.user;
        })
      }
    })
  })

  socket.on('createMessage', (text,callback) => {
    callback({
      status:true
    })
    io.to(text.room).emit('newMessage', sendMessage(text.from,text.text, text.cretedAt));
  })

  socket.on('shareLocation', (location) => {
    io.to(location.room).emit('newLocation', sendLocation(location.user,location.url))
  })


  socket.on('disconnect',() => {
    userHelper.removeUser(socket.id)
    .then(() =>   userHelper.getUserList(room).then(value => io.to(room).emit('updateUserList',value)))
    .then(() => io.to(room).emit('newMessage',generateMessage('Admin', `${finalUser} has left`)))
  })
})




server.listen(PORT, () => {
  console.log('server is up')
})
