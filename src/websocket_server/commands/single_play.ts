import { BOT_PLAYER_ID } from '../../constants';
import { GameCollectionEntity } from '../../db/GameCollection';
import { WebSocketEvent } from '../../models/WebSocketEvents';
import { WebSocketResponse } from '../response/WebSocketResponse';

export const single_play = (
  _data: void,
  clientId: string,
  wsResponse: WebSocketResponse
) => {
  const game = GameCollectionEntity.createSinglePlayGame({ clientId });
  const idPlayer = Object.keys(game.players).find((id) => id !== BOT_PLAYER_ID);
  wsResponse.sendMessage(WebSocketEvent.createGame, {
    idGame: game.id,
    idPlayer,
  });
};
