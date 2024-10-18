# user-service/Dockerfile
FROM node:19-alpine


COPY package*.json ./
COPY . .

WORKDIR /app

RUN npm install

EXPOSE 3001

CMD [ "node","index.js"]