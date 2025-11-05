import type { Position, Orientation, Command, RobotState } from './types.js';
import { Grid } from './Grid.js';

/**
 * Represents a robot that can move on the Mars grid
 */
export class Robot {
  private position: Position;
  private orientation: Orientation;
  private isLost: boolean;
  private grid: Grid;

  constructor(x: number, y: number, orientation: Orientation, grid: Grid) {
    this.position = { x, y };
    this.orientation = orientation;
    this.isLost = false;
    this.grid = grid;
  }

  /**
   * Executes a sequence of commands
   */
  executeCommands(commands: Command[]): void {
    for (const command of commands) {
      if (this.isLost) {
        break; // Lost robots ignore further commands
      }

      switch (command) {
        case 'L':
          this.turnLeft();
          break;
        case 'R':
          this.turnRight();
          break;
        case 'F':
          this.moveForward();
          break;
      }
    }
  }

  /**
   * Turns the robot 90 degrees left
   */
  private turnLeft(): void {
    const leftTurns: Record<Orientation, Orientation> = {
      N: 'W',
      W: 'S',
      S: 'E',
      E: 'N',
    };
    this.orientation = leftTurns[this.orientation];
  }

  /**
   * Turns the robot 90 degrees right
   */
  private turnRight(): void {
    const rightTurns: Record<Orientation, Orientation> = {
      N: 'E',
      E: 'S',
      S: 'W',
      W: 'N',
    };
    this.orientation = rightTurns[this.orientation];
  }

  /**
   * Moves the robot forward one grid point in its current orientation
   */
  private moveForward(): void {
    const nextPosition = this.calculateNextPosition();

    // Check if the next position is off the grid
    if (!this.grid.isWithinBounds(nextPosition)) {
      // Check if there's a scent at the current position
      if (this.grid.hasScent(this.position)) {
        // Ignore the command (robot stays at current position)
        return;
      } else {
        // Robot falls off the edge
        this.grid.addScent(this.position); // Leave scent at last position
        this.isLost = true;
        return;
      }
    }

    // Move to the next position
    this.position = nextPosition;
  }

  /**
   * Calculates the next position based on current orientation
   */
  private calculateNextPosition(): Position {
    const { x, y } = this.position;

    switch (this.orientation) {
      case 'N':
        return { x, y: y + 1 };
      case 'S':
        return { x, y: y - 1 };
      case 'E':
        return { x: x + 1, y };
      case 'W':
        return { x: x - 1, y };
    }
  }

  /**
   * Returns the current state of the robot
   */
  getState(): RobotState {
    return {
      position: { ...this.position },
      orientation: this.orientation,
      isLost: this.isLost,
    };
  }
}
