import * as jwt from 'jsonwebtoken';
import { Server as IoServer } from "socket.io";


class SocketServer {
    ioServer: any;
    oneAndOnlyServerConnection: any;
    awaitingMessageListeners: any;

    constructor() {
        this.ioServer = new IoServer();
        this.oneAndOnlyServerConnection = null; //change later to an array or a Map for scalability
        this.awaitingMessageListeners = [];
    }

    init(app) {
        this.ioServer.attach(app);

        this.ioServer.use((socket, next) => {
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

        this.ioServer.on('connection', (socket) => {
            console.log(2);
            //onconnection add socket to a Map of clients and use that socket to attach new listeners
            //at the moment we have only one, but in the future, there will be more
            if (!this.oneAndOnlyServerConnection) {
                this.oneAndOnlyServerConnection = socket;
                this.assignAwaitingMessageListeners();
            }

            socket.on("disconnect", () => {
                this.oneAndOnlyServerConnection = null;

                // jwt.verify(socket.handshake.query.token, process.env.JWT_KEY, async (err, decoded) => {
                //     try {
                //         if (err) throw ('Authentication error on socket disconnect');
                //         const clientId = decoded.id;
                //         console.log(clientId);
                //     }
                //     catch(e) {
                //         console.error(e);
                //     }
                // });
            });

            socket.on("message", (msg) => {
                console.log('msgggg', msg);
                this.ioServer.allSockets().then(res => console.log(res))
                this.ioServer.fetchSockets().then(res => console.log(res.length))
            });

            this.ioServer.fetchSockets().then(sockets => {
                sockets.forEach(x => {
                    x.on("another-message", (msg) => {
                        console.log('another-msg', msg);
                    });
                })
            })
        });
    }

    assignAwaitingMessageListeners() {
        this.awaitingMessageListeners.forEach(listener => {
            this.oneAndOnlyServerConnection.on(listener.name, listener.cb);
        })

        this.awaitingMessageListeners = [];
    }

    addMessageListener(name, cb) {
        this.oneAndOnlyServerConnection
            ? this.oneAndOnlyServerConnection.on(name, cb)
            : this.awaitingMessageListeners.push({ name, cb });
    }

    emit(eventName, data) {
        if (this.oneAndOnlyServerConnection)
            this.oneAndOnlyServerConnection.emit(eventName, data);
    }
}

export default new SocketServer();
