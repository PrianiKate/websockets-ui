import { Player } from './Player';

export interface Room {
  roomId: number;
  roomUsers: Pick<Player, 'index' | 'name'>[];
}
