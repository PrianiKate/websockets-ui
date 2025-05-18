import { FIELD_SIZE } from '../../constants';
import { Game } from '../../models/Game';
import { WebSocketResponse } from '../response/WebSocketResponse';
import { attack } from './attack';

export const randomAttack = (
  props: { gameId: Game['id']; indexPlayer: Game['currentPlayerIndex'] },
  clientId: string,
  wsResponse: WebSocketResponse
) => {
  const generateRandomCoordinate = () =>
    Math.floor(Math.random() * (FIELD_SIZE + 1));
  const x = generateRandomCoordinate();
  const y = generateRandomCoordinate();

  attack({ x, y, ...props }, clientId, wsResponse);
};
