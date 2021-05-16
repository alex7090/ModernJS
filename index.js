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





// // const PORT = process.env.PORT || 8080;

// // io.on('connection', (socket) => {
// //     socket.on('chat message', msg => {
// //         io.emit('chat message', msg);
// //     });
// // });
// // http.listen(8080, () => {
// //     console.log('listening on *:8080');
// // });

// // app.listen(PORT, console.log(`Server started on port ${PORT}`));











var app = require('express')();
var http = require('http').createServer(app);
const PORT = 8080;
var io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});
var STATIC_CHANNELS = [{
    name: 'Global chat',
    participants: 0,
    id: 1,
    sockets: []
}, {
    name: 'Funny',
    participants: 0,
    id: 2,
    sockets: []
}];

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})


http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected client
    console.log('new client connected');
    socket.emit('connection', null);
    socket.on('channel-join', id => {
        console.log('channel join', id);
        STATIC_CHANNELS.forEach(c => {
            if (c.id === id) {
                if (c.sockets.indexOf(socket.id) == (-1)) {
                    c.sockets.push(socket.id);
                    c.participants++;
                    io.emit('channel', c);
                }
            } else {
                let index = c.sockets.indexOf(socket.id);
                if (index != (-1)) {
                    c.sockets.splice(index, 1);
                    c.participants--;
                    io.emit('channel', c);
                }
            }
        });

        return id;
    });
    socket.on('send-message', message => {
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        STATIC_CHANNELS.forEach(c => {
            let index = c.sockets.indexOf(socket.id);
            if (index != (-1)) {
                c.sockets.splice(index, 1);
                c.participants--;
                io.emit('channel', c);
            }
        });
    });

});



/**
 * @description This methos retirves the static channels
 */
app.get('/getChannels', (req, res) => {
    res.json({
        channels: STATIC_CHANNELS
    })
});