import { Game } from '../../models/Game';
import { Player } from '../../models/Player';
import { AttackResult, Position, Ship } from '../../models/Ship';

export interface GameCollectionRepository {
  createGame(players: Pick<Player, 'clientId'>[]): Game;

  findGameById(id: Game['id']): Game | null;

  addShips(id: Game['id'], ships: Ship[], indexPlayer: string): Game | null;

  attack(id: Game['id'], position: Position, indexPlayer: string): AttackResult;

  checkIsGameFinished(id: Game['id']): {
    winnerClientId: Player['clientId'] | null;
    winnerGameId: string | null;
  };

  createSinglePlayGame(player: Pick<Player, 'clientId'>): Game;
}
