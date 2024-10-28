import * as jwt from 'jsonwebtoken';
import { Server as IoServer } from "socket.io";


class SocketServer {
    io: any;
    oneAndOnlyServerConnection: any;
    awaitingMessageListeners: any;

    constructor() {
        this.io = new IoServer(null);
        this.oneAndOnlyServerConnection = null; //change later to an array or a Map for scalability
        this.awaitingMessageListeners = [];
    }

    init(app) {
        this.io.attach(app);

        this.io.use((socket, next) => {
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

        this.io.on('connection', (socket) => {
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
        });

        const emitEvent = (message, res) => {
            const { domain, aud, context: { project_id } } = res.origin;
            this.io.to(`${domain}__${aud}__${project_id}`).emit('message', message);
        };
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
