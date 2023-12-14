const Redis = require('ioredis');
const http = require('http');
const socketIO = require('socket.io');

// Create an HTTP server
const server = http.createServer();
const io = socketIO(server);

console.log('Server is running ...');

// Handle socket connections
io.on('connection', function (socket) {
    socket.emit('welcome', 'You are now successfully connected to the socket.');

    console.log('A connection has been made.');

    // Create a Redis instance
    const redis = new Redis();

    // Subscribe to a Redis channel
    redis.subscribe('danaChat:channel');

    // Listen for Redis messages
    redis.on('message', function (channel, message) {
        const data = JSON.parse(message);

        if (data.event === 'newMsg') {
            console.log(data);
            io.emit('newMsg', data);
        }

        if (data.event === 'left') {
            io.emit('left', data);
        }
    });
});

// Start listening on port 3000
server.listen(3000);