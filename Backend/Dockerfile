FROM node:22-alpine
WORKDIR /app
RUN apk update && apk add --no-cache g++ python3 openjdk17
COPY . .
RUN npm install
EXPOSE 4000
CMD ["node", "index.js"]