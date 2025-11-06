import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Grid } from './Grid.js';

describe('Grid', () => {
  describe('constructor', () => {
    it('should create a grid with specified dimensions', () => {
      const grid = new Grid(5, 3);
      assert.ok(grid instanceof Grid);
    });
  });

  describe('isWithinBounds', () => {
    it('should return true for position within bounds', () => {
      const grid = new Grid(5, 3);
      assert.strictEqual(grid.isWithinBounds({ x: 0, y: 0 }), true);
      assert.strictEqual(grid.isWithinBounds({ x: 5, y: 3 }), true);
      assert.strictEqual(grid.isWithinBounds({ x: 2, y: 2 }), true);
    });

    it('should return false for position outside bounds', () => {
      const grid = new Grid(5, 3);
      assert.strictEqual(grid.isWithinBounds({ x: -1, y: 0 }), false);
      assert.strictEqual(grid.isWithinBounds({ x: 0, y: -1 }), false);
      assert.strictEqual(grid.isWithinBounds({ x: 6, y: 3 }), false);
      assert.strictEqual(grid.isWithinBounds({ x: 5, y: 4 }), false);
      assert.strictEqual(grid.isWithinBounds({ x: 10, y: 10 }), false);
    });

    it('should handle edge cases at boundaries', () => {
      const grid = new Grid(5, 3);
      assert.strictEqual(grid.isWithinBounds({ x: 0, y: 0 }), true);
      assert.strictEqual(grid.isWithinBounds({ x: 5, y: 0 }), true);
      assert.strictEqual(grid.isWithinBounds({ x: 0, y: 3 }), true);
      assert.strictEqual(grid.isWithinBounds({ x: 5, y: 3 }), true);
    });
  });

  describe('hasScent', () => {
    it('should return false for position without scent', () => {
      const grid = new Grid(5, 3);
      assert.strictEqual(grid.hasScent({ x: 1, y: 1 }), false);
    });

    it('should return true for position with scent', () => {
      const grid = new Grid(5, 3);
      grid.addScent({ x: 1, y: 1 });
      assert.strictEqual(grid.hasScent({ x: 1, y: 1 }), true);
    });

    it('should differentiate between different positions', () => {
      const grid = new Grid(5, 3);
      grid.addScent({ x: 1, y: 1 });
      assert.strictEqual(grid.hasScent({ x: 1, y: 1 }), true);
      assert.strictEqual(grid.hasScent({ x: 1, y: 2 }), false);
      assert.strictEqual(grid.hasScent({ x: 2, y: 1 }), false);
    });
  });

  describe('addScent', () => {
    it('should add scent at specified position', () => {
      const grid = new Grid(5, 3);
      grid.addScent({ x: 3, y: 2 });
      assert.strictEqual(grid.hasScent({ x: 3, y: 2 }), true);
    });

    it('should handle multiple scents at different positions', () => {
      const grid = new Grid(5, 3);
      grid.addScent({ x: 1, y: 1 });
      grid.addScent({ x: 3, y: 2 });
      grid.addScent({ x: 0, y: 3 });
      
      assert.strictEqual(grid.hasScent({ x: 1, y: 1 }), true);
      assert.strictEqual(grid.hasScent({ x: 3, y: 2 }), true);
      assert.strictEqual(grid.hasScent({ x: 0, y: 3 }), true);
      assert.strictEqual(grid.hasScent({ x: 2, y: 2 }), false);
    });

    it('should handle adding scent to same position multiple times', () => {
      const grid = new Grid(5, 3);
      grid.addScent({ x: 1, y: 1 });
      grid.addScent({ x: 1, y: 1 });
      assert.strictEqual(grid.hasScent({ x: 1, y: 1 }), true);
    });
  });
});
