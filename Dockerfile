# Imagen base liviana con Node 22
FROM node:22-alpine

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiamos solo los archivos de dependencias primero para aprovechar el cache
COPY package*.json ./

# Instalamos dependencias de producción
RUN npm install --only=production

# Copiamos todo el resto del código (incluyendo src)
COPY . .

# Instalamos TypeScript solo para compilar
RUN npm install --save-dev typescript

# Compilamos el proyecto TypeScript
RUN npx tsc

# Puerto en el que corre la API
EXPOSE 3000

# Comando para ejecutar la API
CMD ["node", "dist/main.js"]
