import { BOT_PLAYER_ID } from '../../constants';
import { GameCollectionEntity } from '../../db/GameCollection';
import { Game } from '../../models/Game';
import { Ship } from '../../models/Ship';
import { WebSocketResponse } from '../response/WebSocketResponse';
import { start_game } from './start_game';

export const add_ships = (
  {
    gameId,
    ships,
    indexPlayer,
  }: { gameId: Game['id']; ships: Ship[]; indexPlayer: string },
  _clientId: string,
  _wsResponse: WebSocketResponse
) => {
  const game = GameCollectionEntity.addShips(gameId, ships, indexPlayer)!;
  const playerData = Object.values(game.players);

  if (
    playerData.every(({ ships }) => ships.length > 0) ||
    playerData.find(({ clientId }) => clientId === BOT_PLAYER_ID)
  ) {
    start_game(game, _clientId, _wsResponse);
  }
};
