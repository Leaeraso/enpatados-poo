# Usamos la imagen base node:22-alpine
FROM node:22-alpine

# Creamos y establecemos el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiamos el package.json y el package-lock.json
COPY package* ./

# Instala las dependencias de producción
RUN npm install --only=production

# Copia el resto del código fuente al contenedor
COPY . .

# Instalamos TypeScript globalmente si no está presente
RUN npm install typescript --save-dev

# Compila el código TypeScript
RUN npm run tsc

# Expone el puerto que utiliza tu API
EXPOSE 3000

# Comando para iniciar la aplicación en modo producción
CMD ["npm" ,"start"]

