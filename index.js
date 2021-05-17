const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const msg = require("./utils/saveMessage.js");
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080;

var http = require('http').createServer(app);
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
