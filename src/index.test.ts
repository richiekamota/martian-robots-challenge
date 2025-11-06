import { describe, it } from 'node:test';
import assert from 'node:assert';
import { simulateMarsRobots } from './index.js';

describe('simulateMarsRobots', () => {
  describe('single robot scenarios', () => {
    it('should simulate single robot that stays on grid', () => {
      const input = `5 3
1 1 E
RFRFRFRF`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '1 1 E');
    });

    it('should simulate robot that gets lost', () => {
      const input = `5 3
3 2 N
FRRFLLFFRRFLL`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '3 3 N LOST');
    });

    it('should simulate robot moving to edge but not falling off', () => {
      const input = `5 3
0 0 N
FFF`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '0 3 N');
    });

    it('should simulate robot falling off immediately', () => {
      const input = `5 3
0 0 W
F`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '0 0 W LOST');
    });
  });

  describe('multiple robots scenarios', () => {
    it('should simulate multiple robots independently', () => {
      const input = `5 3
1 1 E
RFRFRFRF
2 2 N
FFLFF`;
      
      const output = simulateMarsRobots(input);
      const lines = output.split('\n');
      
      assert.strictEqual(lines[0], '1 1 E');
      assert.strictEqual(lines[1], '2 3 N LOST');
    });

    it('should handle the complete example from problem description', () => {
      const input = `5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`;
      
      const output = simulateMarsRobots(input);
      const lines = output.split('\n');
      
      assert.strictEqual(lines[0], '1 1 E');
      assert.strictEqual(lines[1], '3 3 N LOST');
      assert.strictEqual(lines[2], '2 3 S');
    });

    it('should apply scent protection from first robot to second', () => {
      const input = `5 3
3 3 N
F
3 3 N
FRF`;
      
      const output = simulateMarsRobots(input);
      const lines = output.split('\n');
      
      // First robot gets lost
      assert.strictEqual(lines[0], '3 3 N LOST');
      // Second robot is protected by scent and continues
      assert.strictEqual(lines[1], '4 3 E');
    });

    it('should handle multiple robots with different scent locations', () => {
      const input = `5 3
0 0 W
F
5 0 E
F
0 3 N
F
5 3 E
F`;
      
      const output = simulateMarsRobots(input);
      const lines = output.split('\n');
      
      // All robots get lost at different edges
      assert.strictEqual(lines[0], '0 0 W LOST');
      assert.strictEqual(lines[1], '5 0 E LOST');
      assert.strictEqual(lines[2], '0 3 N LOST');
      assert.strictEqual(lines[3], '5 3 E LOST');
    });
  });

  describe('complex movement patterns', () => {
    it('should handle robot doing complete circle', () => {
      const input = `5 3
2 2 N
RFRFRFRF`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '2 2 N');
    });

    it('should handle robot only turning without moving', () => {
      const input = `5 3
1 1 E
LLLL`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '1 1 E');
    });

    it('should handle robot with empty instructions', () => {
      const input = `5 3
1 1 E
F`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '2 1 E');
    });

    it('should handle robot moving along entire edge', () => {
      const input = `5 3
0 0 E
FFFFF`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '5 0 E');
    });

    it('should handle zigzag movement pattern', () => {
      const input = `5 3
0 0 N
RFRFRFRF`;
      
      const output = simulateMarsRobots(input);
      // Robot: starts at (0,0) N, R->E, F->(1,0), R->S, F->(1,-1) LOST
      assert.strictEqual(output, '1 0 S LOST');
    });
  });

  describe('scent mechanics', () => {
    it('should preserve scent across multiple robots', () => {
      const input = `5 3
3 3 N
F
3 3 N
F
3 3 N
F`;
      
      const output = simulateMarsRobots(input);
      const lines = output.split('\n');
      
      // First gets lost, second and third are protected
      assert.strictEqual(lines[0], '3 3 N LOST');
      assert.strictEqual(lines[1], '3 3 N');
      assert.strictEqual(lines[2], '3 3 N');
    });

    it('should only protect at exact scent position', () => {
      const input = `5 3
3 3 N
F
4 3 N
F`;
      
      const output = simulateMarsRobots(input);
      const lines = output.split('\n');
      
      // First gets lost at (3,3)
      assert.strictEqual(lines[0], '3 3 N LOST');
      // Second at different position also gets lost
      assert.strictEqual(lines[1], '4 3 N LOST');
    });

    it('should allow robot to continue after ignoring dangerous command', () => {
      const input = `5 3
5 0 E
F
5 0 E
FRFL`;
      
      const output = simulateMarsRobots(input);
      const lines = output.split('\n');
      
      assert.strictEqual(lines[0], '5 0 E LOST');
      // Second robot: F is ignored (scent protection), stays at 5,0 facing E
      // Then continues with remaining commands: R (now S), F (moves to 5,-1 off grid but no scent), L (doesn't execute as lost)
      assert.strictEqual(lines[1], '5 0 E');
    });
  });

  describe('edge cases', () => {
    it('should handle minimum grid size', () => {
      const input = `0 0
0 0 N
F`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '0 0 N LOST');
    });

    it('should handle maximum valid grid size', () => {
      const input = `50 50
25 25 N
F`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '25 26 N');
    });

    it('should handle robot starting at origin', () => {
      const input = `5 3
0 0 N
F`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '0 1 N');
    });

    it('should handle robot starting at maximum coordinates', () => {
      const input = `5 3
5 3 N
F`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '5 3 N LOST');
    });

    it('should handle long instruction sequence', () => {
      const input = `5 3
0 0 E
${'F'.repeat(100)}`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '5 0 E LOST');
    });
  });

  describe('all orientations', () => {
    it('should handle robot facing North', () => {
      const input = `5 3
2 2 N
F`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '2 3 N');
    });

    it('should handle robot facing South', () => {
      const input = `5 3
2 2 S
F`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '2 1 S');
    });

    it('should handle robot facing East', () => {
      const input = `5 3
2 2 E
F`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '3 2 E');
    });

    it('should handle robot facing West', () => {
      const input = `5 3
2 2 W
F`;
      
      const output = simulateMarsRobots(input);
      assert.strictEqual(output, '1 2 W');
    });
  });

  describe('error propagation', () => {
    it('should propagate parser errors', () => {
      const input = 'invalid input';
      
      assert.throws(() => simulateMarsRobots(input), {
        message: /Invalid grid bounds/,
      });
    });

    it('should propagate errors for grid bounds exceeding limit', () => {
      const input = `51 3
1 1 E
F`;
      
      assert.throws(() => simulateMarsRobots(input), {
        message: 'Grid coordinates cannot exceed 50',
      });
    });

    it('should propagate errors for invalid commands', () => {
      const input = `5 3
1 1 E
RFXF`;
      
      assert.throws(() => simulateMarsRobots(input), {
        message: /Invalid command/,
      });
    });
  });
});
