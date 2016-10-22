const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require('socket.io');

const {generateMessage,
    generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require("./utils/users");

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket) => {
    console.log('new connection');

    socket
        .on('join', (params, callback) => {
            if (!isRealString(params.name) || !isRealString(params.room)) {
                return callback('Name and room name are required');
            }
            socket.name=params.name;
            console.log('socket.name',socket.name);
            
            socket
                .join(params.room, () => {
                    users.removeUser(socket.id);
                    users.addUser(socket.id, params.name, params.room);
                    io
                        .to(params.room)
                        .emit('updateUserList', users.getUserList(params.room));
                })
                .emit(
                    'newMessage',
                    generateMessage('Admin','Welcome To The App')
                )
                .broadcast
                .to(params.room)
                .emit(
                    'newMessage',
                    generateMessage('Admin', `${params.name} has joined`)
                )

            callback();
        })
        .on('createMessage', (newMsg, ack) => {
            var user = users.getUser(socket.id);
            if (user && isRealString(newMsg.text)) {
                io.to(user.room).emit(
                    'newMessage',
                    generateMessage(user.name, newMsg.text)
                );
            }
            ack();
        })
        .on('createLocationMessage', (coords) => {
            var user = users.getUser(socket.id);
            if (user) {
                io.to(user.room).emit(
                    'newLocationMessage',
                    generateLocationMessage(user.name, coords)
                )
            }
        })
        .on('disconnect', () => {
            var user = users.removeUser(socket.id);
            if (user) {
                io
                    .to(user.room)
                    .emit('updateUserList', users.getUserList(user.room))
                    .emit(
                        'newMessage',
                        generateMessage('Admin', `${user.name} has left`)
                    );
            }
            console.log('user disconnected from server');
        })

})


server.listen(port, ()=>{
    console.log('running on port ' + port);
})

