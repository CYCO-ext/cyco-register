FROM node:25-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build
RUN npm prune --omit=dev


FROM node:25-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY ca.pem ./ca.pem

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "dist/src/main.js"]