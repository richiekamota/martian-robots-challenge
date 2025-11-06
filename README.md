# Martian Robots Challenge

A TypeScript solution for the Martian Robots programming challenge. This application simulates robots moving on a rectangular Mars grid, with support for robot "scents" that prevent future robots from falling off at the same locations.

## Problem Description

The surface of Mars is modeled as a rectangular grid where robots can move according to instructions from Earth. Each robot:
- Has a position (x, y coordinates) and orientation (N, S, E, W)
- Can turn left (L), turn right (R), or move forward (F)
- Leaves a "scent" if it falls off the edge, preventing future robots from falling at that spot

## Solution Architecture

The solution is organized into clean, testable modules:

- **`types.ts`**: TypeScript type definitions for the domain models
- **`Grid.ts`**: Manages the Mars surface and tracks scents
- **`Robot.ts`**: Implements robot movement logic and state
- **`parser.ts`**: Parses input strings into structured data
- **`index.ts`**: Main entry point and orchestration logic

## Requirements

- Node.js 20 or later
- npm (comes with Node.js)
- Docker (optional, for containerized execution)

## Installation & Setup

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/richiekamota/martian-robots-challenge.git
cd martian-robots-challenge
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript code:
```bash
npm run build
```

## Usage

### Running Locally

#### With a file:
```bash
node dist/index.js sample-input.txt
```

#### With stdin:
```bash
cat sample-input.txt | node dist/index.js
```

Or type input directly:
```bash
node dist/index.js
5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL
# Press Ctrl+D (Unix) or Ctrl+Z (Windows) to end input
```

### Running with Docker

#### Build the Docker image:
```bash
docker build -t martian-robots .
```

#### Run with default sample input:
```bash
docker run martian-robots
```

#### Run with custom input file:
```bash
docker run -v $(pwd)/your-input.txt:/app/your-input.txt martian-robots your-input.txt
```

#### Run with stdin:
```bash
cat sample-input.txt | docker run -i martian-robots /dev/stdin
```

## Input Format

The input consists of:
1. **First line**: Upper-right grid coordinates (space-separated integers, max 50)
2. **Robot blocks**: Two lines per robot
   - Line 1: Starting position (x y orientation)
   - Line 2: Instructions (string of L, R, F commands, max 100 chars)

### Example Input:
```
5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL
```

## Output Format

For each robot, output a single line with:
- Final x coordinate
- Final y coordinate  
- Final orientation (N, S, E, W)
- "LOST" if the robot fell off the grid

### Example Output:
```
1 1 E
3 3 N LOST
2 3 S
```

## Sample Data

The repository includes `sample-input.txt` with the test data from the problem specification. Run it to verify the solution:

```bash
npm run build && node dist/index.js sample-input.txt
```

Expected output:
```
1 1 E
3 3 N LOST
2 3 S
```

## Key Features

- **Clean Architecture**: Separation of concerns with dedicated modules
- **Type Safety**: Full TypeScript with strict mode enabled
- **Scent Tracking**: Robots leave scents when lost, protecting future robots
- **Sequential Processing**: Robots are processed one at a time (important for scent propagation)
- **Input Validation**: Comprehensive error checking for invalid inputs
- **Flexible Input**: Supports both file and stdin input
- **Docker Support**: Containerized for easy deployment

## Testing

The project includes comprehensive unit tests using Node.js's built-in test runner.

### Running Tests Locally

```bash
npm test
```

This will:
1. Compile TypeScript (including test files)
2. Run all test suites
3. Display detailed results

### Test Coverage

- **82 tests** across 4 test files
- **Grid.test.ts**: Grid boundary and scent management (10 tests)
- **Robot.test.ts**: Robot movement and commands (29 tests)
- **parser.test.ts**: Input parsing and validation (28 tests)
- **index.test.ts**: Integration tests (15 tests)

See `TEST_SUMMARY.md` for detailed test documentation.

### Running Tests in Docker

Build and run tests in a container:

```bash
# Build the image
docker build -t martian-robots .

# Run tests (override entrypoint)
docker run --entrypoint npm martian-robots test
```

Or run tests interactively:

```bash
docker run -it --entrypoint sh martian-robots
# Inside container:
npm test
```

## Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled application
- `npm run dev` - Build and run in one command
- `npm test` - Run all unit tests

### Project Structure

```
martian-robots-challenge/
├── src/
│   ├── types.ts          # Type definitions
│   ├── Grid.ts           # Grid management
│   ├── Robot.ts          # Robot logic
│   ├── parser.ts         # Input parsing
│   └── index.ts          # Main entry point
├── dist/                 # Compiled JavaScript (generated)
├── sample-input.txt      # Test data
├── package.json          # Node.js configuration
├── tsconfig.json         # TypeScript configuration
├── Dockerfile            # Docker configuration
└── README.md             # This file
```

## Technical Decisions

1. **TypeScript**: Provides type safety and better development experience
2. **ES Modules**: Modern JavaScript module system for better compatibility
3. **Class-based Design**: Clear encapsulation of Grid and Robot behavior
4. **Immutable Operations**: Robot state changes are explicit and traceable
5. **Docker**: Ensures consistent execution across different environments

## Assumptions

- Grid coordinates start at (0, 0) in the lower-left corner
- Maximum grid size is 50x50
- Maximum instruction length is 100 characters
- Robots are processed sequentially (not in parallel)
- Scents persist across all robot executions in a session

## License

ISC

## Author

Richmond Kamota
