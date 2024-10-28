import SocketServer from '@/sockets/SocketServer';

import { intervals } from '../constants';


// TODO: this module should be used in client-server,
// this socket manager shoud manage connections of other client-servers
// and client-server is going to handle all the klines that go to the UI
// so this socket manager here should have an addMessageListener method
// that is going to emit new messages to all of the subscribed client-servers

class ClientSocketManagerService {
  connections: Map<string, { interval: '', symbols: [] }>;
  dataServiceCallback: Function | null;
  connectionAttempts: any[];
  initAttempts: any;

  constructor() {
    this.connections = new Map(); // this will be new Map or {} where key is userId+Window session

    this.connectionAttempts = [];
    this.initAttempts = {};

    this.dataServiceCallback = null;
  }

  async init() {
    SocketServer.addMessageListener('newConnection', (msg) => {
      //add middleware to check msg data?
      console.log('newConnection', msg, msg.symbols);

      this.connections.set(msg.userId, {
        interval: msg.interval,
        symbols: msg.symbols.toLowerCase().split(',')
      });
    });

    SocketServer.addMessageListener('newPageSocket', (msg) => {
      //add middleware to check msg data?
      console.log('newPageSocket', msg.symbols);

      if (!this.connections.has(msg.userId)) return;

      this.connections.set(msg.userId, {
        ...this.connections.get(msg.userId),
        symbols: msg.symbols.join().toLowerCase().split(',')
      });
    });

    SocketServer.addMessageListener('newIntervalSocket', (msg) => {
      //add middleware to check msg data?
      console.log('newIntervalSocket', msg.symbols);

      if (!this.connections.has(msg.userId)) return;

      this.connections.set(msg.userId, {
        ...this.connections.get(msg.userId),
        interval: msg.interval
      });
    });

    SocketServer.addMessageListener('newDisconnect', (msg) => {
      //add middleware to check msg data?
      console.log('newDisconnect', msg.userId);
      this.connections.delete(msg.userId);
    });

    //send message every 1000ms
    //TODO: add normal time handling with setTimeout + delta
    //what if candle changes and prev candle is not going to receive all the changes
    //server needs to send differences (aka, all changes when they occur or diff if we want interval)
    //like sometimes diff can be 2 candles prev and current 
    //cause in 1sec, can be two events, one that updates prev candle and creates new
    //so in interval case, we should send everything that happened in one sec
    //and in event case, we should send the event message rightaway
    setInterval(() => {
      for (const [key, connection] of this.connections) {
        const userId = key;
        const interval = connection.interval;
        const symbols = connection.symbols;

        if (symbols.length === 0) return;

        const clientMessage = {
          userId,
          klines: {}
        };

        symbols.forEach(symbolName => {
          if (this.klinesBySymbol[interval].hasOwnProperty(symbolName))
            clientMessage.klines[symbolName] = this.getLastKlineBySymbol(interval, symbolName);
        });

        SocketServer.emit('message:new', clientMessage);
      }
    }, 1000);
  }
};


export default new ClientSocketManagerService();