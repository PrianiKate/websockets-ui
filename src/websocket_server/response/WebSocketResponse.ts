import { WebSocket, WebSocketServer } from 'ws';
import { WebSocketEvent } from '../../models/WebSocketEvents';
import { WebSocketResponseRepository } from './WebSocketResponseRepository';
import { AuthCollectionEntity } from '../../db/AuthCollection';

export class WebSocketResponse implements WebSocketResponseRepository {
  #ws: WebSocket;
  #wsServer: WebSocketServer;

  constructor(ws: WebSocket, wsServer: WebSocketServer) {
    this.#ws = ws;
    this.#wsServer = wsServer;
  }

  static #sendMessageToClient(
    type: WebSocketEvent,
    data: unknown,
    client: WebSocket
  ) {
    const result = {
      type,
      id: 0,
      data: JSON.stringify(data),
    };
    console.log('result', result);
    client.send(JSON.stringify(result));
  }

  sendMessage(type: WebSocketEvent, data: unknown) {
    WebSocketResponse.#sendMessageToClient(type, data, this.#ws);
  }

  broadcastMessage(type: WebSocketEvent, data: unknown): void {
    this.#wsServer.clients.forEach((client) => {
      WebSocketResponse.#sendMessageToClient(type, data, client);
    });
  }

  sendMessageByClientId(
    type: WebSocketEvent,
    data: unknown,
    clientId: string
  ): void {
    const client = AuthCollectionEntity.findAuthByClientId(clientId);
    if (!client) return;
    this.#wsServer.clients.forEach((ws) => {
      if (ws === client.ws) {
        WebSocketResponse.#sendMessageToClient(type, data, ws);
      }
    });
  }
}
