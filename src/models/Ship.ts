export enum ShipType {
  small = 'small',
  meduim = 'medium',
  large = 'large',
  huge = 'huge',
}

export enum AttackResult {
  miss = 'miss',
  killed = 'killed',
  shot = 'shot',
}

export interface Position {
  x: number;
  y: number;
}

export interface Ship {
  position: Position;
  direction: boolean;
  length: number;
  type: ShipType;
  activeShipPositions: Position[];
}
