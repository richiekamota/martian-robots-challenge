import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Robot } from './Robot.js';
import { Grid } from './Grid.js';

describe('Robot', () => {
  describe('constructor', () => {
    it('should create a robot at specified position and orientation', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(1, 1, 'N', grid);
      const state = robot.getState();
      
      assert.strictEqual(state.position.x, 1);
      assert.strictEqual(state.position.y, 1);
      assert.strictEqual(state.orientation, 'N');
      assert.strictEqual(state.isLost, false);
    });
  });

  describe('getState', () => {
    it('should return current robot state', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(2, 3, 'E', grid);
      const state = robot.getState();
      
      assert.deepStrictEqual(state, {
        position: { x: 2, y: 3 },
        orientation: 'E',
        isLost: false,
      });
    });

    it('should return a copy of position, not reference', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(1, 1, 'N', grid);
      const state1 = robot.getState();
      state1.position.x = 999;
      
      const state2 = robot.getState();
      assert.strictEqual(state2.position.x, 1);
    });
  });

  describe('executeCommands - turning', () => {
    it('should turn left from North to West', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(1, 1, 'N', grid);
      robot.executeCommands(['L']);
      assert.strictEqual(robot.getState().orientation, 'W');
    });

    it('should turn right from North to East', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(1, 1, 'N', grid);
      robot.executeCommands(['R']);
      assert.strictEqual(robot.getState().orientation, 'E');
    });

    it('should complete full left rotation', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(1, 1, 'N', grid);
      robot.executeCommands(['L', 'L', 'L', 'L']);
      assert.strictEqual(robot.getState().orientation, 'N');
    });

    it('should complete full right rotation', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(1, 1, 'N', grid);
      robot.executeCommands(['R', 'R', 'R', 'R']);
      assert.strictEqual(robot.getState().orientation, 'N');
    });

    it('should handle complex turn sequences', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(1, 1, 'N', grid);
      robot.executeCommands(['R', 'R', 'L']);
      assert.strictEqual(robot.getState().orientation, 'E');
    });
  });

  describe('executeCommands - moving', () => {
    it('should move forward when facing North', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(1, 1, 'N', grid);
      robot.executeCommands(['F']);
      
      const state = robot.getState();
      assert.strictEqual(state.position.x, 1);
      assert.strictEqual(state.position.y, 2);
    });

    it('should move forward when facing South', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(1, 2, 'S', grid);
      robot.executeCommands(['F']);
      
      const state = robot.getState();
      assert.strictEqual(state.position.x, 1);
      assert.strictEqual(state.position.y, 1);
    });

    it('should move forward when facing East', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(1, 1, 'E', grid);
      robot.executeCommands(['F']);
      
      const state = robot.getState();
      assert.strictEqual(state.position.x, 2);
      assert.strictEqual(state.position.y, 1);
    });

    it('should move forward when facing West', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(2, 1, 'W', grid);
      robot.executeCommands(['F']);
      
      const state = robot.getState();
      assert.strictEqual(state.position.x, 1);
      assert.strictEqual(state.position.y, 1);
    });
  });

  describe('executeCommands - getting lost', () => {
    it('should get lost when moving off north edge', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(0, 3, 'N', grid);
      robot.executeCommands(['F']);
      
      const state = robot.getState();
      assert.strictEqual(state.position.x, 0);
      assert.strictEqual(state.position.y, 3);
      assert.strictEqual(state.isLost, true);
    });

    it('should get lost when moving off south edge', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(0, 0, 'S', grid);
      robot.executeCommands(['F']);
      
      const state = robot.getState();
      assert.strictEqual(state.position.x, 0);
      assert.strictEqual(state.position.y, 0);
      assert.strictEqual(state.isLost, true);
    });

    it('should get lost when moving off east edge', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(5, 0, 'E', grid);
      robot.executeCommands(['F']);
      
      const state = robot.getState();
      assert.strictEqual(state.position.x, 5);
      assert.strictEqual(state.position.y, 0);
      assert.strictEqual(state.isLost, true);
    });

    it('should get lost when moving off west edge', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(0, 0, 'W', grid);
      robot.executeCommands(['F']);
      
      const state = robot.getState();
      assert.strictEqual(state.position.x, 0);
      assert.strictEqual(state.position.y, 0);
      assert.strictEqual(state.isLost, true);
    });

    it('should leave a scent when getting lost', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(3, 2, 'N', grid);
      robot.executeCommands(['F', 'F']);
      
      assert.strictEqual(robot.getState().isLost, true);
      assert.strictEqual(grid.hasScent({ x: 3, y: 3 }), true);
    });

    it('should ignore commands after getting lost', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(0, 3, 'N', grid);
      robot.executeCommands(['F', 'R', 'F', 'F']);
      
      const state = robot.getState();
      assert.strictEqual(state.position.x, 0);
      assert.strictEqual(state.position.y, 3);
      assert.strictEqual(state.orientation, 'N');
      assert.strictEqual(state.isLost, true);
    });
  });

  describe('executeCommands - scent protection', () => {
    it('should not get lost at position with scent', () => {
      const grid = new Grid(5, 3);
      
      // First robot gets lost
      const robot1 = new Robot(3, 2, 'N', grid);
      robot1.executeCommands(['F', 'F']);
      assert.strictEqual(robot1.getState().isLost, true);
      
      // Second robot at same position should be protected
      const robot2 = new Robot(3, 3, 'N', grid);
      robot2.executeCommands(['F']);
      
      const state = robot2.getState();
      assert.strictEqual(state.position.x, 3);
      assert.strictEqual(state.position.y, 3);
      assert.strictEqual(state.isLost, false);
    });

    it('should stay at scent position and continue with next commands', () => {
      const grid = new Grid(5, 3);
      
      // First robot gets lost
      const robot1 = new Robot(3, 3, 'N', grid);
      robot1.executeCommands(['F']);
      assert.strictEqual(robot1.getState().isLost, true);
      
      // Second robot should ignore dangerous command but execute others
      const robot2 = new Robot(3, 3, 'N', grid);
      robot2.executeCommands(['F', 'R', 'R', 'F']);
      
      const state = robot2.getState();
      assert.strictEqual(state.position.x, 3);
      assert.strictEqual(state.position.y, 2);
      assert.strictEqual(state.orientation, 'S');
      assert.strictEqual(state.isLost, false);
    });
  });

  describe('executeCommands - example scenarios', () => {
    it('should handle example 1: (1, 1, E) with RFRFRFRF', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(1, 1, 'E', grid);
      robot.executeCommands(['R', 'F', 'R', 'F', 'R', 'F', 'R', 'F']);
      
      const state = robot.getState();
      assert.strictEqual(state.position.x, 1);
      assert.strictEqual(state.position.y, 1);
      assert.strictEqual(state.orientation, 'E');
      assert.strictEqual(state.isLost, false);
    });

    it('should handle example 2: (3, 2, N) with FRRFLLFFRRFLL', () => {
      const grid = new Grid(5, 3);
      const robot = new Robot(3, 2, 'N', grid);
      robot.executeCommands(['F', 'R', 'R', 'F', 'L', 'L', 'F', 'F', 'R', 'R', 'F', 'L', 'L']);
      
      const state = robot.getState();
      assert.strictEqual(state.position.x, 3);
      assert.strictEqual(state.position.y, 3);
      assert.strictEqual(state.orientation, 'N');
      assert.strictEqual(state.isLost, true);
    });

    it('should handle example 3: (0, 3, W) with LLFFFLFLFL', () => {
      const grid = new Grid(5, 3);
      
      // First robot leaves scent
      const robot1 = new Robot(3, 2, 'N', grid);
      robot1.executeCommands(['F', 'R', 'R', 'F', 'L', 'L', 'F', 'F', 'R', 'R', 'F', 'L', 'L']);
      
      const robot2 = new Robot(0, 3, 'W', grid);
      robot2.executeCommands(['L', 'L', 'F', 'F', 'F', 'L', 'F', 'L', 'F', 'L']);
      
      const state = robot2.getState();
      assert.strictEqual(state.position.x, 2);
      assert.strictEqual(state.position.y, 3);
      assert.strictEqual(state.orientation, 'S');
      assert.strictEqual(state.isLost, false);
    });
  });
});
