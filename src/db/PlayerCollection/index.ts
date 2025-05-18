import { Player } from '../../models/Player';
import { PlayerCollectionRepository } from './PlayerCollectionRepository';

class PlayerCollection implements PlayerCollectionRepository {
  #players: Player[] = [];

  findOneByName(name: Player['name']): Player | null {
    return this.#players.find((player) => player.name === name) || null;
  }

  findOneByIndex(index: Player['index']): Player | null {
    return this.#players.find((player) => player.index === index) || null;
  }

  findOneByClientId(clientId: Player['clientId']): Player | null {
    return this.#players.find((player) => player.clientId === clientId) || null;
  }

  create(props: Pick<Player, 'name' | 'password' | 'clientId'>): Player {
    const newPlayer = {
      ...props,
      index: this.#players.length + 1,
      wins: 0,
    };
    this.#players.push(newPlayer);
    return newPlayer;
  }

  findWinners(): Pick<Player, 'name' | 'wins'>[] {
    return this.#players.map(({ name, wins }) => ({ name, wins }));
  }

  updateWinnerByIndex(index: Player['index']): void {
    this.#players.forEach((player) => {
      if (player.index === index) {
        player.wins++;
      }
    });
  }

  updatePlayerClientId({
    index,
    clientId,
  }: Pick<Player, 'index' | 'clientId'>): void {
    this.#players.forEach((player) => {
      if (player.index === index) {
        player.clientId = clientId;
      }
    });
  }

  updateWinnerByClientId(clientId: Player['clientId']): void {
    this.#players.forEach((player) => {
      if (player.clientId === clientId) {
        player.wins++;
      }
    });
  }
}

export const PlayerCollectionEntity = new PlayerCollection();
