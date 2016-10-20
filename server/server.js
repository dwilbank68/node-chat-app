const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
// const hbs = require("hbs");
// hbs.registerPartials(__dirname + '/views/partials');
// app.set('view engine', 'hbs');

// app.use((req, res, next)=> {
//     res.render('maintenance.hbs');
// })
app.use(express.static(publicPath));

io.on('connection',(socket) => {
    console.log('new connection');

    socket
        .emit(
            'newMessage',
            generateMessage('Admin','Welcome To The App')
        )
        .broadcast.emit(
            'newMessage',
            generateMessage('Admin', 'New User Joined The Chat')
        )

    socket
        .on('disconnect', () => {
            console.log('user disconnected from server');
        })
        .on('createMessage', (newMsg, ack) => {
            console.log('createMessage', newMsg);
            io.emit(
                'newMessage',
                generateMessage(newMsg.from, newMsg.text)
            );
            ack('this is from server');
        })


})

// const fs = require("fs");
// app.use((req, res, next)=> {
//     var now = new Date().toString();
//     var log = `${now}: ${req.method} ${req.url}`;
//     console.log(log);
//     fs.appendFile('server.log', log +'\n');
//     next();
// })
//
//
// hbs.registerHelper('getCurrentYear', ()=>{
//     return new Date().getFullYear();
// });
//
// hbs.registerHelper('upperCase', (text)=>{
//     return text.toUpperCase();
// });

// app.get('/',(req,res)=>{
//     res.render('home.hbs', {
//         pageTitle: 'Home Page',
//         welcomeMessage: 'Welcome to'
//     });
// })
//
// app.get('/about', (req, res)=> {
//     res.render('about.hbs', {
//         pageTitle: 'asdfsd'
//     })
// })

server.listen(port, ()=>{
    console.log('running on port ' + port);
})

