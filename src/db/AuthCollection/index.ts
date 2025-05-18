import { Auth } from '../../models/Auth';
import { AuthCollectionRepository } from './AuthCollectionRepository';
import { randomUUID } from 'crypto';
import { WebSocket } from 'ws';

class AuthCollection implements AuthCollectionRepository {
  #clients: Auth[] = [];

  addClient(ws: WebSocket): Auth {
    const auth = {
      clientId: randomUUID(),
      ws,
    };
    this.#clients.push(auth);
    return auth;
  }

  findAuthByClientId(clientId: string): Auth | null {
    return this.#clients.find((client) => client.clientId === clientId) ?? null;
  }

  deleteClient(clientId: string): void {
    this.#clients = this.#clients.filter((auth) => auth.clientId !== clientId);
  }
}

export const AuthCollectionEntity = new AuthCollection();
