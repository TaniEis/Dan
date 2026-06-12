# Stage 1: Build the application
FROM node:alpine AS builder

# Enable corepack to use the correct pnpm version, or fall back to npm install -g pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package management files to leverage Docker layer caching
COPY package.json pnpm-lock.yaml* package-lock.json* ./

# Install dependencies (frozen-lockfile is used to ensure deterministic builds with pnpm)
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy the rest of the application files
COPY . .

# Build the application for production
RUN if [ -f pnpm-lock.yaml ]; then pnpm build; \
    elif [ -f package-lock.json ]; then npm run build; \
    else npm run build; fi

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
