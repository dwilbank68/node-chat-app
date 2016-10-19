const port = process.env.PORT || 3000;

const path = require("path");
const express = require("express");

var app = express();

// const hbs = require("hbs");
// hbs.registerPartials(__dirname + '/views/partials');
// app.set('view engine', 'hbs');

// app.use((req, res, next)=> {
//     res.render('maintenance.hbs');
// })
const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath));

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

app.listen(port, ()=>{
    console.log('running on port ' + port);
})