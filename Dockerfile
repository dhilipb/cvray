FROM node:22-alpine AS builder
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .
RUN pnpm exec prisma generate && pnpm build

FROM node:22-alpine AS runner
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production PORT=3000 NEXT_TELEMETRY_DISABLED=1

# Full node_modules (not standalone output): the prisma CLI is needed at startup for `db push`
COPY --from=builder --chown=node:node /app/package.json /app/pnpm-lock.yaml /app/prisma.config.ts ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next ./.next

USER node
EXPOSE 3000
# Secrets (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, GOOGLE_*, GEMINI_API_KEY) come from the runtime environment, never the image
CMD ["sh", "-c", "pnpm exec prisma db push && pnpm start"]
