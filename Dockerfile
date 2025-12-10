#
# Production-ready multi-stage Dockerfile for the Vite portfolio app.
# - Node 20 Alpine builder (matches engines and keeps build lean)
# - Nginx Alpine runtime serving static build with SPA routing and caching
#

###########
# Builder #
###########
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with a clean, reproducible lockfile install
COPY package*.json ./
RUN npm ci --include=dev

# Copy source and build with optional Vite env args
COPY . .

ARG VITE_OPENAI_API_KEY
ARG VITE_EMAILJS_PUBLIC_KEY
ARG VITE_EMAILJS_SERVICE_ID
ARG VITE_EMAILJS_TEMPLATE_ID

ENV VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}
ENV VITE_EMAILJS_PUBLIC_KEY=${VITE_EMAILJS_PUBLIC_KEY}
ENV VITE_EMAILJS_SERVICE_ID=${VITE_EMAILJS_SERVICE_ID}
ENV VITE_EMAILJS_TEMPLATE_ID=${VITE_EMAILJS_TEMPLATE_ID}

RUN npm run build

##########
# Runtime#
##########
FROM nginx:1.27-alpine

ENV NODE_ENV=production

# Replace default server config with SPA-friendly config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets only (keeps final image tiny)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]



