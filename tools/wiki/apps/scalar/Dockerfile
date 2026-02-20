FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV HOST=0.0.0.0
ENV PORT=5050

EXPOSE 5050

CMD ["node", "server.mjs"]
