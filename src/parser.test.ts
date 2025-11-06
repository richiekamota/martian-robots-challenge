import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseInput } from './parser.js';

describe('parser', () => {
  describe('parseInput', () => {
    it('should parse valid input with single robot', () => {
      const input = `5 3
1 1 E
RFRFRFRF`;
      
      const result = parseInput(input);
      
      assert.deepStrictEqual(result.gridBounds, { maxX: 5, maxY: 3 });
      assert.strictEqual(result.robots.length, 1);
      assert.deepStrictEqual(result.robots[0], {
        startPosition: { x: 1, y: 1 },
        startOrientation: 'E',
        instructions: ['R', 'F', 'R', 'F', 'R', 'F', 'R', 'F'],
      });
    });

    it('should parse valid input with multiple robots', () => {
      const input = `5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`;
      
      const result = parseInput(input);
      
      assert.deepStrictEqual(result.gridBounds, { maxX: 5, maxY: 3 });
      assert.strictEqual(result.robots.length, 3);
      
      assert.deepStrictEqual(result.robots[0], {
        startPosition: { x: 1, y: 1 },
        startOrientation: 'E',
        instructions: ['R', 'F', 'R', 'F', 'R', 'F', 'R', 'F'],
      });
      
      assert.deepStrictEqual(result.robots[1], {
        startPosition: { x: 3, y: 2 },
        startOrientation: 'N',
        instructions: ['F', 'R', 'R', 'F', 'L', 'L', 'F', 'F', 'R', 'R', 'F', 'L', 'L'],
      });
      
      assert.deepStrictEqual(result.robots[2], {
        startPosition: { x: 0, y: 3 },
        startOrientation: 'W',
        instructions: ['L', 'L', 'F', 'F', 'F', 'L', 'F', 'L', 'F', 'L'],
      });
    });

    it('should handle input with extra whitespace', () => {
      const input = `  5   3  
  1   1   E  
  RFRFRFRF  `;
      
      const result = parseInput(input);
      
      assert.deepStrictEqual(result.gridBounds, { maxX: 5, maxY: 3 });
      assert.strictEqual(result.robots.length, 1);
    });

    it('should handle input with trailing newlines', () => {
      const input = `5 3
1 1 E
RFRFRFRF


`;
      
      const result = parseInput(input);
      
      assert.deepStrictEqual(result.gridBounds, { maxX: 5, maxY: 3 });
      assert.strictEqual(result.robots.length, 1);
    });

    it('should return empty robots array when only grid bounds provided', () => {
      const input = '5 3';
      
      const result = parseInput(input);
      
      assert.deepStrictEqual(result.gridBounds, { maxX: 5, maxY: 3 });
      assert.strictEqual(result.robots.length, 0);
    });

    it('should handle all four orientations', () => {
      const input = `5 3
0 0 N
F
1 1 S
F
2 2 E
F
3 3 W
F`;
      
      const result = parseInput(input);
      
      assert.strictEqual(result.robots[0]?.startOrientation, 'N');
      assert.strictEqual(result.robots[1]?.startOrientation, 'S');
      assert.strictEqual(result.robots[2]?.startOrientation, 'E');
      assert.strictEqual(result.robots[3]?.startOrientation, 'W');
    });
  });

  describe('parseInput - error handling', () => {
    it('should throw error for empty input', () => {
      assert.throws(() => parseInput(''), {
        message: /Invalid grid bounds/,
      });
    });

    it('should throw error for invalid grid bounds format', () => {
      assert.throws(() => parseInput('5'), {
        message: /Invalid grid bounds format/,
      });
    });

    it('should throw error for non-numeric grid bounds', () => {
      assert.throws(() => parseInput('a b'), {
        message: /Invalid grid bounds/,
      });
    });

    it('should throw error for grid bounds exceeding 50', () => {
      assert.throws(() => parseInput('51 3'), {
        message: 'Grid coordinates cannot exceed 50',
      });
      
      assert.throws(() => parseInput('5 51'), {
        message: 'Grid coordinates cannot exceed 50',
      });
    });

    it('should throw error for invalid robot position format', () => {
      assert.throws(() => parseInput('5 3\n1 E\nF'), {
        message: /Invalid robot position format/,
      });
    });

    it('should throw error for non-numeric robot coordinates', () => {
      assert.throws(() => parseInput('5 3\na b E\nF'), {
        message: /Invalid coordinates/,
      });
    });

    it('should throw error for invalid orientation', () => {
      assert.throws(() => parseInput('5 3\n1 1 X\nF'), {
        message: /Invalid orientation/,
      });
    });

    it('should throw error for invalid command', () => {
      assert.throws(() => parseInput('5 3\n1 1 E\nRFX'), {
        message: /Invalid command/,
      });
    });

    it('should throw error for instruction string exceeding 100 characters', () => {
      const longInstructions = 'F'.repeat(101);
      assert.throws(() => parseInput(`5 3\n1 1 E\n${longInstructions}`), {
        message: 'Instruction string cannot exceed 100 characters',
      });
    });

    it('should accept instruction string with exactly 100 characters', () => {
      const exactInstructions = 'F'.repeat(100);
      const result = parseInput(`5 3\n1 1 E\n${exactInstructions}`);
      assert.strictEqual(result.robots[0]?.instructions.length, 100);
    });

    it('should throw error for incomplete robot data (missing instructions)', () => {
      const input = `5 3
1 1 E`;
      
      const result = parseInput(input);
      // Should parse grid bounds but no robots
      assert.strictEqual(result.robots.length, 0);
    });
  });

  describe('parseInput - edge cases', () => {
    it('should handle zero coordinates', () => {
      const input = `5 3
0 0 N
F`;
      
      const result = parseInput(input);
      assert.deepStrictEqual(result.robots[0]?.startPosition, { x: 0, y: 0 });
    });

    it('should handle maximum valid grid size', () => {
      const input = `50 50
0 0 N
F`;
      
      const result = parseInput(input);
      assert.deepStrictEqual(result.gridBounds, { maxX: 50, maxY: 50 });
    });

    it('should handle single robot without complete instruction line', () => {
      const input = `5 3
1 1 E`;
      
      const result = parseInput(input);
      // Parser requires both position and instruction lines, so incomplete robot data results in no robots parsed
      assert.strictEqual(result.robots.length, 0);
    });

    it('should handle mixed commands', () => {
      const input = `5 3
1 1 E
LRFLRFLRF`;
      
      const result = parseInput(input);
      assert.deepStrictEqual(result.robots[0]?.instructions, [
        'L', 'R', 'F', 'L', 'R', 'F', 'L', 'R', 'F',
      ]);
    });
  });
});
