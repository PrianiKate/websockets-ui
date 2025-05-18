import { Auth } from '../../models/Auth';
import { WebSocket } from 'ws';

export interface AuthCollectionRepository {
  addClient(ws: WebSocket): Auth;

  deleteClient(clientId: string): void;

  findAuthByClientId(clientId: string): Auth | null;
}
