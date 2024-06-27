FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:18

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y \
    google-chrome-stable \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set environment variable to use Chrome in Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s CMD node -e "require('http').get('http://localhost:3000/health', (res) => { if (res.statusCode !== 200) { process.exit(1); } else { process.exit(0); } }).on('error', () => process.exit(1));"
