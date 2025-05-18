import { BOT_PLAYER_ID } from '../../constants';
import { Game } from '../../models/Game';
import { Ship } from '../../models/Ship';
import { WebSocketEvent } from '../../models/WebSocketEvents';
import { WebSocketResponse } from '../response/WebSocketResponse';
import { turn } from './turn';

export const start_game = (
  game: Game,
  _clientId: string,
  wsResponse: WebSocketResponse
) => {
  const playersData = Object.values(game.players);
  const playerIndices = Object.keys(game.players);
  const formatPlayerShips = (ships: Ship[]) =>
    ships.map(({ activeShipPositions, ...ship }) => ship);

  playersData.forEach((playerData, ind) => {
    const clientId = playerData.clientId;
    if (clientId !== BOT_PLAYER_ID) {
      wsResponse.sendMessageByClientId(
        WebSocketEvent.startGame,
        {
          ships: formatPlayerShips(playerData.ships),
          currentPlayerIndex: playerIndices[ind],
        },
        clientId
      );
      turn(game, clientId, wsResponse);
    }
  });
};
