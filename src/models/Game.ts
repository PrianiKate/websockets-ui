import { Ship } from './Ship';

export enum GameType {
  multiPlay = 'multiPlay',
  singlePlay = 'singlePlay',
}

export interface Game {
  id: number;
  players: Record<
    string,
    {
      clientId: string;
      ships: Ship[];
    }
  >;
  currentPlayerIndex: string;
  type: GameType;
}
