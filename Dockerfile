# Stage 1: Install development dependencies
FROM node:20-alpine AS development-dependencies-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Install production dependencies only
FROM node:20-alpine AS production-dependencies-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 3: Build application
FROM node:20-alpine AS build-env
WORKDIR /app
# Copy all source files and dev dependencies
COPY . .
COPY --from=development-dependencies-env /app/node_modules ./node_modules
# Build React Router application
RUN npm run build

# Stage 4: Production runtime
FROM node:20-alpine

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Security: Create non-root user for container execution
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Copy production dependencies from stage 2
COPY --from=production-dependencies-env /app/node_modules ./node_modules

# Copy built application from stage 3
COPY --from=build-env /app/build ./build

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]