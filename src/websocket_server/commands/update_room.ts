import { RoomCollectionEntity } from '../../db/RoomCollection';
import { WebSocketEvent } from '../../models/WebSocketEvents';
import { WebSocketResponse } from '../response/WebSocketResponse';

export const update_room = (
  _data: void,
  _clientId: string,
  wsResponse: WebSocketResponse
) => {
  const rooms = RoomCollectionEntity.findRooms();
  wsResponse.broadcastMessage(WebSocketEvent.updateRoom, rooms);
};
