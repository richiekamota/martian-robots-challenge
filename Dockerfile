# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for tests)
RUN npm ci

# Copy source code and test files
COPY . .

# Build TypeScript (compiles both source and test files)
RUN npm run build

# Set the entrypoint to run the application
ENTRYPOINT ["node", "dist/index.js"]

# Default: run with sample input
CMD ["sample-input.txt"]
