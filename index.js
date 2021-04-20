const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;


//Passport config
require('./config/passport')(passport);
//Passport middleware
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(cookieParser());
app.use(flash());

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));
app.set('views', [__dirname + '/views', __dirname + '/views/personal']);


app.use(express.json());

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout');

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user/', require('./routes/user'));
app.use('/auth/', require('./routes/auth'));
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 8080;

io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
});
http.listen(8080, () => {
    console.log('listening on *:8080');
});

// app.listen(PORT, console.log(`Server started on port ${PORT}`));