import * as jwt from 'jsonwebtoken';
import { io as IoClient } from "socket.io-client";


class SocketClient {
    socket: any;

    constructor() {
        this.socket = IoClient(process.env.CRYPTO_SOCKET_SERVER_URL);
    }

    init() {
        this.socket.on('connect', () => {
            console.log('Client: Connection established');

            // Send a message to the server
            this.socket.emit('message', 'Hello, server!');
        });

        // Disconnect event
        this.socket.on('disconnect', () => {
            console.log('Client: Connection closed');
        });

        // Disconnect event
        this.socket.on('error', (e) => {
            console.log('Client: error closed', e);
        });
    }

    addMessageListener(cb) {
        this.socket.on('message:new', (msg) => {
            cb(msg);
        });
    }
}

export default new SocketClient();




