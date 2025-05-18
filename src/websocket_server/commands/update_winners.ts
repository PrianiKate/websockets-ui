import { PlayerCollectionEntity } from '../../db/PlayerCollection';
import { WebSocketEvent } from '../../models/WebSocketEvents';
import { WebSocketResponse } from '../response/WebSocketResponse';

export const update_winners = (
  _data: void,
  _clientId: string,
  wsResponse: WebSocketResponse
) => {
  const winners = PlayerCollectionEntity.findWinners();
  wsResponse.broadcastMessage(WebSocketEvent.updateWinners, winners);
};
