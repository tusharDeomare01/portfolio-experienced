#
# Production-ready multi-stage Dockerfile for the Vite portfolio app.
# - Node 20 Alpine builder (matches engines and keeps build lean)
# - Nginx Alpine runtime serving static build with SPA routing and caching
# - Optimized for both Docker deployments and Vercel compatibility
#

###########
# Builder #
###########
FROM node:20-alpine AS builder

# Install build dependencies and security updates
RUN apk add --no-cache \
    git \
    && apk upgrade --no-cache

# Create app directory with proper permissions
WORKDIR /app

# Copy package files first for better layer caching
# Explicitly copy both package.json and package-lock.json for npm ci
COPY package.json package-lock.json ./

# Install dependencies with clean install and audit
# npm ci requires package-lock.json for reproducible builds
RUN npm ci --include=dev --prefer-offline --no-audit --progress=false \
    && npm cache clean --force

# Copy source files (excluding those in .dockerignore)
COPY . .

# Build arguments for Vite environment variables
ARG VITE_OPENAI_API_KEY=""
ARG VITE_EMAILJS_PUBLIC_KEY=""
ARG VITE_EMAILJS_SERVICE_ID=""
ARG VITE_EMAILJS_TEMPLATE_ID=""
ARG VITE_BASE_URL=""

# Set environment variables for build
ENV VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}
ENV VITE_EMAILJS_PUBLIC_KEY=${VITE_EMAILJS_PUBLIC_KEY}
ENV VITE_EMAILJS_SERVICE_ID=${VITE_EMAILJS_SERVICE_ID}
ENV VITE_EMAILJS_TEMPLATE_ID=${VITE_EMAILJS_TEMPLATE_ID}
ENV VITE_BASE_URL=${VITE_BASE_URL}
ENV NODE_ENV=production

# Performance optimization: Increase libuv thread pool size for better parallel I/O
# Improves build performance by enabling concurrent file operations
ENV UV_THREADPOOL_SIZE=24

# Node.js memory optimization for large builds
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the application
RUN npm run build

# Verify build output exists
RUN test -d dist && test -f dist/index.html || (echo "Build failed: dist directory not found" && exit 1)

##########
# Runtime#
##########
FROM nginx:1.27-alpine

# Install security updates, wget for healthcheck, and remove unnecessary packages
RUN apk upgrade --no-cache && \
    apk add --no-cache wget && \
    rm -rf /var/cache/apk/*

# Create non-root user for nginx
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx-user -g nginx-user nginx-user

# Set environment
ENV NODE_ENV=production

# Copy nginx configurations
COPY nginx-main.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Set proper permissions for web content
RUN chown -R nginx-user:nginx-user /usr/share/nginx/html && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    chown -R nginx-user:nginx-user /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chmod 755 /usr/share/nginx/html

# Create entrypoint script to handle permissions and start nginx
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'set -e' >> /entrypoint.sh && \
    echo '# Fix permissions for nginx directories' >> /entrypoint.sh && \
    echo 'chown -R nginx-user:nginx-user /var/cache/nginx /var/log/nginx /var/run/nginx.pid /etc/nginx/conf.d /usr/share/nginx/html' >> /entrypoint.sh && \
    echo '# Start nginx (master process runs as root for port binding, workers run as nginx-user)' >> /entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Use entrypoint script
ENTRYPOINT ["/entrypoint.sh"]



