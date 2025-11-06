# Docker Testing Guide

## Overview

The Docker container includes all necessary dependencies for running tests, including:
- TypeScript compiler
- Node.js test runner (built-in, no external deps)
- @types/node (for TypeScript type definitions)
- All source code and test files

## How It Works

The Dockerfile ensures test dependencies are available:

```dockerfile
# Install all dependencies (including devDependencies for tests)
RUN npm ci

# Copy source code and test files
COPY . .

# Build TypeScript (compiles both source and test files)
RUN npm run build
```

The `npm ci` command installs **all dependencies** from package-lock.json, including devDependencies. This means `@types/node` and `typescript` are available in the container.

## Running Tests in Docker

### Method 1: Override Entrypoint

Build the image:
```bash
docker build -t martian-robots .
```

Run tests by overriding the entrypoint:
```bash
docker run --entrypoint npm martian-robots test
```

Expected output:
```
✔ Grid tests (10 tests)
✔ Robot tests (29 tests)
✔ Parser tests (28 tests)
✔ Integration tests (15 tests)

ℹ tests 82
ℹ pass 82
ℹ fail 0
```

### Method 2: Interactive Shell

Enter the container interactively:
```bash
docker run -it --entrypoint sh martian-robots
```

Inside the container, you can run:
```bash
# Run tests
npm test

# Run the application
node dist/index.js sample-input.txt

# Check installed dependencies
npm list
```

### Method 3: Create Test-Specific Image (Optional)

You can create a multi-stage Dockerfile with a test stage:

```dockerfile
# Test stage
FROM node:20-alpine AS test
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "test"]

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
ENTRYPOINT ["node", "dist/index.js"]
CMD ["sample-input.txt"]
```

Then build and run tests:
```bash
docker build --target test -t martian-robots-test .
docker run martian-robots-test
```

## Verifying Dependencies in Container

To verify all test dependencies are available:

```bash
docker run --entrypoint sh -it martian-robots
# Inside container:
ls -la dist/*.test.js    # Check test files are compiled
npm list @types/node     # Verify @types/node is installed
npm list typescript      # Verify TypeScript is installed
which node               # Verify Node.js is available
node --version           # Check Node version (should be v20.x)
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t martian-robots .
      
      - name: Run tests in Docker
        run: docker run --entrypoint npm martian-robots test
      
      - name: Run application with sample input
        run: docker run martian-robots
```

### GitLab CI Example

```yaml
test:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t martian-robots .
    - docker run --entrypoint npm martian-robots test
```

## Troubleshooting

### Tests Not Found
If you see "No test files found", ensure:
1. Test files (*.test.ts) are not in .dockerignore
2. TypeScript compilation succeeded
3. Compiled test files exist in dist/ directory

Check:
```bash
docker run --entrypoint sh -it martian-robots
ls -la src/*.test.ts
ls -la dist/*.test.js
```

### Dependencies Missing
If dependencies are missing, verify:
1. package.json includes @types/node in devDependencies
2. package-lock.json exists and is up to date
3. `npm ci` is used (not `npm install`)

Check:
```bash
docker run --entrypoint npm martian-robots list
```

### Build Failures
If build fails, check:
1. TypeScript compilation errors
2. All source files are copied
3. tsconfig.json is configured correctly

Run manually:
```bash
docker run --entrypoint sh -it martian-robots
npm run build
```

## Performance Notes

- **Image size**: ~200MB (alpine base + Node.js + dependencies)
- **Build time**: ~30-60 seconds (depending on cache)
- **Test execution**: ~1 second for 82 tests
- **Cache optimization**: Copying package files before source code leverages Docker layer caching

## Security Considerations

The container:
- Runs as non-root user (Node.js alpine default)
- Includes only necessary dependencies
- Uses official Node.js base image
- Can be scanned with tools like Trivy:
  ```bash
  trivy image martian-robots
