# Use Node.js LTS
FROM node:20-slim

# Install system dependencies for Prisma and OpenSSL
RUN apt-get update && apt-get install -y \
    openssl \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start the application with PM2
CMD ["pm2-runtime", "src/server.js"]
