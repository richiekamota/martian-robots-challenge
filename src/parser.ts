import type { GridBounds, RobotInput, Orientation, Command } from './types.js';

/**
 * Parses the input string and returns grid bounds and robot inputs
 */
export function parseInput(input: string): {
  gridBounds: GridBounds;
  robots: RobotInput[];
} {
  const lines = input.trim().split('\n').map(line => line.trim());

  if (lines.length < 1) {
    throw new Error('Input must contain at least the grid bounds');
  }

  // Parse grid bounds from first line
  const gridBounds = parseGridBounds(lines[0]!);

  // Parse robot instructions (pairs of lines)
  const robots: RobotInput[] = [];
  for (let i = 1; i < lines.length; i += 2) {
    if (i + 1 < lines.length) {
      const robot = parseRobot(lines[i]!, lines[i + 1]!);
      robots.push(robot);
    }
  }

  return { gridBounds, robots };
}

/**
 * Parses the grid bounds from a string like "5 3"
 */
function parseGridBounds(line: string): GridBounds {
  const parts = line.split(/\s+/);
  
  if (parts.length !== 2) {
    throw new Error(`Invalid grid bounds format: ${line}`);
  }

  const maxX = parseInt(parts[0]!, 10);
  const maxY = parseInt(parts[1]!, 10);

  if (isNaN(maxX) || isNaN(maxY)) {
    throw new Error(`Invalid grid bounds: ${line}`);
  }

  if (maxX > 50 || maxY > 50) {
    throw new Error('Grid coordinates cannot exceed 50');
  }

  return { maxX, maxY };
}

/**
 * Parses a robot's starting position and instructions
 */
function parseRobot(positionLine: string, instructionLine: string): RobotInput {
  // Parse position line (e.g., "1 1 E")
  const parts = positionLine.split(/\s+/);
  
  if (parts.length !== 3) {
    throw new Error(`Invalid robot position format: ${positionLine}`);
  }

  const x = parseInt(parts[0]!, 10);
  const y = parseInt(parts[1]!, 10);
  const orientation = parts[2]! as Orientation;

  if (isNaN(x) || isNaN(y)) {
    throw new Error(`Invalid coordinates: ${positionLine}`);
  }

  if (!['N', 'S', 'E', 'W'].includes(orientation)) {
    throw new Error(`Invalid orientation: ${orientation}`);
  }

  // Parse instruction line (e.g., "RFRFRFRF")
  const instructions = parseInstructions(instructionLine);

  return {
    startPosition: { x, y },
    startOrientation: orientation,
    instructions,
  };
}

/**
 * Parses instruction string into an array of commands
 */
function parseInstructions(line: string): Command[] {
  if (line.length > 100) {
    throw new Error('Instruction string cannot exceed 100 characters');
  }

  const instructions: Command[] = [];
  
  for (const char of line) {
    if (!['L', 'R', 'F'].includes(char)) {
      throw new Error(`Invalid command: ${char}`);
    }
    instructions.push(char as Command);
  }

  return instructions;
}
