import { BOT_PLAYER_ID } from '../../constants';
import { PlayerCollectionEntity } from '../../db/PlayerCollection';
import { Game } from '../../models/Game';
import { Player } from '../../models/Player';
import { WebSocketEvent } from '../../models/WebSocketEvents';
import { WebSocketResponse } from '../response/WebSocketResponse';
import { update_winners } from './update_winners';

export const finish = (
  {
    game,
    winnerClientId,
    winnerGameId,
  }: {
    game: Game;
    winnerGameId: string;
    winnerClientId: Player['clientId'];
  },
  _clientId: string,
  wsResponse: WebSocketResponse
) => {
  const playersData = Object.values(game.players);
  if (winnerClientId !== BOT_PLAYER_ID) {
    PlayerCollectionEntity.updateWinnerByClientId(winnerClientId);
  }

  playersData.forEach((playerData) => {
    const clientId = playerData.clientId;
    if (clientId !== BOT_PLAYER_ID) {
      wsResponse.sendMessageByClientId(
        WebSocketEvent.finish,
        {
          winPlayer: winnerGameId,
        },
        clientId
      );
    }
  });

  update_winners(void 0, _clientId, wsResponse);
};
