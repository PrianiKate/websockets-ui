import { Player } from '../../models/Player';

export interface PlayerCollectionRepository {
  findOneByName(name: Player['name']): Player | null;

  findOneByIndex(index: Player['index']): Player | null;

  findOneByClientId(index: Player['clientId']): Player | null;

  create(props: Pick<Player, 'name' | 'password' | 'clientId'>): Player;

  findWinners(): Pick<Player, 'name' | 'wins'>[];

  updateWinnerByClientId(clientId:  Player['clientId']): void;

  updatePlayerClientId(props: Pick<Player, 'index' | 'clientId'>): void;

  updateWinnerByIndex(index: Player['index']): void;
}
