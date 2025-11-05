# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Set the entrypoint to run the application
ENTRYPOINT ["node", "dist/index.js"]

# Default: run with sample input
CMD ["sample-input.txt"]
