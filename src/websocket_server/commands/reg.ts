import { PlayerCollectionEntity } from '../../db/PlayerCollection';
import { Player } from '../../models/Player';
import { WebSocketEvent } from '../../models/WebSocketEvents';
import { WebSocketResponse } from '../response/WebSocketResponse';
import { update_room } from './update_room';
import { update_winners } from './update_winners';

export const reg = (
  data: Pick<Player, 'name' | 'password'>,
  clientId: string,
  wsResponse: WebSocketResponse
) => {
  let player = PlayerCollectionEntity.findOneByName(data.name);

  if (player && player.password !== data.password) {
    wsResponse.sendMessage(WebSocketEvent.reg, {
      name: player.name,
      index: player.index,
      error: true,
      errorText: 'Password is wrong',
    });
    return;
  }

  if (!player) {
    player = PlayerCollectionEntity.create({
      ...data,
      clientId,
    });
  } else {
    PlayerCollectionEntity.updatePlayerClientId({
      index: player.index,
      clientId,
    });
  }

  wsResponse.sendMessage(WebSocketEvent.reg, {
    name: player.name,
    index: player.index,
    error: false,
    errorText: '',
  });
  update_room(void 0, clientId, wsResponse);
  update_winners(void 0, clientId, wsResponse);
};
