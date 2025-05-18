import { WebSocket } from 'ws';

export interface Auth {
  clientId: string;
  ws: WebSocket;
}
