import { Game } from '../../models/Game';
import { WebSocketEvent } from '../../models/WebSocketEvents';
import { WebSocketResponse } from '../response/WebSocketResponse';

export const turn = (
  game: Game,
  clientId: string,
  wsResponse: WebSocketResponse
) => {
  const currentPlayer = game.currentPlayerIndex;

  wsResponse.sendMessageByClientId(
    WebSocketEvent.turn,
    { currentPlayer },
    clientId
  );
};
