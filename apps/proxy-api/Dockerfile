FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

# Copy package files
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml turbo.json ./
COPY ./apps/proxy-api ./apps/proxy-api
COPY ./packages ./packages

# Install dependencies and build
RUN pnpm install --frozen-lockfile && pnpm build --filter=proxy-api

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

# Copy necessary files from builder
COPY --from=builder --chown=hono:nodejs ./app/ ./

USER hono
EXPOSE 3000

CMD ["node", "/app/apps/proxy-api/dist/index.js"]