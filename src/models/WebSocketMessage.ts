import { WebSocketEvent } from './WebSocketEvents';

export interface WebSocketMessage {
  type: WebSocketEvent;
  data: any;
  id: number;
}
