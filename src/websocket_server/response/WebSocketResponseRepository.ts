import { WebSocketEvent } from '../../models/WebSocketEvents';

export interface WebSocketResponseRepository {
  sendMessage(type: WebSocketEvent, message: unknown): void;

  broadcastMessage(type: WebSocketEvent, message: unknown): void;

  sendMessageByClientId(
    type: WebSocketEvent,
    message: unknown,
    clientId: string
  ): void;
}
