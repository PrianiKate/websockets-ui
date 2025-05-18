import { BOT_PLAYER_ID, BOT_TIMEOUT } from '../../constants';
import { GameCollectionEntity } from '../../db/GameCollection';
import { Game } from '../../models/Game';
import { AttackResult, Position } from '../../models/Ship';
import { WebSocketEvent } from '../../models/WebSocketEvents';
import { WebSocketResponse } from '../response/WebSocketResponse';
import { finish } from './finish';
import { randomAttack } from './randomAttack';
import { turn } from './turn';

export const attack = (
  {
    gameId,
    x,
    y,
    indexPlayer,
  }: { gameId: Game['id']; indexPlayer: Game['currentPlayerIndex'] } & Position,
  clientId: string,
  wsResponse: WebSocketResponse
) => {
  const game = GameCollectionEntity.findGameById(gameId)!;

  if (game.currentPlayerIndex !== indexPlayer) {
    return;
  }

  const result = GameCollectionEntity.attack(gameId, { x, y }, indexPlayer);

  const response = {
    position: { x, y },
    currentPlayer: indexPlayer,
    status: result,
  };

  const players = Object.values(game.players);
  const anotherPlayer =
    players[0].clientId === clientId ? players[1] : players[0];
  const anotherPlayerClientId = anotherPlayer.clientId;

  if (anotherPlayerClientId !== BOT_PLAYER_ID) {
    wsResponse.sendMessageByClientId(
      WebSocketEvent.attack,
      response,
      anotherPlayerClientId
    );
  }
  wsResponse.sendMessage(WebSocketEvent.attack, response);

  const isGameFinished = GameCollectionEntity.checkIsGameFinished(gameId);

  if (isGameFinished.winnerGameId) {
    finish(
      {
        game,
        winnerClientId: isGameFinished.winnerClientId!,
        winnerGameId: isGameFinished.winnerGameId!,
      },
      clientId,
      wsResponse
    );
  } else {
    if (indexPlayer !== BOT_PLAYER_ID) {
      turn(game, clientId, wsResponse);
    }
    if (anotherPlayerClientId !== BOT_PLAYER_ID) {
      turn(game, anotherPlayerClientId, wsResponse);
    }
    const isSinglePlay =
      indexPlayer === BOT_PLAYER_ID || anotherPlayerClientId === BOT_PLAYER_ID;
    if (isSinglePlay &&
      (response.status === AttackResult.miss &&
        indexPlayer !== BOT_PLAYER_ID) ||
      (response.status !== AttackResult.miss && indexPlayer === BOT_PLAYER_ID)
    ) {
      setTimeout(
        () =>
          randomAttack(
            { gameId: game.id, indexPlayer: BOT_PLAYER_ID },
            BOT_PLAYER_ID,
            wsResponse
          ),
        BOT_TIMEOUT
      );
    }
  }
};
