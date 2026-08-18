FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm install --no-frozen-lockfile && pnpm --filter @axsd/api build

FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY --from=build /app /app
ENV NODE_ENV=production PORT=3000 HOST=0.0.0.0
EXPOSE 3000
CMD ["pnpm","--filter","@axsd/api","start"]