import { WebSocketServer } from 'ws';
import { WebSocketMessage } from '../models/WebSocketMessage';
import * as commands from './commands';
import { WebSocketResponse } from './response/WebSocketResponse';
import { AuthCollectionEntity } from '../db/AuthCollection';

const WS_PORT = 3000;

export const wsServer = new WebSocketServer({
  port: WS_PORT,
});

wsServer.on('connection', function connection(ws) {
  console.log('WS Server connected');
  const clientId = AuthCollectionEntity.addClient(ws).clientId;

  ws.on('message', function (message) {
    console.log(`Received message: ${message}`);

    const messageStr = message.toString();
    const jsonObj: WebSocketMessage = JSON.parse(messageStr);
    const event = jsonObj.type;
    const data = jsonObj.data;
    const parsedData = data ? JSON.parse(data) : data;

    const command = commands[event];
    if (command) {
      const wsResponse = new WebSocketResponse(ws, wsServer);
      command(parsedData, clientId, wsResponse);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    AuthCollectionEntity.deleteClient(clientId);
  });
});
