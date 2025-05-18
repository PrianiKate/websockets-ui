import { Player } from '../../models/Player';
import { Room } from '../../models/Room';

export interface RoomCollectionRepository {
  createRoom(player: Player): void;

  findRoomById(roomId: Room['roomId']): Room | null;

  findRooms(): Room[];

  removeRoom(roomId: number): void;
}
