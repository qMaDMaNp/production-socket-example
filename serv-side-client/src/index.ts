import 'dotenv/config';
import express from 'express';

import * as bodyParser from 'body-parser';

import routes from '@/routes';

import ApiErrorMiddleware from "@middlewares/ApiErrorMiddleware";
import SocketClient from '@sockets/SocketClient';

class Main {
    server: any;
    PORT: any;
    app: any;

    constructor() {
        this.server = express();
        this.PORT = 3333;
        this.app = null;
    }

    registerMiddleware() {
        // this.server.use(cors({
        //     credentials: true,
        //     origin: [
        //         "http://localhost",
        //         "http://127.0.0.1"
        //     ]
        // }));

        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({ extended: false }));

        // server.use('/files', express.static(path.resolve("/services/files-storage")));
        // server.use('/avatars', express.static(path.resolve("/services/files-storage/avatars")));

        this.server.use("/api", routes);
        this.server.use(ApiErrorMiddleware);
    }

    async initApp() {

        this.registerMiddleware();

        this.app = this.server.listen(this.PORT, () => {
            SocketClient.init()
            console.info(`App is listening on ${this.PORT}`);
        });
    }
};

process.on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
});

process.on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
});

new Main().initApp();