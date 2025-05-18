import { randomUUID } from 'crypto';
import { Game, GameType } from '../../models/Game';
import { Player } from '../../models/Player';
import { AttackResult, Position, Ship } from '../../models/Ship';
import { GameCollectionRepository } from './GameCollectionRepository';
import { BOT_PLAYER_ID, BOT_SHIP_VARIANTS } from '../../constants';

class GameCollection implements GameCollectionRepository {
  #games: Game[] = [];

  createGame(players: Pick<Player, 'clientId'>[]): Game {
    const firstPlayerId = randomUUID();
    const secondPlayerId = randomUUID();

    const game = {
      id: this.#games.length + 1,
      players: {
        [firstPlayerId]: {
          clientId: players[0].clientId,
          ships: [],
        },
        [secondPlayerId]: {
          clientId: players[1].clientId,
          ships: [],
        },
      },
      currentPlayerIndex: firstPlayerId,
      type: GameType.multiPlay,
    };

    this.#games.push(game);

    return game;
  }

  #generateBotShips(): Ship[] {
    const randomIndex = Math.floor(Math.random() * (BOT_SHIP_VARIANTS.length + 1));

    return BOT_SHIP_VARIANTS[randomIndex] as Ship[];
  }
 
  createSinglePlayGame(player: Pick<Player, 'clientId'>): Game {
    const playerId = randomUUID();

    const game = {
      id: this.#games.length + 1,
      players: {
        [playerId]: {
          clientId: player.clientId,
          ships: [],
        },
        [BOT_PLAYER_ID]: {
          clientId: BOT_PLAYER_ID,
          ships: this.#generateBotShips().map((ship) => ({
            ...ship,
            activeShipPositions: this.#calcActiveShipPositions(ship),
          })),
        },
      },
      currentPlayerIndex: playerId,
      type: GameType.singlePlay,
    };

    this.#games.push(game);

    return game;
  }

  findGameById(id: Game['id']): Game | null {
    return this.#games.find((game) => game.id === id) ?? null;
  }

  #calcActiveShipPositions({ position, length, direction }: Ship) {
    const activeShipPositions = [];
    for (let i = 0; i < length; i++) {
      activeShipPositions.push({
        x: !direction ? position.x + i : position.x,
        y: !direction ? position.y : position.y + i,
      });
    }
    return activeShipPositions;
  }

  addShips(id: Game['id'], ships: Ship[], indexPlayer: string): Game | null {
    let currentGame = null;
    this.#games.forEach((game) => {
      if (game.id === id && game.players[indexPlayer]) {
        game.players[indexPlayer].ships = [
          ...ships.map((ship) => ({
            ...ship,
            activeShipPositions: this.#calcActiveShipPositions(ship),
          })),
        ];
        currentGame = game;
      }
    });
    return currentGame;
  }

  attack(
    id: Game['id'],
    position: Position,
    indexPlayer: string
  ): AttackResult {
    let result = AttackResult.miss;

    for (let i = 0; i < this.#games.length; i++) {
      const game = this.#games[i];

      if (game.id === id && game.players[indexPlayer]) {
        const players = Object.keys(game.players);
        const enemy = players[0] === indexPlayer ? players[1] : players[0];
        const enemyShips = game.players[enemy].ships;
        const checkShipPosition = (pos: Position) =>
          pos.x === position.x && pos.y === position.y;

        enemyShips.forEach((ship, ind) => {
          if (ship.activeShipPositions.find(checkShipPosition)) {
            const newShipPositions = enemyShips[ind].activeShipPositions.filter(
              (pos) => !checkShipPosition(pos)
            );
            enemyShips[ind] = {
              ...enemyShips[ind],
              activeShipPositions: newShipPositions,
            };
            result =
              newShipPositions.length > 0
                ? AttackResult.shot
                : AttackResult.killed;
          }
        });

        if (result === AttackResult.miss) {
          game.currentPlayerIndex = enemy;
        }
      }
    }

    return result;
  }

  checkIsGameFinished(id: Game['id']): {
    winnerClientId: Player['clientId'] | null;
    winnerGameId: string | null;
  } {
    let winnerGameId = null;
    let winnerClientId = null;

    this.#games.forEach((game) => {
      if (game.id === id) {
        const playerIds = Object.keys(game.players);
        const players = Object.values(game.players);
        players.forEach((player, pos) => {
          const ships = player.ships;
          const hasNoShips = ships.every(
            (ship) => ship.activeShipPositions.length === 0
          );
          if (hasNoShips) {
            const anotherPlayerId = players.length - pos - 1;
            winnerClientId = players[anotherPlayerId].clientId;
            winnerGameId = playerIds[anotherPlayerId];
          }
        });
      }
    });

    return {
      winnerClientId,
      winnerGameId,
    };
  }
}

export const GameCollectionEntity = new GameCollection();
