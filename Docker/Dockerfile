# Multi-stage build for Vite React Frontend
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --ignore-scripts

RUN npm prune --omit-dev

# Copy all source code
COPY . .

# Build the application - creates dist folder
RUN npm run build

# Production stage
FROM node:24-alpine AS final

WORKDIR /app


# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create system user and group for security
RUN addgroup -S appgroup && adduser -S -G appgroup -h /home/appuser appuser

# Change ownership of app directory to the new user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port (typically 3000 for serve, but can be configured)
EXPOSE 3000

# Install serve globally to serve the static files
USER root
RUN npm install -g serve
USER appuser

# Serve the built application
CMD ["serve", "-s", "dist", "-l", "3000"]