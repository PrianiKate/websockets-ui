import { GameCollectionEntity } from '../../db/GameCollection';
import { PlayerCollectionEntity } from '../../db/PlayerCollection';
import { Player } from '../../models/Player';
import { WebSocketEvent } from '../../models/WebSocketEvents';
import { WebSocketResponse } from '../response/WebSocketResponse';

export const create_game = (
  { firstPlayerId }: { firstPlayerId: Player['index'] },
  clientId: string,
  wsResponse: WebSocketResponse
) => {
  const player = PlayerCollectionEntity.findOneByClientId(clientId)!;
  const firstPlayer = PlayerCollectionEntity.findOneByIndex(firstPlayerId)!;
  const game = GameCollectionEntity.createGame([firstPlayer, player]);
  const idGame = game.id;
  const gamePlayerIds = Object.keys(game.players);

  wsResponse.sendMessageByClientId(
    WebSocketEvent.createGame,
    { idGame, idPlayer: gamePlayerIds[0] },
    firstPlayer.clientId
  );
  wsResponse.sendMessage(WebSocketEvent.createGame, {
    idGame,
    idPlayer: gamePlayerIds[1],
  });
};
