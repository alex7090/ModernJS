// // Setup basic express server
// const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const flash = require('express-flash');
// const cookieParser = require('cookie-parser');
// const expressLayouts = require('express-ejs-layouts');
// const bodyParser = require('body-parser');
// const app = express();
// const path = require('path');
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// const port = process.env.PORT || 3000;
// var query = require('./config/query');

// server.listen(port, () => {
//     console.log('Server listening at port %d', port);
// });

// //Passport config
// require('./config/passport')(passport);
// //Passport middleware
// app.use(require('express-session')({
//     secret: 'keyboard cat',
//     resave: true,
//     saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());


// app.use(cookieParser());
// app.use(flash());

// app.use(express.static(__dirname + '/views'));
// app.use(express.static(__dirname + '/public'));
// app.set('views', [__dirname + '/views', __dirname + '/views/personal']);


// app.use(express.json());

// app.use(expressLayouts);
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.set('layout');

// app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/user/', require('./routes/user'));
// app.use('/auth/', require('./routes/auth'));
// app.use('/', require('./routes/index'));

// app.use(express.static(path.join(__dirname, 'public')));



// let numUsers = 0;

// io.on('connection', (socket) => {
//     let addedUser = false;

//     // when the client emits 'new message', this listens and executes
//     socket.on('new message', (data) => {
//         // we tell the client to execute 'new message'
//         let queryValues2 = [];
//         query("INSERT INTO public.chat (username, message) values('" + socket.username + "', '" + data + "')", queryValues2, (err, rows) => {
//             socket.broadcast.emit('new message', {
//                 username: socket.username,
//                 message: data
//             });
//         });
//     });

//     // when the client emits 'add user', this listens and executes
//     socket.on('add user', (username) => {
//         if (addedUser) return;

//         // we store the username in the socket session for this client
//         socket.username = username;
//         ++numUsers;
//         addedUser = true;
//         let queryValues2 = [];
//         query("SELECT * FROM public.chat ORDER BY id", queryValues2, (err, rows) => {
//             socket.emit('login', {
//                 numUsers: numUsers,
//                 data: rows
//             });
//         });
//         // echo globally (all clients) that a person has connected
//         socket.broadcast.emit('user joined', {
//             username: socket.username,
//             numUsers: numUsers
//         });
//     });

//     // when the client emits 'typing', we broadcast it to others
//     socket.on('typing', () => {
//         socket.broadcast.emit('typing', {
//             username: socket.username
//         });
//     });

//     // when the client emits 'stop typing', we broadcast it to others
//     socket.on('stop typing', () => {
//         socket.broadcast.emit('stop typing', {
//             username: socket.username
//         });
//     });

//     // when the user disconnects.. perform this
//     socket.on('disconnect', () => {
//         if (addedUser) {
//             --numUsers;

//             // echo globally that this client has left
//             socket.broadcast.emit('user left', {
//                 username: socket.username,
//                 numUsers: numUsers
//             });
//         }
//     });
// });







const express = require('express');
var cors = require('cors')
const app = express();
const bodyParser = require('body-parser');

const msg = require("./utils/saveMessage.js");

const cookieParser = require('cookie-parser');
var http = require('http').createServer(app);
const PORT = 8080;
app.use(cors())
var io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/user/', require('./routes/user'));
app.use('/chat/', require('./routes/chat'));

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

io.on('connection', (socket) => {
    socket.on('send-message', message => {
        msg.saveMessage(message);
        io.emit('message', message);
    });
});
