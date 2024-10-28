//TODO: make 2 files from this file, which states that this file is old

import * as jwt from 'jsonwebtoken';

const io2 = require('socket.io-client');
const socketClient = io2.connect(process.env.SOCKET_SERVER_URL);

const connections = new Map();

const io = require('socket.io')(null, {
    ...((process.env.NODE_ENV === 'development') ? {
        cors: {
            origin: [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
            ]
        }
    } : {})
});

io.use((socket, next) => {
    // if (socket.handshake.query && socket.handshake.query.token) {
    //     jwt.verify(socket.handshake.query.token, process.env.JWT_KEY, (err, decoded) => {
    //         if (err) return next(new Error('Authentication error'));
    next();
    //     });
    // }
    // else {
    //     next(new Error('Authentication error'));
    // }
})
    .on('connection', (socket) => {
        console.log(
            'socket',
            socket.handshake.query.userId
        );

        connections.set(socket.handshake.query.userId, socket);

        socketClient.emit('newConnection', {
            userId: socket.handshake.query.userId,
            symbols: socket.handshake.query.symbols,
            interval: socket.handshake.query.interval
        });

        //event listeners
        socket.on("newPageSocket", (symbols) => {
            socketClient.emit('newPageSocket', {
                userId: socket.handshake.query.userId,
                symbols
            });
        });

        socket.on("newIntervalSocket", (interval) => {
            socketClient.emit('newIntervalSocket', {
                userId: socket.handshake.query.userId,
                interval
            });
        });

        socket.on("disconnect", () => {
            socketClient.emit('newDisconnect', {
                userId: socket.handshake.query.userId
            });

            connections.delete(socket.handshake.query.userId);
        });

        // handleDisconnect(socket);
    });

function handleDisconnect(socket) {
    socket.on("disconnect", () => {
        jwt.verify(socket.handshake.query.token, process.env.JWT_KEY, async (err, decoded) => {
            try {
                if (err) throw ('Authentication error on socket disconnect');

                const clientId = decoded.id;
                console.log(clientId);
            }
            catch (e) {
                console.error(e);
            }
        });
    });
};

const emitEvent = (message, res) => {
    const { domain, aud, context: { project_id } } = res.origin;
    io.to(`${domain}__${aud}__${project_id}`).emit('message', message);
};

export { io, emitEvent };


socketClient.on('connect', () => {
    console.log('Client: Connection established');
    // Send a message to the server
    socketClient.emit('message', 'Hello, server!');
});

// Listen for messages from the server
socketClient.on('message:new', (msg) => {
    // console.log(msg.userId, connections.has(msg.userId));
    if (connections.has(msg.userId))
        connections.get(msg.userId).emit('message:new', msg.klines);
});

// Disconnect event
socketClient.on('disconnect', () => {
    console.log('Client: Connection closed');
});

// Disconnect event
socketClient.on('error', (e) => {
    console.log('Client: error closed', e);
});