FROM node:22-alpine

WORKDIR /app

# Copia primeiro os arquivos de dependências do backend
COPY Backend/package*.json ./

# Instala exatamente as dependências do package-lock.json
RUN npm ci

# Copia somente o código do backend
COPY Backend/src ./src

EXPOSE 3000

CMD ["npm", "start"]