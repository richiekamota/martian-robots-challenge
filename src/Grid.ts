import type { Position, GridBounds } from './types.js';

/**
 * Manages the Mars grid surface and tracks scents left by lost robots
 */
export class Grid {
  private bounds: GridBounds;
  private scents: Set<string>;

  constructor(maxX: number, maxY: number) {
    this.bounds = { maxX, maxY };
    this.scents = new Set<string>();
  }

  /**
   * Checks if a position is within the grid bounds
   */
  isWithinBounds(position: Position): boolean {
    return (
      position.x >= 0 &&
      position.x <= this.bounds.maxX &&
      position.y >= 0 &&
      position.y <= this.bounds.maxY
    );
  }

  /**
   * Checks if there's a scent at the given position
   * (i.e., a robot was previously lost here)
   */
  hasScent(position: Position): boolean {
    return this.scents.has(this.positionToKey(position));
  }

  /**
   * Marks a position with a scent (called when a robot is lost)
   */
  addScent(position: Position): void {
    this.scents.add(this.positionToKey(position));
  }

  /**
   * Converts a position to a unique string key for storage
   */
  private positionToKey(position: Position): string {
    return `${position.x},${position.y}`;
  }
}
