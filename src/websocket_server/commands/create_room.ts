import { PlayerCollectionEntity } from '../../db/PlayerCollection';
import { RoomCollectionEntity } from '../../db/RoomCollection';
import { WebSocketResponse } from '../response/WebSocketResponse';
import { update_room } from './update_room';

export const create_room = (
  _data: void,
  clientId: string,
  wsResponse: WebSocketResponse
) => {
  const player = PlayerCollectionEntity.findOneByClientId(clientId)!;
  RoomCollectionEntity.createRoom(player);
  update_room(_data, clientId, wsResponse);
};
