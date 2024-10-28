const io2 = require('socket.io-client');
const socketClient = io2.connect('ws://127.0.0.1:4444');

console.log(123123123);
socketClient.on('connect', () => {
    console.log('Client: Connection established');
    // Send a message to the server
    socketClient.emit('message', 'Hello, server!');
});

socketClient.on('connect_error', (e) => {
    console.log('Client: Connection error', e.message);
});

// Disconnect event
socketClient.on('disconnect', () => {
    console.log('Client: Connection closed');
});

// Disconnect event
socketClient.on('error', (e) => {
    console.log('Client: error closed', e);
});