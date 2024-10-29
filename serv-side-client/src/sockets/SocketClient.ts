import * as jwt from 'jsonwebtoken';
import { io as IoClient } from "socket.io-client";


class SocketClient {
    socket: any;

    constructor() {
        this.socket = null;
    }

    init() {
        this.socket = IoClient('ws://host.docker.internal:4444');

        console.log(11);
        this.socket.on('connect', () => {
            console.log('Client: Connection established');

            // Send a message to the server
            setInterval(() => {
                this.socket.emit('message', 'Hello, server!');
            }, 3000);

            setInterval(() => {
                this.socket.emit('another-message', '1Hello1, server!');
            }, 8000);
        });

        this.socket.on('connect_error', (e) => {
            console.log('Client: Connection error', e.message);
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




