# Estágio de construção
FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install -g prisma
RUN npm ci
RUN npx prisma generate
RUN npm run build

# ----------------------------

# Estágio de produção
FROM node:18-alpine

WORKDIR /app

# Copia apenas o necessário
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma 
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh


# Variáveis de ambiente
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
