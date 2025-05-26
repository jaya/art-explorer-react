FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

# Copy package files
COPY pnpm-lock.yaml package.json tsconfig.json ./
COPY src ./src

# Install dependencies and build
RUN pnpm install --frozen-lockfile && \
    pnpm run build && \
    pnpm prune --production

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

# Copy necessary files from builder
COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]