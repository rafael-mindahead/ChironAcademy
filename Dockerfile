FROM node:22-alpine

WORKDIR /app

COPY Backend/package*.json ./

RUN npm ci

COPY Backend/src ./src

EXPOSE 3000

CMD ["npm", "start"]