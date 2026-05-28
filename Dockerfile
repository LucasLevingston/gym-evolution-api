FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl wget && \
    addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 fastify

COPY --from=deps --chown=fastify:nodejs /app/node_modules ./node_modules
COPY --chown=fastify:nodejs ./src ./src
COPY --chown=fastify:nodejs ./prisma ./prisma
COPY --chown=fastify:nodejs ./package*.json ./

USER fastify

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s \
    CMD wget -qO- http://localhost:3333/health || exit 1

# tsx is in dependencies — no compile step needed (Node 22)
CMD ["sh", "-c", "npx prisma migrate deploy && node_modules/.bin/tsx src/app.ts"]
