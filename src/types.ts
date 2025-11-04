/**
 * Represents the four cardinal directions
 */
export type Orientation = 'N' | 'S' | 'E' | 'W';

/**
 * Represents the three possible robot commands
 */
export type Command = 'L' | 'R' | 'F';

/**
 * Represents a coordinate position on the Mars grid
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Represents a robot's complete state
 */
export interface RobotState {
  position: Position;
  orientation: Orientation;
  isLost: boolean;
}

/**
 * Represents the input data for a robot
 */
export interface RobotInput {
  startPosition: Position;
  startOrientation: Orientation;
  instructions: Command[];
}

/**
 * Represents the bounds of the Mars grid
 */
export interface GridBounds {
  maxX: number;
  maxY: number;
}
