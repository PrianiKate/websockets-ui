import { PlayerCollectionEntity } from '../../db/PlayerCollection';
import { RoomCollectionEntity } from '../../db/RoomCollection';
import { WebSocketResponse } from '../response/WebSocketResponse';
import { create_game } from './create_game';
import { update_room } from './update_room';

export const add_user_to_room = (
  { indexRoom }: { indexRoom: number },
  clientId: string,
  wsResponse: WebSocketResponse
) => {
  const player = PlayerCollectionEntity.findOneByClientId(clientId)!;
  const room = RoomCollectionEntity.findRoomById(indexRoom);
  if (
    !room ||
    room.roomUsers?.length !== 1 ||
    room.roomUsers[0].index === player.index
  ) {
    return;
  }
  const firstPlayerId = room.roomUsers[0].index;
  RoomCollectionEntity.removeRoom(indexRoom);
  update_room(void 0, clientId, wsResponse);
  create_game({ firstPlayerId }, clientId, wsResponse);
};
