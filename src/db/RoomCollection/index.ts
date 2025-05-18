import { Player } from '../../models/Player';
import { Room } from '../../models/Room';
import { RoomCollectionRepository } from './RoomCollectionRepositiory';

class RoomCollection implements RoomCollectionRepository {
  #rooms: Room[] = [];

  createRoom(player: Player): void {
    this.#rooms.push({
      roomId: this.#rooms.length + 1,
      roomUsers: [
        {
          index: player.index,
          name: player.name,
        },
      ],
    });
  }

  findRooms(): Room[] {
    return this.#rooms;
  }

  findRoomById(roomId: Room['roomId']): Room | null {
    return this.#rooms.find((room) => room.roomId === roomId) ?? null;
  }

  removeRoom(roomId: number): void {
    this.#rooms = this.#rooms.filter((room) => room.roomId !== roomId);
  }
}

export const RoomCollectionEntity = new RoomCollection();
