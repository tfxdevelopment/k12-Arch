FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 6006

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--no-open", "--port", "6006"]
