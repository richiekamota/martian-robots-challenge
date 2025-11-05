import { Grid } from './Grid.js';
import { Robot } from './Robot.js';
import { parseInput } from './parser.js';
import type { RobotState } from './types.js';

/**
 * Simulates the Mars robots based on input string
 */
export function simulateMarsRobots(input: string): string {
  // Parse the input
  const { gridBounds, robots } = parseInput(input);

  // Create the Mars grid
  const grid = new Grid(gridBounds.maxX, gridBounds.maxY);

  // Process each robot sequentially
  const results: string[] = [];
  
  for (const robotInput of robots) {
    const robot = new Robot(
      robotInput.startPosition.x,
      robotInput.startPosition.y,
      robotInput.startOrientation,
      grid
    );

    // Execute the robot's instructions
    robot.executeCommands(robotInput.instructions);

    // Get the final state and format output
    const state = robot.getState();
    results.push(formatOutput(state));
  }

  return results.join('\n');
}

/**
 * Formats the robot's final state as output
 */
function formatOutput(state: RobotState): string {
  const { position, orientation, isLost } = state;
  const positionStr = `${position.x} ${position.y} ${orientation}`;
  return isLost ? `${positionStr} LOST` : positionStr;
}

/**
 * Main function - reads input and outputs results
 */
async function main(): Promise<void> {
  // Check if input file is provided as command line argument
  const args = process.argv.slice(2);
  
  let input: string;

  if (args.length > 0) {
    // Read from file
    const fs = await import('fs');
    const filePath = args[0]!;
    input = fs.readFileSync(filePath, 'utf-8');
  } else {
    // Read from stdin
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    input = Buffer.concat(chunks).toString('utf-8');
  }

  try {
    const output = simulateMarsRobots(input);
    console.log(output);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
