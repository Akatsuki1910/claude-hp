# Node.jsサーバー用 Dockerfile
FROM node:lts-slim

WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .

EXPOSE 3000
CMD ["pnpm","run", "server"]
