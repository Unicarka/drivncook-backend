# Utiliser une image Node.js officielle comme base
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "app.js"]
